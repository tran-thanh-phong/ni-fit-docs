import { openBrowser, PHONE } from '../lib/session.mjs'
import { createRecorder } from '../lib/shot.mjs'
import { TEST } from '../lib/env.mjs'
import { DEMO_CLIENT as C } from '../lib/demo-data.mjs'

const hideOthers = { blur: { pattern: /@/, except: new RegExp(C.email.replace('.', '\\.')) } }
const { browser, page } = await openBrowser({ viewport: PHONE, mobile: true })
try {
  const rec = createRecorder(page, { flow: 'pt-dung-app-hoc-vien', viewports: ['phone'] })
  const email = page.locator('input[type="email"],input[type="text"],input:not([type])').first()
  const password = page.locator('input[type="password"]').first()
  const signIn = page.getByRole('button', { name: 'Đăng nhập' })

  await page.goto(`${TEST.clientUrl}/login`, { waitUntil: 'networkidle' })
  await email.fill(TEST.trainerUser)
  await password.fill(TEST.password)
  await rec.step('dang-nhap', [email, password, signIn])

  await signIn.click()
  await page.waitForURL('**/coach/clients', { timeout: 30000 })
  await page.waitForTimeout(2000)
  const studentRow = page.getByText(C.email).first()
  await rec.step('chon-hoc-vien', [page.getByRole('button').filter({ hasText: C.email }).or(studentRow)], hideOthers)

  await studentRow.click()
  await page.getByRole('button', { name: 'Bắt đầu buổi tập' }).waitFor({ timeout: 30000 })
  await page.waitForTimeout(1500)
  await rec.step('trang-chu-thao-tac-thay', [
    page.getByText(/Đang thao tác thay/),
    page.getByRole('button', { name: 'Bắt đầu buổi tập' }),
    page.getByRole('button', { name: /^BỮA ĂN/ }),
    page.getByRole('link', { name: 'Bữa ăn' }),
  ])

  await page.getByRole('button', { name: 'Bắt đầu buổi tập' }).click()
  await page.getByRole('button', { name: /Ghi — ghi set này/ }).waitFor({ timeout: 30000 })
  await page.waitForTimeout(1500)
  await rec.step('man-hinh-ghi-set', [
    page.getByRole('button', { name: /^Db chest press 10\*, 0\/2 set/ }),
    page.getByRole('button', { name: 'Tăng MỨC TẠ KG' }),
    page.getByRole('button', { name: 'Tăng REP' }),
    page.getByRole('button', { name: /Ghi — ghi set này/ }),
  ])

  await page.getByRole('button', { name: 'Thêm 5 MỨC TẠ KG' }).click()
  await page.getByRole('button', { name: 'Thêm 5 MỨC TẠ KG' }).click()
  await page.getByRole('button', { name: 'Tăng REP' }).click()
  await page.getByRole('button', { name: 'Tăng REP' }).click()
  await page.getByRole('button', { name: 'Tăng REP' }).click()
  await page.getByRole('button', { name: /Ghi — ghi set này/ }).click()
  await page.waitForTimeout(2500)
  await rec.step('da-ghi-set', [
    page.getByText(/Nghỉ · trước set/i).first(),
    page.getByRole('button', { name: 'Sửa set 1' }),
    page.getByRole('button', { name: 'Hoàn thành' }),
  ])

  await page.getByRole('button', { name: 'Hoàn thành' }).click()
  await page.waitForTimeout(2000)
  await rec.step('hoan-thanh-buoi-tap', [
    page.getByText('Hoàn thành buổi tập?'),
    page.getByText('Tập dở · giữ các set đã ghi', { exact: false }),
    page.getByRole('button', { name: 'Hoàn thành' }).last(),
  ])
  await page.getByRole('button', { name: 'Tiếp tục', exact: true }).click()
  await page.waitForTimeout(800)

  await page.goto(`${TEST.clientUrl}/meals`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(3000)
  await rec.step('xem-thuc-don', [
    page.getByText('Thực đơn hiện tại'),
    page.getByRole('tab', { name: 'Ngày', exact: true }).or(page.getByText('Ngày', { exact: true })).first(),
    page.getByRole('button', { name: 'Sáng', exact: true }).or(page.getByText('Sáng', { exact: true })).first(),
    page.getByText('Cơm', { exact: true }).first(),
  ])

  await rec.step('thoat-che-do-thao-tac-thay', [
    page.getByRole('button', { name: 'Đổi', exact: true }),
    page.getByRole('button', { name: 'Thoát', exact: true }),
  ])
} finally {
  await browser.close()
}
