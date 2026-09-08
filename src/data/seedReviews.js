/**
 * Seed customer reviews — used in demo mode and on first Firestore read.
 * Replaceable from the admin panel. Designed to feel real, not promotional.
 */
export const initialReviews = [
  {
    id: 'rv_seed_1',
    name: 'Ayesha R.',
    city: 'Lahore',
    rating: 5,
    title: 'Genuinely beautiful quality',
    body:
      'The glass is thick and feels weighty in a good way. Bamboo lid fits snug, no leaking when I carry it to work. The straw is a nice touch — I use it daily for nimbu pani now.',
    verified: true,
    approved: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 12,
  },
  {
    id: 'rv_seed_2',
    name: 'Hamza K.',
    city: 'Karachi',
    rating: 5,
    title: 'Looks great on my desk',
    body:
      'Bought it for iced coffee at the office. Looks much more premium than a plastic tumbler. Straw is a bit thinner than I expected but works fine.',
    verified: true,
    approved: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 22,
  },
  {
    id: 'rv_seed_3',
    name: 'Sana M.',
    city: 'Islamabad',
    rating: 4,
    title: 'Lovely jar, careful with the lid',
    body:
      'The jar itself is beautiful. The bamboo lid is real wood so I hand-wash and air-dry it as the note suggested. Straw gets a tiny bit cloudy after a few weeks of juice but cleans up well.',
    verified: true,
    approved: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 35,
  },
  {
    id: 'rv_seed_4',
    name: 'Bilal A.',
    city: 'Faisalabad',
    rating: 5,
    title: 'Worth the price',
    body:
      'Honestly, I was on the fence at this price point but the packaging was solid and the jar feels like something you’d see in a café. Replaced my plastic bottles with this.',
    verified: true,
    approved: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 47,
  },
  {
    id: 'rv_seed_5',
    name: 'Mahnoor T.',
    city: 'Rawalpindi',
    rating: 5,
    title: 'Perfect for smoothies',
    body:
      'I make a smoothie almost every morning and this holds a generous portion. The wide mouth is easy to clean. The bamboo lid adds a really nice warm look to my kitchen counter.',
    verified: true,
    approved: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 61,
  },
  {
    id: 'rv_seed_6',
    name: 'Daniyal S.',
    city: 'Multan',
    rating: 4,
    title: 'Solid build, good value',
    body:
      'Glass is thick, straw is glass (not plastic). I was surprised it’s not flimsy. Delivery took 4 days to my city which was reasonable.',
    verified: true,
    approved: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 78,
  },
];
