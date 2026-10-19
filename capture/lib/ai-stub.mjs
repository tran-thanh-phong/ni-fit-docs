import path from 'node:path'
import { randomUUID } from 'node:crypto'
import XLSX from 'xlsx'
import { trainerToken, apiGet } from './api-client.mjs'

/*
 * Test's Gemini credits ran out (2026-10-19), so the AI step cannot run live there. This module answers the
 * generate job with a draft built from the real workbook rows and the real Test library, exactly the shape the
 * AI endpoint returns. Everything after Generate (matching, review, saving) still hits the real backend.
 * Re-record with real AI later: HAR_REFRESH=1 and no STUB_AI.
 */

export const SAMPLE_XLSX = path.resolve(import.meta.dirname, '../../samples/plan-an-tap-mau.xlsx')

const normalize = (s) => s.toLowerCase().normalize('NFC').replace(/[^\p{L}\p{N}]+/gu, '')
const clean = (s) => String(s ?? '').replace(/\s+/g, ' ').trim()

function readSheet(name) {
  const wb = XLSX.readFile(SAMPLE_XLSX, { cellDates: true })
  return XLSX.utils.sheet_to_json(wb.Sheets[name], { header: 1, raw: true, defval: null })
}

// Excel turned "8-12" into the date 8 Dec; read it back as the rep range it was meant to be.
function parseReps(cell) {
  if (cell instanceof Date) return { reps: cell.getDate(), repMax: cell.getMonth() + 1 }
  const text = clean(cell)
  const range = text.match(/^(\d+)\s*-\s*(\d+)$/)
  if (range) return { reps: Number(range[1]), repMax: Number(range[2]) }
  if (/^\d+$/.test(text)) return { reps: Number(text), repMax: null }
  return { reps: null, repMax: null, toFailure: text.toUpperCase() === 'F' }
}

function exerciseDto(row) {
  const [name, sets, repCell, , rir, note] = row
  const { reps, repMax, toFailure } = parseReps(repCell)
  const numberOfSets = Number(sets) || 1
  const noteText = [toFailure ? 'Tập tới thất bại (F)' : null, clean(note) || null].filter(Boolean).join('. ') || null
  return {
    exerciseName: clean(name),
    counterType: 'Reps',
    numberOfSets,
    targetRIR: rir == null ? null : Number(rir),
    implicitReps: reps,
    implicitRepMax: repMax,
    restPeriodSeconds: 90,
    notes: noteText,
    sets: Array.from({ length: numberOfSets }, (_, i) => ({
      setNo: i + 1,
      reps,
      repMax,
      weight: null,
      isBodyWeight: false,
      note: i === 0 ? noteText : null,
    })),
  }
}

export function workoutDraftFromWorkbook() {
  const rows = readSheet('Lịch tập')
  const days = []
  const trailing = []
  for (const row of rows) {
    const first = clean(row[0])
    if (!first) continue
    if (/^Ngày\s*\d+/i.test(first)) days.push({ dayLabel: first.replace(/\(\s*/, '(').replace(/\s*\)/, ')'), isRestDay: false, exercises: [] })
    else if (row[1] == null && days.length) trailing.push(first)
    else if (days.length) days.at(-1).exercises.push(exerciseDto(row))
  }
  return {
    planName: 'Plan tập 4 ngày - Minh Anh',
    guidelines: `<ul>${trailing.map((t) => `<li>${t}</li>`).join('')}</ul>`,
    durationWeeks: 8,
    scheduleType: 'Weekly',
    settings: { effortMetric: 'RIR', repRangeDisplay: true, progressionMode: 'FixedSets', weightUnit: 'Kg' },
    days,
    planWarnings: [],
    noExerciseRowsFound: false,
  }
}

export async function buildWorkoutGenerateResult() {
  const draft = workoutDraftFromWorkbook()
  const token = await trainerToken()
  const library = (await apiGet(token, '/api/app/exercise/lookup?maxResultCount=1000')).items
  const byKey = new Map(library.map((x) => [normalize(x.name), x]))
  const names = [...new Set(draft.days.flatMap((d) => d.exercises.map((e) => e.exerciseName)))]
  const exerciseMappings = names.map((name) => {
    const exact = byKey.get(normalize(name))
    const near = exact ?? library.find((x) => normalize(x.name).includes(normalize(name)) || normalize(name).includes(normalize(x.name)))
    return { name, isMapped: Boolean(exact), suggestedExerciseId: near?.id ?? null, suggestedExerciseName: near?.name ?? null }
  })
  return { draft, exerciseMappings }
}

const item = (name, amount, unit, category = 'Other', extra = {}) => ({
  name,
  amount: amount ?? null,
  unit: unit ?? null,
  quantityText: amount != null ? `${amount}${unit ?? ''}` : (extra.quantityText ?? null),
  quantityKind: amount != null ? 'Exact' : 'None',
  proposedCategory: category,
  libraryName: null,
  proposedUnit: unit ?? null,
  ...extra,
})

const row = (kind, base, note = null) => ({ ...base, kind, note, isRecipe: false, recipeInstruction: null, alternative: null, ingredients: [] })
const food = (...args) => row('Food', item(...args))
const supplement = (name, amount, unit, extra = {}) => row('Supplement', item(name, amount, unit, 'Other', extra))

