import assert from 'node:assert/strict'
import { test } from 'node:test'
import { mkdtemp, mkdir, writeFile, readFile, readdir, rm, chmod, symlink } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import * as artifact from './release-artifact.mjs'

async function fixture(t) {
  const root = await mkdtemp(join(tmpdir(), 'diffpal-artifact-'))
  t.after(() => rm(root, { recursive: true, force: true }))
  const dist = join(root, 'dist')
  await mkdir(join(dist, 'assets'), { recursive: true })
  await writeFile(join(dist, 'index.html'), '<h1>Release</h1>')
  await writeFile(join(dist, '404.html'), '<h1>Not found</h1>')
  await writeFile(join(dist, 'assets', 'app.hash.js'), 'console.log("release")')
  return { root, dist, env: { ...process.env, SITE_DIST: dist, ARTIFACT_ROOT: join(root, 'releases') } }
}
function built(env) {
  return artifact.build({ dist: env.SITE_DIST, output: env.ARTIFACT_ROOT })
}

// Catches accidental dependence on timestamps/absolute source paths, or copying
// metadata into the publicly served asset directory.
test('identical public bytes produce the same release in different directories', async t => {
  const a = await fixture(t), b = await fixture(t)
  const first = await built(a.env), second = await built(b.env)
  assert.equal(first.digest, second.digest)
  assert.equal((await built(a.env)).directory, first.directory)
  assert.match(first.digest, /^[a-f0-9]{64}$/)
  assert.deepEqual(await readdir(join(first.directory, 'assets')), ['404.html', 'assets', 'index.html'])
  assert.equal(await readFile(join(first.directory, 'metadata', '_headers'), 'utf8'),
    await readFile(new URL('../hosting/_headers', import.meta.url), 'utf8'))
  assert.equal((await artifact.verify(first.directory)).digest, first.digest)
})

// Catches a checksum guard that trusts the manifest without inspecting bytes or
// ignores files which Terraform would nevertheless upload.
test('verification rejects changed bytes and untracked uploaded files', async t => {
  const { env } = await fixture(t)
  const { directory } = await built(env)
  const html = join(directory, 'assets', 'index.html')
  await chmod(html, 0o644)
  await writeFile(html, '<h1>Altered!</h1>')
  await assert.rejects(artifact.verify(directory), /manifest|checksum/i)
  await writeFile(html, '<h1>Release</h1>')
  await writeFile(join(directory, 'assets', 'extra.txt'), 'untracked')
  await assert.rejects(artifact.verify(directory), /manifest|untracked/i)
})

// Catches packaging which follows symlinks or leaks operator/private files.
test('build refuses symlinks and hidden files instead of publishing them', async t => {
  const { root, dist, env } = await fixture(t)
  await writeFile(join(root, 'private.txt'), 'private')
  await symlink(join(root, 'private.txt'), join(dist, 'leak.txt'))
  await assert.rejects(built(env), /regular file|symlink/i)
  await rm(join(dist, 'leak.txt'))
  await writeFile(join(dist, '.env'), 'private')
  await assert.rejects(built(env), /hidden|private/i)
})

// Catches uploading a single file beyond the Workers Free limit.
test('build rejects a static asset larger than 25 MiB', async t => {
  const { dist, env } = await fixture(t)
  await writeFile(join(dist, 'large.bin'), Buffer.alloc(25 * 1024 * 1024 + 1))
  await assert.rejects(built(env), /25 MiB/)
})
