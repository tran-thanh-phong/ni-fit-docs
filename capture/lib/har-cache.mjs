import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const CACHE_DIR = path.resolve(here, '../.cache')

// First run records the real AI answers; later runs replay them so re-shooting a page costs no paid call.
// Delete .cache/<name>.har (or set HAR_REFRESH=1) to call the AI again.
export async function replayOrRecord(page, name, urlGlob) {
  fs.mkdirSync(CACHE_DIR, { recursive: true })
  const harPath = path.join(CACHE_DIR, `${name}.har`)
  const record = process.env.HAR_REFRESH === '1' || !fs.existsSync(harPath)
  await page.routeFromHAR(harPath, { url: urlGlob, update: record, updateContent: 'embed', notFound: 'fallback' })
  console.log(`[har] ${name}: ${record ? 'recording live AI answers' : 'replaying cached answers'}`)
  return record
}
