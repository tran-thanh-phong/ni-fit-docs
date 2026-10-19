import { openBrowser, signInAdmin } from '../lib/session.mjs'
import { createRecorder } from '../lib/shot.mjs'
import { replayOrRecord } from '../lib/har-cache.mjs'
import { SAMPLE_XLSX, buildWorkoutGenerateResult, stubGenerationJob } from '../lib/ai-stub.mjs'
import { TEST } from '../lib/env.mjs'
import { DEMO_CLIENT as C } from '../lib/demo-data.mjs'

const PLAN_NAME = 'Plan tập 4 ngày - Minh Anh'
const hideOthers = { blur: { pattern: /@/, except: new RegExp(C.email.replace('.', '\\.')) } }
const generate = (page) => page.getByRole('button', { name: /^Tạo( bản nháp)?\s*→/ })

const { browser, context, page } = await openBrowser()
try {
  await signInAdmin(page)
  if (process.env.LIVE_AI === '1') await replayOrRecord(page, 'workout-import', '**/workout-plan-import/**')
  else await stubGenerationJob(page, 'workout', await buildWorkoutGenerateResult())
  const rec = createRecorder(page, { flow: 'nhap-chuong-trinh-tap' })

  await page.goto(`${TEST.adminUrl}/admin/workout-plans`, { waitUntil: 'networkidle' })
  const importButton = page.getByRole('link', { name: 'Nhập', exact: true }).or(page.getByRole('button', { name: 'Nhập', exact: true }))
  await rec.step('danh-sach-chuong-trinh', [importButton])

  await importButton.first().click()
  await page.waitForURL('**/workout-plans/import')
  await page.waitForLoadState('networkidle')
  await rec.step('man-hinh-nhap', [page.getByText('Thả tệp .xlsx vào đây hoặc chọn tệp')])

  await page.locator('input[type="file"]').setInputFiles(SAMPLE_XLSX)
  await page.getByRole('radio', { name: /Lịch tập/ }).check()
  await page.getByRole('radio', { name: /^Theo tuần/ }).check()
  for (const day of ['T2', 'T3', 'T5', 'T6']) await page.getByRole('button', { name: `${day} tắt` }).click()
  await page.getByRole('textbox').last().fill('Giữ nguyên ghi chú của HLV; ưu tiên set thẳng đơn giản.')
  await page.waitForTimeout(500)
  await rec.step('chon-tep-va-cai-dat', [
    page.getByText('plan-an-tap-mau.xlsx'),
    page.getByRole('radio', { name: /Lịch tập/ }).locator('xpath=ancestor::label[1]'),
    page.getByRole('radio', { name: /^Theo tuần/ }).locator('xpath=ancestor::label[1]'),
    page.getByRole('button', { name: 'T2 bật' }).locator('xpath=..'),
    page.getByRole('textbox').last(),
    generate(page),
  ])

  await generate(page).click()
  await page.waitForTimeout(1200)
  await rec.step('dang-tao-ban-nhap', [page.getByText('Đang đọc sheet')])
  await page.getByText(/bài tập · \d+ đã ghép/).waitFor({ timeout: 120000 })
  await page.waitForTimeout(800)
  await rec.step('buoc-ghep-ten-bai-tap', [
    page.getByText(/bài tập · \d+ đã ghép/),
    page.getByText('Cable Fly', { exact: true }),
    page.getByRole('button', { name: /^Áp dụng tất cả/ }),
  ])

  await page.getByRole('button', { name: /^Áp dụng tất cả/ }).click()
  await page.waitForTimeout(800)
  await page.getByRole('button', { name: /^Tiếp tục/ }).click()
  await page.getByRole('heading', { name: 'Thiết lập chương trình' }).waitFor({ timeout: 60000 })
  await page.waitForTimeout(1500)
  await rec.step('xem-lai-truoc-khi-luu', [
    page.getByText('Đã nhập — xem lại trước khi lưu'),
    page.getByRole('heading', { name: 'Thiết lập chương trình' }),
    page.getByText('T2', { exact: true }).first(),
    page.getByRole('heading', { name: 'Chi tiết buổi' }),
  ])

  await page.getByRole('button', { name: 'Sửa thiết lập chương trình' }).click()
  await page.waitForTimeout(800)
  await page.getByRole('combobox').first().click()
  await page.getByRole('option').filter({ hasText: C.email }).waitFor()
  await rec.step('chon-hoc-vien', [page.getByRole('option').filter({ hasText: C.email })], hideOthers)
  await page.getByRole('option').filter({ hasText: C.email }).click()

  await page.getByRole('tab', { name: 'Lịch tập' }).click()
  const today = new Date()
  const dd = String(today.getDate()).padStart(2, '0')
  const mm = String(today.getMonth() + 1).padStart(2, '0')
  await page.getByPlaceholder('dd-MM-yyyy').first().fill(`${dd}-${mm}-${today.getFullYear()}`)
  await page.waitForTimeout(600)
  await rec.step('ngay-bat-dau', [page.getByPlaceholder('dd-MM-yyyy').first(), page.getByRole('button', { name: 'Lưu chương trình' })])

  // REUSE_PLAN=1: the plan from an earlier run already exists (a plan with logged workouts cannot be deleted),
  // so leave the editor without saving and shoot the list that shows it.
  const reuse = process.env.REUSE_PLAN === '1'
  if (reuse) {
    page.on('dialog', (dialog) => dialog.accept())
    await page.goto(`${TEST.adminUrl}/admin/workout-plans`, { waitUntil: 'networkidle' })
  } else {
    await page.getByRole('button', { name: 'Lưu chương trình' }).click()
    await page.waitForURL(/\/admin\/workout-plans$/, { timeout: 60000 })
    await page.waitForLoadState('networkidle')
  }
  await page.getByText(PLAN_NAME).first().waitFor()
  const savedRow = page.locator('tr, div.cursor-pointer').filter({ hasText: PLAN_NAME }).first()
  await rec.step('chuong-trinh-da-luu', [savedRow], hideOthers)
} finally {
  await context.close()
  await browser.close()
}
