import { openBrowser, signInAdmin } from '../lib/session.mjs'
import { createRecorder } from '../lib/shot.mjs'
import { TEST } from '../lib/env.mjs'
import { DEMO_CLIENT as C } from '../lib/demo-data.mjs'

const { browser, page } = await openBrowser()
try {
  await signInAdmin(page)
  const rec = createRecorder(page, { flow: 'tao-hoc-vien' })
  const hideOthers = { blur: { pattern: /@/, except: /example\.com/ } }

  await page.goto(`${TEST.adminUrl}/admin/clients`, { waitUntil: 'networkidle' })
  await rec.step('danh-sach-hoc-vien', [page.getByRole('link', { name: 'Thêm học viên' }).or(page.getByRole('button', { name: 'Thêm học viên' }))], hideOthers)

  await page.getByRole('link', { name: 'Thêm học viên' }).or(page.getByRole('button', { name: 'Thêm học viên' })).first().click()
  await page.waitForURL('**/admin/clients/create')
  await page.waitForLoadState('networkidle')

  await page.getByLabel('Tên đăng nhập', { exact: true }).fill(C.username)
  await page.getByLabel('Email', { exact: true }).fill(C.email)
  await page.locator('input[type="password"]').nth(0).fill(C.password)
  await page.locator('input[type="password"]').nth(1).fill(C.password)
  await page.getByLabel('Tên', { exact: true }).fill(C.firstName)
  await page.getByLabel('Họ', { exact: true }).fill(C.lastName)
  await page.getByLabel(/^Số điện thoại/).fill(C.phone)
  await page.getByLabel(/^Huấn luyện viên/).selectOption({ label: C.trainerName })

  await rec.step('dien-form', [
    page.getByLabel('Tên đăng nhập', { exact: true }),
    page.getByLabel('Email', { exact: true }),
    page.locator('input[type="password"]').nth(0),
    page.getByLabel('Tên', { exact: true }),
    page.getByLabel('Họ', { exact: true }),
    page.getByLabel(/^Số điện thoại/),
    page.getByLabel(/^Huấn luyện viên/),
    page.getByRole('button', { name: 'Tạo học viên' }),
  ])

  // REUSE_CLIENT=1 re-shoots the guide after the client already exists (Test has no hard delete for users).
  if (process.env.REUSE_CLIENT !== '1') {
    await page.getByRole('button', { name: 'Tạo học viên' }).click()
    await page.waitForURL(/\/admin\/clients(\/[0-9a-f-]+)?$/, { timeout: 30000 })
    await page.waitForLoadState('networkidle')
  }

  await page.goto(`${TEST.adminUrl}/admin/clients`, { waitUntil: 'networkidle' })
  const clientRow = page.locator('tr, div.cursor-pointer').filter({ hasText: C.email })
  await page.getByPlaceholder('Tìm kiếm...').fill(C.username)
  await page.waitForTimeout(1500)
  await rec.step('hoc-vien-moi-trong-danh-sach', [clientRow], hideOthers)

  await clientRow.first().getByRole('button').last().click()
  await page.getByRole('menuitem', { name: 'Xem' }).click()
  await page.waitForURL(/\/admin\/clients\/[0-9a-f-]+$/)
  await page.waitForLoadState('networkidle')
  await page.getByText('Chương trình đã giao').waitFor()
  await page.waitForTimeout(1500)
  await rec.step('ho-so-hoc-vien', [])
} finally {
  await browser.close()
}
