import { Env, Game } from '../types';
import { jsonResponse, errorResponse } from '../utils/response';

/**
 * Handle /api/v1/games
 */
export async function handleGames(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const pathParts = url.pathname.replace(/^\/api\/v1\/games\/?/, '').split('/');
  const gameIdentifier = pathParts[0];

  // Distribution Sync Route: POST /api/v1/games/sync
  if (gameIdentifier === 'sync' && request.method === 'POST') {
    return syncDistributionGames(request, env);
  }

  // Specific game routes
  if (gameIdentifier && gameIdentifier.length > 0) {
    if (pathParts[1] === 'play' && request.method === 'POST') {
      return recordPlay(gameIdentifier, env);
    }
    if (request.method === 'GET') {
      return getGameDetail(gameIdentifier, env);
    }
  }

  // GET /api/v1/games listing
  if (request.method !== 'GET') {
    return errorResponse('Method Not Allowed', 405);
  }

  try {
    const category = url.searchParams.get('category');
    const search = url.searchParams.get('search');
    const featured = url.searchParams.get('featured');
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '50', 10), 100);
    const offset = Math.max(parseInt(url.searchParams.get('offset') || '0', 10), 0);
    const sort = url.searchParams.get('sort') || 'popular';

    let query = 'SELECT * FROM games WHERE status = ?';
    const params: unknown[] = ['published'];

    if (category && category !== 'all') {
      query += ' AND category = ?';
      params.push(category);
    }

    if (featured === '1' || featured === 'true') {
      query += ' AND is_featured = 1';
    }

    if (search && search.trim().length > 0) {
      query += ' AND (title LIKE ? OR description LIKE ? OR tags LIKE ?)';
      const term = `%${search.trim()}%`;
      params.push(term, term, term);
    }

    if (sort === 'popular') {
      query += ' ORDER BY play_count DESC';
    } else if (sort === 'rating') {
      query += ' ORDER BY rating_avg DESC';
    } else if (sort === 'newest') {
      query += ' ORDER BY created_at DESC';
    } else {
      query += ' ORDER BY is_featured DESC, play_count DESC';
    }

    query += ' LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const { results } = await env.DB.prepare(query).bind(...params).all<Game>();

    return jsonResponse({
      success: true,
      data: results || [],
      count: results ? results.length : 0,
      limit,
      offset,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return errorResponse('Failed to fetch games', 500, message);
  }
}

/**
 * Get game detail by ID or Slug
 */
async function getGameDetail(identifier: string, env: Env): Promise<Response> {
  try {
    const game = await env.DB.prepare(
      'SELECT * FROM games WHERE (id = ? OR slug = ?) AND status = ? LIMIT 1'
    ).bind(identifier, identifier, 'published').first<Game>();

    if (!game) {
      return errorResponse('Game not found', 404);
    }

    return jsonResponse({
      success: true,
      data: game,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return errorResponse('Failed to fetch game details', 500, message);
  }
}

/**
 * Record a game play event (increments play_count)
 */
async function recordPlay(identifier: string, env: Env): Promise<Response> {
  try {
    await env.DB.prepare(
      'UPDATE games SET play_count = play_count + 1 WHERE id = ? OR slug = ?'
    ).bind(identifier, identifier).run();

    return jsonResponse({
      success: true,
      message: 'Play recorded successfully',
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return errorResponse('Failed to record play', 500, message);
  }
}

/**
 * Ingest or sync games from game distribution feeds into D1
 */
async function syncDistributionGames(request: Request, env: Env): Promise<Response> {
  try {
    const body = await request.json().catch(() => ({})) as { games?: Game[] };
    const gamesList = body.games || [];

    if (gamesList.length === 0) {
      return errorResponse('No games provided for sync. Pass an array of game objects.', 400);
    }

    let inserted = 0;
    for (const g of gamesList) {
      const sql = `
        INSERT OR REPLACE INTO games (
          id, slug, title, description, category, tags, developer,
          source_type, entry_url, thumbnail_url, orientation, play_count,
          rating_avg, status, is_featured
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'published', ?)
      `;
      await env.DB.prepare(sql).bind(
        g.id,
        g.slug,
        g.title,
        g.description || '',
        g.category || 'arcade',
        typeof g.tags === 'string' ? g.tags : JSON.stringify(g.tags || []),
        g.developer || 'GamePix Distribution',
        g.source_type || 'gamepix',
        g.entry_url,
        g.thumbnail_url,
        g.orientation || 'landscape',
        g.play_count || 10000,
        g.rating_avg || 4.8,
        g.is_featured ? 1 : 0
      ).run();
      inserted++;
    }

    return jsonResponse({
      success: true,
      message: `Successfully synchronized ${inserted} games to Cloudflare D1.`,
      count: inserted,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return errorResponse('Failed to sync games', 500, message);
  }
}