const YOGURT = 'Sữa chua TH True Milk không đường'

export function mealDraftFromWorkbook() {
  const meals = [
    { label: 'Sáng', foods: [food('Cơm', 100, 'g', 'Carb'), food('Khoai', 100, 'g', 'Carb'), food('Trứng', 3, 'quả', 'Protein'), food('Thịt, cá nạc', 100, 'g', 'Protein'), food(YOGURT, 1, 'hộp', 'Protein'), food('Khóm', 100, 'g', 'Fruit')] },
    { label: 'Trưa', foods: [food('Cơm', 100, 'g', 'Carb'), food('Khoai', 100, 'g', 'Carb'), food('Thịt, cá nạc', 150, 'g', 'Protein'), food('Khóm', 100, 'g', 'Fruit'), food(YOGURT, 1, 'hộp', 'Protein'), row('Food', item('Rau', null, null, 'Veg', { quantityText: 'vừa đủ' }), 'Súp lơ, măng tây, ớt chuông, cà chua, dưa leo, rau luộc...')] },
    { label: "Trước tập (ít nhất 60')", foods: [food('Cơm', 200, 'g', 'Carb'), food('Khoai', 100, 'g', 'Carb'), food('Thịt, cá nạc', 150, 'g', 'Protein'), food(YOGURT, 1, 'hộp', 'Protein'), food('Chuối', 1, 'trái', 'Fruit', { quantityText: '1 trái (70-90g)' })] },
    { label: 'Tối', foods: [food('Cơm', 200, 'g', 'Carb'), food('Thịt, cá nạc', 150, 'g', 'Protein'), food('Khóm', 100, 'g', 'Fruit'), food(YOGURT, 1, 'hộp', 'Protein')] },
    {
      label: 'Thực phẩm bổ sung (theo ngày)',
      foods: [],
      supplements: [
        supplement('Vitamin D3', 2000, 'iu'),
        supplement('K2', 90, 'mcg'),
        supplement('Omega 3', 2, 'viên'),
        supplement('Magnesium Bisglycinate', null, 'mg', { quantityText: '300-500mg', quantityKind: 'Range' }),
        supplement('Creatine', 5, 'g'),
        supplement('Zinc Bisglycinate', null, 'mg', { quantityText: '15-25mg', quantityKind: 'Range' }),
      ],
    },
  ]
  return {
    planName: 'Thực đơn ngày tập - Minh Anh',
    guidelines: '<p>Tpbs cơ bản khuyên dùng theo ngày: D3 + K2, Omega 3, Magnesium, Creatine, Zinc.</p>',
    dayTypes: [{ label: 'Ngày tập', meals: meals.map((m) => ({ foodsNote: null, supplements: [], ...m })) }],
    droppedValues: [],
    unplacedLines: [],
    warnings: [],
    unreadable: false,
  }
}

export async function buildMealGenerateResult() {
  const draft = mealDraftFromWorkbook()
  const token = await trainerToken()
  const names = new Map()
  for (const meal of draft.dayTypes[0].meals) {
    for (const r of [...meal.foods, ...meal.supplements]) {
      const key = `${r.kind}:${r.name}`
      const seen = names.get(key)
      names.set(key, { ...r, usedIn: (seen?.usedIn ?? 0) + 1 })
    }
  }
  // The paged list returns the whole library; the lookup endpoint is capped and misses items.
  const all = (await apiGet(token, '/api/app/library-item?maxResultCount=1000')).items ?? []
  const library = { Food: all.filter((x) => x.kind === 'Food'), Supplement: all.filter((x) => x.kind === 'Supplement') }
  const mappings = [...names.values()].map((use) => {
    const key = normalize(use.name)
    const items = library[use.kind]
    const exact = items.find((x) => normalize(x.name) === key)
    const near = exact ? [] : items.filter((x) => key.length >= 4 && (normalize(x.name).includes(key) || key.includes(normalize(x.name))))
    return {
      name: use.name,
      kind: use.kind,
      usedIn: use.usedIn,
      isMapped: Boolean(exact),
      resolvedLibraryItemId: exact?.id ?? null,
      resolvedItemName: exact?.name ?? null,
      suggestions: near.slice(0, 2).map((x) => ({ id: x.id, name: x.name })),
      proposedCategory: use.proposedCategory,
      proposedUnit: use.proposedUnit,
    }
  })
  return { outcome: 'Ready', draft, mappings }
}

/**
 * Answers the generate job of one import kind: start returns a job id, the first polls report Running (so the
 * "generating" screen can be shot), then a Succeeded poll carries the result.
 */
export async function stubGenerationJob(page, kind, result, { runningPolls = 3 } = {}) {
  const base = kind === 'workout' ? 'workout-plan-import' : 'meal-plan-import'
  const jobId = randomUUID()
  let polls = 0
  await page.route(`**/api/app/${base}/start-generate`, (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ jobId }) })
  )
  await page.route(`**/api/app/${base}/generate-job/*`, (route) => {
    polls += 1
    const body = polls <= runningPolls ? { jobId, status: 'Running' } : { jobId, status: 'Succeeded', result }
    return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(body) })
  })
}
