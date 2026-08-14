import { onCall, HttpsError } from 'firebase-functions/v2/https'
import { defineSecret } from 'firebase-functions/params'
import { initializeApp } from 'firebase-admin/app'
import { getFirestore, FieldValue } from 'firebase-admin/firestore'
import { randomBytes } from 'node:crypto'

initializeApp()
const db = getFirestore()

const RESEND_API_KEY = defineSecret('RESEND_API_KEY')

const SITE_URL = 'https://senoiaporchfest.org'
// Resend can only send from senoiaporchfest.org after the domain is verified
// there (DNS records) — until then the key stays placeholder and sends skip.
const FROM = 'Senoia PorchFest <noreply@senoiaporchfest.org>'
const CONTACT = 'info@enjoysenoia.com'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function requireString(data, field, maxLen) {
  const v = data[field]
  if (typeof v !== 'string' || !v.trim() || v.trim().length > maxLen) {
    throw new HttpsError('invalid-argument', `Please provide a valid ${field}.`)
  }
  return v.trim()
}

// App Check is not enforced yet: enable it only together with registering a
// reCAPTCHA Enterprise key and setting APP_CHECK_SITE_KEY in src/firebase.js
// (see that file) — then change this to `process.env.FUNCTIONS_EMULATOR !== 'true'`
// like the car show site.
const callOpts = {
  secrets: [RESEND_API_KEY],
  enforceAppCheck: false,
}

export const signUp = onCall(callOpts, async (req) => {
  const eventId = requireString(req.data, 'eventId', 20)
  const shiftId = requireString(req.data, 'shiftId', 60)
  const firstName = requireString(req.data, 'firstName', 80)
  const lastName = requireString(req.data, 'lastName', 80)
  const email = requireString(req.data, 'email', 200).toLowerCase()
  const phone = requireString(req.data, 'phone', 40)

  if (!EMAIL_RE.test(email)) {
    throw new HttpsError('invalid-argument', 'Please provide a valid email address.')
  }
  if (phone.replace(/\D/g, '').length < 7) {
    throw new HttpsError('invalid-argument', 'Please provide a valid phone number.')
  }

  const eventRef = db.doc(`events/${eventId}`)
  const shiftRef = db.doc(`events/${eventId}/shifts/${shiftId}`)
  const signupRef = db.collection('signups').doc()
  const cancelToken = randomBytes(24).toString('hex')

  const shift = await db.runTransaction(async (t) => {
    const [eventSnap, shiftSnap] = await Promise.all([t.get(eventRef), t.get(shiftRef)])
    if (eventSnap.exists && eventSnap.data().signupOpen === false) {
      throw new HttpsError('failed-precondition', 'Volunteer sign-ups are closed.')
    }
    if (!shiftSnap.exists) {
      throw new HttpsError('not-found', 'That shift no longer exists.')
    }
    const s = shiftSnap.data()
    if (s.spotsFilled >= s.spotsTotal) {
      throw new HttpsError('failed-precondition', 'Sorry, that shift just filled up.')
    }
    // Duplicate emails are allowed on purpose: households share addresses, and
    // one person may take several slots of the same shift.
    t.create(signupRef, {
      eventId, shiftId, firstName, lastName, email, phone,
      cancelToken,
      status: 'active',
      createdAt: FieldValue.serverTimestamp(),
    })
    t.update(shiftRef, { spotsFilled: FieldValue.increment(1) })
    return s
  })

  await sendEmail({
    to: email,
    subject: `You're signed up: ${shift.role} — Senoia PorchFest`,
    html: `
      <p>Hi ${escapeHtml(firstName)},</p>
      <p>Thanks for volunteering for <strong>Senoia PorchFest</strong>!</p>
      <p><strong>${escapeHtml(shift.role)}</strong><br>${escapeHtml(shift.time)}</p>
      <p>Need to cancel? <a href="${SITE_URL}/cancel?token=${cancelToken}">Click here to release your spot</a>.</p>
      <p>Questions? Reply to this email or contact <a href="mailto:${CONTACT}">${CONTACT}</a>.</p>
    `,
  })

  return { ok: true }
})

export const cancelSignup = onCall(callOpts, async (req) => {
  const token = requireString(req.data, 'token', 100)

  const snap = await db.collection('signups')
    .where('cancelToken', '==', token)
    .limit(1)
    .get()
  if (snap.empty) {
    throw new HttpsError('not-found', 'This cancellation link is not valid.')
  }
  const signupRef = snap.docs[0].ref

  const signup = await db.runTransaction(async (t) => {
    const s = (await t.get(signupRef)).data()
    if (s.status !== 'active') {
      throw new HttpsError('failed-precondition', 'This signup was already cancelled.')
    }
    // The shift may have been deleted by an admin; the cancellation must still
    // succeed, so only decrement the counter when the shift still exists.
    const shiftRef = db.doc(`events/${s.eventId}/shifts/${s.shiftId}`)
    const shiftSnap = await t.get(shiftRef)
    t.update(signupRef, { status: 'cancelled', cancelledAt: FieldValue.serverTimestamp() })
    if (shiftSnap.exists) {
      t.update(shiftRef, { spotsFilled: FieldValue.increment(-1) })
    }
    return s
  })

  const shiftSnap = await db.doc(`events/${signup.eventId}/shifts/${signup.shiftId}`).get()
  const shift = shiftSnap.data()
  await sendEmail({
    to: signup.email,
    subject: 'Your Senoia PorchFest volunteer shift was cancelled',
    html: `
      <p>Hi ${escapeHtml(signup.firstName)},</p>
      <p>Your signup for <strong>${escapeHtml(shift?.role ?? 'a volunteer shift')}</strong>
      (${escapeHtml(shift?.time ?? '')}) has been cancelled and your spot released.</p>
      <p>Changed your mind? <a href="${SITE_URL}/volunteer">Sign-ups are here</a>.</p>
    `,
  })

  return { ok: true }
})

function escapeHtml(s) {
  return String(s).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
}

async function sendEmail({ to, subject, html }) {
  const key = RESEND_API_KEY.value()
  if (!key || key.startsWith('placeholder')) {
    console.log(`[email skipped — no RESEND_API_KEY] to=${to} subject=${subject}`)
    return
  }
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: FROM, to: [to], subject, html }),
    })
    if (!res.ok) {
      console.error(`Resend error ${res.status}: ${await res.text()}`)
    }
  } catch (err) {
    console.error('Email send failed', err)
  }
}
