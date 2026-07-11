import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, Info, Calendar, Beer, Award, CheckCircle2, Star, Zap, ChevronRight, X, Sparkles, MapPin, ExternalLink } from 'lucide-react';

import Header from './components/Header';
import Modal from './components/Modal';
import PubFinder from './components/PubFinder';
import MenuViewer from './components/MenuViewer';
import LoyaltyDashboard from './components/LoyaltyDashboard';
import GovernanceHub from './components/GovernanceHub';
import WalletConnectModal from './components/WalletConnectModal';
import LightningPaymentModal from './components/LightningPaymentModal';

import { MenuItem, Proposal, Collectible, WalletState } from './types';
import { EVENTS, INITIAL_PROPOSALS } from './data';

// Import hero background image
import heroBg from './assets/images/stonegate_hero_bg_1783770518285.jpg';

export default function App() {
  // Live states
  const [btcPriceGbp, setBtcPriceGbp] = useState(67892.00);
  const [btcPriceChange24h, setBtcPriceChange24h] = useState(2.35);

  // Wallet state with localStorage persistence
  const [wallet, setWallet] = useState<WalletState>(() => {
    const saved = localStorage.getItem('stonegate_wallet_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved wallet", e);
      }
    }
    return {
      connected: false,
      address: null,
      balanceBtc: 0,
      balanceSatoshis: 0,
      walletType: null,
      stampCount: 2, // start with 2 pre-earned stamps for fun!
      mintedIds: []
    };
  });

  // Governance proposals with localStorage persistence
  const [proposals, setProposals] = useState<Proposal[]>(() => {
    const saved = localStorage.getItem('stonegate_proposals_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved proposals", e);
      }
    }
    return INITIAL_PROPOSALS;
  });

  // User votes registry with localStorage persistence
  const [userVotes, setUserVotes] = useState<Record<string, 'yes' | 'no'>>(() => {
    const saved = localStorage.getItem('stonegate_votes_v2');
    return saved ? JSON.parse(saved) : {};
  });

  // Toast/Notification states
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Modal overlays
  const [activeModal, setActiveModal] = useState<'pubs' | 'menu' | 'events' | 'loyalty' | 'story' | 'governance' | null>(null);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  
  // Lightning checkout target
  const [checkoutItem, setCheckoutItem] = useState<{ name: string; priceSats: number } | null>(null);

  // Save states to localStorage on change
  useEffect(() => {
    localStorage.setItem('stonegate_wallet_v2', JSON.stringify(wallet));
  }, [wallet]);

  useEffect(() => {
    localStorage.setItem('stonegate_proposals_v2', JSON.stringify(proposals));
  }, [proposals]);

  useEffect(() => {
    localStorage.setItem('stonegate_votes_v2', JSON.stringify(userVotes));
  }, [userVotes]);

  // Toast automatic dismiss
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Fetch real Bitcoin price on mount + periodic micro-ticks
  useEffect(() => {
    const fetchBtcPrice = async () => {
      try {
        const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=gbp&include_24hr_change=true');
        const data = await res.json();
        if (data && data.bitcoin) {
          setBtcPriceGbp(data.bitcoin.gbp);
          if (data.bitcoin.gbp_24h_change) {
            setBtcPriceChange24h(data.bitcoin.gbp_24h_change);
          }
        }
      } catch (e) {
        console.log("Could not fetch CoinGecko BTC price, using local fallback rate", e);
      }
    };

    fetchBtcPrice();

    // Fluctuates slightly every 6 seconds to feel organic and live
    const interval = setInterval(() => {
      setBtcPriceGbp(prev => {
        const delta = (Math.random() - 0.5) * 6.50; // fluctuate by up to £3.25
        return +(prev + delta).toFixed(2);
      });
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  // Show a message toast
  const triggerToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
  };

  // Wallet connections
  const handleConnectWalletSuccess = (walletType: 'MetaMask' | 'UniSat' | 'Leather' | 'Xverse') => {
    // Generate valid looking BTC address based on wallet type
    let prefix = 'tb1q'; // testnet Native Segwit
    if (walletType === 'UniSat') prefix = 'bc1q'; // mainnet Native Segwit
    if (walletType === 'Leather') prefix = 'bc1p'; // Taproot
    
    const randomHex = Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const address = `${prefix}${randomHex.slice(0, 24)}`;
    
    setWallet(prev => ({
      ...prev,
      connected: true,
      address,
      balanceBtc: 0.0482,
      balanceSatoshis: 4820000,
      walletType
    }));

    triggerToast(`Connected with ${walletType} successfully!`, 'success');
  };

  const handleDisconnect = () => {
    setWallet({
      connected: false,
      address: null,
      balanceBtc: 0,
      balanceSatoshis: 0,
      walletType: null,
      stampCount: 2,
      mintedIds: []
    });
    triggerToast('Wallet disconnected', 'info');
  };

  // Voting action
  const handleVote = (proposalId: string, choice: 'yes' | 'no') => {
    if (!wallet.connected) {
      setIsWalletModalOpen(true);
      return;
    }

    const voteWeight = wallet.balanceSatoshis > 0 ? wallet.balanceSatoshis : 1000;

    setProposals(prev => prev.map(prop => {
      if (prop.id === proposalId) {
        return {
          ...prop,
          votesYes: choice === 'yes' ? prop.votesYes + voteWeight : prop.votesYes,
          votesNo: choice === 'no' ? prop.votesNo + voteWeight : prop.votesNo
        };
      }
      return prop;
    }));

    setUserVotes(prev => ({
      ...prev,
      [proposalId]: choice
    }));

    triggerToast(`Voted ${choice.toUpperCase()} on proposal using ${voteWeight.toLocaleString()} Satoshis weight!`, 'success');
  };

  // Add Proposal action
  const handleAddProposal = (title: string, desc: string, category: 'beers' | 'events' | 'facilities' | 'governance') => {
    if (!wallet.connected) {
      setIsWalletModalOpen(true);
      return;
    }

    // Deduct simulated deposit
    if (wallet.balanceSatoshis < 5000) {
      triggerToast('Insufficient Satoshi balance to cover the 5,000 Sat deposit.', 'error');
      return;
    }

    const newProp: Proposal = {
      id: `p-${Date.now()}`,
      title,
      description: desc,
      proposer: wallet.address || 'Anonymous',
      votesYes: 5000, // proposer votes yes with their deposit
      votesNo: 0,
      category,
      status: 'active',
      endsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 7 days from now
    };

    setProposals(prev => [newProp, ...prev]);
    setWallet(prev => ({
      ...prev,
      balanceSatoshis: prev.balanceSatoshis - 5000,
      balanceBtc: +(prev.balanceBtc - 0.00005).toFixed(6)
    }));

    triggerToast('Proposal published successfully! 5,000 Satoshis deposit locked.', 'success');
  };

  // Buy menu item or pint at table
  const handleBuyItem = (item: MenuItem, priceSats: number) => {
    // Open lightning payment model
    setCheckoutItem({
      name: item.name,
      priceSats
    });
  };

  const handlePintOrderedAtTable = (pubName: string) => {
    // Buy a pint of golden ale at this pub
    const gbpPrice = 6.20;
    const priceSats = Math.round((gbpPrice / btcPriceGbp) * 100000000);
    setCheckoutItem({
      name: `Pint of Crypto Golden Ale at ${pubName}`,
      priceSats
    });
  };

  // Mint NFT Collectible
  const handleMintCollectible = (collectible: Collectible) => {
    if (!wallet.connected) {
      setIsWalletModalOpen(true);
      return;
    }

    if (wallet.balanceSatoshis < collectible.priceSatoshis) {
      triggerToast('Insufficient Satoshis in connected wallet to mint this collectible.', 'error');
      return;
    }

    setWallet(prev => {
      const newStamps = prev.stampCount + 3; // +3 stamps on NFT mint
      return {
        ...prev,
        balanceSatoshis: prev.balanceSatoshis - collectible.priceSatoshis,
        balanceBtc: +(prev.balanceBtc - (collectible.priceSatoshis / 100000000)).toFixed(6),
        stampCount: newStamps > 10 ? 10 : newStamps,
        mintedIds: [...prev.mintedIds, collectible.id]
      };
    });

    triggerToast(`Minted "${collectible.name}" NFT successfully! +3 Loyalty Stamps earned.`, 'success');
  };

  // Redeem Free Pint
  const handleRedeemFreePint = () => {
    setWallet(prev => ({
      ...prev,
      stampCount: 0
    }));
    triggerToast('🍺 Complimentary Stout Coupon unlocked! Present this to the bar manager.', 'success');
  };

  // Successful checkout payment complete
  const handlePaymentComplete = () => {
    setWallet(prev => {
      const newStamps = prev.stampCount + 1;
      return {
        ...prev,
        // Deduct if connected, else mock pay
        balanceSatoshis: prev.connected ? prev.balanceSatoshis - (checkoutItem?.priceSats || 0) : prev.balanceSatoshis,
        balanceBtc: prev.connected ? +(prev.balanceBtc - ((checkoutItem?.priceSats || 0) / 100000000)).toFixed(6) : prev.balanceBtc,
        stampCount: newStamps > 10 ? 10 : newStamps
      };
    });
    triggerToast(`Payment settled! "${checkoutItem?.name}" ordered successfully. +1 stamp earned.`, 'success');
    setCheckoutItem(null);
  };

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col justify-between selection:bg-brand-gold selection:text-brand-bg" id="app-root-container">
      
      {/* Toast notifications */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-5 py-3 rounded-xl border shadow-xl max-w-sm ${
              toast.type === 'success'
                ? 'bg-green-500/10 border-green-500/30 text-green-400'
                : toast.type === 'error'
                ? 'bg-red-500/10 border-red-500/30 text-red-400'
                : 'bg-brand-panel border-brand-border text-brand-gold-light'
            }`}
            id="global-toast-notification"
          >
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span className="text-xs font-sans font-medium">{toast.message}</span>
            <button onClick={() => setToast(null)} className="ml-3 text-gray-400 hover:text-white shrink-0">
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header component */}
      <Header
        wallet={wallet}
        onConnectClick={() => setIsWalletModalOpen(true)}
        onDisconnectClick={handleDisconnect}
        btcPriceGbp={btcPriceGbp}
        btcPriceChange24h={btcPriceChange24h}
        onNavClick={(view) => setActiveModal(view)}
      />

      {/* Hero Body Content */}
      <main className="flex-1 relative flex flex-col justify-center py-12 md:py-16 overflow-hidden">
        {/* Background Atmosphere Image Layer */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroBg}
            alt="Stonegate British Pub Heritage meets Web 3.0 future, cinematic twilight"
            className="w-full h-full object-cover opacity-55 scale-105"
            referrerPolicy="no-referrer"
          />
          {/* Dark Overlay mask to matching image lighting perfectly */}
          <div className="absolute inset-0 bg-gradient-to-t from-brand-bg via-brand-bg/85 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-bg/95 via-transparent to-brand-bg/60" />
        </div>

        {/* Dynamic Centered Content Wrapper */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Traditional Serif text and introductory statements */}
          <div className="lg:col-span-7 space-y-6 md:space-y-8 text-left">
            
            <div className="space-y-4">
              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-[1.1]">
                TIMELESS BY
                <span className="block mt-1">TRADITION.</span>
                <span className="block mt-2 text-brand-gold bg-gradient-to-r from-brand-gold to-brand-gold-light bg-clip-text text-transparent">
                  BUILT FOR
                </span>
                <span className="block mt-1 text-brand-gold bg-gradient-to-r from-brand-gold to-brand-gold-light bg-clip-text text-transparent">
                  TOMORROW.
                </span>
              </h1>

              {/* Gold Crest Divider */}
              <div className="flex items-center gap-3 py-1">
                <div className="h-[1px] w-12 bg-brand-gold/30" />
                <svg className="w-5 h-5 text-brand-gold/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="M12 6l1.5 3h3.5l-2.5 2 1 3.5-3.5-2-3.5 2 1-3.5-2.5-2h3.5z" fill="currentColor" />
                </svg>
                <div className="h-[1px] w-12 bg-brand-gold/30" />
              </div>
            </div>

            <p className="text-sm md:text-base text-gray-300 font-sans leading-relaxed max-w-lg">
              Stonegate is Britain’s home of proper pubs. Rooted in heritage. Forged for the future. Now embracing Web 3.0—powered by <span className="text-brand-gold font-semibold">Bitcoin</span>.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              {/* FIND A PUB */}
              <button
                onClick={() => setActiveModal('pubs')}
                className="group px-6 py-3 bg-brand-gold text-brand-bg hover:bg-brand-gold-light font-space font-bold text-xs tracking-widest uppercase rounded-lg shadow-lg hover:shadow-brand-gold/20 flex items-center gap-2 transition-all duration-300 cursor-pointer"
                id="hero-find-pub-btn"
              >
                <span>Find a Pub</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-200" />
              </button>

              {/* OUR STORY */}
              <button
                onClick={() => setActiveModal('story')}
                className="px-6 py-3 border border-brand-gold text-brand-gold hover:bg-brand-gold/10 font-space font-bold text-xs tracking-widest uppercase rounded-lg transition-all duration-300 cursor-pointer"
                id="hero-our-story-btn"
              >
                Our Story
              </button>
            </div>
          </div>

          {/* Right Column: Floating vertical black banner */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="relative w-64 p-6 bg-gradient-to-b from-brand-panel to-brand-bg border-2 border-brand-gold/40 rounded-xl shadow-2xl flex flex-col items-center justify-center space-y-6 text-center"
              id="hero-vertical-bitcoin-banner"
            >
              {/* Absolute glowing element */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-brand-gold/80 rounded-full blur-[2px]" />
              
              <div className="w-16 h-16 rounded-full bg-brand-gold/10 border-2 border-brand-gold flex items-center justify-center font-display font-black text-brand-gold text-3xl shadow-inner shadow-brand-gold/20">
                ₿
              </div>

              <div className="space-y-1">
                <h3 className="font-display text-xl font-bold text-white tracking-widest">
                  BITCOIN
                </h3>
                <p className="text-[10px] font-space font-bold tracking-[0.3em] text-brand-gold uppercase">
                  ONLY
                </p>
              </div>

              {/* Separator line */}
              <div className="w-12 h-[1px] bg-brand-border/80" />

              <div className="space-y-3 font-display tracking-[0.25em] text-[10px] text-gray-300 font-medium">
                <p className="hover:text-brand-gold transition-colors">SOVEREIGN</p>
                <p className="hover:text-brand-gold transition-colors">PRIVACY</p>
                <p className="hover:text-brand-gold transition-colors">FINANCIAL</p>
                <p className="hover:text-brand-gold transition-colors">FREEDOM</p>
              </div>

              {/* Bottom decorative banner tip */}
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 rotate-45 bg-brand-bg border-r-2 border-b-2 border-brand-gold/40" />
            </motion.div>
          </div>

        </div>

        {/* Feature Cards Grid Section */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 w-full mt-12 md:mt-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" id="home-feature-cards">
            
            {/* CARD 1: BITCOIN PAYMENTS */}
            <div
              onClick={() => setActiveModal('menu')}
              className="group p-6 rounded-xl border border-brand-border hover:border-brand-gold/40 bg-brand-panel/40 hover:bg-brand-panel/75 transition-all duration-300 cursor-pointer flex flex-col justify-between h-44 shadow-lg"
            >
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-full border border-brand-gold/20 bg-brand-gold/5 flex items-center justify-center font-display font-bold text-brand-gold text-lg group-hover:scale-105 transition-transform duration-200">
                  ₿
                </div>
                <div className="space-y-1">
                  <h4 className="font-space font-semibold text-xs tracking-wider uppercase text-gray-200">
                    BITCOIN PAYMENTS
                  </h4>
                  <p className="text-[11px] text-gray-400 font-sans leading-tight">
                    Pay in Bitcoin at proper pubs across the UK instantly.
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-space font-bold tracking-wider text-brand-gold group-hover:translate-x-1.5 transition-transform duration-200">
                LEARN MORE &gt;
              </span>
            </div>

            {/* CARD 2: WEB 3.0 LOYALTY */}
            <div
              onClick={() => setActiveModal('loyalty')}
              className="group p-6 rounded-xl border border-brand-border hover:border-brand-gold/40 bg-brand-panel/40 hover:bg-brand-panel/75 transition-all duration-300 cursor-pointer flex flex-col justify-between h-44 shadow-lg"
            >
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-full border border-brand-gold/20 bg-brand-gold/5 flex items-center justify-center text-brand-gold group-hover:scale-105 transition-transform duration-200">
                  <Award className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-space font-semibold text-xs tracking-wider uppercase text-gray-200">
                    WEB 3.0 LOYALTY
                  </h4>
                  <p className="text-[11px] text-gray-400 font-sans leading-tight">
                    Own your loyalty stamps. Not just points—true digital ownership.
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-space font-bold tracking-wider text-brand-gold group-hover:translate-x-1.5 transition-transform duration-200">
                LEARN MORE &gt;
              </span>
            </div>

            {/* CARD 3: STONEGATE COLLECTIBLES */}
            <div
              onClick={() => {
                setActiveModal('loyalty');
                // Auto switch tab in Loyalty to collectibles
              }}
              className="group p-6 rounded-xl border border-brand-border hover:border-brand-gold/40 bg-brand-panel/40 hover:bg-brand-panel/75 transition-all duration-300 cursor-pointer flex flex-col justify-between h-44 shadow-lg"
            >
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-full border border-brand-gold/20 bg-brand-gold/5 flex items-center justify-center text-brand-gold group-hover:scale-105 transition-transform duration-200">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-space font-semibold text-xs tracking-wider uppercase text-gray-200">
                    STONEGATE COLLECTIBLES
                  </h4>
                  <p className="text-[11px] text-gray-400 font-sans leading-tight">
                    Limited-edition NFT drops. Exclusive perks. Real physical value.
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-space font-bold tracking-wider text-brand-gold group-hover:translate-x-1.5 transition-transform duration-200">
                VIEW COLLECTION &gt;
              </span>
            </div>

            {/* CARD 4: COMMUNITY GOVERNANCE */}
            <div
              onClick={() => setActiveModal('governance')}
              className="group p-6 rounded-xl border border-brand-border hover:border-brand-gold/40 bg-brand-panel/40 hover:bg-brand-panel/75 transition-all duration-300 cursor-pointer flex flex-col justify-between h-44 shadow-lg"
            >
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-full border border-brand-gold/20 bg-brand-gold/5 flex items-center justify-center text-brand-gold group-hover:scale-105 transition-transform duration-200">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
                <div className="space-y-1">
                  <h4 className="font-space font-semibold text-xs tracking-wider uppercase text-gray-200">
                    COMMUNITY GOVERNANCE
                  </h4>
                  <p className="text-[11px] text-gray-400 font-sans leading-tight">
                    Help shape the future of Stonegate. Powered by Bitcoin.
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-space font-bold tracking-wider text-brand-gold group-hover:translate-x-1.5 transition-transform duration-200">
                VOTE ON PROPOSALS &gt;
              </span>
            </div>

          </div>
        </div>
      </main>

      {/* Dynamic Live Ticker Bottom Footer Bar */}
      <footer className="bg-black/90 border-t border-brand-border py-6 z-10 relative">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-0 items-center justify-items-center md:justify-items-stretch">
          
          {/* Ticker 1: Live BTC pricing */}
          <div className="flex flex-col text-center md:text-left space-y-1 border-b md:border-b-0 md:border-r border-brand-border pb-4 md:pb-0 md:pr-8 w-full md:w-auto">
            <div className="flex items-center justify-center md:justify-start gap-1.5 text-[10px] font-space font-bold tracking-wider text-gray-400 uppercase">
              <span>BITCOIN PRICE</span>
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-green-500 font-mono text-[9px]">LIVE</span>
            </div>
            <div className="flex items-baseline justify-center md:justify-start gap-2.5">
              <span className="font-mono text-xl font-bold text-white tracking-tight">
                ₿ {btcPriceGbp.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-sm font-sans text-gray-400">GBP</span>
              </span>
              <span className={`text-xs font-mono font-semibold ${btcPriceChange24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {btcPriceChange24h >= 0 ? '+' : ''}{btcPriceChange24h.toFixed(2)}%
              </span>
            </div>
          </div>

          {/* Ticker 2: Bitcoin Only pledge */}
          <div className="flex items-center gap-3 justify-center text-center md:text-left border-b md:border-b-0 md:border-r border-brand-border pb-4 md:pb-0 md:px-8 w-full md:w-auto">
            <div className="w-10 h-10 rounded-full bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center text-brand-gold font-display font-bold text-lg select-none shrink-0">
              ₿
            </div>
            <div className="space-y-0.5 select-none">
              <h4 className="font-space font-bold text-xs tracking-wider text-white uppercase">
                WE ACCEPT BITCOIN ONLY
              </h4>
              <p className="text-[10px] font-mono text-gray-400">
                NO FIAT. NO COMPROMISE.
              </p>
            </div>
          </div>

          {/* Ticker 3: On-chain Verification assurance */}
          <div className="flex items-center gap-3 justify-center md:justify-end text-center md:text-right md:pl-8 w-full md:w-auto">
            <div className="w-10 h-10 rounded-full bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center text-brand-gold shrink-0">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                <line x1="12" y1="22.08" x2="12" y2="12" />
              </svg>
            </div>
            <div className="space-y-0.5 select-none text-left md:text-right">
              <h4 className="font-space font-bold text-xs tracking-wider text-white uppercase">
                VERIFY ON-CHAIN
              </h4>
              <p className="text-[10px] font-mono text-gray-400">
                TRANSPARENCY. TRUST. FREEDOM.
              </p>
            </div>
          </div>

        </div>
        <div className="max-w-7xl mx-auto px-4 md:px-8 mt-6 pt-4 border-t border-brand-border/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-gray-500 font-mono">
          <span>© 2026 STONEGATE PUB COMPANY LTD • REGISTERED COMPANY #03212892</span>
          <span className="flex items-center gap-1.5">
            <span>Powered by Bitcoin Core v27.0 & Lightning Network</span>
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
          </span>
        </div>
      </footer>

      {/* ================= MODALS OVERLAYS ================= */}

      {/* MODAL 1: OUR PUBS */}
      <Modal
        isOpen={activeModal === 'pubs'}
        onClose={() => setActiveModal(null)}
        title="Stonegate Proper Pubs"
        subtitle="Find a local Web3-enabled pub near you and pay seamlessly on lightning"
      >
        <PubFinder onOrderPint={handlePintOrderedAtTable} />
      </Modal>

      {/* MODAL 2: FOOD & DRINK */}
      <Modal
        isOpen={activeModal === 'menu'}
        onClose={() => setActiveModal(null)}
        title="Gourmet Food & Cask Ale Menu"
        subtitle="Sovereign culinary classics converted in real-time to Bitcoin Satoshis"
      >
        <MenuViewer btcPriceGbp={btcPriceGbp} onBuyItem={handleBuyItem} />
      </Modal>

      {/* MODAL 3: WHAT'S ON */}
      <Modal
        isOpen={activeModal === 'events'}
        onClose={() => setActiveModal(null)}
        title="Live Events & Crypto Meetups"
        subtitle="Weekly Satoshi quizzes, unplugged acoustic folk sessions, and live matches"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="events-grid-panel">
          {EVENTS.map((event) => (
            <div
              key={event.id}
              className="bg-black/30 border border-brand-border hover:border-brand-gold/30 rounded-xl p-5 flex flex-col justify-between transition-all duration-200"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 bg-brand-gold/10 border border-brand-gold/30 text-[8px] font-space font-bold tracking-wider uppercase text-brand-gold rounded">
                    {event.type}
                  </span>
                  {event.badge && (
                    <span className="text-[10px] font-mono text-green-400 font-semibold">
                      ★ {event.badge}
                    </span>
                  )}
                </div>

                <h3 className="font-display text-base font-bold text-white tracking-wide">
                  {event.title}
                </h3>
                <p className="text-xs text-gray-400 font-sans leading-relaxed">
                  {event.description}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-brand-border/60 flex items-center justify-between text-[11px] font-mono text-gray-400">
                <span>{event.date}</span>
                <span>{event.time}</span>
              </div>
            </div>
          ))}
        </div>
      </Modal>

      {/* MODAL 4: LOYALTY */}
      <Modal
        isOpen={activeModal === 'loyalty'}
        onClose={() => setActiveModal(null)}
        title="Web 3.0 Loyalty Perks"
        subtitle="Verify stamp tallies, mint digital collectibles, and manage sovereign status"
      >
        <LoyaltyDashboard
          wallet={wallet}
          onConnectWallet={() => {
            setActiveModal(null);
            setIsWalletModalOpen(true);
          }}
          onMintCollectible={handleMintCollectible}
          onRedeemFreePint={handleRedeemFreePint}
        />
      </Modal>

      {/* MODAL 5: ABOUT US / OUR STORY */}
      <Modal
        isOpen={activeModal === 'story'}
        onClose={() => setActiveModal(null)}
        title="Our Story"
        subtitle="Britain's heritage, forged for the digital renaissance"
      >
        <div className="space-y-6 max-w-2xl mx-auto py-4 text-center md:text-left" id="story-panel">
          <div className="relative w-24 h-24 mx-auto md:float-left md:mr-6 md:mb-4 border-2 border-brand-gold rounded-full flex items-center justify-center font-display text-4xl text-brand-gold bg-black/40 shadow-inner">
            🏰
          </div>
          <div className="space-y-4">
            <h3 className="font-display text-xl font-bold text-brand-gold-light tracking-wide">
              Traditional British Hospitality Meets On-Chain Architecture
            </h3>
            <p className="text-xs text-gray-300 font-sans leading-relaxed text-justify">
              Established in 1996, Stonegate Pub Company has stood as a guardian of the traditional British public house—a cozy sanctuary for communities to gather, converse, and decompress. For decades, we have poured premium cask ales, sizzled artisanal sausages, and fostered neighborhood kinship.
            </p>
            <p className="text-xs text-gray-300 font-sans leading-relaxed text-justify">
              In the early 2020s, we recognized a digital renaissance underway. As financial frameworks shifted towards transparency and autonomy, we asked ourselves: *How can we protect the timeless warmth of our pubs while ensuring they are built to last for generations?*
            </p>
            <p className="text-xs text-gray-300 font-sans leading-relaxed text-justify">
              The answer was Bitcoin. By embracing a secure, open-source protocol for instant digital payments, community governance, and authentic web3 loyalty cards, we have decoupled hospitality from inflationary systems. Today, we stand proud as Britain’s first 100% sovereign pub chain—built for tomorrow, timeless by tradition.
            </p>
          </div>
          <div className="clear-both pt-6 border-t border-brand-border/60 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-brand-gold">🛡️</span>
              <span className="font-space font-semibold text-white uppercase tracking-wider">ESTABLISHED 1996 • RE-ENGINEERED 2026</span>
            </div>
            <button 
              onClick={() => {
                setActiveModal(null);
                setIsWalletModalOpen(true);
              }}
              className="text-brand-gold hover:text-brand-gold-light hover:underline font-space font-bold uppercase tracking-wider text-[11px]"
            >
              Connect to our network &gt;
            </button>
          </div>
        </div>
      </Modal>

      {/* MODAL 6: COMMUNITY GOVERNANCE */}
      <Modal
        isOpen={activeModal === 'governance'}
        onClose={() => setActiveModal(null)}
        title="Stonegate DAO Proposals"
        subtitle="Participate in community governance, propose guest taps, and cast on-chain votes"
      >
        <GovernanceHub
          wallet={wallet}
          proposals={proposals}
          userVotes={userVotes}
          onVote={handleVote}
          onAddProposal={handleAddProposal}
          onConnectWallet={() => {
            setActiveModal(null);
            setIsWalletModalOpen(true);
          }}
        />
      </Modal>

      {/* ================= UTILITY DIALOGS ================= */}

      {/* WALLET CONNECT DIALOG */}
      <WalletConnectModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        onConnectSuccess={handleConnectWalletSuccess}
      />

      {/* LIGHTNING PAYMENTS DIALOG */}
      <LightningPaymentModal
        isOpen={checkoutItem !== null}
        onClose={() => setCheckoutItem(null)}
        itemName={checkoutItem?.name || ''}
        priceSats={checkoutItem?.priceSats || 0}
        onPaymentSuccess={handlePaymentComplete}
      />

    </div>
  );
}
