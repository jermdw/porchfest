export default function SiteFooter() {
  return (
    <footer className="bg-ink text-pale/70 text-sm">
      <div className="max-w-5xl mx-auto px-6 py-10 grid gap-8 sm:grid-cols-3">
        <div>
          <p className="font-display uppercase tracking-wide text-cream mb-2">Contact</p>
          <p>
            <a className="underline hover:text-pale" href="mailto:info@enjoysenoia.com">
              info@enjoysenoia.com
            </a>
          </p>
          <p>
            <a className="underline hover:text-pale" href="tel:+17707279173">(770) 727-9173</a>
          </p>
          <p className="mt-1">PO Box 310, Senoia, GA 30276</p>
        </div>
        <div>
          <p className="font-display uppercase tracking-wide text-cream mb-2">The Festival</p>
          <p>Sunday, September 6, 2026 · 3–10pm</p>
          <p>The porches of historic Senoia, Georgia</p>
          <p className="mt-1">Free admission</p>
        </div>
        <div>
          <p className="font-display uppercase tracking-wide text-cream mb-2">About</p>
          <p>
            Presented by the Senoia Downtown Development Authority. Proceeds
            support downtown preservation. Please visit our local shops and
            restaurants!
          </p>
        </div>
      </div>
      <p className="text-center pb-6 text-pale/70">
        Senoia PorchFest
      </p>
    </footer>
  )
}
