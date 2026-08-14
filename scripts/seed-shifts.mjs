// Seed events/2026/shifts from a CSV (one row per volunteer slot; duplicate
// rows collapse into a shift's spot count) — same format the car show used.
//
// Rows that carry a volunteer name (columns 4-7) are pre-registered volunteers
// from the organizers' paper sheets: each becomes a `signups` doc (deterministic
// ID, so re-running never duplicates) and counts toward the shift's spotsFilled.
// Usage:
//   node scripts/seed-shifts.mjs data/shifts_2026.csv            # against emulator (FIRESTORE_EMULATOR_HOST=localhost:8081)
//   node scripts/seed-shifts.mjs data/shifts_2026.csv --prod     # against production
import { readFileSync } from 'node:fs'
import { createHash, randomBytes } from 'node:crypto'
import { initializeApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

const csvPath = process.argv[2]
const prod = process.argv.includes('--prod')
if (!csvPath) {
  console.error('Usage: node scripts/seed-shifts.mjs <csv> [--prod]')
  process.exit(1)
}
if (!prod && !process.env.FIRESTORE_EMULATOR_HOST) {
  process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8081'
}

const PROJECT_ID = 'senoiaporchfest'
const EVENT_ID = '2026'
// PorchFest weekend: Sat 9/5 setup, Sun 9/6 event, Mon 9/7 cleanup.
const DATE_MAP = { '9/5': '2026-09-05', '9/6': '2026-09-06', '9/7': '2026-09-07' }

function parseCsv(text) {
  const rows = []
  let row = [], field = '', inQuotes = false
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (inQuotes) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++ }
      else if (c === '"') inQuotes = false
      else field += c
    } else if (c === '"') inQuotes = true
    else if (c === ',') { row.push(field); field = '' }
    else if (c === '\n' || c === '\r') {
      if (field || row.length) { row.push(field); rows.push(row); row = []; field = '' }
    } else field += c
  }
  if (field || row.length) { row.push(field); rows.push(row) }
  return rows
}

const [header, ...rows] = parseCsv(readFileSync(csvPath, 'utf8'))
if (header[0] !== 'What' || header[1] !== 'When') {
  console.error('Unexpected CSV format; expected columns starting with What,When')
  process.exit(1)
}

// Collapse duplicate rows (one row per slot) into shifts with spot counts.
const shifts = new Map()
const volunteers = [] // pre-registered signups from the organizers' sheets
let sortOrder = 0
for (const [i, [role, when, , first, last, email, phone]] of rows.entries()) {
  if (!role) continue
  if (!when) {
    console.error(`Row ${i + 2}: "${role}" has no When column`)
    process.exit(1)
  }
  const key = `${role}|${when}`
  if (!shifts.has(key)) {
    const dayToken = when.trim().split(/[\s-]+/)[0]
    const day = DATE_MAP[dayToken]
    if (!day) {
      console.error(`Row "${role}" has unmapped date in "${when}" (expected 9/5, 9/6 or 9/7)`)
      process.exit(1)
    }
    shifts.set(key, {
      id: createHash('sha1').update(key).digest('hex').slice(0, 10),
      role,
      time: when,
      day,
      spotsTotal: 0,
      sortOrder: sortOrder++,
    })
  }
  shifts.get(key).spotsTotal++
  if (first?.trim() || last?.trim()) {
    const shiftId = shifts.get(key).id
    volunteers.push({
      // Deterministic per (shift, name): re-seeding is idempotent.
      id: createHash('sha1').update(`${shiftId}|${first}|${last}`).digest('hex').slice(0, 20),
      shiftId,
      firstName: (first ?? '').trim(),
      lastName: (last ?? '').trim(),
      email: (email ?? '').trim().toLowerCase(),
      phone: (phone ?? '').trim(),
    })
  }
}

console.log(`Seeding ${shifts.size} shifts (${[...shifts.values()].reduce((n, s) => n + s.spotsTotal, 0)} total spots) → ${prod ? 'PRODUCTION' : 'emulator'}`)

if (prod) {
  await seedViaRest()
} else {
  await seedViaAdminSdk()
}

async function seedViaAdminSdk() {
  initializeApp({ projectId: PROJECT_ID })
  const db = getFirestore()
  const batch = db.batch()
  batch.set(db.doc(`events/${EVENT_ID}`), {
    name: 'Senoia PorchFest 2026',
    date: '2026-09-06',
    signupOpen: true,
  }, { merge: true })
  for (const s of shifts.values()) {
    const { id, ...data } = s
    const ref = db.doc(`events/${EVENT_ID}/shifts/${id}`)
    const existing = await ref.get()
    // Idempotent: never clobber spotsFilled on re-run
    batch.set(ref, existing.exists ? data : { ...data, spotsFilled: 0 }, { merge: true })
  }
  await batch.commit()

  // Pre-registered volunteers: create-if-absent, and count only NEW docs toward
  // spotsFilled so re-runs never double-count. Live signups race through the
  // signUp callable's transaction, not this script — seeding happens pre-launch.
  const newByShift = new Map()
  for (const v of volunteers) {
    const ref = db.doc(`signups/${v.id}`)
    if ((await ref.get()).exists) continue
    await ref.set({
      eventId: EVENT_ID, shiftId: v.shiftId,
      firstName: v.firstName, lastName: v.lastName, email: v.email, phone: v.phone,
      cancelToken: randomBytes(24).toString('hex'),
      status: 'active',
      createdAt: new Date(),
      seededFrom: 'organizer-sheet',
    })
    newByShift.set(v.shiftId, (newByShift.get(v.shiftId) ?? 0) + 1)
  }
  for (const [shiftId, n] of newByShift) {
    const ref = db.doc(`events/${EVENT_ID}/shifts/${shiftId}`)
    const snap = await ref.get()
    await ref.update({ spotsFilled: (snap.data().spotsFilled ?? 0) + n })
  }
  console.log(`Seeded ${[...newByShift.values()].reduce((a, b) => a + b, 0)} pre-registered volunteers (${volunteers.length} on sheet)`)
}

