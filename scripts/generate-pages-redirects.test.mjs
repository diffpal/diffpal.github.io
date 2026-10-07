import assert from 'node:assert/strict'
import { test } from 'node:test'
import { mkdtemp, mkdir, writeFile, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { runInNewContext } from 'node:vm'
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
  for (const [file, route] of [
    ['github-quickstart.html', '/getting-started/github-quickstart'],
    ['github-quickstart/index.html', '/getting-started/github-quickstart'],
    ['index.html', '/'], ['docs.html', '/docs'], ['docs/index.html', '/docs'],
    ['getting-started.html', '/getting-started'],
    ['getting-started/index.html', '/getting-started'],
    ['getting-started/github-quickstart.html', '/getting-started/github-quickstart'],
    ['getting-started/github-quickstart/index.html', '/getting-started/github-quickstart'],
  ]) {
    const html = await readFile(join(output, file), 'utf8')
    const target = `https://diffpal.metalagman.dev${route}`
    assert.ok(html.includes(`rel="canonical" href="${target}"`))
    assert.ok(html.includes(`http-equiv="refresh" content="0; url=${target}"`))
    assert.ok(html.includes(`<a href="${target}">`))
    assert.ok(html.includes('location.search + location.hash'))
    assert.ok(!html.includes('noindex'), `${file}: redirect must not suppress indexing signals`)
    let destination
    runInNewContext(html.match(/<script>([\s\S]*?)<\/script>/)[1], {
      location: { search: '?source=legacy', hash: '#install', replace: url => { destination = url } }
    })
    assert.equal(destination, `${target}?source=legacy#install`)
    assert.ok(!html.includes('<h1>Old site</h1>'))
  }
  const fallback = await readFile(join(output, '404.html'), 'utf8')
  assert.ok(fallback.includes('location.pathname'))
  assert.ok(fallback.includes('noindex'))
  assert.ok(!fallback.includes('rel="canonical"'))
  assert.ok(!fallback.includes('http-equiv="refresh"'))
  let destination
  runInNewContext(fallback.match(/<script>([\s\S]*?)<\/script>/)[1], {
    location: { pathname: '/unknown.html', search: '?source=legacy', hash: '#section', replace: url => { destination = url } }
  })
  assert.equal(destination, 'https://diffpal.metalagman.dev/unknown?source=legacy#section')
  const robots = await readFile(join(output, 'robots.txt'), 'utf8')
  assert.match(robots, /^User-agent: \*\nAllow: \/\n/)
  assert.ok(!robots.includes('Disallow: /'))
  await writeFile(join(output, 'stale.html'), 'stale')
  await generate(dist, output)
  await assert.rejects(readFile(join(output, 'stale.html')), { code: 'ENOENT' })
})
