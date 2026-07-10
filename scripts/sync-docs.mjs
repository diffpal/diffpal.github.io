import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const lock = JSON.parse(fs.readFileSync(path.join(root, 'docs-source.json'), 'utf8'))
const sourceDir = path.resolve(root, process.env.DIFFPAL_DOCS_DIR || '.source/diffpal/docs')
const repositoryRoot = path.dirname(sourceDir)
const generatedDir = path.join(root, '.generated')

if (!fs.existsSync(sourceDir)) {
  throw new Error(`canonical docs directory not found: ${sourceDir}`)
}

function markdownFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) return markdownFiles(fullPath)
    return entry.isFile() && entry.name.endsWith('.md') ? [fullPath] : []
  })
}

function destinationFor(relativePath) {
  const normalized = relativePath.split(path.sep).join('/')
  if (normalized === 'README.md') return 'docs.md'
  if (path.posix.basename(normalized) === 'README.md') {
    return `${path.posix.basename(path.posix.dirname(normalized))}.md`
  }
  return path.posix.basename(normalized)
}

const sources = markdownFiles(sourceDir)
const destinations = new Map()
const sourceByAbsolutePath = new Map()
for (const source of sources) {
  const relative = path.relative(sourceDir, source).split(path.sep).join('/')
  const destination = destinationFor(relative)
  if (destinations.has(destination)) {
    throw new Error(`duplicate flattened docs destination ${destination}`)
  }
  destinations.set(destination, relative)
  sourceByAbsolutePath.set(path.resolve(source), destination)
}

function rewriteTarget(target, source) {
  if (/^(?:[a-z]+:|#|\/)/i.test(target)) return target
  const match = target.match(/^([^#?]+)([?#].*)?$/)
  if (!match) return target
  const resolved = path.resolve(path.dirname(source), match[1])
  const suffix = match[2] || ''
  const destination = sourceByAbsolutePath.get(resolved)
  if (destination) return `/${destination.replace(/\.md$/, '')}${suffix}`
  if (!resolved.startsWith(repositoryRoot + path.sep)) return target

  const relative = path.relative(repositoryRoot, resolved).split(path.sep).join('/')
  const kind = fs.existsSync(resolved) && fs.statSync(resolved).isDirectory() ? 'tree' : 'blob'
  return `https://github.com/${lock.repository}/${kind}/${lock.ref}/${relative}${suffix}`
}

function rewriteMarkdown(content, source) {
  return content.replace(/(!?\[[^\]]*\]\()([^\s)]+)([^)]*\))/g, (_match, prefix, target, suffix) => {
    return `${prefix}${rewriteTarget(target, source)}${suffix}`
  })
}

fs.rmSync(generatedDir, { recursive: true, force: true })
fs.mkdirSync(generatedDir, { recursive: true })

const rewrites = {}
for (const [destination, relative] of destinations) {
  const source = path.join(sourceDir, relative)
  const output = path.join(generatedDir, relative)
  fs.mkdirSync(path.dirname(output), { recursive: true })
  fs.writeFileSync(output, rewriteMarkdown(fs.readFileSync(source, 'utf8'), source))
  const stat = fs.statSync(source)
  fs.utimesSync(output, stat.atime, stat.mtime)
  rewrites[relative] = destination
}

for (const sitePage of ['index.md', 'privacy.md']) {
  const output = path.join(generatedDir, 'site', sitePage)
  fs.mkdirSync(path.dirname(output), { recursive: true })
  fs.copyFileSync(path.join(root, sitePage), output)
  rewrites[`site/${sitePage}`] = sitePage
}

fs.writeFileSync(path.join(root, '.generated-rewrites.json'), `${JSON.stringify(rewrites, null, 2)}\n`)
console.log(`generated ${destinations.size} canonical docs pages from ${lock.repository}@${lock.ref}`)
