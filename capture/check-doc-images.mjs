// Fails when a page references a screenshot that is not in assets/images.
import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '..')
let missing = 0
let used = new Set()
for (const file of fs.readdirSync(path.join(root, 'pt')).filter((f) => f.endsWith('.md'))) {
  const text = fs.readFileSync(path.join(root, 'pt', file), 'utf8')
  for (const m of text.matchAll(/\{%\s*include shot\.html([^%]*)%\}/g)) {
    const attr = (name) => m[1].match(new RegExp(`${name}="([^"]*)"`))?.[1] ?? ''
    const dir = attr('dir')
    for (const f of [...attr('desktop').split(','), ...attr('phone').split(',')].filter(Boolean)) {
      const rel = `assets/images/${dir}/${f}.png`
      used.add(rel)
      if (!fs.existsSync(path.join(root, rel))) {
        console.log(`MISSING ${file}: ${rel}`)
        missing++
      }
    }
  }
}
for (const dir of fs.readdirSync(path.join(root, 'assets/images'))) {
  for (const f of fs.readdirSync(path.join(root, 'assets/images', dir))) {
    if (!used.has(`assets/images/${dir}/${f}`)) console.log(`UNUSED  assets/images/${dir}/${f}`)
  }
}
console.log(missing ? `${missing} missing` : 'all referenced images exist')
process.exit(missing ? 1 : 0)
