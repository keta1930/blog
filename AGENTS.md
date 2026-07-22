# AGENTS.md

This file is the authoritative guide for coding agents working in this repository.

## Product direction

Build a modern, content-first personal blog for keta's posts and ideas. The experience should remain calm, readable, bilingual, easy to maintain, and inexpensive to operate.

Use the public author name **keta** and link the author identity to <https://github.com/keta1930>.

## Architecture decisions

The following decisions are established unless the user explicitly changes them:

| Area | Decision |
| --- | --- |
| Framework | Fumadocs with Next.js |
| Content | MDX and validated frontmatter under `content/docs/` |
| Hosting | GitHub Pages with project-page base-path support |
| Delivery | `.github/workflows/deploy-pages.yml` validates and deploys the static export when `main` changes |
| Languages | English is the default; every English post has a same-slug Chinese translation |
| Search | Fumadocs static search with English and Mandarin indexes |
| Comments | Giscus backed by GitHub Discussions |
| Syndication | RSS only; no email subscription |
| AI discovery | Provide `llms.txt`; do not add `llms-full.txt` |

Do not add a contact form or an application backend unless the user revises the project scope.

## Implementation constraints

- Keep the production site fully compatible with static export and GitHub Pages. Do not introduce features that require a persistent Node.js server, server actions, or runtime-only API routes.
- Prefer built-in Fumadocs and Next.js capabilities before adding custom infrastructure or dependencies.
- Keep prose in MDX simple. Add interactive components only when they materially improve an article.
- Every published English post must have a Chinese translation with the same slug. Preserve the language and meaning of author-written content; never invent a translation unless the user asks for one.
- Keep internal links, assets, search, feeds, and metadata compatible with the deployed GitHub Pages base path.
- Never commit credentials, tokens, private keys, or local-only configuration. Giscus uses public repository/category identifiers supplied through `NEXT_PUBLIC_*` variables; secrets remain GitHub-managed.
- Preserve the current public routes and document any proposed route change before implementing it.
- Maintain accessible semantics, keyboard usability, readable typography, and responsive layouts.

## Repository conventions

- The Fumadocs application lives at the repository root.
- Use npm consistently and treat `package-lock.json` as authoritative.
- Keep authored MDX under `content/docs/` and application code under `src/`.
- Treat `content/docs/` MDX and frontmatter as the only post data source. Do not maintain post metadata arrays in TSX.
- Store each article in `content/docs/<YYYY-MM-DD>-<english-title-kebab-case>/` with English `index.mdx`, Chinese `index.zh.mdx`, and an `assets/` directory for article-local media.
- Every article file requires matching stable `slug` frontmatter plus `title`, `description`, `publishedAt`, `updatedAt`, and integer `readingTime`. The directory is an organizational name; public routes are derived from `slug`.
- Use `/posts/<slug>` for English posts and `/zh/posts/<slug>` for Chinese posts.
- Keep global navigation ordered as About, Posts, and FAQs; search, theme, and language controls must remain available on every page.
- Keep article pages free of a documentation sidebar. Adjacent-post navigation shows only title and publication date.
- Preserve the global shortcuts: `Command/Ctrl + K` for search, `D` for theme, `L` for language, `H` for localized home, and post-page `M` for copying Markdown.
- Keep authored content separate from generated build output.
- Do not commit generated export directories, dependency directories, or local environment files.
- Keep GitHub Pages deployment on the official artifact flow. The workflow must obtain `NEXT_PUBLIC_SITE_URL` and `NEXT_PUBLIC_BASE_PATH` from `actions/configure-pages` rather than hard-coding repository paths.

## Verified commands

Use the development and verification commands documented in [README.md](./README.md). For routing, assets, search, feeds, metadata, or AI-readable delivery changes, also run the documented GitHub Pages production build with `NEXT_PUBLIC_SITE_URL` and `NEXT_PUBLIC_BASE_PATH`; its static export is generated in `out/`.

## Working agreement

Before changing the project, inspect the repository state and relevant configuration. Make the smallest coherent change that satisfies the request, and avoid unrelated rewrites.

For implementation work:

1. Confirm that the approach respects the architecture decisions above.
2. Update or add focused tests when behavior can be tested meaningfully.
3. Run the repository's documented formatting, linting, type-checking, test, and production-build commands that apply to the change.
4. Verify static export for changes involving routing, content loading, search, feeds, images, or deployment.
5. Update root documentation when commands, structure, or architectural decisions change.

Do not claim a command or deployment is verified unless it was actually run successfully.
