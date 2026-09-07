# diffpal.github.io

This repository contains the public documentation website for DiffPal.

Production site: https://diffpal.github.io/

Public documentation Markdown lives at the repository root and in topical
directories. The directory structure defines public routes such as
`/getting-started/github-quickstart` and `/reference/cli`. The build also emits
redirect pages for the former flat routes.

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
