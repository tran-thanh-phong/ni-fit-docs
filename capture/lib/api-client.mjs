import { TEST } from './env.mjs'

// Password-grant token for the trainer, used only to read library lookups when stubbing AI output.
export async function trainerToken() {
  const res = await fetch(`${TEST.apiUrl}/connect/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'password',
      client_id: 'NiFit_Client',
      username: TEST.trainerUser,
      password: TEST.password,
      scope: 'openid profile email roles offline_access NiFit',
    }),
  })
  if (!res.ok) throw new Error(`token request failed: ${res.status}`)
  return (await res.json()).access_token
}

export async function apiGet(token, pathAndQuery) {
  const res = await fetch(`${TEST.apiUrl}${pathAndQuery}`, { headers: { Authorization: `Bearer ${token}` } })
  if (!res.ok) throw new Error(`GET ${pathAndQuery} -> ${res.status}`)
  return res.json()
}
