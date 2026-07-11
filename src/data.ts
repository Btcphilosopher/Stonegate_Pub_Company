import { Pub, MenuItem, EventItem, Proposal, Collectible } from './types';

export const PUBS: Pub[] = [
  {
    id: 'pub-1',
    name: 'The Sovereign Tavern',
    city: 'London',
    address: '42 Fleet Street, Temple',
    postcode: 'EC4Y 1AA',
    phone: '+44 20 7353 1234',
    rating: 4.8,
    features: ['Bitcoin ATM', 'Cold Lightning Taps', 'Rooftop Terrace', 'Crypto Workspace'],
    imageUrl: 'https://picsum.photos/seed/pubsovereign/600/400'
  },
  {
    id: 'pub-2',
    name: 'The Genesis Taproom',
    city: 'Manchester',
    address: '12 Deansgate, Castlefield',
    postcode: 'M3 3WR',
    phone: '+44 161 832 5678',
    rating: 4.7,
    features: ['Hardware Wallet Support', 'Satoshi Trivia Nights', 'Local Craft Beers', 'Heated Beer Garden'],
    imageUrl: 'https://picsum.photos/seed/pubgenesis/600/400'
  },
  {
    id: 'pub-3',
    name: 'The Peer-to-Peer',
    city: 'Edinburgh',
    address: '88 Royal Mile, Old Town',
    postcode: 'EH1 1PD',
    phone: '+44 131 225 9876',
    rating: 4.9,
    features: ['Instant Lightning Payments', 'Whisky Vaults', 'Historic British Architecture', 'Live Folk Music'],
    imageUrl: 'https://picsum.photos/seed/pubp2p/600/400'
  },
  {
    id: 'pub-4',
    name: 'Proof of Work Inn',
    city: 'Birmingham',
    address: '7 Hill Street, City Centre',
    postcode: 'B5 4UA',
    phone: '+44 121 643 1122',
    rating: 4.6,
    features: ['ASIC Heating (Eco)', 'Giant Screen Sports', 'Classic Pub Darts', 'Crypto Meetup Hub'],
    imageUrl: 'https://picsum.photos/seed/pubpow/600/400'
  },
  {
    id: 'pub-5',
    name: 'The Mempool Lounge',
    city: 'Leeds',
    address: '25 The Headrow',
    postcode: 'LS1 6PU',
    phone: '+44 113 243 4455',
    rating: 4.5,
    features: ['Lightning Fast WiFi', 'Artisanal Pies', 'Cask Ales', 'Weekly Quiz'],
    imageUrl: 'https://picsum.photos/seed/pubmempool/600/400'
  }
];

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'm1',
    name: 'Sovereign Fish & Chips',
    description: 'Fresh North Sea cod in crispy Bitcoin Golden Ale batter, hand-cut triple cooked chips, minted mushy peas, and homemade tartare sauce.',
    category: 'pub-classics',
    priceGbp: 18.50,
    isSpecial: true
  },
  {
    id: 'm2',
    name: 'The Genesis Double Beef Burger',
    description: 'Two dry-aged British beef patties, aged cheddar, maple smoked bacon, caramelized red onion marmalade, and brioche bun. Served with rosemary fries.',
    category: 'pub-classics',
    priceGbp: 17.00,
    isSpecial: false
  },
  {
    id: 'm3',
    name: 'The Halving Sirloin Steak',
    description: '8oz premium grass-fed British sirloin steak cooked to perfection, roasted plum tomatoes, field mushroom, and thick-cut sovereign chips.',
    category: 'pub-classics',
    priceGbp: 26.50,
    isSpecial: true
  },
  {
    id: 'm4',
    name: 'Crypto Golden Ale',
    description: 'Brewed exclusively for Stonegate Pub Company. A refreshing golden ale with light citrus notes and a crisp, clean finish.',
    category: 'beers',
    priceGbp: 6.20,
    isSpecial: true
  },
  {
    id: 'm5',
    name: 'Lightning Stout (Nitrogen)',
    description: 'Rich, smooth, dark stout with roasted coffee bean aromas and a velvety cream head. Pours instantly on lightning tap.',
    category: 'beers',
    priceGbp: 6.50,
    isSpecial: false
  },
  {
    id: 'm6',
    name: 'Mempool IPA',
    description: 'Double dry-hopped West Coast style India Pale Ale. Robust pine needles and heavy grapefruit punch with balanced bitterness.',
    category: 'beers',
    priceGbp: 6.80,
    isSpecial: false
  },
  {
    id: 'm7',
    name: 'Proof of Botanicals Gin',
    description: 'Distilled with 12 organic British botanicals including juniper, coriander seed, elderflower, and fresh lemon peel. Served with premium tonic.',
    category: 'spirits',
    priceGbp: 9.50,
    isSpecial: false
  },
  {
    id: 'm8',
    name: 'Satoshi Single Malt Whisky',
    description: '12-year-old highland single malt scotch matured in double oak casks. Notes of honey, vanilla, and subtle peat smoke.',
    category: 'spirits',
    priceGbp: 11.00,
    isSpecial: true
  },
  {
    id: 'm9',
    name: 'Timeless Warm Sticky Toffee Pudding',
    description: 'Rich sponge cake with finely chopped dates, smothered in warm toffee sauce, and served with luxurious vanilla bean ice cream.',
    category: 'desserts',
    priceGbp: 8.00,
    isSpecial: false
  },
  {
    id: 'm10',
    name: 'Bitcoin Bramble Tart',
    description: 'Traditional forest blackberry and apple shortcrust tart served with hot custard or double cream.',
    category: 'desserts',
    priceGbp: 7.50,
    isSpecial: false
  }
];

