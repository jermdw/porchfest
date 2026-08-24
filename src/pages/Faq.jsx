import { useState, useEffect, useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import SiteHeader from '../components/SiteHeader.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import usePageMeta from '../lib/usePageMeta.js'
import { FAQS, FAQ_CATEGORIES } from '../data/faq.js'

export default function Faq() {
  usePageMeta({
    title: 'Frequently Asked Questions | Senoia PorchFest',
    description:
      'Got questions about Senoia PorchFest? Learn about band submissions, food truck locations, festival parking, and visitor info.',
    path: '/faq',
  })

  const location = useLocation()
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [openItems, setOpenItems] = useState(() => {
    // If an item ID is in the URL hash, open it by default
    const hash = window.location.hash.replace('#', '')
    return hash ? { [hash]: true } : {}
  })

  // Open item if navigated to with hash
  useEffect(() => {
    const hash = location.hash.replace('#', '')
    if (hash) {
      setOpenItems((prev) => ({ ...prev, [hash]: true }))
      const el = document.getElementById(hash)
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100)
      }
    }
  }, [location.hash])

  // Filter FAQs based on category and search query
  const filteredFaqs = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    return FAQS.filter((faq) => {
      const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory
      if (!matchesCategory) return false
      if (!query) return true
      return (
        faq.question.toLowerCase().includes(query) ||
        faq.answer.toLowerCase().includes(query) ||
        (faq.tip && faq.tip.toLowerCase().includes(query))
      )
    })
  }, [selectedCategory, searchQuery])

  const toggleItem = (id) => {
    setOpenItems((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  // Generate FAQPage JSON-LD for rich search results
  useEffect(() => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: FAQS.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    }

    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.id = 'faq-jsonld'
    script.text = JSON.stringify(schema)
    document.head.appendChild(script)

    return () => {
      document.getElementById('faq-jsonld')?.remove()
    }
  }, [])

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <SiteHeader />

      <header className="bg-ink text-cream px-6 pt-8 pb-10 text-center">
        <p className="font-script text-flag-bright text-3xl mb-1">Got questions?</p>
        <h1 className="text-3xl sm:text-5xl font-display font-semibold uppercase tracking-wide">
          Frequently Asked Questions
        </h1>
        <p className="text-pale/90 mt-4 max-w-2xl mx-auto">
          Everything you need to know about music, food, parking, and attending Senoia PorchFest.
        </p>
      </header>

      <main className="flex-1 max-w-4xl mx-auto px-4 py-8 w-full">
        {/* Search & Category Filter */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions (e.g. bands, food trucks, parking)..."
              aria-label="Search frequently asked questions"
              className="w-full bg-white border border-stone-300 rounded-xl px-4 py-3 pl-11 text-ink placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-flag focus:border-transparent transition-shadow shadow-xs"
            />
            <svg
              className="absolute left-3.5 top-3.5 w-5 h-5 text-stone-400 pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 text-stone-400 hover:text-stone-600 text-sm font-semibold px-1"
                aria-label="Clear search"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2 pt-1" aria-label="FAQ Categories">
            {FAQ_CATEGORIES.map((cat) => {
              const active = selectedCategory === cat.id
              return (
                <button
                  key={cat.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-full text-sm font-display tracking-wide uppercase transition-colors ${
                    active
                      ? 'bg-flag text-cream font-semibold shadow-xs'
                      : 'bg-white text-stone-700 border border-stone-200 hover:border-stone-400 hover:text-ink'
                  }`}
                >
                  {cat.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* FAQs List */}
        {filteredFaqs.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-stone-200 p-8">
            <p className="font-display text-xl uppercase tracking-wide text-ink mb-2">
              No matching questions found
            </p>
            <p className="text-stone-600 text-sm max-w-md mx-auto mb-4">
              We couldn’t find any questions matching &ldquo;{searchQuery}&rdquo;. Try another
              search term or browse by category.
            </p>
            <button
              onClick={() => {
                setSearchQuery('')
                setSelectedCategory('all')
              }}
              className="inline-block bg-ink hover:bg-flag text-cream font-display uppercase tracking-wider text-sm px-5 py-2 rounded-md transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="space-y-3" role="region" aria-label="FAQ items">
            {filteredFaqs.map((faq) => {
              const isOpen = !!openItems[faq.id]
              return (
                <article
                  key={faq.id}
                  id={faq.id}
                  className="bg-white rounded-xl border border-stone-200 transition-shadow hover:shadow-xs overflow-hidden"
                >
                  <h3>
                    <button
                      type="button"
                      onClick={() => toggleItem(faq.id)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-answer-${faq.id}`}
                      className="w-full text-left px-5 py-4 flex items-start justify-between gap-4 font-display font-semibold text-lg sm:text-xl text-ink hover:text-flag transition-colors cursor-pointer"
                    >
                      <span>{faq.question}</span>
                      <span
                        className={`text-flag shrink-0 transition-transform duration-200 text-xl font-bold mt-0.5 ${
                          isOpen ? 'rotate-45' : ''
                        }`}
                        aria-hidden="true"
                      >
                        +
                      </span>
                    </button>
                  </h3>
                  {isOpen && (
                    <div
                      id={`faq-answer-${faq.id}`}
                      className="px-5 pb-5 pt-1 text-stone-700 text-base leading-relaxed border-t border-stone-100"
                    >
                      <p>{faq.answer}</p>
                      {faq.tip && (
                        <div className="mt-3 bg-cream/70 border-l-4 border-flag p-3 rounded-r-md text-sm text-stone-800">
                          <strong className="font-semibold text-ink">Tip: </strong>
                          {faq.tip}
                        </div>
                      )}
                      {faq.link && (
                        <div className="mt-3">
                          <Link
                            to={faq.link.url}
                            className="inline-flex items-center text-flag hover:text-flag-deep font-semibold text-sm underline"
                          >
                            {faq.link.text} &rarr;
                          </Link>
                        </div>
                      )}
                    </div>
                  )}
                </article>
              )
            })}
          </div>
        )}

        {/* Contact Organizers Callout */}
        <section className="mt-12 bg-white rounded-2xl border-2 border-stone-200 p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-xl">
              <span className="font-script text-flag text-2xl block mb-0.5">Need more details?</span>
              <h2 className="font-display text-2xl sm:text-3xl uppercase tracking-wide text-ink font-semibold">
                Contact the Organizers
              </h2>
              <p className="text-stone-700 mt-2 leading-relaxed">
                Presented by the Senoia Downtown Development Authority (DDA). Have questions not
                answered here? Feel free to get in touch.
              </p>
              <div className="mt-4 flex flex-wrap gap-y-2 gap-x-6 text-sm text-stone-600">
                <div>
                  <strong className="text-ink">Email:</strong>{' '}
                  <a
                    href="mailto:info@enjoysenoia.com"
                    className="underline font-semibold text-flag hover:text-flag-deep"
                  >
                    info@enjoysenoia.com
                  </a>
                </div>
                <div>
                  <strong className="text-ink">Phone:</strong>{' '}
                  <a
                    href="tel:+17707279173"
                    className="underline font-semibold text-flag hover:text-flag-deep"
                  >
                    (770) 727-9173
                  </a>
                </div>
                <div>
                  <strong className="text-ink">Location:</strong> Historic Senoia, GA
                </div>
              </div>
            </div>
            <div className="shrink-0">
              <a
                href="mailto:info@enjoysenoia.com?subject=Senoia%20PorchFest%20Inquiry"
                className="inline-block w-full sm:w-auto text-center bg-ink hover:bg-flag text-cream font-display font-semibold uppercase tracking-wider px-6 py-3 rounded-md transition-colors shadow-sm"
              >
                Email Organizers &rarr;
              </a>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
