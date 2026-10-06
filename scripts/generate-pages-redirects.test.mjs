import assert from 'node:assert/strict'
import { test } from 'node:test'
import { mkdtemp, mkdir, writeFile, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { generate } from './generate-pages-redirects.js'

test('Pages redirects preserve all built routes, query strings, and fragments', async t => {
  const root = await mkdtemp(join(tmpdir(), 'diffpal-pages-'))
  t.after(() => rm(root, { recursive: true, force: true }))
  const dist = join(root, 'dist'), output = join(root, 'redirects')
  await mkdir(join(dist, 'getting-started'), { recursive: true })
  for (const route of ['index.html', 'docs.html', '404.html', 'github-quickstart.html', 'getting-started/index.html', 'getting-started/github-quickstart.html']) {
    await writeFile(join(dist, route), '<h1>Old site</h1>')
  }
  await generate(dist, output)
  for (const [file, route] of [['github-quickstart.html', '/getting-started/github-quickstart'], ['index.html', '/'], ['docs.html', '/docs'], ['getting-started/index.html', '/getting-started'], ['getting-started/github-quickstart.html', '/getting-started/github-quickstart']]) {
    const html = await readFile(join(output, file), 'utf8')
    const target = `https://diffpal.metalagman.dev${route}`
    assert.ok(html.includes(`rel="canonical" href="${target}"`))
    assert.ok(html.includes(`http-equiv="refresh" content="0; url=${target}"`))
    assert.ok(html.includes(`<a href="${target}">`))
    assert.ok(html.includes('location.search + location.hash'))
    assert.ok(html.includes('noindex'))
    assert.ok(!html.includes('<h1>Old site</h1>'))
  }
  const fallback = await readFile(join(output, '404.html'), 'utf8')
  assert.ok(fallback.includes('location.pathname'))
  assert.ok((await readFile(join(output, 'robots.txt'), 'utf8')).includes('Disallow: /'))
  await writeFile(join(output, 'stale.html'), 'stale')
  await generate(dist, output)
  await assert.rejects(readFile(join(output, 'stale.html')), { code: 'ENOENT' })
})
