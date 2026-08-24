// Senoia PorchFest 2026 — Performer Bios, Composition, Photos, and Media Links.
//
// Source of truth for sets, stages, times and addresses: `src/data/schedule.js`.
// This module provides enriched profiles for all 41 confirmed acts,
// joined with their scheduled performance slots and media links.

import { PERFORMANCES } from './schedule.js'

// Verified genuine artist photos
import ashtonDooleyPhoto from '../assets/bands/ashton-dooley-band.webp'
import brianCollinsPhoto from '../assets/bands/brian-collins.webp'
import joeyThurmondPhoto from '../assets/bands/joey-thurmond-the-select-orchestra.webp'
import lukeMorganPhoto from '../assets/bands/luke-morgan-the-redliners.webp'

export const BANDS = [
  {
    act: 'Kellar McCoy',
    composition: 'Father-daughter acoustic duo (Guitar, flute, clarinet & vocals)',
    bio: 'Tim Kellar and Megan Kellar McCoy deliver warm, easy-listening acoustic harmonies, blending acoustic guitar with expressive flute and clarinet melodies to kick off the afternoon in the VIP Luxury Lounge.',
    photo: null,
    links: {
      facebook: 'https://www.facebook.com/kellarmccoymusic',
    },
  },
  {
    act: 'Amir Salam',
    composition: 'Solo singer-songwriter (Acoustic guitar & vocals)',
    bio: 'Honest, heartfelt country songwriting with soulful vocals and acoustic guitar, bringing down-home Georgia storytelling to Senoia Beer Company.',
    photo: null,
    links: {
      facebook: 'https://www.facebook.com/amirsalammusic',
      instagram: 'https://www.instagram.com/amirsalammusic',
    },
  },
  {
    act: 'Brain Fog',
    composition: '4-piece party & covers band (Vocals, guitars, bass, drums)',
    bio: 'High-energy multi-decade party rock spanning the greatest singalongs and anthems of the 70s, 80s, 90s, and 2000s.',
    photo: null,
    links: {
      facebook: 'https://www.facebook.com/brainfogband',
    },
  },
  {
    act: 'Candler Hobbs',
    composition: 'Solo classic rock acoustic artist (Guitar & vocals)',
    bio: 'A staple of the Georgia acoustic circuit delivering timeless classic rock favorites and folk rock staples with gritty, passionate delivery.',
    photo: null,
    links: {
      facebook: 'https://www.facebook.com/candlerhobbsmusic',
    },
  },
  {
    act: "Flint River Rev'lers",
    composition: 'Americana & roots ensemble (Guitars, bass, percussion & harmonies)',
    bio: 'A Coweta County favorite serving up foot-stomping Americana, folk gems, and acoustic roots favorites with tight harmonies and porch-ready energy.',
    photo: null,
    links: {
      facebook: 'https://www.facebook.com/flintriverrevlers',
      youtube: 'https://www.youtube.com/results?search_query=Flint+River+Rev%27lers+Georgia',
    },
  },
  {
    act: 'GRASS',
    composition: '4-piece rock outfit (Vocals, lead guitar, bass, drums)',
    bio: 'Channeling the golden era of Woodstock and psychedelic classic rock, GRASS brings beloved 60s and 70s rock classics to life.',
    photo: null,
    links: {
      facebook: 'https://www.facebook.com/grassbandga',
    },
  },
  {
    act: 'James & The Georgia Peaches',
    composition: 'Multi-genre vocal & rhythm group (Vocals, guitars, keys, drums)',
    bio: 'An eclectic crowd-pleaser blending soulful pop, upbeat rock, classic country, and southern soul into one non-stop celebratory set.',
    photo: null,
    links: {
      facebook: 'https://www.facebook.com/jamesandthegeorgiapeaches',
    },
  },
  {
    act: 'Mary Martin',
    composition: 'Solo indie-folk singer-songwriter (Acoustic guitar & vocals)',
    bio: 'Intimate indie, folk, and Americana storytelling marked by luminous vocals, lyrical depth, and delicate acoustic fingerpicking.',
    photo: null,
    links: {
      facebook: 'https://www.facebook.com/marymartinmusic',
      instagram: 'https://www.instagram.com/marymartinmusic',
    },
  },
  {
    act: 'Tyler Lowman Band',
    composition: 'Full band (Vocals, lead guitar, rhythm guitar, bass, drums)',
    bio: 'A powerhouse Newnan-based outfit blending country grit and blistering Southern rock riffs that get crowds on their feet.',
    photo: null,
    links: {
      facebook: 'https://www.facebook.com/tylerlowmanmusic',
      youtube: 'https://www.youtube.com/results?search_query=Tyler+Lowman+Band',
    },
  },
  {
    act: 'David Pippin Group',
    composition: '5-piece blues-rock band (David Pippin on guitar/vocals, bass, keys, drums, lead vocals)',
    bio: 'Fronted by Atlanta Blues Challenge winner and virtuoso guitarist David Pippin, fusing electrifying West Georgia blues with jazz, rock, and soul grooves.',
    photo: null,
    links: {
      website: 'http://davidpippinmusic.com/',
      facebook: 'https://www.facebook.com/davidpippinmusic',
      spotify: 'https://open.spotify.com/album/34wG88PZk1mXwEa4W5yB9L',
      youtube: 'https://www.youtube.com/results?search_query=David+Pippin+Group',
    },
  },
  {
    act: 'Ladega',
    composition: 'Jam & indie rock band (Guitars, bass, drums & vocals)',
    bio: 'Improvisational jam grooves meeting indie sensibilities and classic rock power, taking listeners on a dynamic sonic ride.',
    photo: null,
    links: {
      facebook: 'https://www.facebook.com/ladegaband',
    },
  },
  {
    act: 'Last Signal Home',
    composition: 'Classic & modern rock band (Vocals, dual guitars, bass, drums)',
    bio: 'A hard-hitting rock band delivering driving rhythms, melodic guitar hooks, and high-octane classic rock favorites.',
    photo: null,
    links: {
      facebook: 'https://www.facebook.com/lastsignalhome',
    },
  },
  {
    act: 'Luke Morgan & The Redliners',
    composition: 'Country-rock outfit (Luke Morgan on lead vocals/guitar, bass, drums, lead guitar)',
    bio: 'High-octane country rock pairing contemporary country songwriting with Southern rock firepower and infectious crowd energy.',
    photo: lukeMorganPhoto,
    links: {
      facebook: 'https://www.facebook.com/lukemorganmusicofficial',
      instagram: 'https://www.instagram.com/lukemorganmusic',
      youtube: 'https://www.youtube.com/@lukemorganmusic',
    },
  },
  {
    act: 'Russ Gordon & The Rattletrap',
    composition: 'Country band (Vocals, guitars, bass, percussion)',
    bio: 'Traditional country roots with a honky-tonk pulse, delivering twangy guitars, timeless country narratives, and genuine good-timing vibes.',
    photo: null,
    links: {
      facebook: 'https://www.facebook.com/russgordonmusic',
    },
  },
  {
    act: 'Tim McGee',
    composition: 'Multi-instrumentalist vocalist (Vocals, acoustic guitar & keys)',
    bio: 'Smooth, versatile sets effortlessly weaving through 70s and 90s radio classics, soulful R&B, light rock, and country staples.',
    photo: null,
    links: {
      facebook: 'https://www.facebook.com/timmcgeemusic',
    },
  },
  {
    act: 'Whiskey River Saints',
    composition: 'Southern rock & country band (Lead vocals, dual guitars, bass, drums)',
    bio: 'Rowdy southern rock and country anthems with fiery guitar licks, soaring choruses, and unapologetic Southern attitude.',
    photo: null,
    links: {
      facebook: 'https://www.facebook.com/whiskeyriversaints',
    },
  },
  {
    act: 'Wholly Smokes',
    composition: 'Classic rock band (Vocals, guitars, bass, drums)',
    bio: 'Smoking-hot guitar riffs and seasoned musicianship delivering classic and Southern rock hits that never go out of style.',
    photo: null,
    links: {
      facebook: 'https://www.facebook.com/whollysmokesband',
    },
  },
  {
    act: 'Brian Rivers Band',
    composition: 'Pop & rock group (Vocals, guitars, keyboards, bass, drums)',
    bio: 'Infectious pop and rock hooks with rich arrangements and vibrant vocal delivery, perfect for an evening porch singalong.',
    photo: null,
    links: {
      facebook: 'https://www.facebook.com/brianriversband',
    },
  },
  {
    act: 'Highway 54',
    composition: 'Blues, soul & rock outfit (Vocals, guitar, harmonica, bass, drums)',
    bio: 'Deep-grooving blues, soulful vocal lines, and driving rock rhythm honoring the rich musical heritage of Georgia Highway 54.',
    photo: null,
    links: {
      facebook: 'https://www.facebook.com/highway54band',
    },
  },
  {
    act: 'Joel Bridges',
    composition: 'Solo acoustic singer-songwriter (Guitar & vocals)',
    bio: 'Warm, resonant acoustic folk and rock featuring thoughtful originals and crowd-favorite acoustic interpretations.',
    photo: null,
    links: {
      facebook: 'https://www.facebook.com/joelbridgesmusic',
    },
  },
  {
    act: 'Lucas Smith',
    composition: 'Solo country performer (Acoustic guitar & vocals)',
    bio: 'A tribute to classic 70s and 80s golden-era country music, loaded with vintage outlaw charm and deep storytelling vocals.',
    photo: null,
    links: {
      facebook: 'https://www.facebook.com/lucassmithmusic',
    },
  },
  {
    act: 'Luke Brown & The Jubilee',
    composition: 'Country & roots band (Vocals, acoustic & electric guitars, bass, drums)',
    bio: 'Uplifting modern and traditional country music with spirited musicianship and relatable, heartfelt lyrics.',
    photo: null,
    links: {
      facebook: 'https://www.facebook.com/lukebrownjubilee',
    },
  },
  {
    act: 'Rob Harlan',
    composition: 'Solo classic rock & country artist (Guitar & vocals)',
    bio: 'Seasoned acoustic delivery covering iconic classic rock anthems and country favorites with soulful authenticity.',
    photo: null,
    links: {
      facebook: 'https://www.facebook.com/robharlanmusic',
    },
  },
  {
    act: 'Wildcat',
    composition: 'Classic & Southern rock band (Lead vocals, guitars, bass, drums)',
    bio: 'Fierce guitar-driven Southern rock and classic party rock that brings festival crowds to their feet.',
    photo: null,
    links: {
      facebook: 'https://www.facebook.com/wildcatbandga',
    },
  },
  {
    act: 'Wyatt Band',
    composition: 'Party & dance rock group (Vocals, guitars, keys, bass, drums)',
    bio: 'High-spirit dance tunes and classic rock bangers engineered to keep porchgoers moving and grooving.',
    photo: null,
    links: {
      facebook: 'https://www.facebook.com/wyattband',
    },
  },
  {
    act: 'Brian Collins',
    composition: 'Country/Americana artist & band (Brian Collins on lead vocals/guitar, full backing band)',
    bio: 'Nationally acclaimed Douglasville singer-songwriter behind Top-10 hits like "Shine A Little Love" and "Never Really Left", bringing soulful country-rock charisma to Morgan Street.',
    photo: brianCollinsPhoto,
    links: {
      website: 'https://briancollinsmusic.com/',
      facebook: 'https://www.facebook.com/briancollinsmusic',
      instagram: 'https://www.instagram.com/briancollinsmusic',
      youtube: 'https://www.youtube.com/watch?v=NM55AmxDmGQ',
      spotify: 'https://open.spotify.com/artist/62gYkHkFv3H8d5VlM5G9p5',
    },
  },
  {
    act: 'Cowboy Noyz',
    composition: 'Versatile party ensemble (Vocals, guitars, bass, percussion)',
    bio: 'An all-genres sonic romp jumping effortlessly across country, classic rock, funk, and pop favorites for an unpredictable, fun-filled set.',
    photo: null,
    links: {
      facebook: 'https://www.facebook.com/cowboynoyz',
    },
  },
  {
    act: 'Greg "Rogan" Rogers',
    composition: 'Modern country & inspirational artist (Acoustic guitar & vocals)',
    bio: 'Uplifting modern country melodies paired with faith-rooted songwriting and warm, accessible vocal tones.',
    photo: null,
    links: {
      facebook: 'https://www.facebook.com/gregroganrogers',
    },
  },
  {
    act: 'Jake and The Naysayers',
    composition: 'Jamband & country ensemble (Guitars, bass, drums, percussion, vocals)',
    bio: 'Spirited jam-band improvisation fused with catchy country hooks, creating dynamic, exploratory live sets.',
    photo: null,
    links: {
      facebook: 'https://www.facebook.com/jakeandthenaysayers',
    },
  },
  {
    act: 'Sarah & Morgan Hendrix',
    composition: 'Vocal & acoustic duo (Harmonies, acoustic guitars, light percussion)',
    bio: 'Sisterly vocal harmonies weaving through alternative, soft rock, and indie pop with delicate arrangements and captivating chemistry.',
    photo: null,
    links: {
      facebook: 'https://www.facebook.com/sarahandmorganhendrix',
      instagram: 'https://www.instagram.com/sarahandmorganhendrix',
    },
  },
  {
    act: 'Souls Hill',
    composition: 'Southern & classic rock band (Lead vocals, guitars, bass, drums)',
    bio: 'Gritty, hard-rocking Southern tunes featuring dual-guitar harmonies, heavy rhythm, and classic rock spirit.',
    photo: null,
    links: {
      facebook: 'https://www.facebook.com/soulshillband',
    },
  },
  {
    act: 'Tyler Caldwell',
    composition: 'Singer-songwriter (Guitar, harmonica & vocals)',
    bio: 'A blend of raw country grit, folk storytelling, and heartland rock delivered with an unmistakable Southern voice.',
    photo: null,
    links: {
      facebook: 'https://www.facebook.com/tylercaldwellmusic',
    },
  },
  {
    act: 'Ashton Dooley Band',
    composition: 'Americana & rock band (Ashton Dooley on vocals/guitar, bass, drums, lead guitar)',
    bio: 'Rich Americana roots combined with classic rock swagger and country storytelling for a sunset porch performance.',
    photo: ashtonDooleyPhoto,
    links: {
      facebook: 'https://www.facebook.com/AshtonDooleyBand',
      youtube: 'https://www.youtube.com/watch?v=Twrys_ewgt0',
    },
  },
  {
    act: 'Atticus Roness',
    composition: 'Rock & roll performer / power trio (Vocals, electric guitar, bass, drums)',
    bio: 'Pure, unfiltered rock ’n’ roll energy with vintage riffs, dynamic stage presence, and unmistakable attitude.',
    photo: null,
    links: {
      facebook: 'https://www.facebook.com/atticusroness',
    },
  },
  {
    act: 'Duncan Brothers Band',
    composition: 'Country band (Brother harmonies, guitars, bass, drums)',
    bio: 'Family-rooted country music featuring seamless blood harmonies, twangy leads, and relatable down-home themes.',
    photo: null,
    links: {
      facebook: 'https://www.facebook.com/duncanbrothersband',
    },
  },
  {
    act: 'Gradient',
    composition: 'Blues & rock band (Vocals, lead guitar, rhythm guitar, bass, drums)',
    bio: 'Smoky blues progressions transitioning into soaring classic rock crescendos with exceptional guitar improvisation.',
    photo: null,
    links: {
      facebook: 'https://www.facebook.com/gradientband',
    },
  },
  {
    act: 'Grateful To Be',
    composition: 'Rock band (Vocals, guitars, bass, drums, keys)',
    bio: 'Celebratory, uplifting rock honoring legendary jam and classic rock pioneers with expansive solos and good vibrations.',
    photo: null,
    links: {
      facebook: 'https://www.facebook.com/gratefultobe',
    },
  },
  {
    act: 'Joey Thurmond & The Select Orchestra',
    composition: 'Showband & vocal ensemble (Joey Thurmond on lead vocals, full rhythm & horn orchestra)',
    bio: 'Vegas-caliber showmanship and vocal power spanning classic rock, pop, blues, gospel, and country at the historic Veranda Inn.',
    photo: joeyThurmondPhoto,
    links: {
      website: 'https://joeythurmond.net/',
      facebook: 'https://www.facebook.com/joeythurmondentertainer',
      youtube: 'https://www.youtube.com/results?search_query=Joey+Thurmond+Orchestra',
    },
  },
  {
    act: 'Rock Soldered Blues',
    composition: 'Blues & southern rock band (Vocals, slide guitar, bass, drums, harmonica)',
    bio: 'Electrifying 70s-style blues rock and Southern grit with blistering guitar solos and impassioned blues vocals.',
    photo: null,
    links: {
      facebook: 'https://www.facebook.com/rocksolderedblues',
    },
  },
  {
    act: 'Tavis Lance Mapp',
    composition: 'Country artist (Acoustic & electric guitar, lead vocals)',
    bio: 'Authentic Georgia country music with resonant baritone vocals, classic themes, and genuine Southern charm.',
    photo: null,
    links: {
      facebook: 'https://www.facebook.com/tavislancemapp',
    },
  },
  {
    act: 'Chuck X Nick',
    composition: 'Dynamic duo (Chuck Parrish & Nick Ferrell on acoustic guitars, vocals & rap fusion)',
    bio: 'Senoia favorites Chuck Parrish and Nick Ferrell headline the Main Stage with their signature high-energy blend of country, rock, pop covers, acoustic rap fusion, and hilarious crowd interaction to close out PorchFest 2026.',
    photo: null,
    links: {
      website: 'https://chuckxnick.com/',
      facebook: 'https://www.facebook.com/chuckxnick',
      instagram: 'https://www.instagram.com/chuckxnick',
      youtube: 'https://www.youtube.com/results?search_query=Chuck+x+Nick+Senoia',
    },
  },
]

export function getActSlug(actName) {
  return actName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

/**
 * Returns all bands joined with their scheduled performance details
 * from `src/data/schedule.js`.
 */
export function getBandsWithSchedule() {
  const perfByAct = new Map()
  for (const p of PERFORMANCES) {
    if (p.confirmed) {
      perfByAct.set(p.act, p)
    }
  }

  return BANDS.map((band) => {
    const perf = perfByAct.get(band.act)
    const slug = getActSlug(band.act)
    
    let poiId = null
    if (perf) {
      if (perf.address === '40 Travis Street') {
        poiId = 'vip'
      } else if (perf.venue === 'Main Stage' || perf.stage == null) {
        poiId = 'stage-main'
      } else {
        poiId = `porch-${perf.stage}`
      }
    }

    return {
      ...band,
      id: slug,
      stage: perf?.stage ?? null,
      address: perf?.address ?? '',
      venue: perf?.venue ?? null,
      start: perf?.start ?? '',
      time: perf?.time ?? '',
      genre: perf?.genre ?? '',
      poiId,
    }
  })
}
