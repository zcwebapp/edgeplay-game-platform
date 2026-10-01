import { Env, LeaderboardEntry } from '../types';
import { jsonResponse, errorResponse } from '../utils/response';

/**
 * Handle /api/v1/leaderboards
 */
export async function handleLeaderboards(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const pathParts = url.pathname.replace(/^\/api\/v1\/leaderboards\/?/, '').split('/');
  const gameId = pathParts[0];

  if (request.method === 'POST') {
    return submitScore(request, env);
  }

  if (request.method === 'GET') {
    if (!gameId || gameId.length === 0) {
      return errorResponse('Game ID is required to fetch leaderboard', 400);
    }
    return getLeaderboard(gameId, env);
  }

  return errorResponse('Method Not Allowed', 405);
}

/**
 * Fetch top leaderboard entries for a given game
 */
async function getLeaderboard(gameId: string, env: Env): Promise<Response> {
  try {
    const query = `
      SELECT 
        l.id,
        l.game_id,
        l.user_id,
        COALESCE(u.username, 'ANONYMOUS_PLAYER') as username,
        COALESCE(u.avatar_url, 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=120&auto=format&fit=crop&q=80') as avatar_url,
        COALESCE(u.is_vip, 0) as is_vip,
        l.score,
        l.score_display,
        l.created_at
      FROM leaderboards l
      LEFT JOIN users u ON l.user_id = u.id
      WHERE l.game_id = ?
      ORDER BY l.score DESC
      LIMIT 50
    `;

    const { results } = await env.DB.prepare(query).bind(gameId).all<LeaderboardEntry>();

    const rankedResults = (results || []).map((entry, index) => ({
      ...entry,
      rank: index + 1,
      badge: index === 0 ? '👑 CHAMPION' : index === 1 ? '🥈 RUNNER UP' : index === 2 ? '🥉 3RD PLACE' : `#${index + 1}`,
    }));

    return jsonResponse({
      success: true,
      game_id: gameId,
      total: rankedResults.length,
      data: rankedResults,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return errorResponse('Failed to fetch leaderboard', 500, message);
  }
}

/**
 * Submit high score
 */
async function submitScore(request: Request, env: Env): Promise<Response> {
  try {
    const body = await request.json() as {
      game_id?: string;
      user_id?: string;
      username?: string;
      score?: number;
      score_display?: string;
    };

    const { game_id, user_id = 'usr_guest', username, score, score_display } = body;

    if (!game_id || typeof score !== 'number') {
      return errorResponse('Missing required fields: game_id and numeric score', 400);
    }

    // Auto-create guest user if does not exist
    if (user_id.startsWith('usr_guest')) {
      const displayName = username || `GUEST_${Math.floor(1000 + Math.random() * 9000)}`;
      await env.DB.prepare(
        'INSERT OR IGNORE INTO users (id, username, role) VALUES (?, ?, ?)'
      ).bind(user_id, displayName, 'player').run();
    }

    const formattedDisplay = score_display || `${score.toLocaleString()} pts`;

    // Insert score into leaderboards
    await env.DB.prepare(
      'INSERT INTO leaderboards (game_id, user_id, score, score_display) VALUES (?, ?, ?, ?)'
    ).bind(game_id, user_id, score, formattedDisplay).run();

    // Query current rank
    const rankResult = await env.DB.prepare(
      'SELECT COUNT(*) as higher_scores FROM leaderboards WHERE game_id = ? AND score > ?'
    ).bind(game_id, score).first<{ higher_scores: number }>();

    const rank = (rankResult?.higher_scores ?? 0) + 1;

    return jsonResponse({
      success: true,
      message: 'Score submitted successfully',
      data: {
        game_id,
        user_id,
        score,
        score_display: formattedDisplay,
        rank,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return errorResponse('Failed to submit score', 500, message);
  }
}
