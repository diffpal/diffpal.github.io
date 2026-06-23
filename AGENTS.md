# Repository Guidelines

## Project Structure & Module Organization

This repository publishes the DiffPal documentation site at `https://diffpal.github.io/` using VitePress. Public documentation Markdown lives at the repository root, for example `index.md`, `quickstart.md`, and `config-reference.md`. Do not add a `docs/` directory.

VitePress configuration lives in `.vitepress/config.mts`. Theme customizations are in `.vitepress/theme/index.ts` and `.vitepress/theme/custom.css`. Static assets live in `public/`, currently `public/favicon.svg`. GitHub Actions workflows live in `.github/workflows/`.

`README.md` is for the GitHub repository only and is excluded from VitePress routes with `srcExclude`.

## Build, Test, and Development Commands

Install dependencies:

```bash
npm ci
```

Run the local development server:

```bash
npm run docs:dev
```

Build the production site:

```bash
npm run docs:build
```

Preview the generated build:

```bash
npm run docs:preview
```

Run the repository check:

```bash
npm run check
```

## Coding Style & Naming Conventions

Use Markdown for documentation pages and keep filenames lowercase with hyphens, such as `platform-gitlab.md`. Use clean internal links like `/quickstart` and `/config-reference`. Links to files that remain in `diffpal/diffpal` should use canonical GitHub URLs.

Keep CSS restrained and scoped to `.vitepress/theme/custom.css`. Use TypeScript/ESM syntax in VitePress config and theme files.

## Testing Guidelines

There is no separate unit test suite. Treat `npm run docs:build` as the required validation gate. Before publishing substantial documentation changes, also run `npm run docs:preview` and verify important routes such as `/`, `/quickstart`, and `/troubleshooting`.

## Commit & Pull Request Guidelines

Use Conventional Commit style. The initial repository commit uses:

```text
feat: add vitepress documentation site
```

Prefer subjects such as `docs: update quickstart` or `fix: correct platform link`. Pull requests should summarize the documentation change, note any link updates, and include screenshots for visible theme or homepage changes.

## Security & Configuration Tips

Do not commit provider secrets, tokens, or generated build output. The generated site is written to `.vitepress/dist` and should remain ignored. GitHub Pages deploys through `.github/workflows/pages.yml` from the VitePress build artifact.
