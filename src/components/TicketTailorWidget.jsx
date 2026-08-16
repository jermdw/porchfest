import { useEffect, useRef, useState } from 'react'

const WIDGET_SRC = 'https://cdn.tickettailor.com/js/widgets/min/widget.js'

// Ticket Tailor's official inline checkout widget — the same embed the DDA's
// old enjoysenoia.com page used, so buyers land in the identical checkout
// (Ticket Tailor's own Stripe flow; no payment data ever touches this site).
//
// The widget script scans the DOM for <script data-url> tags when it runs, so
// it is (re)inserted per mount rather than loaded once in index.html — React
// won't execute a <script> rendered by JSX. Two things widget.js insists on
// (from its source): the script's PARENT must carry class "tt-widget", and it
// only claims scripts not already in window.TTW.foundElements — a fresh
// element per mount satisfies both, so StrictMode's double-mount is fine.
export default function TicketTailorWidget({ checkoutUrl, minHeight = 420 }) {
  const hostRef = useRef(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const host = hostRef.current
    if (!host) return
    const s = document.createElement('script')
    s.src = WIDGET_SRC
    s.async = true
    s.dataset.url = checkoutUrl
    s.dataset.type = 'inline'
    s.dataset.inlineMinimal = 'true'
    s.dataset.inlineShowLogo = 'false'
    s.dataset.inlineBgFill = 'false'
    s.onerror = () => setFailed(true)
    host.appendChild(s)
    return () => {
      // Remove the script and whatever the widget injected beside it.
      host.replaceChildren()
    }
  }, [checkoutUrl])

  return (
    <div className="bg-white rounded-xl border border-stone-200 p-2 sm:p-4" style={{ minHeight }}>
      <div ref={hostRef} className="tt-widget" />
      {/* Always present, not only on failure: ad blockers can stall the widget
          without firing onerror, and a buyer should never be stuck. */}
      <p className={`text-center text-sm mt-3 ${failed ? 'text-stone-700' : 'text-stone-500'}`}>
        {failed ? "The ticket form couldn't load. " : 'Trouble with the form? '}
        <a
          href={checkoutUrl}
          target="_blank"
          rel="noreferrer"
          className="underline text-flag font-semibold"
        >
          Open checkout in a new tab →
        </a>
      </p>
    </div>
  )
}
