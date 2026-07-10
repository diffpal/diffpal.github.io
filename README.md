# diffpal.github.io

This repository contains the public documentation website for DiffPal.

Production site: https://diffpal.github.io/

Canonical public documentation lives in the main
[`diffpal/diffpal`](https://github.com/diffpal/diffpal/tree/main/docs)
repository. This site records an immutable source commit in `docs-source.json`
and generates its documentation pages into `.generated/` before each build.
Only the homepage, theme, privacy policy, and site metadata are maintained here.

## Local Development

Install dependencies:

```bash
npm ci
```

Check out the locked canonical documentation source:

```bash
git clone https://github.com/diffpal/diffpal.git .source/diffpal
git -C .source/diffpal checkout "$(node -p "require('./docs-source.json').ref")"
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

Run the complete build, privacy, and synchronization checks with:

```bash
npm run check
```

Preview the generated site:

```bash
npm run docs:preview
```
