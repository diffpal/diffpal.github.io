import { readFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const outputRoot = resolve(repositoryRoot, '.vitepress/dist')
const canonicalOrigin = 'https://diffpal.github.io'

async function readRequiredFile(path) {
  let contents

  try {
    contents = await readFile(path)
  } catch (error) {
    throw new Error(`Required build output is missing: ${path}`, { cause: error })
  }

  if (contents.length === 0) {
    throw new Error(`Required build output is empty: ${path}`)
  }

  return contents
}

const sitemapPath = resolve(outputRoot, 'sitemap.xml')
const robotsOutputPath = resolve(outputRoot, 'robots.txt')
const robotsSourcePath = resolve(repositoryRoot, 'public/robots.txt')
const llmsOutputPath = resolve(outputRoot, 'llms.txt')
const llmsSourcePath = resolve(repositoryRoot, 'public/llms.txt')
const cliOutputPath = resolve(outputRoot, 'cli.html')
const artifactsOutputPath = resolve(outputRoot, 'artifacts.html')

const [
  sitemapBuffer,
  robotsOutput,
  robotsSource,
  llmsOutput,
  llmsSource,
  cliOutput,
  artifactsOutput
] = await Promise.all([
  readRequiredFile(sitemapPath),
  readRequiredFile(robotsOutputPath),
  readRequiredFile(robotsSourcePath),
  readRequiredFile(llmsOutputPath),
  readRequiredFile(llmsSourcePath),
  readRequiredFile(cliOutputPath),
  readRequiredFile(artifactsOutputPath)
])

if (!robotsOutput.equals(robotsSource)) {
  throw new Error(`${robotsOutputPath} does not match ${robotsSourcePath}`)
}

if (!llmsOutput.equals(llmsSource)) {
  throw new Error(`${llmsOutputPath} does not match ${llmsSourcePath}`)
}

const sitemap = sitemapBuffer.toString('utf8')
if (!sitemap.startsWith('<?xml') || !sitemap.includes('<urlset')) {
  throw new Error(`${sitemapPath} is not an XML sitemap`)
}

const locations = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) =>
  match[1].replaceAll('&amp;', '&')
)

if (locations.length === 0) {
  throw new Error(`${sitemapPath} does not contain any sitemap locations`)
}

for (const location of locations) {
  let url

  try {
    url = new URL(location)
  } catch (error) {
    throw new Error(`${sitemapPath} contains an invalid location: ${location}`, {
      cause: error
    })
  }

  if (url.origin !== canonicalOrigin) {
    throw new Error(
      `${sitemapPath} contains a non-canonical location: ${location}`
    )
  }
}

const cli = cliOutput.toString('utf8')
const artifacts = artifactsOutput.toString('utf8')

for (const marker of [
  'review uncommitted',
  'human-readable text on stderr',
  'This command never publishes to a host.'
]) {
  if (!cli.includes(marker)) {
    throw new Error(`${cliOutputPath} does not contain required content: ${marker}`)
  }
}

if (cli.includes('<code>--state</code>')) {
  throw new Error(`${cliOutputPath} contains the obsolete --state option`)
}

for (const marker of ['CLI snapshot manifest', 'temporary revision']) {
  if (!artifacts.includes(marker)) {
    throw new Error(`${artifactsOutputPath} does not contain required content: ${marker}`)
  }
}

console.log(
  'Verified synchronized pages, sitemap.xml, robots.txt, and llms.txt in .vitepress/dist'
)
