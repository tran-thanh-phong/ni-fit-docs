import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { DESKTOP, PHONE } from './session.mjs'

const here = path.dirname(fileURLToPath(import.meta.url))
export const IMAGES_DIR = path.resolve(here, '../../assets/images')
const REPO_ROOT = path.resolve(IMAGES_DIR, '..', '..')

const VIEWPORTS = { desktop: DESKTOP, phone: PHONE }
// Phone tab bar and the desktop sticky action bar cover the lowest ~80px, so marks there count as not visible.
const BOTTOM_RESERVED = 80
const LAYER_ID = '__doc_highlight_layer__'

// Numbered red outlines in a fixed overlay; removed again right after each screenshot.
async function drawHighlights(page, boxes) {
  await page.evaluate(({ boxes, id }) => {
    document.getElementById(id)?.remove()
    const layer = document.createElement('div')
    layer.id = id
    layer.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:2147483647'
    for (const b of boxes) {
      const frame = document.createElement('div')
      frame.style.cssText = `position:absolute;left:${b.x - 4}px;top:${b.y - 4}px;width:${b.width + 8}px;height:${b.height + 8}px;border:3px solid #e11d48;border-radius:10px;box-shadow:0 0 0 2px rgba(255,255,255,.85)`
      const badge = document.createElement('div')
      badge.textContent = String(b.n)
      // Wide boxes with room on the left get the badge in the margin; narrow boxes or boxes hugging the edge get it on
      // the top-left corner, so it never covers the element's own text.
      const corner = b.width < 80 || b.x < 40
      const left = corner ? -17 : -38
      const top = corner ? -17 : Math.max(-6, b.height / 2 - 14)
      badge.style.cssText = `position:absolute;left:${left}px;top:${top}px;width:28px;height:28px;border-radius:50%;background:#e11d48;color:#fff;font:700 15px/28px system-ui,sans-serif;text-align:center;box-shadow:0 0 0 2px #fff`
      frame.appendChild(badge)
      layer.appendChild(frame)
    }
    document.body.appendChild(layer)
  }, { boxes, id: LAYER_ID })
}

const clearOverlays = (page) =>
  page.evaluate((id) => {
    document.getElementById(id)?.remove()
    for (const el of document.querySelectorAll('[data-doc-blur]')) {
      el.style.filter = ''
      delete el.dataset.docBlur
    }
  }, LAYER_ID)

// Blurs leaf text matching `pattern` unless it also matches `except`, so other people's emails never reach the docs.
const blurText = (page, { pattern, except }) =>
  page.evaluate(({ pattern, except }) => {
    const re = new RegExp(pattern)
    const ex = except ? new RegExp(except) : null
    for (const el of document.querySelectorAll('body *')) {
      if (el.children.length) continue
      const t = el.textContent ?? ''
      if (re.test(t) && !(ex && ex.test(t))) {
        el.style.filter = 'blur(5px)'
        el.dataset.docBlur = '1'
      }
    }
  }, { pattern: pattern.source, except: except?.source })

const resetScroll = (page) =>
  page.evaluate(() => {
    window.scrollTo(0, 0)
    for (const el of document.querySelectorAll('*')) if (el.scrollTop > 0) el.scrollTop = 0
  })

/**
 * One recorder per flow. `viewports` picks the layouts each step is captured in; ['desktop','phone']
 * resizes the same page between shots so both images show identical data. Marks that do not fit
 * one screen are split over extra images (-2, -3 ...) while keeping their global numbers.
 */
export function createRecorder(page, { flow, viewports = ['desktop', 'phone'] }) {
  const dir = path.join(IMAGES_DIR, flow)
  fs.mkdirSync(dir, { recursive: true })
  let index = 0
  const written = []
  // The context renders at 2x; desktop shots are saved at CSS size and phone shots at device size, so phones stay sharp
  // without 2560px-wide desktop images.
  const setView = (vp) => page.setViewportSize(VIEWPORTS[vp])

  async function visibleBoxes(pending, targets, vp) {
    const limit = VIEWPORTS[vp].height - BOTTOM_RESERVED
    const inView = []
    for (const i of pending) {
      const box = await targets[i].first().boundingBox({ timeout: 2500 }).catch(() => null)
      if (box && box.y >= 0 && box.y + box.height <= limit) inView.push({ ...box, n: i + 1, i })
    }
    return inView
  }

  async function step(slug, marks = [], opts = {}) {
    console.log(`[step] ${new Date().toISOString().slice(11, 19)} ${slug}`)
    index += 1
    const nn = String(index).padStart(2, '0')
    const targets = marks.map((m) => (typeof m === 'string' ? page.locator(m) : m))
    for (const vp of viewports) {
      if (viewports.length > 1) {
        await setView(vp)
        await page.waitForTimeout(700)
      }
      if (!opts.keepScroll) await resetScroll(page)
      const base = `${nn}-${slug}${vp === 'phone' && viewports.length > 1 ? '-mobile' : ''}`
      let pending = targets.map((_, i) => i)
      let part = 0
      do {
        part += 1
        if (pending.length) {
          if (part === 1) await targets[pending[0]].first().scrollIntoViewIfNeeded({ timeout: 2500 }).catch(() => {})
          else await targets[pending[0]].first().evaluate((el) => el.scrollIntoView({ block: 'center' }), null, { timeout: 2500 }).catch(() => {})
          await page.waitForTimeout(250)
        }
        let boxes = await visibleBoxes(pending, targets, vp)
        if (pending.length && !boxes.length) {
          const box = await targets[pending[0]].first().boundingBox({ timeout: 2500 }).catch(() => null)
          if (!box) {
            console.warn(`[shot] ${flow}/${base}: mark ${pending[0] + 1} not found, skipped`)
            pending = pending.slice(1)
            continue
          }
          boxes = [{ ...box, n: pending[0] + 1, i: pending[0] }]
        }
        if (opts.blur) await blurText(page, opts.blur)
        if (boxes.length) await drawHighlights(page, boxes)
        const file = path.join(dir, `${base}${part > 1 ? `-${part}` : ''}.png`)
        await page.screenshot({ path: file, scale: vp === 'phone' ? 'device' : 'css' })
        written.push(path.relative(REPO_ROOT, file).split(path.sep).join('/'))
        await clearOverlays(page)
        const done = new Set(boxes.map((b) => b.i))
        pending = pending.filter((i) => !done.has(i))
      } while (pending.length)
    }
    if (viewports.length > 1) await setView(viewports[0])
  }

  return { step, written }
}
