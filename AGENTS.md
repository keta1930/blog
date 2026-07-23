# AGENTS.md

This file is the authoritative project and development guide for coding agents working in this repository.

## Project overview

Keta’s Field Notes is [keta](https://github.com/keta1930)’s bilingual, content-first personal blog. It publishes posts about learning, creation, attention, technology, and evolving observations.

The production site is <https://keta1930.github.io/blog>. The experience is calm, readable, responsive, easy to maintain, and inexpensive to operate.

## Product and feature decisions

| Area | Current implementation |
| --- | --- |
| Framework | Next.js 16 with Fumadocs and React 19 |
| Content | MDX and validated frontmatter under `content/docs/` |
| Languages | English at `/`; Chinese at `/zh` |
| Hosting | GitHub Pages project site |
| Delivery | Static export deployed by `.github/workflows/deploy-pages.yml` |
| Search | Fumadocs static search with separate English and Mandarin Orama indexes |
| Comments | Giscus backed by GitHub Discussions, with project-owned light and dark themes |
| Audio | Optional per-language article audio declared in frontmatter |
| Syndication | RSS at `/rss.xml` |
| AI discovery | `/llms.txt` and per-post clean Markdown output; no `llms-full.txt` |

The public site includes:

- A home page featuring the latest post and a vintage-style animation
- About, Posts, and FAQs pages in both languages
- Global search, theme switching, and language switching on every page
- Article metadata, reading progress, table of contents, adjacent-post navigation, and responsive long-form typography
- Styled code blocks with language labels, tables, Mermaid diagrams, and KaTeX formulas
- One-click Markdown copying and Giscus comments on article pages
- Optional article audio with playback, seeking, elapsed and total time, and playback-rate controls
- RSS, Open Graph images, `llms.txt`, and clean Markdown routes generated from the content source

The site has no application backend, contact form, email subscription, server actions, persistent Node.js runtime, or runtime-only API routes.

## Routes and navigation

| Page | English | Chinese |
| --- | --- | --- |
| Home | `/` | `/zh` |
| About | `/about` | `/zh/about` |
| Posts | `/posts` | `/zh/posts` |
| FAQs | `/faqs` | `/zh/faqs` |
| Article | `/posts/<slug>` | `/zh/posts/<slug>` |

Global navigation is ordered About, Posts, and FAQs. Article pages do not use a documentation sidebar. Adjacent-post links display only the post title and publication date.

Keyboard shortcuts:

| Shortcut | Behavior |
| --- | --- |
| `Command/Ctrl + K` | Open global search |
| `D` | Toggle the light or dark theme |
| `L` | Switch language while preserving the current route |
| `H` | Return to the localized home page |
| `M` | Copy the current article as Markdown |

Shortcut handlers ignore inputs, textareas, selects, and editable elements. `M` is registered only on article pages.

## Architecture

The application uses the Next.js App Router and `output: 'export'`. `NEXT_PUBLIC_BASE_PATH` drives both `basePath` and `assetPrefix`, and Next.js images are unoptimized for static hosting.

The principal directories are:

```text
.
├── .github/workflows/       # GitHub Pages deployment
├── content/docs/            # Authored bilingual MDX posts and article assets
├── public/                  # Hand-authored public assets and generated local audio output
├── scripts/                 # Build-time content asset utilities
├── src/app/                 # Routes, layouts, metadata, feeds, and global styles
├── src/components/          # Shared page and article components
├── src/lib/                 # Content source, locale, post, and site utilities
├── next.config.mjs          # Static-export and base-path configuration
└── source.config.ts         # MDX collection and frontmatter schema
```

Generated directories such as `out/`, `.next/`, `node_modules/`, and `public/audio/` are not authored sources and are not committed.

## Content model

`content/docs/` MDX files and their frontmatter are the only source of post content and metadata. Do not create post registries, metadata arrays, route maps, or manually maintained post lists in application code.

Each post uses one directory named `<YYYY-MM-DD>-<english-title-kebab-case>`:

```text
content/docs/2026-07-22-a-post-title/
├── index.mdx
├── index.zh.mdx
└── assets/
    ├── illustration.webp
    └── narration.mp3
```

`index.mdx` contains the English post and `index.zh.mdx` contains its Chinese translation. Both files use the same stable `slug`. Store article-specific images and audio in the local `assets/` directory.

Required frontmatter:

```yaml
---
title: A post title
slug: a-post-title
description: A concise summary used by lists, search, feeds, and metadata.
publishedAt: '2026-07-22'
updatedAt: '2026-07-22'
readingTime: 5
---
```

Schema rules:

- `slug` uses lowercase letters, numbers, and hyphens.
- `publishedAt` and `updatedAt` use `YYYY-MM-DD`.
- `readingTime` is a positive integer in minutes.
- Each language file contains its own title, description, body, and optional audio declaration.
- Ordinary prose stays in Markdown; MDX components are reserved for content that materially benefits from interaction.

Adding or editing MDX automatically updates the home page, Posts archive, article routes, adjacent-post navigation, search indexes, RSS, Open Graph metadata, `llms.txt`, and clean Markdown output.

### Article audio

Audio is optional and configured independently in each language file:

```yaml
audio:
  src: './assets/narration.mp3'
```

The source must be an MP3, M4A, OGG, or WAV file directly inside the article’s `assets/` directory. `npm run audio:sync` validates declared paths and copies only referenced files to the ignored `public/audio/<slug>/` directory. The `predev` and `prebuild` scripts run this synchronization automatically.

## Search, feeds, and generated routes

- `/api/search` is statically generated into English and Mandarin Orama indexes.
- `/rss.xml` is generated from English posts.
- `/llms.txt` lists published content for AI discovery.
- `/llms.mdx/posts/<locale>/<slug>/content.md` provides clean article Markdown used by the copy action.
- `/og/posts/<locale>/<slug>/image.png` provides generated article imagery.

All internal links, generated URLs, search assets, feeds, comments themes, and article media must respect `NEXT_PUBLIC_BASE_PATH`.

## Comments

Giscus is rendered only when all public identifiers are available:

```text
NEXT_PUBLIC_GISCUS_REPO
NEXT_PUBLIC_GISCUS_REPO_ID
NEXT_PUBLIC_GISCUS_CATEGORY
NEXT_PUBLIC_GISCUS_CATEGORY_ID
```

For local development, copy `.env.example` to `.env.local` and provide the identifiers generated by <https://giscus.app/>. For GitHub Pages, the workflow supplies the repository name and reads `GISCUS_REPO_ID`, `GISCUS_CATEGORY`, and `GISCUS_CATEGORY_ID` from Actions Variables.

Credentials, tokens, private keys, and local environment files must not be committed. Giscus repository and category identifiers are public configuration, not secrets.

## Deployment

The deployment workflow runs on pushes to `main` and through manual dispatch. It:

1. Installs dependencies with `npm ci`.
2. Runs ESLint and TypeScript checks.
3. Obtains the public site URL and base path from `actions/configure-pages`.
4. Builds the static export in `out/`.
5. Uploads and deploys the GitHub Pages artifact.

Keep deployment on the official GitHub Pages artifact flow. Do not hard-code the repository base path in application code or the workflow.

## Development commands

Use npm and treat `package-lock.json` as authoritative.

| Command | Purpose |
| --- | --- |
| `npm ci` | Install the locked dependency graph |
| `npm run dev` | Synchronize declared audio and start local development |
| `npm run audio:sync` | Rebuild `public/audio/` from article frontmatter |
| `npm run lint` | Run ESLint |
| `npm run types:check` | Regenerate MDX and route types, then run TypeScript |
| `npm run build` | Synchronize audio and create the static export |
| `npm run start` | Serve the generated `out/` directory |

For a production-equivalent project-page build:

```bash
NEXT_PUBLIC_SITE_URL=https://keta1930.github.io/blog \
NEXT_PUBLIC_BASE_PATH=/blog \
npm run build
```

Run the checks relevant to the changed behavior. Routing, content loading, search, feeds, images, audio, comments themes, metadata, or deployment changes require a successful production-equivalent static build.

## Implementation constraints

- Keep the site fully compatible with Next.js static export and GitHub Pages.
- Prefer Fumadocs and Next.js capabilities before adding custom infrastructure or dependencies.
- Keep English as the default UI and content locale; publish Chinese translations under the same slug.
- Keep search, theme, and language controls available throughout the site.
- Maintain accessible semantics, keyboard operation, visible focus states, readable typography, and responsive layouts.
- Use project design tokens and the existing calm, vintage visual language for interface additions.
- Keep authored content separate from generated output.
- Do not add a persistent backend, server actions, runtime-only API routes, a contact form, email subscriptions, or `llms-full.txt`.

## Working agreement

Before editing, inspect the repository state and the relevant source, configuration, and documentation. Make the smallest coherent change that satisfies the request and preserve unrelated work in a dirty worktree.

For implementation work:

1. Confirm that the change fits the architecture and static-export constraints.
2. Add or update focused tests when behavior is meaningfully testable.
3. Run formatting, linting, type checking, and production builds that apply to the change.
4. Verify static output for changes to routes, content loading, search, feeds, images, audio, comments themes, metadata, or deployment.
5. Update root documentation when commands, structure, or product decisions change.

Report only commands that were actually run and their actual results.
