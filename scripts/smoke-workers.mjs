import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { legacyRedirects } from './redirects.js'

const base = new URL(process.env.BASE_URL || 'https://diffpal.metalagman.dev')
const production = 'https://diffpal.metalagman.dev'
const staging = base.hostname.endsWith('.workers.dev')
const sitemap = await readFile(new URL('../.vitepress/dist/sitemap.xml', import.meta.url), 'utf8')
const locations = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => new URL(match[1]))

async function get(path, expected = 200) {
  const response = await fetch(new URL(path, base), { signal: AbortSignal.timeout(30_000) })
  assert.equal(response.status, expected, `${path}: HTTP ${response.status}`)
  assert.equal(response.headers.get('x-content-type-options'), 'nosniff', `${path}: missing nosniff`)
  assert.equal(response.headers.get('x-robots-tag'), staging ? 'noindex' : null, `${path}: crawler policy`)
  return { response, text: await response.text() }
}

for (const location of locations) {
  const { response, text } = await get(location.pathname)
  assert.equal(new URL(response.url).pathname, location.pathname, `${location.pathname}: canonical URL redirects`)
  assert.ok(text.includes(`rel="canonical" href="${production}${location.pathname}"`), `${location.pathname}: canonical`)
  assert.ok(!text.includes('https://diffpal.github.io'), `${location.pathname}: stale origin`)
}
for (const [from, to] of Object.entries(legacyRedirects)) {
  const { text } = await get(from)
  assert.ok(text.includes(`url=${to}`) && text.includes(`${production}${to}`), `${from}: legacy redirect`)
}
const { text: robots } = await get('/robots.txt')
assert.ok(robots.includes(`Sitemap: ${production}/sitemap.xml`))
const { text: llms } = await get('/llms.txt')
assert.ok(llms.startsWith('# DiffPal'))
const { text: remoteSitemap } = await get('/sitemap.xml')
assert.equal(remoteSitemap, sitemap)
const { text: home } = await get('/')
const asset = home.match(/href="(\/assets\/[^\"]+\.css)"/)[1]
const { response: assetResponse } = await get(asset)
if (process.env.EXPECT_IMMUTABLE_CACHE !== 'false') {
  assert.match(assetResponse.headers.get('cache-control') || '', /max-age=31536000.*immutable/)
}
for (const path of ['/_headers', '/manifest.json']) await get(path, 404)
const { text: missing } = await get('/a-route-that-does-not-exist', 404)
assert.ok(missing.includes('404') && !missing.includes('rel="canonical"'))
console.log(`Verified ${locations.length} routes, ${Object.keys(legacyRedirects).length} legacy redirects, assets, crawlers, and 404 at ${base.origin}`)
