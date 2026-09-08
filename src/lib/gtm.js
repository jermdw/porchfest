const GTM_ID = 'GTM-5TLDPSQN'

// Loads the GTM container only in production builds, so localhost/dev
// traffic never reaches the live GA4 property. Mirrors the App Check
// PROD gate in src/firebase.js.
export function initGtm() {
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' })

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`
  document.head.appendChild(script)
}

// Pushes a virtual pageview for GTM's "Custom Event - page_view (SPA)"
// trigger, since React Router navigation never reloads the page. Tracks
// pathname only — never the query string, which on /cancel carries a
// per-signup cancellation token that must not reach Google Analytics.
export function pushPageView(title) {
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({
    event: 'page_view',
    page_path: window.location.pathname,
    page_title: title,
    page_location: window.location.origin + window.location.pathname,
  })
}

// Fires once a shift signup succeeds, for GTM's "Custom Event -
// volunteer_signup" trigger (GA4 key event). Shift metadata only — never the
// volunteer's name/email/phone, which must not reach Google Analytics.
export function pushVolunteerSignup(shift) {
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({
    event: 'volunteer_signup',
    shift_role: shift.role,
    shift_day: shift.day,
    shift_category: shift.category,
  })
}

// Fires when the ErrorBoundary catches a render error, for GTM's "Custom Event
// - app_error" trigger. Until now a render failure only reached the visitor's
// own console, so a white screen in the wild was invisible to us.
//
// Three constraints shape this:
//
// 1. It must never throw. It runs inside componentDidCatch, i.e. the app is
//    already broken; an exception here would take out the error boundary too.
//    Hence the try/catch around everything, including the dataLayer push.
// 2. It must not carry PII. `/cancel?token=` holds a live cancellation token in
//    its query string, so we send `pathname` only — never `search` — for the
//    same reason pushPageView does.
// 3. GA4 truncates event parameters at 100 characters, silently. Truncating
//    here instead keeps the useful half rather than whatever happens to fall in
//    the first 100 chars, and makes what we send predictable.
//
// Safe to call before GTM has loaded: the container replays whatever is already
// queued on dataLayer when it arrives.
const GA4_PARAM_MAX = 100

function clip(value, max = GA4_PARAM_MAX) {
  const text = String(value ?? '')
  return text.length > max ? `${text.slice(0, max - 1)}…` : text
}

// The first frame of React's component stack — "    in Schedule (at ...)" —
// names the component that actually threw, which is the single most useful
// field when triaging. The rest is ancestry we can infer.
function topFrame(componentStack) {
  const first = String(componentStack ?? '')
    .split('\n')
    .map((line) => line.trim())
    .find(Boolean)
  return first ? clip(first.replace(/^in\s+/, '')) : 'unknown'
}

export function pushError(error, componentStack) {
  try {
    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({
      event: 'app_error',
      error_name: clip(error?.name || 'Error'),
      error_message: clip(error?.message || String(error)),
      error_component: topFrame(componentStack),
      error_path: window.location.pathname,
    })
  } catch {
    // Reporting must never be the reason a broken page gets worse.
  }
}
