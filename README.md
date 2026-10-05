# diffpal.github.io

This repository contains the public documentation website for DiffPal.

Production site: https://diffpal.metalagman.dev/, served by Cloudflare Workers.
The private `home-lab` repository manages Worker `diffpal-site`, its immutable
releases, rollback, and custom domain through Terraform. GitHub Pages at
https://diffpal.github.io/ serves redirects to the new domain.

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

## Deploy And Roll Back

Build, verify, and package an immutable release:

```bash
npm run artifact
```

The output prints a SHA256 digest and the absolute release directory under
`.artifacts/<digest>`. Retain that directory; never deploy from mutable
`.vitepress/dist` or edit a packaged release. Packaging verifies each file,
keeps HTTP headers separate from public assets, and enforces Workers file limits.

In private `home-lab`, import that actual directory and review the saved plan:

```bash
task workers:artifact SITE=diffpal ARTIFACT='<absolute release directory>'
task workers:verify SITE=diffpal
task workers:plan SITE=diffpal
task workers:show SITE=diffpal
# After reviewing the exact saved plan:
task workers:apply SITE=diffpal
task workers:status SITE=diffpal
```

Then run HTTP checks from this repository and verify navigation, local search,
and the homepage badge in a browser:

```bash
BASE_URL=https://diffpal-site.metalagman-e17.workers.dev npm run smoke:workers
BASE_URL=https://diffpal.metalagman.dev npm run smoke:workers
```

The staging hostname is marked `noindex`; production is indexable. Record the
uploaded version UUID alongside its artifact digest in private release evidence.
For rollback, select a real retained version, review and apply a fresh plan,
then repeat the HTTP/browser checks:

```bash
task workers:rollback SITE=diffpal WORKER=diffpal-site VERSION='<prior version UUID>'
task workers:plan SITE=diffpal
task workers:show SITE=diffpal
task workers:apply SITE=diffpal
```

A later artifact import clears the rollback selection. Terraform is the only
remote deployment writer; do not deploy or roll back this Worker with Wrangler
or native Workers Builds. Credentials, state, plans, and release selections
remain private in `home-lab`.

The GitHub Actions Pages workflow builds a separate redirect artifact with
`npm run docs:pages-redirects`. It preserves existing nested and legacy URLs,
including query strings and fragments, without publishing a second documentation
site. Production Workers assets are packaged separately.