export const EVENTS: EventItem[] = [
  {
    id: 'e1',
    title: 'Satoshi Pub Quiz',
    date: 'Every Wednesday',
    time: '20:00 - 22:30',
    description: 'The ultimate British pub trivia, updated for the modern age. Standard trivia rounds mixed with cryptography questions. Jackpot prize paid out in real Bitcoin!',
    type: 'quiz',
    badge: '1M Sats Jackpot'
  },
  {
    id: 'e2',
    title: 'Bitcoin & Beers Meetup',
    date: 'Monthly First Thursday',
    time: '18:30 - 22:00',
    description: 'Informal networking for local Bitcoiners, developers, and crypto-curious newcomers. Connect, debate, and buy pints on lightning network.',
    type: 'crypto-meetup',
    badge: 'Free First Pint'
  },
  {
    id: 'e3',
    title: 'Live Acoustic: Heritage Folk',
    date: 'Every Friday Night',
    time: '21:00 - Midnight',
    description: 'Unplugged acoustic sets featuring traditional English & Scottish folk singers, bringing a cozy, historic pub atmosphere to the weekend.',
    type: 'live-music',
    badge: 'Unplugged'
  },
  {
    id: 'e4',
    title: 'Premier League Saturdays (4K Ultra-HD)',
    date: 'Every Saturday',
    time: '12:30 - 19:30',
    description: 'Watch all major Premier League matches live across giant screens with spatial sound. Enjoy sovereign pint deals during match hours.',
    type: 'sports',
    badge: 'Live Sports'
  }
];

export const INITIAL_PROPOSALS: Proposal[] = [
  {
    id: 'p-1',
    title: "Add 'Blockstream Pale Ale' to the Permanent Cask Guest Taps",
    description: "Should we list Blockstream's new flagship floral Pale Ale across all Sovereign class pubs in the UK? It is light, organic, and pairs brilliantly with our Fish & Chips.",
    proposer: "tb1q9f...x9y4",
    votesYes: 4850,
    votesNo: 1240,
    category: 'beers',
    status: 'active',
    endsAt: '2026-07-20'
  },
  {
    id: 'p-2',
    title: "Introduce Hardware Wallet Deposit Lockers Behind the Bar",
    description: "Provide physical tamper-proof secure locker drawers managed by the pub landlord for guests wanting to temporarily secure their hardware keys while enjoying a social night out.",
    proposer: "tb1qd8...e33r",
    votesYes: 2150,
    votesNo: 3400,
    category: 'facilities',
    status: 'active',
    endsAt: '2026-07-18'
  },
  {
    id: 'p-3',
    title: "Host Monthly 'Bitcoin 101' Educational Brunches for Local Elders",
    description: "Launch a community outreach initiative to explain digital privacy, simple mobile wallet safety, and peer-to-peer security over tea and crumpets, funded entirely by our community treasury.",
    proposer: "tb1qll...z4st",
    votesYes: 7200,
    votesNo: 150,
    category: 'events',
    status: 'passed',
    endsAt: '2026-07-01'
  },
  {
    id: 'p-4',
    title: "Double the Loyalty Stamp Reward multiplier during UEFA Euro Matches",
    description: "Offer double digital loyalty stamps on all beer and pub snacks purchased via Lightning during England and Scotland national team football matches this summer.",
    proposer: "tb1qhp...4f9x",
    votesYes: 8930,
    votesNo: 420,
    category: 'governance',
    status: 'active',
    endsAt: '2026-07-15'
  }
];

export const COLLECTIBLES: Collectible[] = [
  {
    id: 'c-1',
    name: 'The Sovereign Tankard',
    description: 'The ultimate digital proof of patronage. Owns the rights to a physical handcrafted pewter tankard engraved with your unique token ID, kept behind the bar at your favorite Stonegate Pub.',
    imageSeed: 'tankard',
    priceSatoshis: 150000, // ~0.0015 BTC
    totalQuantity: 100,
    mintedCount: 78,
    perks: ['Physical Tankard Behind Bar', 'Permanent 10% Off Craft Beers', 'Exclusive Discord Channel Access']
  },
  {
    id: 'c-2',
    name: 'Satoshi\'s Coaster (Limited Edition)',
    description: 'A beautifully animated digital coaster showing the iconic British pub coin pattern blended with Bitcoin circuit traces. Unlocks special VIP seating booking privileges.',
    imageSeed: 'coaster',
    priceSatoshis: 50000, // ~0.0005 BTC
    totalQuantity: 500,
    mintedCount: 341,
    perks: ['VIP Table Priority Booking', '1 Free Pint per Month', 'Custom Digital Avatar Badge']
  },
  {
    id: 'c-3',
    name: 'The Golden Tap Handle NFT',
    description: 'A masterwork digital rendering of the classic Victorian copper tap handle merged with a golden Bitcoin seal. Only for the most dedicated community patrons.',
    imageSeed: 'tap',
    priceSatoshis: 500000, // ~0.005 BTC
    totalQuantity: 21,
    mintedCount: 14,
    perks: ['Permanent Pint Name Plate on Bar', 'Annual Private Whiskey Tasting Invite', 'Weighted Governance Votes (+3x)']
  }
];
