import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const ENV_FILE = path.resolve(here, '../../../ni-fit-mvp/frontend/apps/admin-v2/.env.test')

// Password stays in the sibling repo's gitignored .env.test; this module never logs it.
function readEnvFile() {
  const out = {}
  for (const line of fs.readFileSync(ENV_FILE, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
    if (m) out[m[1]] = m[2].replace(/^["']|["']$/g, '')
  }
  return out
}

const file = readEnvFile()

export const TEST = {
  adminUrl: 'https://nifit-admin.phongit.online',
  clientUrl: 'https://nifit-app.phongit.online',
  apiUrl: 'https://nifit-be.phongit.online',
  trainerUser: 'nifit_pta',
  password: file.E2E_ADMIN_PASS,
}

if (!TEST.password) throw new Error('E2E_ADMIN_PASS missing in admin-v2/.env.test')