// The Admin SDK requires ADC/cert credentials; for prod we use the REST API
// with a short-lived token from `gcloud auth print-access-token` instead.
async function seedViaRest() {
  const token = process.env.GCLOUD_ACCESS_TOKEN
  if (!token) {
    console.error('Set GCLOUD_ACCESS_TOKEN (gcloud auth print-access-token --account jermdw@gmail.com) for --prod')
    process.exit(1)
  }
  const dbPath = `projects/${PROJECT_ID}/databases/(default)`
  const docs = `https://firestore.googleapis.com/v1/${dbPath}/documents`
  const name = (path) => `${dbPath}/documents/${path}`
  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }

  const listRes = await fetch(`${docs}/events/${EVENT_ID}/shifts?pageSize=300&mask.fieldPaths=day`, { headers })
  if (!listRes.ok) throw new Error(`list failed: ${listRes.status} ${await listRes.text()}`)
  const existing = new Set(
    ((await listRes.json()).documents ?? []).map((d) => d.name.split('/').pop()),
  )

  const str = (v) => ({ stringValue: v })
  const int = (v) => ({ integerValue: String(v) })
  const transforms = []
  const writes = [{
    update: {
      name: name(`events/${EVENT_ID}`),
      fields: {
        name: str('Senoia PorchFest 2026'),
        date: str('2026-09-06'),
        signupOpen: { booleanValue: true },
      },
    },
    updateMask: { fieldPaths: ['name', 'date', 'signupOpen'] },
  }]
  for (const s of shifts.values()) {
    const fields = {
      role: str(s.role), time: str(s.time), day: str(s.day),
      spotsTotal: int(s.spotsTotal), sortOrder: int(s.sortOrder),
    }
    const fieldPaths = ['role', 'time', 'day', 'spotsTotal', 'sortOrder']
    if (!existing.has(s.id)) {
      fields.spotsFilled = int(0)
      fieldPaths.push('spotsFilled')
    }
    writes.push({
      update: { name: name(`events/${EVENT_ID}/shifts/${s.id}`), fields },
      updateMask: { fieldPaths },
    })
  }
  // Pre-registered volunteers: find which signup docs already exist so re-runs
  // never duplicate a person or double-count spotsFilled.
  if (volunteers.length) {
    const bgRes = await fetch(`https://firestore.googleapis.com/v1/${dbPath}/documents:batchGet`, {
      method: 'POST', headers,
      body: JSON.stringify({ documents: volunteers.map((v) => name(`signups/${v.id}`)) }),
    })
    if (!bgRes.ok) throw new Error(`batchGet failed: ${bgRes.status} ${await bgRes.text()}`)
    const found = new Set(
      (await bgRes.json()).filter((r) => r.found).map((r) => r.found.name.split('/').pop()),
    )
    const newByShift = new Map()
    for (const v of volunteers) {
      if (found.has(v.id)) continue
      newByShift.set(v.shiftId, (newByShift.get(v.shiftId) ?? 0) + 1)
      writes.push({
        update: {
          name: name(`signups/${v.id}`),
          fields: {
            eventId: str(EVENT_ID), shiftId: str(v.shiftId),
            firstName: str(v.firstName), lastName: str(v.lastName),
            email: str(v.email), phone: str(v.phone),
            cancelToken: str(randomBytes(24).toString('hex')),
            status: str('active'),
            createdAt: { timestampValue: new Date().toISOString() },
            seededFrom: str('organizer-sheet'),
          },
        },
      })
    }
    // The spotsFilled increments go in a SECOND request: a shift doc already has
    // an update in `writes`, and Firestore rejects a batch that touches the same
    // document twice.
    for (const [shiftId, n] of newByShift) {
      transforms.push({
        transform: {
          document: name(`events/${EVENT_ID}/shifts/${shiftId}`),
          fieldTransforms: [{ fieldPath: 'spotsFilled', increment: int(n) }],
        },
      })
    }
    console.log(`${volunteers.length - found.size} new pre-registered volunteers to write (${found.size} already present)`)
  }

  await sendBatch(writes, 'main')
  if (transforms.length) await sendBatch(transforms, 'spotsFilled increments')

  async function sendBatch(w, label) {
    const res = await fetch(`${docs}:batchWrite`, {
      method: 'POST', headers, body: JSON.stringify({ writes: w }),
    })
    if (!res.ok) throw new Error(`batchWrite (${label}) failed: ${res.status} ${await res.text()}`)
    // batchWrite is non-atomic: HTTP 200 can still carry per-write failures
    const body = await res.json()
    const failed = (body.status ?? []).filter((s) => s.code)
    if (failed.length) {
      throw new Error(`batchWrite (${label}) had ${failed.length} failed writes: ${JSON.stringify(failed.slice(0, 3))}`)
    }
    console.log(`batchWrite (${label}) applied ${body.writeResults?.length ?? 0} writes (${existing.size} pre-existing shifts preserved)`)
  }
}

for (const s of shifts.values()) console.log(`  ${s.day}  ${s.role} (${s.spotsTotal})`)
console.log('Done.')
