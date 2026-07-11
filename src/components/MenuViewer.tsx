import React, { useState } from 'react';
import { Beer, Coffee, ShieldCheck, Flame, ShoppingBag, CreditCard } from 'lucide-react';
import { MenuItem } from '../types';
import { MENU_ITEMS } from '../data';

interface MenuViewerProps {
  btcPriceGbp: number;
  onBuyItem: (item: MenuItem, priceSats: number) => void;
}

export default function MenuViewer({ btcPriceGbp, onBuyItem }: MenuViewerProps) {
  const [activeCategory, setActiveCategory] = useState<'beers' | 'spirits' | 'pub-classics' | 'desserts'>('beers');

  // Calculates Satoshis from GBP
  const getSatoshiPrice = (priceGbp: number) => {
    if (!btcPriceGbp || btcPriceGbp <= 0) return 0;
    // 1 BTC = 100,000,000 Satoshis
    // satoshis = (priceGbp / btcPriceGbp) * 100,000,000
    return Math.round((priceGbp / btcPriceGbp) * 100000000);
  };

  const categories = [
    { id: 'beers', label: 'Cask & Craft Beers', icon: Beer },
    { id: 'spirits', label: 'Sovereign Spirits', icon: Coffee },
    { id: 'pub-classics', label: 'Heritage Classics', icon: Flame },
    { id: 'desserts', label: 'Timeless Desserts', icon: ShieldCheck }
  ];

  const filteredItems = MENU_ITEMS.filter((item) => item.category === activeCategory);

  return (
    <div className="space-y-6" id="menu-viewer-container">
      {/* Category Tabs */}
      <div className="flex flex-wrap md:flex-nowrap gap-2 border-b border-brand-border pb-4 overflow-x-auto scrollbar-none" id="menu-categories">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-space font-semibold tracking-wider uppercase whitespace-nowrap transition-all duration-200 border ${
                activeCategory === cat.id
                  ? 'bg-brand-gold border-brand-gold text-brand-bg shadow-lg shadow-brand-gold/15'
                  : 'bg-transparent border-brand-border text-gray-400 hover:text-white hover:border-brand-gold/40'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Grid of Menu Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="menu-items-grid">
        {filteredItems.map((item) => {
          const satoshiPrice = getSatoshiPrice(item.priceGbp);
          return (
            <div
              key={item.id}
              className="relative flex flex-col justify-between bg-black/40 border border-brand-border rounded-xl p-5 hover:border-brand-gold/30 transition-all duration-300 group"
            >
              {item.isSpecial && (
                <div className="absolute top-3 right-3 px-1.5 py-0.5 bg-brand-gold/10 border border-brand-gold/30 text-[8px] font-space font-bold tracking-widest uppercase text-brand-gold rounded">
                  Chef's Choice
                </div>
              )}

              <div className="space-y-2">
                <h3 className="font-display text-base font-semibold text-white tracking-wide group-hover:text-brand-gold transition-colors duration-200">
                  {item.name}
                </h3>
                <p className="text-xs text-gray-400 font-sans leading-relaxed pr-10">
                  {item.description}
                </p>
              </div>

              {/* Price & Pay Action */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mt-6 pt-4 border-t border-brand-border/60">
                <div className="space-y-1">
                  {/* GBP Price */}
                  <div className="text-sm font-space font-semibold text-white">
                    £{item.priceGbp.toFixed(2)}
                  </div>
                  {/* Satoshis Price */}
                  <div className="text-[10px] font-mono text-brand-gold font-medium flex items-center gap-1">
                    <span>⚡</span>
                    <span>{satoshiPrice.toLocaleString()} sats</span>
                  </div>
                </div>

                {/* Instant Lightning Checkout */}
                <button
                  onClick={() => onBuyItem(item, satoshiPrice)}
                  className="w-full sm:w-auto px-4 py-2 bg-brand-gold text-brand-bg hover:bg-brand-gold-light text-[10px] font-space font-bold tracking-wider uppercase rounded-lg shadow-md transition-all duration-200 flex items-center justify-center gap-1.5"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Buy with Lightning</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
