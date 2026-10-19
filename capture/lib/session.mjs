import { chromium } from 'playwright'
import { TEST } from './env.mjs'

export const DESKTOP = { width: 1280, height: 800 }
export const PHONE = { width: 390, height: 844 }

export async function openBrowser({ viewport = DESKTOP, mobile = false } = {}) {
  const browser = await chromium.launch()
  const context = await browser.newContext({
    viewport,
    locale: 'vi-VN',
    timezoneId: 'Asia/Bangkok',
    ...(mobile ? { hasTouch: true, isMobile: true } : {}),
    deviceScaleFactor: 2,
  })
  const page = await context.newPage()
  return { browser, context, page }
}

const USER_INPUT = '#Input_UserNameOrEmailAddress, input[name="Input.UserNameOrEmailAddress"], input[name="LoginInput.UserNameOrEmailAddress"]'

// Sign in through the OpenIddict form hosted by the backend; both apps share it.
export async function signIn(page, entryUrl, appOrigin, { user = TEST.trainerUser, password = TEST.password } = {}) {
  await page.goto(entryUrl, { waitUntil: 'domcontentloaded' })
  await page.locator(USER_INPUT).first().waitFor({ state: 'visible', timeout: 30000 })
  await page.locator(USER_INPUT).first().fill(user)
  await page.locator('input[type="password"]:visible').first().fill(password)
  await Promise.all([
    page.waitForURL(`${appOrigin}/**`, { timeout: 60000 }),
    page.locator('button[type="submit"]').click(),
  ])
  await page.waitForLoadState('networkidle')
}

export const signInAdmin = (page, opts) => signIn(page, `${TEST.adminUrl}/auth/login`, TEST.adminUrl, opts)
