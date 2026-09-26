/** 文章点赞计数服务：D1 原子计数 + 浏览器级匿名投票人去重，支持匿名点赞与取消。 */

interface Env {
  DB: D1Database;
  LIKE_SALT: string;
  ALLOWED_ORIGINS: string;
}

const ROUTE_PATTERN = /^\/likes\/([a-z0-9-]{1,100})$/;
const VOTER_ID_PATTERN = /^[A-Za-z0-9_-]{16,64}$/;

const UPSERT_LIKE = `
  INSERT INTO likes (slug, count) VALUES (?, 1)
  ON CONFLICT(slug) DO UPDATE SET count = count + 1
`;

const READ_VOTER = 'SELECT 1 AS present FROM voters WHERE slug = ? AND voter = ?';

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

    const url = new URL(request.url);
    const match = url.pathname.match(ROUTE_PATTERN);
    if (!match) {
      return json({ error: 'Not found' }, 404, corsOrigin);
    }
    const slug = match[1];

    if (request.method === 'GET') {
      const count = await readCount(env.DB, slug);
      const voterId = url.searchParams.get('voter');
      // 列表页只取计数、不携带 voter，此时无需查询投票记录
      if (!isVoterId(voterId)) {
        return json({ slug, count }, 200, corsOrigin);
      }
      const voter = await hashVoter(env.LIKE_SALT, `browser:${voterId}`);
      const row = await env.DB.prepare(READ_VOTER).bind(slug, voter).first();
      return json({ slug, count, liked: row !== null }, 200, corsOrigin);
    }

    if (request.method !== 'POST') {
      return json({ error: 'Method not allowed' }, 405, corsOrigin);
    }

    const body = (await request.json().catch(() => null)) as
      | { action?: unknown; voter?: unknown }
      | null;
    if (body?.action !== 'like' && body?.action !== 'unlike') {
      return json({ error: 'Expected body: { "action": "like" | "unlike" }' }, 400, corsOrigin);
    }
    if (body.voter !== undefined && !isVoterId(body.voter)) {
      return json({ error: 'Invalid voter' }, 400, corsOrigin);
    }
    const action = body.action;
    const voter = await resolveVoter(env, request, isVoterId(body.voter) ? body.voter : null);

    // 去重标记与计数分两步写入：标记由主键幂等，计数由单条 SQL 原子更新。
    // 两个分支执行后分别保证记录存在 / 不存在，因此 liked 无需再查一次即可如实返回。
    let liked: boolean;
    if (action === 'like') {
      const inserted = await env.DB.prepare(
        'INSERT OR IGNORE INTO voters (slug, voter) VALUES (?, ?)',
      ).bind(slug, voter).run();
      if (inserted.meta.changes > 0) {
        await env.DB.prepare(UPSERT_LIKE).bind(slug).run();
      }
      liked = true;
    } else {
      const deleted = await env.DB.prepare(
        'DELETE FROM voters WHERE slug = ? AND voter = ?',
      ).bind(slug, voter).run();
      if (deleted.meta.changes > 0) {
        await env.DB.prepare(
          'UPDATE likes SET count = MAX(count - 1, 0) WHERE slug = ?',
        ).bind(slug).run();
      }
      liked = false;
    }

    return json({ slug, count: await readCount(env.DB, slug), liked }, 200, corsOrigin);
  },
} satisfies ExportedHandler<Env>;

async function readCount(db: D1Database, slug: string): Promise<number> {
  const row = await db.prepare('SELECT count FROM likes WHERE slug = ?')
    .bind(slug)
    .first<{ count: number }>();
  return row?.count ?? 0;
}

/** 解析本次请求的投票人哈希：优先使用浏览器级匿名 ID，未携带时回退到 IP 以兼容旧客户端。 */
async function resolveVoter(env: Env, request: Request, voterId: string | null): Promise<string> {
  if (voterId) {
    return hashVoter(env.LIKE_SALT, `browser:${voterId}`);
  }
  const ip = request.headers.get('CF-Connecting-IP') ?? 'local-dev';
  return hashVoter(env.LIKE_SALT, `network:${ip}`);
}

function isVoterId(value: unknown): value is string {
  return typeof value === 'string' && VOTER_ID_PATTERN.test(value);
}

/** 用 salt 混淆 subject 后再哈希，避免在数据库中直接落盘访客 IP 或客户端 ID。 */
async function hashVoter(salt: string, subject: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`${salt}:${subject}`));
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

function baseHeaders(corsOrigin: string | null): HeadersInit {
  // 计数与投票状态随投票人变化，禁止任何中间层缓存
  const headers: Record<string, string> = { Vary: 'Origin', 'Cache-Control': 'no-store' };
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
