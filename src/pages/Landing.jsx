import { Link } from 'react-router-dom'
import SiteHeader from '../components/SiteHeader.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import usePageMeta from '../lib/usePageMeta.js'
import wordmark from '../assets/porchfest-wordmark.svg'

const HIGHLIGHTS = [
  ['Free', 'Admission — stroll porch to porch all evening'],
  ['29 Porches', 'Plus the Main Stage closing act at 8pm'],
  ['3–10pm', 'Sunday, September 6 · music starts at 3'],
]

const SECTIONS = [
  {
    to: '/schedule',
    title: 'Schedule',
    text: 'Who’s playing, where, and when — plan your porch-to-porch route.',
  },
  {
    to: '/map',
    title: 'Day Of',
    text: 'The interactive festival map: porch stages, food, parking, and more.',
  },
  {
    to: '/volunteer',
    title: 'Volunteer',
    text: 'PorchFest runs on volunteers — grab a shift and be part of it.',
    featured: true,
  },
]

export default function Landing() {
  usePageMeta({
    title: 'Senoia PorchFest — Sept 6, 2026 · Historic Senoia, GA',
    description:
      'Senoia PorchFest: live music on the porches of historic Senoia, Georgia. Sunday, September 6, 2026, starting at 3pm. Free admission, presented by the Senoia Downtown Development Authority.',
    path: '/',
  })

  return (
    <div className="min-h-screen bg-ink flex flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="text-center px-6 pt-14 pb-14">
          <h1>
            <span className="block font-script text-flag-bright text-4xl sm:text-5xl mb-4">
              Senoia
            </span>
            {/* The 2026 vector wordmark from the shirt-print design system —
                same art the printed merch carries. */}
            <img
              src={wordmark}
              alt="PorchFest 2026"
              width="571"
              height="264"
              className="w-80 sm:w-[28rem] max-w-full h-auto mx-auto drop-shadow-[0_4px_24px_rgba(176,42,48,0.3)]"
            />
            <span className="block font-display text-2xl sm:text-3xl uppercase tracking-wide text-cream mt-6">
              Sunday, September 6, 2026 &middot; 3&ndash;10pm
            </span>
          </h1>
          <p className="font-display text-lg uppercase tracking-widest text-pale/80 mt-1 mb-10">
            5th Annual &middot; Live music on the porches of historic Senoia
          </p>
          <Link
            to="/volunteer"
            className="inline-block bg-flag hover:bg-flag-deep text-cream font-display font-semibold text-xl uppercase tracking-wider px-10 py-4 rounded-md shadow-lg transition-colors"
          >
            Volunteer Sign-Up
          </Link>
        </section>

        <section className="bg-cream py-12 px-4">
          <div className="max-w-4xl mx-auto grid gap-6 sm:grid-cols-3 text-center">
            {HIGHLIGHTS.map(([big, small]) => (
              <div key={big}>
                <p className="font-display text-4xl text-flag uppercase">{big}</p>
                <p className="text-stone-600 mt-1">{small}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-cream pb-14 px-4">
          <div className="max-w-4xl mx-auto grid gap-5 sm:grid-cols-3">
            {SECTIONS.map((s) => (
              <Link
                key={s.to}
                to={s.to}
                className={`rounded-xl border p-6 transition-shadow hover:shadow-md ${
                  s.featured ? 'bg-ink border-flag' : 'bg-white border-stone-200'
                }`}
              >
                <h2 className={`font-display text-xl uppercase tracking-wide mb-1 ${s.featured ? 'text-flag-bright' : 'text-ink'}`}>
                  {s.title} →
                </h2>
                <p className={`text-sm ${s.featured ? 'text-pale/80' : 'text-stone-600'}`}>{s.text}</p>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
