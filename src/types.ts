export interface Pub {
  id: string;
  name: string;
  city: string;
  address: string;
  postcode: string;
  phone: string;
  rating: number;
  features: string[];
  imageUrl: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  category: 'beers' | 'spirits' | 'pub-classics' | 'desserts';
  priceGbp: number;
  isSpecial: boolean;
}

export interface EventItem {
  id: string;
  title: string;
  date: string;
  time: string;
  description: string;
  type: 'quiz' | 'live-music' | 'crypto-meetup' | 'sports';
  badge?: string;
}

export interface Proposal {
  id: string;
  title: string;
  description: string;
  proposer: string;
  votesYes: number;
  votesNo: number;
  category: 'beers' | 'events' | 'facilities' | 'governance';
  status: 'active' | 'passed' | 'defeated';
  endsAt: string;
}

export interface Collectible {
  id: string;
  name: string;
  description: string;
  imageSeed: string;
  priceSatoshis: number;
  totalQuantity: number;
  mintedCount: number;
  perks: string[];
}

export interface WalletState {
  connected: boolean;
  address: string | null;
  balanceBtc: number;
  balanceSatoshis: number;
  walletType: 'MetaMask' | 'UniSat' | 'Leather' | 'Xverse' | null;
  stampCount: number;
  mintedIds: string[];
}
