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

const [sitemapBuffer, robotsOutput, robotsSource, llmsOutput, llmsSource] = await Promise.all([
  readRequiredFile(sitemapPath),
  readRequiredFile(robotsOutputPath),
  readRequiredFile(robotsSourcePath),
  readRequiredFile(llmsOutputPath),
  readRequiredFile(llmsSourcePath)
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

console.log('Verified sitemap.xml, robots.txt, and llms.txt in .vitepress/dist')
