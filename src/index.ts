/**
 * EdgePlay Game Platform - Cloudflare Worker Entry Point
 * Architecture: Cloudflare Workers + Static Assets + D1 (SQLite) + R2 (Object Storage)
 * Compatibility Date: 2026-10-01
 */

import { Env } from './types';
import { jsonResponse, handleOptions } from './utils/response';
import { handleGames } from './routes/games';
import { handleLeaderboards } from './routes/leaderboards';
import { handleSaves } from './routes/saves';
import { handleAssets } from './routes/assets';

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    // 1. Handle CORS Preflight
    if (request.method === 'OPTIONS') {
      return handleOptions();
    }

    // 2. Health & Diagnostic Check
    if (url.pathname === '/api/v1/health') {
      return jsonResponse({
        status: 'online',
        service: 'EdgePlay Game Platform API',
        runtime: 'Cloudflare Workers (Edge)',
        compatibility_date: '2026-10-01',
        features: {
          d1_database: !!env.DB,
          r2_storage: !!env.GAME_ASSETS,
          static_assets: !!env.ASSETS,
        },
        timestamp: new Date().toISOString(),
      });
    }

    // 3. API Router Dispatch
    if (url.pathname.startsWith('/api/v1/games')) {
      return handleGames(request, env);
    }

    if (url.pathname.startsWith('/api/v1/leaderboards')) {
      return handleLeaderboards(request, env);
    }

    if (url.pathname.startsWith('/api/v1/saves')) {
      return handleSaves(request, env);
    }

    if (url.pathname.startsWith('/api/v1/assets/')) {
      return handleAssets(request, env);
    }

    // 4. Workers Static Assets Fallback
    // Serves HTML, CSS, JS, audio, and playable game files from ./public
    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    return new Response('EdgePlay Worker Running. Static assets binding not found.', {
      status: 200,
      headers: { 'Content-Type': 'text/plain' },
    });
  },
};
