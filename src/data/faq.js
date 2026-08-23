// FAQ data for Senoia PorchFest and Senoia Welcome Center inquiries.
// Organized by category with unique anchor slugs.

export const FAQ_CATEGORIES = [
  { id: 'all', label: 'All Questions' },
  { id: 'food-vendors', label: 'Food Trucks & Food' },
  { id: 'craft-vendors', label: 'Artisans & Crafts' },
  { id: 'musicians', label: 'Bands & Musicians' },
  { id: 'spaces', label: 'Downtown Spaces' },
  { id: 'general', label: 'Festival & Visitors' },
]

export const FAQS = [
  // --- Food Vendors & Food Trucks ---
  {
    id: 'food-truck-application',
    category: 'food-vendors',
    question: 'How do food trucks and food vendors apply for PorchFest?',
    answer:
      'Food vendor spots are curated and coordinated annually by the Senoia Downtown Development Authority (DDA). Because space along Food Truck Alley on Gin Street is limited, vendors are selected to ensure a balanced, high-quality variety of cuisines, snacks, desserts, and beverages. Vendors must apply in advance and be approved before registering.',
    link: {
      text: 'See our confirmed 2026 food & drink lineup',
      url: '/vendors',
    },
  },
  {
    id: 'food-vendor-timeline',
    category: 'food-vendors',
    question: 'When do food vendor applications open for PorchFest?',
    answer:
      'Applications typically open in the late spring and early summer. Because demand is high and space is limited, spots often fill several weeks before the event. Once approved, invited vendors complete their registration through the DDA.',
    tip: 'To get on the inquiry list for future PorchFest events, email the Welcome Center at info@enjoysenoia.com with your food truck or business name, menu highlights, and photos of your setup.',
  },
  {
    id: 'food-vendor-locations',
    category: 'food-vendors',
    question: 'Where are food vendors stationed during PorchFest?',
    answer:
      'Most food trucks and stands are stationed along Food Truck Alley on Gin Street (between Main Street and Pylant Street), with additional snack and beverage stands located near high-traffic porch clusters across historic downtown.',
    link: {
      text: 'View Food Truck Alley on the festival map',
      url: '/map?poi=food-trucks',
    },
  },

  // --- Artisans, Makers & Craft Vendors ---
  {
    id: 'craft-vendor-application',
    category: 'craft-vendors',
    question: 'How can artisans and craft vendors apply to participate?',
    answer:
      'Artisan and craft vendor spaces are coordinated through the Senoia DDA. We give preference to local makers, handcrafted goods, original artwork, and creators whose offerings fit the community festival atmosphere. Applications are reviewed by the event team prior to space allocation.',
  },
  {
    id: 'commercial-direct-sales',
    category: 'craft-vendors',
    question: 'Are direct-sales or commercial merchandise booths accepted?',
    answer:
      'PorchFest focuses primarily on music, local artisans, and downtown community partners. Direct-sales companies, mass-produced merchandise, and national commercial franchises are generally not accepted for artisan spaces.',
  },
  {
    id: 'craft-vendor-contact',
    category: 'craft-vendors',
    question: 'How do I join the craft vendor list for next year?',
    answer:
      'Send an email to the Senoia Welcome Center at info@enjoysenoia.com with "PorchFest Craft Vendor Inquiry" in the subject line. Include your business name, a description of your handmade items, sample photos of your work, and links to your social media or website.',
  },

  // --- Musicians & Bands ---
  {
    id: 'band-selection-process',
    category: 'musicians',
    question: 'How are bands and performers selected for PorchFest?',
    answer:
      'The PorchFest lineup is curated by the organizing committee to deliver a dynamic, family-friendly mix of genres—including rock, acoustic, bluegrass, Americana, blues, folk, country, and pop. Acts are matched with volunteer porch hosts based on space, acoustic requirements, and schedule timing.',
    link: {
      text: 'Explore the full 2026 artist lineup and schedule',
      url: '/schedule',
    },
  },
  {
    id: 'band-submissions',
    category: 'musicians',
    question: 'How can a musical act submit to play at future PorchFests?',
    answer:
      'Musician submissions open each spring. Bands and solo performers can submit an Electronic Press Kit (EPK), audio/video performance links, and social channels for committee review. To be added to the call-for-artists list, email info@enjoysenoia.com.',
  },
  {
    id: 'tips-and-merch',
    category: 'musicians',
    question: 'Can performers sell merchandise and accept tips?',
    answer:
      'Yes, absolutely! All porch stages are free to the public, so guests are enthusiastically encouraged to support our musicians directly by tipping at the porch stages and purchasing band t-shirts, CDs, and merchandise.',
  },

  // --- Downtown Event Spaces & Venues ---
  {
    id: 'downtown-popups',
    category: 'spaces',
    question: 'Can vendors set up independent pop-ups or sidewalk booths during PorchFest?',
    answer:
      'No. Unscheduled pop-ups or unpermitted vending on public sidewalks, streets, and city rights-of-way are not permitted during PorchFest. All approved spaces are coordinated in advance to maintain safe pedestrian movement and clear emergency access.',
  },
  {
    id: 'renting-senoia-spaces',
    category: 'spaces',
    question: 'How do I inquire about reserving downtown public spaces for other events?',
    answer:
      'For inquiries regarding downtown Senoia event spaces, city parks, or special event permits for dates outside of PorchFest, contact Melissa Quinn at the Senoia Welcome Center / DDA. The Welcome Center team can guide you through the city’s event permitting guidelines and facility availability.',
  },

  // --- Festival & Visitor Info ---
  {
    id: 'admission-cost',
    category: 'general',
    question: 'Is admission free? Do I need a ticket to attend?',
    answer:
      'Senoia PorchFest is 100% free to attend! No ticket is needed to walk the neighborhood and enjoy the music on all neighborhood porch stages. If you want an elevated experience with catered food, drinks, and private amenities, limited VIP Luxury Lounge tickets are available for purchase.',
    link: {
      text: 'Learn more about VIP Luxury Lounge tickets',
      url: '/vip',
    },
  },
  {
    id: 'parking-and-golf-carts',
    category: 'general',
    question: 'Where do I park, and can I drive my golf cart?',
    answer:
      'Free public parking is available in municipal downtown lots and along public streets where designated. Senoia is a golf cart-friendly community, and street-legal golf carts are welcome in standard parking spots. Carts are not permitted on closed pedestrian streets or residential lawns.',
    link: {
      text: 'Check parking locations on the day-of map',
      url: '/map?poi=parking',
    },
  },
  {
    id: 'rain-policy',
    category: 'general',
    question: 'What is the festival rain policy?',
    answer:
      'PorchFest is a rain-or-shine event! Porches provide covered stages for the musicians, and festivalgoers are encouraged to bring umbrellas or light rain jackets if passing showers are expected. In the event of dangerous lightning or severe weather, safety notices will be posted to the website and social media.',
  },
  {
    id: 'welcome-center-role',
    category: 'general',
    question: 'Where is the Senoia Welcome Center and how can they help?',
    answer:
      'The Senoia Welcome Center is located in the heart of downtown Senoia and is directed by Melissa Quinn. The Welcome Center assists visitors with maps, local dining, shopping recommendations, historic details, and coordinates event inquiries for the Senoia Downtown Development Authority.',
  },
]
