// Categories must be tellable apart by shape alone, not colour (WCAG 1.4.1) —
// which also keeps them legible on a printed handout in greyscale. Porch-stage
// pins render their stage NUMBER instead of an icon (see MapCanvas); the porch
// shape here is for the legend chips and list headings.
const PATHS = {
  porch: (
    <>
      <path d="M3 11 12 4l9 7" />
      <path d="M5.5 10v10M18.5 10v10M3 20h18" />
      <path d="M9 20v-5.5h6V20" />
    </>
  ),
  stage: (
    <>
      <path d="M9 17.5V6l10-2.5V15" />
      <circle cx="6.5" cy="17.5" r="2.5" />
      <circle cx="16.5" cy="15" r="2.5" />
    </>
  ),
  vip: (
    <path d="M12 3.5 14.5 9l6 .6-4.5 4 1.3 5.9L12 16.4l-5.3 3.1L8 13.6l-4.5-4 6-.6z" />
  ),
  food: (
    <>
      <path d="M5 3v6a2.5 2.5 0 0 0 5 0V3M7.5 11v10" />
      <path d="M18 3c-1.6 1.2-2.5 3.2-2.5 5.5 0 1.9 1 3 2.5 3.2V21" />
    </>
  ),
  drinks: (
    <>
      <path d="M6.5 4h9l-1.2 13.5a2.5 2.5 0 0 1-2.5 2.3h-1.6a2.5 2.5 0 0 1-2.5-2.3z" />
      <path d="M6.9 9h8.2" />
    </>
  ),
  kids: (
    <>
      <ellipse cx="12" cy="8.5" rx="5" ry="6" />
      <path d="M12 14.5 10.8 17h2.4L12 20.5" />
    </>
  ),
  merch: (
    <path d="M8.5 4 4 7.5l2 2.8 2-1.3V20h8V9l2 1.3 2-2.8L15.5 4a3.5 3.5 0 0 1-7 0z" />
  ),
  restroom: (
    <>
      <circle cx="12" cy="5" r="2.6" />
      <path d="M8.5 21v-6.5H7l2-5.5a3 3 0 0 1 6 0l2 5.5h-1.5V21" />
    </>
  ),
  parking: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="3" />
      <path d="M9.5 17V8h3.2a2.9 2.9 0 0 1 0 5.8H9.5" />
    </>
  ),
  aid: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="4" />
      <path d="M12 8.5v7M8.5 12h7" />
    </>
  ),
}

export default function CategoryIcon({ category, className = 'w-5 h-5', style }) {
  const path = PATHS[category]
  if (!path) return null
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
      aria-hidden="true"
      focusable="false"
    >
      {path}
    </svg>
  )
}
