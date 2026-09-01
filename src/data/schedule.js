// Senoia PorchFest 2026 performance schedule.
//
// Source of truth: the official 2026 schedule card (organizer PDF, Aug 2026) —
// per CLAUDE.md, event facts come from the organizers, never invented.
// Every entry carries `confirmed`; unconfirmed entries are a working checklist
// and are NEVER rendered.
//
// `stage` is the printed stage number from the card. One known discrepancy:
// the card prints stage 15 for BOTH 97 Lower Creek Trail (Ladega) and
// 57 Morgan Street, while the printed venue map shows stage 26 on Morgan
// Street — 57 Morgan is entered as 26 here pending organizer confirmation.
// `start` is 24h "HH:MM" and drives sort order; `time` is the display label.

export const PERFORMANCES = [
  // ---- 2:00 PM — VIP kickoff ----
  {
    act: 'Kellar McCoy', genre: 'VIP Luxury Lounge — sponsored by BMW of South Atlanta',
    stage: 1, address: '40 Travis Street', venue: "Senoia Farmers' Market",
    start: '14:00', time: '2:00 PM', confirmed: true,
  },

  // ---- 3:00 PM ----
  { act: 'Amir Salam', genre: 'Country', stage: 2, address: '1 Main Street', venue: 'Senoia Beer Company', start: '15:00', time: '3:00 PM', confirmed: true },
  { act: 'Brain Fog', genre: "70s, 80s, 90s, 00's Covers", stage: 12, address: '180 Seavy Street', venue: null, start: '15:00', time: '3:00 PM', confirmed: true },
  { act: 'Candler Hobbs', genre: 'Classic Rock', stage: 27, address: '31 Morgan Street', venue: null, start: '15:00', time: '3:00 PM', confirmed: true },
  { act: 'David Pippin Group', genre: 'Rock and Blues', stage: 5, address: '60 Main Street', venue: 'Olivia James', start: '15:00', time: '3:00 PM', confirmed: true },
  { act: 'GRASS', genre: "60's and 70's Rock", stage: 16, address: '89 Lower Creek Trail', venue: null, start: '15:00', time: '3:00 PM', confirmed: true },
  { act: 'James & The Georgia Peaches', genre: 'Pop, Rock, Country and Soul', stage: 19, address: '252 Seavy Street', venue: 'Veranda Inn', start: '15:00', time: '3:00 PM', confirmed: true },
  { act: 'Mary Martin', genre: 'Indie, Folk, Americana', stage: 7, address: '22 Main Street', venue: 'Pearl & Pine Brewery', start: '15:00', time: '3:00 PM', confirmed: true },
  { act: 'Tyler Lowman Band', genre: 'Country, Southern Rock', stage: 22, address: '239 Pylant Street', venue: null, start: '15:00', time: '3:00 PM', confirmed: true },

  // ---- 4:00 PM ----
  { act: 'Ladega', genre: 'Jam Band, Indie, Classic Rock', stage: 15, address: '97 Lower Creek Trail', venue: null, start: '16:00', time: '4:00 PM', confirmed: true },
  { act: 'Last Signal Home', genre: 'Rock', stage: 8, address: '42 Main Street', venue: '404 Celsius', start: '16:00', time: '4:00 PM', confirmed: true },
  { act: 'Luke Morgan & The Redliners', genre: 'Country Rock', stage: 17, address: '55 Lower Creek Trail', venue: null, start: '16:00', time: '4:00 PM', confirmed: true },
  { act: 'Russ Gordon & The Rattletrap', genre: 'Country', stage: 2, address: '1 Main Street', venue: 'Senoia Beer Company', start: '16:00', time: '4:00 PM', confirmed: true },
  { act: 'Tim McGee', genre: '70s, 90s, R&B, Light Rock and Country', stage: 1, address: '40 Travis Street', venue: "Senoia Farmers' Market", start: '16:00', time: '4:00 PM', confirmed: true },
  { act: 'Whiskey River Saints', genre: 'Southern Rock and Country', stage: 21, address: '371 Pylant Street', venue: null, start: '16:00', time: '4:00 PM', confirmed: true },
  { act: 'Wholly Smokes', genre: 'Classic and Southern Rock', stage: 22, address: '239 Pylant Street', venue: null, start: '16:00', time: '4:00 PM', confirmed: true },

  // ---- 5:00 PM ----
  { act: 'Brian Rivers Band', genre: 'Pop and Rock', stage: 13, address: '274 Seavy Street', venue: null, start: '17:00', time: '5:00 PM', confirmed: true },
  { act: 'Highway 54', genre: 'Blues, Soul and Rock', stage: 4, address: '70 Main Street', venue: 'Crust & Craft', start: '17:00', time: '5:00 PM', confirmed: true },
  { act: 'Joel Bridges', genre: 'Acoustic, Folk and Rock', stage: 3, address: '18 Main Street', venue: 'Borgo Italia', start: '17:00', time: '5:00 PM', confirmed: true },
  { act: 'Lucas Smith', genre: '70s, 80s, Old Country', stage: 23, address: '270 Pylant Street', venue: null, start: '17:00', time: '5:00 PM', confirmed: true },
  { act: 'Luke Brown & The Jubilee', genre: 'Country', stage: 14, address: '77 Lower Creek Trail', venue: null, start: '17:00', time: '5:00 PM', confirmed: true },
  { act: 'Rob Harlan', genre: 'Classic Rock and Country', stage: 24, address: '352 Pylant Street', venue: null, start: '17:00', time: '5:00 PM', confirmed: true },
  { act: 'Wildcat', genre: 'Classic and Southern Rock', stage: 25, address: '41 Morgan Street', venue: null, start: '17:00', time: '5:00 PM', confirmed: true },
  { act: 'Wyatt Band', genre: 'Dance Tunes and Classic Rock', stage: 28, address: '230 Pylant Street', venue: null, start: '17:00', time: '5:00 PM', confirmed: true },

  // ---- 6:00 PM ----
  { act: 'Brian Collins', genre: 'Country/Americana', stage: 26, address: '57 Morgan Street', venue: null, start: '18:00', time: '6:00 PM', confirmed: true },
  { act: 'Cowboy Noyz', genre: 'All Genres', stage: 6, address: '48 Main Street', venue: 'Glass House Society', start: '18:00', time: '6:00 PM', confirmed: true },
  { act: 'Greg "Rogan" Rogers', genre: 'Modern Country and Christian', stage: 20, address: '271 Seavy Street', venue: null, start: '18:00', time: '6:00 PM', confirmed: true },
  { act: 'Jake and The Naysayers', genre: 'Jamband and Country', stage: 23, address: '270 Pylant Street', venue: null, start: '18:00', time: '6:00 PM', confirmed: true },
  { act: 'Sarah & Morgan Hendrix', genre: 'Alternative, Soft Rock and Indie Pop', stage: 9, address: '30 Main Street', venue: 'Senoia Coffee/Mess Hall', start: '18:00', time: '6:00 PM', confirmed: true },
  { act: 'Souls Hill', genre: 'Southern and Classic Rock', stage: 18, address: '25 Lower Creek Trail', venue: null, start: '18:00', time: '6:00 PM', confirmed: true },
  { act: 'Tyler Caldwell', genre: 'Country, Folk and Rock', stage: 21, address: '371 Pylant Street', venue: null, start: '18:00', time: '6:00 PM', confirmed: true },

  // ---- 7:00 PM ----
  { act: 'Ashton Dooley Band', genre: 'Americana, Classic Rock and Country', stage: 1, address: '40 Travis Street', venue: "Senoia Farmers' Market", start: '19:00', time: '7:00 PM', confirmed: true },
  { act: 'Atticus Roness', genre: 'Rock n Roll', stage: 7, address: '22 Main Street', venue: 'Pearl & Pine Brewery', start: '19:00', time: '7:00 PM', confirmed: true },
  { act: 'Duncan Brothers Band', genre: 'Country', stage: 26, address: '57 Morgan Street', venue: null, start: '19:00', time: '7:00 PM', confirmed: true },
  { act: 'Gradient', genre: 'Blues and Rock', stage: 2, address: '1 Main Street', venue: 'Senoia Beer Company', start: '19:00', time: '7:00 PM', confirmed: true },
  { act: 'Grateful To Be', genre: 'Rock', stage: 10, address: '74 Main Street', venue: 'Buggy Museum', start: '19:00', time: '7:00 PM', confirmed: true },
  { act: 'Joey Thurmond & The Select Orchestra', genre: 'Rock, Pop, Blues, Gospel', stage: 19, address: '252 Seavy Street', venue: 'Veranda Inn', start: '19:00', time: '7:00 PM', confirmed: true },
  { act: 'Rock Soldered Blues', genre: "Southern and 70's Rock and Blues", stage: 29, address: '258 Pylant Street', venue: null, start: '19:00', time: '7:00 PM', confirmed: true },
  { act: 'Tavis Lance Mapp', genre: 'Country', stage: 12, address: '180 Seavy Street', venue: null, start: '19:00', time: '7:00 PM', confirmed: true },

  // ---- 8:00 PM — closing act ----
  {
    act: 'Chuck X Nick', genre: 'Closing Act',
    stage: null, address: 'Bottom of Main Street', venue: 'Main Stage',
    start: '20:00', time: '8:00 PM', confirmed: true,
  },
]

export const publishedPerformances = () =>
  PERFORMANCES.filter((p) => p.confirmed).sort(
    (a, b) => a.start.localeCompare(b.start) || a.act.localeCompare(b.act),
  )
