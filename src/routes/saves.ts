import { Env, GameSave } from '../types';
import { jsonResponse, errorResponse } from '../utils/response';

/**
 * Handle /api/v1/saves
 */
export async function handleSaves(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const pathParts = url.pathname.replace(/^\/api\/v1\/saves\/?/, '').split('/');
  const gameId = pathParts[0];

  if (!gameId) {
    return errorResponse('Game ID is required for cloud saves', 400);
  }

  if (request.method === 'GET') {
    return getSaveState(request, gameId, env);
  }

  if (request.method === 'POST') {
    return putSaveState(request, gameId, env);
  }

  return errorResponse('Method Not Allowed', 405);
}

/**
 * Retrieve cloud save state from R2 with D1 metadata
 */
async function getSaveState(request: Request, gameId: string, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const userId = url.searchParams.get('user_id') || 'usr_001';
  const slotId = parseInt(url.searchParams.get('slot') || '1', 10);

  try {
    const r2Key = `saves/${userId}/${gameId}_s${slotId}.json`;

    // 1. Fetch metadata from D1
    const meta = await env.DB.prepare(
      'SELECT * FROM game_saves WHERE user_id = ? AND game_id = ? AND slot_id = ?'
    ).bind(userId, gameId, slotId).first<GameSave>();

    // 2. Fetch object payload from R2
    let payload: unknown = null;
    const r2Object = await env.GAME_ASSETS.get(r2Key);
    if (r2Object) {
      const text = await r2Object.text();
      try {
        payload = JSON.parse(text);
      } catch {
        payload = text;
      }
    }

    if (!meta && !payload) {
      return errorResponse('No save found for this slot', 404);
    }

    return jsonResponse({
      success: true,
      meta: meta || { user_id: userId, game_id: gameId, slot_id: slotId },
      payload,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return errorResponse('Failed to retrieve cloud save', 500, message);
  }
}

/**
 * Save cloud state into R2 bucket and D1 index table
 */
async function putSaveState(request: Request, gameId: string, env: Env): Promise<Response> {
  try {
    const body = await request.json() as {
      user_id?: string;
      slot_id?: number;
      summary?: string;
      data: unknown;
    };

    const userId = body.user_id || 'usr_001';
    const slotId = body.slot_id || 1;
    const summary = body.summary || 'Auto-saved progress';
    const dataStr = JSON.stringify(body.data ?? {});
    const r2Key = `saves/${userId}/${gameId}_s${slotId}.json`;

    // 1. Save state payload to Cloudflare R2 (zero egress fees, unlimited capacity)
    await env.GAME_ASSETS.put(r2Key, dataStr, {
      httpMetadata: {
        contentType: 'application/json',
      },
      customMetadata: {
        gameId,
        userId,
        slotId: String(slotId),
      },
    });

    const fileSize = new TextEncoder().encode(dataStr).length;

    // 2. Upsert index metadata into Cloudflare D1
    await env.DB.prepare(`
      INSERT INTO game_saves (user_id, game_id, slot_id, r2_key, file_size, summary, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(user_id, game_id, slot_id) DO UPDATE SET
        file_size = excluded.file_size,
        summary = excluded.summary,
        updated_at = CURRENT_TIMESTAMP
    `).bind(userId, gameId, slotId, r2Key, fileSize, summary).run();

    return jsonResponse({
      success: true,
      message: 'Cloud save synced to R2 & D1 successfully',
      data: {
        user_id: userId,
        game_id: gameId,
        slot_id: slotId,
        r2_key: r2Key,
        file_size: fileSize,
        summary,
        synced_at: new Date().toISOString(),
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return errorResponse('Failed to persist cloud save', 500, message);
  }
}
