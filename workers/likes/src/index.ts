/** 文章点赞计数服务：D1 原子计数 + 投票去重，支持匿名点赞与取消。 */

interface Env {
  DB: D1Database;
  LIKE_SALT: string;
  ALLOWED_ORIGINS: string;
}

const ROUTE_PATTERN = /^\/likes\/([a-z0-9-]{1,100})$/;

const UPSERT_LIKE = `
  INSERT INTO likes (slug, count) VALUES (?, 1)
  ON CONFLICT(slug) DO UPDATE SET count = count + 1
`;

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = request.headers.get('Origin');
    const allowed = env.ALLOWED_ORIGINS.split(',').map((item) => item.trim());
    const corsOrigin = origin && allowed.includes(origin) ? origin : null;

    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: corsOrigin ? 204 : 403,
        headers: baseHeaders(corsOrigin),
      });
    }

    const match = new URL(request.url).pathname.match(ROUTE_PATTERN);
    if (!match) {
      return json({ error: 'Not found' }, 404, corsOrigin);
    }
    const slug = match[1];

    if (request.method === 'GET') {
      return json({ slug, count: await readCount(env.DB, slug) }, 200, corsOrigin);
    }

    if (request.method !== 'POST') {
      return json({ error: 'Method not allowed' }, 405, corsOrigin);
    }

    const body = (await request.json().catch(() => null)) as { action?: unknown } | null;
    if (body?.action !== 'like' && body?.action !== 'unlike') {
      return json({ error: 'Expected body: { "action": "like" | "unlike" }' }, 400, corsOrigin);
    }
    const action = body.action;

    const ip = request.headers.get('CF-Connecting-IP') ?? 'local-dev';
    const voter = await hashVoter(env.LIKE_SALT, ip);

    // 去重标记与计数分两步写入：标记由主键幂等，计数由单条 SQL 原子更新
    if (action === 'like') {
      const inserted = await env.DB.prepare(
        'INSERT OR IGNORE INTO voters (slug, voter) VALUES (?, ?)',
      ).bind(slug, voter).run();
      if (inserted.meta.changes > 0) {
        await env.DB.prepare(UPSERT_LIKE).bind(slug).run();
      }
    } else {
      const deleted = await env.DB.prepare(
        'DELETE FROM voters WHERE slug = ? AND voter = ?',
      ).bind(slug, voter).run();
      if (deleted.meta.changes > 0) {
        await env.DB.prepare(
          'UPDATE likes SET count = MAX(count - 1, 0) WHERE slug = ?',
        ).bind(slug).run();
      }
    }

    return json({ slug, count: await readCount(env.DB, slug), liked: action === 'like' }, 200, corsOrigin);
  },
} satisfies ExportedHandler<Env>;

async function readCount(db: D1Database, slug: string): Promise<number> {
  const row = await db.prepare('SELECT count FROM likes WHERE slug = ?')
    .bind(slug)
    .first<{ count: number }>();
  return row?.count ?? 0;
}

/** 用 salt 混淆 IP 后再哈希，避免在数据库中直接落盘访客 IP。 */
async function hashVoter(salt: string, ip: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`${salt}:${ip}`));
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

function baseHeaders(corsOrigin: string | null): HeadersInit {
  const headers: Record<string, string> = { Vary: 'Origin' };
  if (corsOrigin) {
    headers['Access-Control-Allow-Origin'] = corsOrigin;
    headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS';
    headers['Access-Control-Allow-Headers'] = 'Content-Type';
  }
  return headers;
}

function json(payload: object, status: number, corsOrigin: string | null): Response {
  return Response.json(payload, { status, headers: baseHeaders(corsOrigin) });
}
