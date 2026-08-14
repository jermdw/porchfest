import { Link } from 'react-router-dom'
import SiteHeader from '../components/SiteHeader.jsx'
import SiteFooter from '../components/SiteFooter.jsx'

const HIGHLIGHTS = [
  ['Free', 'Admission — stroll between porches all afternoon'],
  ['3:00pm', 'Music starts Sunday afternoon, September 6'],
  ['8,000+', 'Music fans joined us last year'],
]

const SECTIONS = [
  {
    to: '/schedule',
    title: 'Schedule',
    text: 'Who’s playing, where, and when — plan your porch-to-porch route.',
  },
  {
    to: '/volunteer',
    title: 'Volunteer',
    text: 'PorchFest runs on volunteers — grab a shift and be part of it.',
    featured: true,
  },
]

export default function Landing() {
  return (
    <div className="min-h-screen bg-ink flex flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="text-center px-6 pt-14 pb-14">
          <h1>
            <span className="block font-script text-porch text-5xl sm:text-6xl mb-1">
              Senoia
            </span>
            <span className="block font-display text-6xl sm:text-7xl uppercase tracking-wide text-cream font-semibold">
              PorchFest
            </span>
            <span className="block font-display text-2xl sm:text-3xl uppercase tracking-wide text-cream mt-5">
              Sunday, September 6, 2026 &middot; 3pm
            </span>
          </h1>
          <p className="font-display text-lg uppercase tracking-widest text-porch-pale/80 mt-1 mb-10">
            Live music on the porches of historic Senoia &middot; Free admission
          </p>
          <Link
            to="/volunteer"
            className="inline-block bg-porch hover:bg-porch-deep text-ink hover:text-cream font-display font-semibold text-xl uppercase tracking-wider px-10 py-4 rounded-md shadow-lg transition-colors"
          >
            Volunteer Sign-Up
          </Link>
        </section>

        <section className="bg-cream py-12 px-4">
          <div className="max-w-4xl mx-auto grid gap-6 sm:grid-cols-3 text-center">
            {HIGHLIGHTS.map(([big, small]) => (
              <div key={big}>
                <p className="font-display text-4xl text-porch-deep uppercase">{big}</p>
                <p className="text-stone-600 mt-1">{small}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-cream pb-14 px-4">
          <div className="max-w-3xl mx-auto grid gap-5 sm:grid-cols-2">
            {SECTIONS.map((s) => (
              <Link
                key={s.to}
                to={s.to}
                className={`rounded-xl border p-6 transition-shadow hover:shadow-md ${
                  s.featured ? 'bg-ink border-porch' : 'bg-white border-stone-200'
                }`}
              >
                <h2 className={`font-display text-xl uppercase tracking-wide mb-1 ${s.featured ? 'text-porch' : 'text-ink'}`}>
                  {s.title} →
                </h2>
                <p className={`text-sm ${s.featured ? 'text-porch-pale/80' : 'text-stone-600'}`}>{s.text}</p>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
