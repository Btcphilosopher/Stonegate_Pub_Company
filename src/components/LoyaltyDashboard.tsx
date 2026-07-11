import React, { useState } from 'react';
import { Shield, Sparkles, Award, Gift, Gem, ArrowRight } from 'lucide-react';
import { WalletState, Collectible } from '../types';
import { COLLECTIBLES } from '../data';

interface LoyaltyDashboardProps {
  wallet: WalletState;
  onConnectWallet: () => void;
  onMintCollectible: (collectible: Collectible) => void;
  onRedeemFreePint: () => void;
}

export default function LoyaltyDashboard({
  wallet,
  onConnectWallet,
  onMintCollectible,
  onRedeemFreePint
}: LoyaltyDashboardProps) {
  const [activeTab, setActiveTab] = useState<'stamps' | 'collectibles'>('stamps');

  // We have a static list of collectibles, but we can enrich it with local states (mint count) in App.tsx
  // Let's assume the component gets mint state directly or tracks it nicely. We'll use the static list and mark owned if wallet.mintedIds has it.

  return (
    <div className="space-y-6" id="loyalty-dashboard-container">
      {/* Secondary Tabs */}
      <div className="flex gap-4 border-b border-brand-border/60 pb-3">
        <button
          onClick={() => setActiveTab('stamps')}
          className={`pb-2.5 text-xs font-space font-semibold tracking-wider uppercase border-b-2 transition-all duration-200 ${
            activeTab === 'stamps'
              ? 'text-brand-gold border-brand-gold'
              : 'text-gray-400 border-transparent hover:text-white'
          }`}
          id="loyalty-tab-stamps"
        >
          🍺 Digital Stamp Card
        </button>
        <button
          onClick={() => setActiveTab('collectibles')}
          className={`pb-2.5 text-xs font-space font-semibold tracking-wider uppercase border-b-2 transition-all duration-200 ${
            activeTab === 'collectibles'
              ? 'text-brand-gold border-brand-gold'
              : 'text-gray-400 border-transparent hover:text-white'
          }`}
          id="loyalty-tab-collectibles"
        >
          💎 Digital Collectibles (NFTs)
        </button>
      </div>

      {activeTab === 'stamps' ? (
        <div className="space-y-6" id="stamps-panel">
          {/* Main Stamp Card Area */}
          <div className="bg-black/40 border border-brand-border rounded-xl p-6 md:p-8 flex flex-col md:flex-row gap-8 items-center justify-between">
            <div className="space-y-4 max-w-md">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-gold/10 border border-brand-gold/30 rounded-full text-[10px] font-space font-bold tracking-wider uppercase text-brand-gold">
                <Award className="w-3.5 h-3.5" />
                <span>Stonegate Web3 Club</span>
              </div>
              <h3 className="font-display text-2xl font-bold text-white tracking-wide">
                Patron Stamp Card
              </h3>
              <p className="text-xs text-gray-400 font-sans leading-relaxed">
                Earn 1 digital stamp for every craft pint or gourmet meal ordered via Lightning, and 3 stamps for every limited NFT minted. Redeem 10 stamps for an exclusive complimentary cask ale or classic roast dinner.
              </p>

              {wallet.connected && wallet.stampCount >= 10 ? (
                <button
                  onClick={onRedeemFreePint}
                  className="px-5 py-2.5 bg-green-500 hover:bg-green-400 text-brand-bg text-[10px] font-space font-bold tracking-wider uppercase rounded-lg shadow-lg shadow-green-500/20 transition-all duration-200 flex items-center gap-1.5 cursor-pointer animate-bounce"
                >
                  <Gift className="w-4 h-4 animate-spin" />
                  <span>Redeem Complimentary Pint Now</span>
                </button>
              ) : !wallet.connected ? (
                <button
                  onClick={onConnectWallet}
                  className="px-5 py-2.5 bg-brand-gold text-brand-bg hover:bg-brand-gold-light text-[10px] font-space font-bold tracking-wider uppercase rounded-lg shadow-md transition-all duration-200 flex items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Connect Wallet to Access Stamp Card</span>
                </button>
              ) : (
                <div className="text-[11px] text-brand-gold font-medium font-sans flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-brand-gold animate-ping" />
                  <span>Collect {10 - wallet.stampCount} more stamps to unlock your reward!</span>
                </div>
              )}
            </div>

            {/* Stamp Slots Grid */}
            <div className="w-full max-w-sm">
              <div className="grid grid-cols-5 gap-3 p-4 bg-brand-panel border border-brand-border/60 rounded-xl justify-items-center">
                {Array.from({ length: 10 }).map((_, idx) => {
                  const isStamped = wallet.connected && wallet.stampCount > idx;
                  return (
                    <div
                      key={idx}
                      className={`relative w-12 h-12 rounded-full flex items-center justify-center border transition-all duration-300 ${
                        isStamped
                          ? 'bg-brand-gold border-brand-gold shadow-lg shadow-brand-gold/15 scale-105'
                          : 'bg-black/40 border-brand-border text-gray-500'
                      }`}
                      title={isStamped ? 'Stamp Earned!' : 'Empty Slot'}
                    >
                      {isStamped ? (
                        <span className="text-brand-bg text-sm font-bold">🍺</span>
                      ) : (
                        <span className="font-mono text-[10px]">{idx + 1}</span>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="mt-3 flex justify-between text-[10px] text-gray-400 font-mono">
                <span>0 / 10 STAMPS</span>
                <span>COMPLIMENTARY LEVEL</span>
              </div>
            </div>
          </div>

          {/* Perks explanation section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 border border-brand-border bg-black/20 rounded-xl space-y-2">
              <div className="w-8 h-8 rounded bg-brand-gold/10 flex items-center justify-center text-brand-gold">
                <Shield className="w-4 h-4" />
              </div>
              <h4 className="font-display font-semibold text-white tracking-wide text-sm">On-Chain Identity</h4>
              <p className="text-xs text-gray-400 font-sans leading-relaxed">
                Your loyalty status is tied secure-first to your sovereign Bitcoin key. No email, no trackers, absolute privacy.
              </p>
            </div>

            <div className="p-5 border border-brand-border bg-black/20 rounded-xl space-y-2">
              <div className="w-8 h-8 rounded bg-brand-gold/10 flex items-center justify-center text-brand-gold">
                <Gift className="w-4 h-4" />
              </div>
              <h4 className="font-display font-semibold text-white tracking-wide text-sm">Real-World Utility</h4>
              <p className="text-xs text-gray-400 font-sans leading-relaxed">
                Enjoy complimentary beers, custom-engraved tankards kept at the bar, and VIP booking options.
              </p>
            </div>

            <div className="p-5 border border-brand-border bg-black/20 rounded-xl space-y-2">
              <div className="w-8 h-8 rounded bg-brand-gold/10 flex items-center justify-center text-brand-gold">
                <Gem className="w-4 h-4" />
              </div>
              <h4 className="font-display font-semibold text-white tracking-wide text-sm">True Asset Ownership</h4>
              <p className="text-xs text-gray-400 font-sans leading-relaxed">
                Trade, sell, or keep your digital collectibles on secondary markets or use them across any participating Stonegate pub.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="collectibles-panel">
          {COLLECTIBLES.map((collectible) => {
            const isOwned = wallet.connected && wallet.mintedIds.includes(collectible.id);
            return (
              <div
                key={collectible.id}
                className="flex flex-col justify-between border border-brand-border bg-black/40 hover:border-brand-gold/40 rounded-xl overflow-hidden group transition-all duration-300"
              >
                {/* Collectible Visual Header */}
                <div className="relative h-48 bg-gradient-to-b from-brand-border/40 to-black/20 flex items-center justify-center">
                  <div className="text-center space-y-2">
                    {/* Simulated artistic rendering based on seed */}
                    {collectible.imageSeed === 'tankard' ? (
                      <span className="text-6xl group-hover:scale-110 transition-transform duration-300 inline-block">🍺</span>
                    ) : collectible.imageSeed === 'coaster' ? (
                      <span className="text-6xl group-hover:scale-110 transition-transform duration-300 inline-block">🪙</span>
                    ) : (
                      <span className="text-6xl group-hover:scale-110 transition-transform duration-300 inline-block">🏺</span>
                    )}
                    <div className="text-[10px] font-mono text-brand-gold font-bold tracking-widest uppercase">
                      LIMITED NFT
                    </div>
                  </div>

                  {/* Supply Badge */}
                  <div className="absolute top-3 right-3 px-2 py-0.5 bg-black/85 border border-brand-border text-[9px] font-mono text-gray-400 rounded">
                    {collectible.mintedCount} / {collectible.totalQuantity} MINTED
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-display text-base font-semibold text-white tracking-wide">
                      {collectible.name}
                    </h4>
                    <p className="text-xs text-gray-400 font-sans leading-relaxed">
                      {collectible.description}
                    </p>

                    {/* Perks List */}
                    <div className="pt-2 space-y-1.5">
                      <div className="text-[10px] font-space font-bold tracking-wider uppercase text-brand-gold">
                        Holder Perks:
                      </div>
                      <ul className="space-y-1 text-[11px] text-gray-300 font-sans">
                        {collectible.perks.map((perk, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-brand-gold">✓</span>
                            <span>{perk}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-brand-border/60 flex items-center justify-between gap-3">
                    <div className="space-y-0.5">
                      <span className="text-[9px] text-gray-400 uppercase font-sans">MINT PRICE</span>
                      <div className="text-xs font-mono font-bold text-brand-gold">
                        {(collectible.priceSatoshis / 100000000).toFixed(4)} BTC
                      </div>
                      <div className="text-[10px] text-gray-400 font-mono">
                        ({collectible.priceSatoshis.toLocaleString()} sats)
                      </div>
                    </div>

                    {isOwned ? (
                      <button
                        disabled
                        className="px-4 py-2 bg-green-500/20 border border-green-500/30 text-green-400 text-[10px] font-space font-bold tracking-wider uppercase rounded-lg cursor-not-allowed"
                      >
                        Owned ✓
                      </button>
                    ) : (
                      <button
                        onClick={() => onMintCollectible(collectible)}
                        className="px-4 py-2 bg-brand-gold text-brand-bg hover:bg-brand-gold-light text-[10px] font-space font-bold tracking-wider uppercase rounded-lg transition-all duration-200 shadow-md flex items-center gap-1 cursor-pointer"
                      >
                        <span>Mint NFT</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
