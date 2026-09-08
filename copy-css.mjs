/* tsc emits the `import './x.css'` statements but does not carry the files
   across, so the compiled output would reference nothing. Copy them next to
   their importers in dist/. */
import { copyFileSync, mkdirSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
const here = dirname(fileURLToPath(import.meta.url))
mkdirSync(join(here, 'dist'), { recursive: true })
for (const f of readdirSync(join(here, 'src')).filter((f) => f.endsWith('.css'))) {
  copyFileSync(join(here, 'src', f), join(here, 'dist', f))
  console.log('  copied', f)
}
