# blog-likes Worker

文章点赞计数 API。Cloudflare Worker + D1（SQLite），匿名点赞（按 salted IP 哈希去重，计数为原子 SQL 自增），支持取消。

## 接口

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| `GET` | `/likes/<slug>` | 返回 `{ slug, count }` |
| `POST` | `/likes/<slug>` | 请求体 `{ "action": "like" \| "unlike" }`，返回 `{ slug, count, liked }` |

CORS 仅允许 `wrangler.toml` 中 `ALLOWED_ORIGINS` 列出的来源。

## 一次性部署

```bash
cd workers/likes
npm install
npx wrangler login                                # 浏览器授权 CLI

# 创建 D1 数据库，把输出中的 database_id 填入 wrangler.toml 的 [[d1_databases]].database_id
npx wrangler d1 create blog-likes

# 应用建表迁移到远端数据库
npx wrangler d1 migrations apply blog-likes --remote

# 生成并写入去重 salt 密钥（自己保存一份，丢失后历史去重标记失效）
openssl rand -hex 32 | npx wrangler secret put LIKE_SALT

npm run deploy                                    # 输出 Worker URL
```

部署后：

1. 本地开发：把 Worker URL 填入根目录 `.env.local` 的 `NEXT_PUBLIC_LIKES_API_URL`。
2. 生产：在 GitHub 仓库 Settings → Secrets and variables → Actions → Variables 中新增
   `LIKES_API_URL`，值为 Worker URL。

## 日常命令

| 命令 | 用途 |
| --- | --- |
| `npm run dev` | 本地运行 Worker（D1 本地模拟） |
| `npm run check` | TypeScript 检查 |
| `npm run deploy` | 部署到 Cloudflare |
| `npx wrangler d1 migrations apply blog-likes --remote` | 应用新增的数据库迁移 |
