// Senoia PorchFest 2026 performance schedule.
//
// Every entry carries a `confirmed` flag — entries stay `confirmed: false`
// until the act, porch, and time come from the organizers (the DDA publishes
// the official lineup on enjoysenoia.com / their Facebook page). Unconfirmed
// entries are a working checklist and are NEVER rendered on the site.
//
// `start` is 24h "HH:MM" and only drives sort order; `time` is what visitors
// see, so write it however the organizers phrase it.
//
// Example:
// {
//   act: 'The Example Band',
//   porch: '123 Main St',
//   time: '3:00–3:45pm',
//   start: '15:00',
//   confirmed: false,
// },

export const PERFORMANCES = []
