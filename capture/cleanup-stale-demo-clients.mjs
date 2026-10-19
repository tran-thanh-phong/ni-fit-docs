// Test has no hard delete and PT cannot deactivate users, so demo clients from earlier capture attempts are renamed
// to make them obviously not part of the guide.
import { trainerToken, apiGet } from './lib/api-client.mjs'
import { TEST } from './lib/env.mjs'
import { DEMO_CLIENT as C } from './lib/demo-data.mjs'

const token = await trainerToken()
const list = await apiGet(token, '/api/app/client?maxResultCount=200')
for (const c of list.items.filter((x) => /^minh\.anh\.demo/.test(x.email ?? '') && x.email !== C.email)) {
  const detail = await apiGet(token, `/api/app/client/${c.id}`)
  const res = await fetch(`${TEST.apiUrl}/api/app/client/${c.id}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...detail, name: 'Capture', surname: 'Thử nghiệm cũ' }),
  })
  console.log(res.status, c.email, res.ok ? '' : (await res.text()).slice(0, 200))
}
