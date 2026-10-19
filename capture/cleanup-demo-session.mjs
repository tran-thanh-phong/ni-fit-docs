// Discards a workout session left open for the demo client so the guide can start a fresh one.
import { openBrowser, PHONE } from './lib/session.mjs'
import { TEST } from './lib/env.mjs'
import { DEMO_CLIENT as C } from './lib/demo-data.mjs'

const { browser, page } = await openBrowser({ viewport: PHONE, mobile: true })
try {
  await page.goto(`${TEST.clientUrl}/login`, { waitUntil: 'networkidle' })
  await page.locator('input[type="email"],input[type="text"],input:not([type])').first().fill(TEST.trainerUser)
  await page.locator('input[type="password"]').first().fill(TEST.password)
  await page.getByRole('button', { name: 'Đăng nhập' }).click()
  await page.waitForURL('**/coach/clients')
  await page.waitForTimeout(2000)
  await page.getByText(C.email).first().click()
  await page.waitForTimeout(4000)
  const resume = page.getByRole('button', { name: 'Tiếp tục buổi tập' })
  if (!(await resume.isVisible())) {
    console.log('no open session')
  } else {
    await resume.click()
    await page.getByRole('button', { name: 'Menu buổi tập' }).click()
    await page.getByText('Hủy buổi tập').first().click()
    await page.waitForTimeout(1000)
    await page.getByRole('button', { name: 'Hủy bỏ' }).click()
    await page.waitForTimeout(3000)
    console.log('discarded, now at', page.url())
  }
} finally {
  await browser.close()
}
