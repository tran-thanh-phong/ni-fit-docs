import { openBrowser, signInAdmin } from '../lib/session.mjs'
import { createRecorder } from '../lib/shot.mjs'
import { replayOrRecord } from '../lib/har-cache.mjs'
import { SAMPLE_XLSX, buildMealGenerateResult, stubGenerationJob } from '../lib/ai-stub.mjs'
import { TEST } from '../lib/env.mjs'
import { DEMO_CLIENT as C } from '../lib/demo-data.mjs'

const PLAN_NAME = 'Thực đơn ngày tập - Minh Anh'
const hideOthers = { blur: { pattern: /@/, except: new RegExp(C.email.replace('.', '\.')) } }

const generate = (page) => page.getByRole('button', { name: /^Tạo( bản nháp)?\s*→/ })
const { browser, context, page } = await openBrowser()
try {
  await signInAdmin(page)
  if (process.env.LIVE_AI === '1') await replayOrRecord(page, 'meal-import', '**/meal-plan-import/**')
  else await stubGenerationJob(page, 'meal', await buildMealGenerateResult())
  const rec = createRecorder(page, { flow: 'nhap-thuc-don' })

  await page.goto(`${TEST.adminUrl}/admin/meal-plans`, { waitUntil: 'networkidle' })
  const importButton = page.getByRole('link', { name: 'Nhập', exact: true }).or(page.getByRole('button', { name: 'Nhập', exact: true }))
  await rec.step('danh-sach-thuc-don', [importButton])

  await importButton.first().click()
  await page.waitForURL('**/meal-plans/import')
  await page.waitForLoadState('networkidle')
  await rec.step('man-hinh-nhap', [page.getByText('Thả tệp .xlsx vào đây hoặc chọn tệp')])

  await page.locator('input[type="file"]').setInputFiles(SAMPLE_XLSX)
  await page.getByRole('radio', { name: /Ăn uống/ }).check()
  await page.getByRole('textbox').last().fill('Sheet này là thực đơn một ngày tập.')
  await page.waitForTimeout(600)
  await rec.step('chon-tep-va-sheet', [
    page.getByText('plan-an-tap-mau.xlsx'),
    page.getByRole('radio', { name: /Ăn uống/ }).locator('xpath=ancestor::label[1]'),
    page.getByRole('textbox').last(),
    generate(page),
  ])

  await generate(page).click()
  await page.waitForTimeout(1200)
  await rec.step('dang-tao-ban-nhap', [page.getByText(/Đang đọc sheet|Đang tạo từ/).first()])
  await page.getByText(/\d+ tên · \d+ đã ghép/).waitFor({ timeout: 120000 })
  await page.waitForTimeout(800)
  await rec.step('buoc-ghep-ten-mon', [
    page.getByText(/\d+ tên · \d+ đã ghép/),
    page.getByRole('button', { name: /^Áp dụng tất cả/ }),
  ])

  await page.getByRole('button', { name: /^Áp dụng tất cả/ }).click()
  await page.waitForTimeout(1500)
  await page.getByRole('button', { name: /^Tiếp tục/ }).click()
  await page.getByRole('heading', { name: 'Thiết lập chương trình' }).waitFor({ timeout: 60000 })
  await page.waitForTimeout(1500)
  await rec.step('xem-lai-truoc-khi-luu', [
    page.getByText('Đã nhập — xem lại trước khi lưu'),
    page.getByRole('heading', { name: 'Thiết lập chương trình' }),
    page.getByRole('button', { name: /^Bữa 1/ }).first(),
    page.getByRole('button', { name: 'Lưu thực đơn' }),
  ])

  await page.getByRole('button', { name: /^Bữa 1/ }).first().click()
  await page.waitForTimeout(800)
  await rec.step('kiem-tra-bua-an', [page.getByRole('button', { name: 'Cơm' }).first(), page.getByText('Số lượng · Đơn vị').first()])
  await page.getByRole('button', { name: /^Bữa 1/ }).first().click()

  await page.getByRole('button', { name: 'Sửa thiết lập chương trình' }).click()
  await page.waitForTimeout(800)
  await rec.step('ten-thuc-don', [page.getByRole('textbox').first()])
  await page.getByRole('tab', { name: 'Lịch', exact: true }).click()
  await page.getByRole('combobox').first().click()
  await page.getByRole('option').filter({ hasText: C.email }).waitFor()
  await rec.step('chon-hoc-vien', [page.getByRole('option').filter({ hasText: C.email })], hideOthers)
  await page.getByRole('option').filter({ hasText: C.email }).click()
  const today = new Date()
  const dd = String(today.getDate()).padStart(2, '0')
  const mm = String(today.getMonth() + 1).padStart(2, '0')
  await page.getByPlaceholder('dd-MM-yyyy').first().fill(`${dd}-${mm}-${today.getFullYear()}`)
  await page.waitForTimeout(600)
  await rec.step('ngay-bat-dau', [page.getByPlaceholder('dd-MM-yyyy').first(), page.getByRole('button', { name: 'Lưu thực đơn' })])

  if (process.env.NO_SAVE === '1') {
    console.log('NO_SAVE=1: stopped before saving')
  } else {
    await page.getByRole('button', { name: 'Lưu thực đơn' }).click()
    await page.waitForURL(/\/admin\/meal-plans$/, { timeout: 60000 })
    await page.waitForLoadState('networkidle')
    await page.getByText(PLAN_NAME).first().waitFor()
    const savedRow = page.locator('tr, div.cursor-pointer').filter({ hasText: PLAN_NAME }).first()
    await rec.step('thuc-don-da-luu', [savedRow], hideOthers)
  }
} finally {
  await context.close()
  await browser.close()
}
