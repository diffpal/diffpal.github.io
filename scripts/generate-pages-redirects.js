import { readdir, mkdir, writeFile, rm } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
import { legacyRedirects } from './redirects.js'

const origin = 'https://diffpal.metalagman.dev'

async function htmlFiles(directory, prefix = '') {
  const files = []
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = prefix + entry.name
    if (entry.isDirectory()) files.push(...await htmlFiles(join(directory, entry.name), path + '/'))
    else if (entry.isFile() && path.endsWith('.html')) files.push(path)
  }
  return files
}

export async function generate(dist = join(root, '.vitepress/dist'), output = join(root, '.vitepress/pages-redirects')) {
  dist = resolve(dist)
  output = resolve(output)
  if (output === dist || output.startsWith(dist + '/') || dist.startsWith(output + '/')) throw Error('Redirect output must be separate from the site build')
  const files = await htmlFiles(dist)
  if (!files.includes('index.html') || !files.includes('404.html')) throw Error('Build the site before generating Pages redirects')
  await rm(output, { recursive: true, force: true })
  let count = 0
  for (const file of files) {
    const path = '/' + file.replace(/index\.html$/, '').replace(/\.html$/, '').replace(/\/$/, '')
    const target = origin + (file === '404.html' ? '/' : (legacyRedirects[path] ?? path))
    const scriptTarget = file === '404.html'
      ? `${JSON.stringify(origin)} + location.pathname.replace(/\\.html$/, '')`
      : JSON.stringify(target)
    const metadata = file === '404.html'
      ? '<meta name="robots" content="noindex">'
      : `<link rel="canonical" href="${target}"><meta http-equiv="refresh" content="0; url=${target}">`
    const html = `<!doctype html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">${metadata}<title>DiffPal has moved</title><script>location.replace(${scriptTarget} + location.search + location.hash)</script></head><body><p>DiffPal has moved to <a href="${target}">${target}</a>.</p></body></html>
`
    const destinations = new Set([file])
    if (file !== '404.html' && path !== '/') {
      destinations.add(`${path.slice(1)}.html`)
      destinations.add(`${path.slice(1)}/index.html`)
    }
    for (const alias of destinations) {
      const destination = join(output, alias)
      await mkdir(dirname(destination), { recursive: true })
      await writeFile(destination, html)
      count++
    }
  }
  await writeFile(join(output, 'robots.txt'), 'User-agent: *\nAllow: /\n')
  console.log(`Generated ${count} Pages redirects to ${origin}`)
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await generate()
