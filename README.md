# diffpal.github.io

This repository contains the public documentation website for DiffPal.

Production site: https://diffpal.github.io/

Public documentation Markdown lives at the repository root so the organization-level GitHub Pages site publishes at `/`, not under a project path.

## Local Development

Install dependencies:

```bash
npm ci
```

Start the local VitePress server:

```bash
npm run docs:dev
```

## Build And Preview

Build the static site:

```bash
npm run docs:build
```

Preview the generated site:

```bash
npm run docs:preview
```
