// FAQ data for Senoia PorchFest.
// Organized by category with unique anchor slugs.

export const FAQ_CATEGORIES = [
  { id: 'all', label: 'All Questions' },
  { id: 'food', label: 'Food & Drink' },
  { id: 'music', label: 'Bands & Music' },
  { id: 'attending', label: 'Attending PorchFest' },
]

export const FAQS = [
  // --- Food & Drink ---
  {
    id: 'food-vendor-locations',
    category: 'food',
    question: 'Where are food vendors stationed during PorchFest?',
    answer:
      'Most food trucks and snack stands are stationed along Food Truck Alley on Gin Street (between Main Street and Pylant Street), with additional beverage and snack stands located near high-traffic porch clusters across historic downtown.',
    link: {
      text: 'View Food Truck Alley on the festival map',
      url: '/map?poi=food-trucks',
    },
  },

  // --- Bands & Music ---
  {
    id: 'band-selection-process',
    category: 'music',
    question: 'How are bands and performers selected for PorchFest?',
    answer:
      'The PorchFest lineup is curated by the organizing committee to deliver a dynamic, family-friendly mix of genres across nearly 30 host porches. Acts are paired with volunteer porch hosts based on acoustic requirements, space, and schedule timing.',
    link: {
      text: 'Explore the full 2026 artist lineup and schedule',
      url: '/schedule',
    },
  },
  {
    id: 'band-submissions',
    category: 'music',
    question: 'How can musical acts submit to play at future PorchFests?',
    answer:
      'Musician submissions open each spring. Bands and solo performers can submit an Electronic Press Kit (EPK), performance videos, and audio links when the annual call for artists is announced by the organizers.',
  },
  {
    id: 'tips-and-merch',
    category: 'music',
    question: 'Can performers sell merchandise and accept tips?',
    answer:
      'Yes, absolutely! All porch performances are free to the public, so guests are enthusiastically encouraged to support the musicians directly by tipping at porch stages and purchasing band t-shirts and merchandise.',
  },

  // --- Attending PorchFest ---
  {
    id: 'admission-cost',
    category: 'attending',
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
    category: 'attending',
    question: 'Where do I park, and can I drive my golf cart?',
    answer:
      'Free public parking is available in municipal downtown lots and along public streets where designated. Senoia is a golf cart-friendly community, and street-legal golf carts are welcome in standard parking spaces. Carts are not permitted on closed pedestrian street segments or residential lawns.',
    link: {
      text: 'Check parking locations on the map',
      url: '/map?poi=parking',
    },
  },
  {
    id: 'rain-policy',
    category: 'attending',
    question: 'What is the festival rain policy?',
    answer:
      'PorchFest is a rain-or-shine event! Porches provide covered stages for musicians, and festivalgoers are encouraged to bring umbrellas or light rain jackets if passing showers are expected. In the event of dangerous lightning or severe weather, safety notices will be posted to the website and official social channels.',
  },
]
