# Keta’s Field Notes

Visit the site: [https://keta1930.github.io/blog](https://keta1930.github.io/blog)

Keta’s Field Notes is [keta](https://github.com/keta1930)’s bilingual personal blog. It collects writing about learning, creation, attention, technology, and small observations that continue to evolve.

The site supports English and Chinese posts, global search, light and dark themes, RSS, article comments, Markdown copying, and optional article audio.

## Keyboard shortcuts

| Shortcut | Action |
| --- | --- |
| `Command/Ctrl + K` | Open search |
| `D` | Toggle light and dark themes |
| `L` | Switch between English and Chinese |
| `H` | Return to the home page |
| `M` | Copy the current post text |

Shortcuts are disabled while typing in an input, textarea, select, or editable element. `M` is available on post pages.

## Make your own

You can use this repository as the starting point for a similar static blog:

```bash
git clone https://github.com/keta1930/blog.git
cd blog
npm ci
npm run dev
```

Open <http://localhost:3000>, replace the site copy and the posts under `content/docs/`, then adapt the public repository settings to your own GitHub account.

To publish with GitHub Pages:

1. Push the repository to GitHub and enable **Settings → Pages → GitHub Actions**.
2. Enable GitHub Discussions and configure [Giscus](https://giscus.app/) if comments are needed.
3. Add `GISCUS_REPO_ID`, `GISCUS_CATEGORY`, and `GISCUS_CATEGORY_ID` under **Settings → Secrets and variables → Actions → Variables**.
4. Push to `main` or run the **Deploy to GitHub Pages** workflow manually.

See [AGENTS.md](./AGENTS.md) for the current architecture, content model, development commands, and implementation constraints.
