import { Env } from '../types';
import { errorResponse, CORS_HEADERS } from '../utils/response';

/**
 * Handle /api/v1/assets/* -> stream from Cloudflare R2 bucket
 */
export async function handleAssets(request: Request, env: Env): Promise<Response> {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return errorResponse('Method Not Allowed', 405);
  }

  const url = new URL(request.url);
  const key = url.pathname.replace(/^\/api\/v1\/assets\//, '');

  if (!key || key.trim().length === 0) {
    return errorResponse('Asset key is required', 400);
  }

  try {
    const object = await env.GAME_ASSETS.get(key);

    if (!object) {
      return errorResponse(`Asset not found: ${key}`, 404);
    }

    // Check ETag caching
    const ifNoneMatch = request.headers.get('if-none-match');
    if (ifNoneMatch && object.httpEtag === ifNoneMatch) {
      return new Response(null, {
        status: 304,
        headers: {
          etag: object.httpEtag,
          ...CORS_HEADERS,
        },
      });
    }

    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set('etag', object.httpEtag);
    headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    for (const [k, v] of Object.entries(CORS_HEADERS)) {
      headers.set(k, v);
    }

    return new Response(request.method === 'HEAD' ? null : object.body, {
      status: 200,
      headers,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return errorResponse('Failed to stream asset from R2', 500, message);
  }
}
