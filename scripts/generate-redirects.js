import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { legacyRedirects } from './redirects.js'

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const outputRoot = resolve(repositoryRoot, '.vitepress/dist')
const canonicalOrigin = 'https://diffpal.github.io'

await Promise.all(
  Object.entries(legacyRedirects).map(async ([from, to]) => {
    const outputPath = resolve(outputRoot, `${from.slice(1)}.html`)
    const canonicalURL = `${canonicalOrigin}${to}`
    const html = `<!doctype html>
<html lang="en-US">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="refresh" content="0; url=${to}">
    <link rel="canonical" href="${canonicalURL}">
    <title>Page moved | DiffPal</title>
    <script>location.replace(${JSON.stringify(to)} + location.search + location.hash)</script>
  </head>
  <body>
    <p>This page moved to <a href="${to}">${to}</a>.</p>
  </body>
</html>
`

    await mkdir(dirname(outputPath), { recursive: true })
    await writeFile(outputPath, html)
  })
)

console.log(`Generated ${Object.keys(legacyRedirects).length} legacy route redirects`)
