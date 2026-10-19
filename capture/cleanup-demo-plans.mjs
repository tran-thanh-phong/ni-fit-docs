// Removes plans left over from earlier capture runs so each guide run ends with exactly one demo plan per kind.
import { trainerToken, apiGet } from './lib/api-client.mjs'
import { TEST } from './lib/env.mjs'

const NAMES = { 'workout-plan': 'Plan tập 4 ngày - Minh Anh', 'meal-plan': 'Thực đơn ngày tập - Minh Anh' }
const token = await trainerToken()

for (const [path, name] of Object.entries(NAMES).filter(([p]) => !process.env.ONLY || p === process.env.ONLY)) {
  const list = await apiGet(token, `/api/app/${path}?maxResultCount=200`)
  for (const plan of list.items.filter((p) => p.name === name)) {
    // An assigned plan cannot be deleted; unassigning first turns it back into a plain draft.
    if (plan.status === 'Active') {
      const un = await fetch(`${TEST.apiUrl}/api/app/${path}/${plan.id}/unassign`, { method: 'POST', headers: { Authorization: `Bearer ${token}` } })
      console.log(un.status, 'unassign', path, plan.id)
    }
    const res = await fetch(`${TEST.apiUrl}/api/app/${path}/${plan.id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
    console.log(res.status, path, plan.id, plan.status ?? '')
    if (!res.ok) {
      // A plan with logged workouts cannot be deleted; archiving removes it from the default lists instead.
      const archived = await fetch(`${TEST.apiUrl}/api/app/${path}/${plan.id}/archive`, { method: 'POST', headers: { Authorization: `Bearer ${token}` } })
      console.log(archived.status, 'archive', path, plan.id)
    }
  }
}
