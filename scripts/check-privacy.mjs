import fs from 'node:fs'
import path from 'node:path'

const dist = path.resolve('.vitepress/dist')
const index = fs.readFileSync(path.join(dist, 'index.html'), 'utf8')
if (index.includes('googletagmanager.com') || index.includes('G-B8G6D7K9SQ')) {
  throw new Error('analytics must not be embedded in the initial HTML response')
}
if (!fs.existsSync(path.join(dist, 'privacy.html'))) {
  throw new Error('privacy page was not generated')
}
console.log('consent-first analytics checks passed')
