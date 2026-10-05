import { createHash } from 'node:crypto'
import { readdir, lstat, readFile, mkdir, mkdtemp, writeFile, rename, rm } from 'node:fs/promises'
import { resolve, join, dirname, basename } from 'node:path'
import { fileURLToPath } from 'node:url'

const maxFiles = 20_000, maxBytes = 25 * 1024 * 1024
const hash = bytes => createHash('sha256').update(bytes).digest('hex')
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const encode = manifest => JSON.stringify(manifest) + '\n'

async function walk(directory, prefix = '') {
  const info = await lstat(directory)
  if (!info.isDirectory() || info.isSymbolicLink()) throw Error(`Not a regular directory: ${directory}`)
  const files = []
  for (const name of (await readdir(directory)).sort()) {
    if (name.startsWith('.') || /(?:\.tfstate(?:\.|$)|\.tfplan$|\.pem$|\.key$)/i.test(name)) {
      throw Error(`Hidden/private file is not a public asset: ${name}`)
    }
    const path = prefix + name, full = join(directory, name), stat = await lstat(full)
    if (stat.isDirectory()) files.push(...await walk(full, path + '/'))
    else {
      if (!stat.isFile() || stat.isSymbolicLink()) throw Error(`Not a regular file (symlink): ${path}`)
      if (stat.size > maxBytes) throw Error(`Asset exceeds 25 MiB: ${path}`)
      const bytes = await readFile(full)
      files.push({ path, bytes })
    }
  }
  return files
}

async function scan(directory) {
  const assets = (await checkAssets(join(directory, 'assets'))).map(file => ({ ...file, path: 'assets/' + file.path }))
  const metadata = await walk(join(directory, 'metadata'), 'metadata/')
  if (metadata.length !== 1 || metadata[0].path !== 'metadata/_headers') throw Error('Unexpected metadata files')
  return { format: 1, files: [...assets, ...metadata].map(({ path, bytes }) => ({
    path, size: bytes.length, sha256: hash(bytes)
  })) }
}

export async function checkAssets(directory) {
  const assets = await walk(directory)
  if (assets.length > maxFiles) throw Error('Static asset count exceeds 20000')
  if (!assets.length) throw Error('No static assets')
  return assets
}

export async function verify(directory) {
  directory = resolve(directory)
  const stat = await lstat(directory)
  if (!stat.isDirectory() || stat.isSymbolicLink()) throw Error('Release must be a regular directory')
  const entries = (await readdir(directory)).sort()
  if (JSON.stringify(entries) !== JSON.stringify(['assets', 'manifest.json', 'metadata'])) throw Error('Untracked release files')
  const manifestFile = join(directory, 'manifest.json')
  if (!(await lstat(manifestFile)).isFile() || (await lstat(manifestFile)).isSymbolicLink()) throw Error('Manifest must be a regular file')
  const expected = await readFile(manifestFile, 'utf8')
  const actual = encode(await scan(directory))
  if (actual !== expected) throw Error('Artifact manifest/checksum mismatch')
  const digest = hash(expected)
  if (basename(directory) !== digest) throw Error('Release directory does not match manifest digest')
  const manifest = JSON.parse(actual)
  return { digest, directory, files: manifest.files.filter(f => f.path.startsWith('assets/')).length,
    bytes: manifest.files.reduce((sum, file) => sum + file.size, 0) }
}

export async function build({ dist = process.env.SITE_DIST || join(root, '.vitepress/dist'),
  output = process.env.ARTIFACT_ROOT || join(root, '.artifacts') } = {}) {
  dist = resolve(dist)
  output = resolve(output)
  if (output === dist || output.startsWith(dist + '/')) throw Error('Artifact output must be outside SITE_DIST')
  const assets = await checkAssets(dist)
  if (assets.some(f => ['_headers', '_redirects', 'manifest.json'].includes(f.path))) throw Error('Deployment metadata must not be a public asset')
  await mkdir(output, { recursive: true })
  const temporary = await mkdtemp(join(output, '.building-'))
  try {
    await mkdir(join(temporary, 'assets'))
    await mkdir(join(temporary, 'metadata'))
    for (const { path, bytes } of assets) {
      const destination = join(temporary, 'assets', path)
      await mkdir(dirname(destination), { recursive: true })
      await writeFile(destination, bytes, { mode: 0o444 })
    }
    await writeFile(join(temporary, 'metadata', '_headers'), await readFile(join(root, 'hosting/_headers')), { mode: 0o444 })
    const manifest = encode(await scan(temporary))
    await writeFile(join(temporary, 'manifest.json'), manifest, { mode: 0o444 })
    const destination = join(output, hash(manifest))
    try { await lstat(destination) }
    catch (error) {
      if (error.code !== 'ENOENT') throw error
      await rename(temporary, destination)
    }
    return await verify(destination)
  } finally { await rm(temporary, { recursive: true, force: true }) }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) try {
  const [command, directory] = process.argv.slice(2)
  if (command !== 'build' && !(command === 'verify' && directory)) throw Error('Usage: release-artifact.mjs build | verify <release-directory>')
  console.log(JSON.stringify(await (command === 'build' ? build() : verify(directory))))
} catch (error) {
  console.error(error.message)
  process.exitCode = 1
}
