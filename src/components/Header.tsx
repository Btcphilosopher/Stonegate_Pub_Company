import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Coins, ChevronDown, LogOut, Wallet, CheckCircle } from 'lucide-react';
import { WalletState } from '../types';

interface HeaderProps {
  wallet: WalletState;
  onConnectClick: () => void;
  onDisconnectClick: () => void;
  btcPriceGbp: number;
  btcPriceChange24h: number;
  onNavClick: (view: 'pubs' | 'menu' | 'events' | 'loyalty' | 'story' | 'governance') => void;
}

export default function Header({
  wallet,
  onConnectClick,
  onDisconnectClick,
  btcPriceGbp,
  btcPriceChange24h,
  onNavClick
}: HeaderProps) {
  const [showBtcDropdown, setShowBtcDropdown] = useState(false);
  const [showWalletDropdown, setShowWalletDropdown] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-brand-bg/95 backdrop-blur-md border-b border-brand-border/60 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
        
        {/* Left: Logo */}
        <div 
          onClick={() => onNavClick('story')} 
          className="flex items-center gap-3 cursor-pointer group"
          id="header-logo-container"
        >
          {/* Detailed SVG Crest to match the design shield exactly */}
          <div className="relative w-12 h-12 flex items-center justify-center border border-brand-gold/30 rounded-lg bg-black/40 group-hover:border-brand-gold/80 transition-all duration-300">
            <svg 
              className="w-8 h-8 text-brand-gold group-hover:scale-105 transition-transform duration-300"
              viewBox="0 0 100 100" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Outer shield boundary */}
              <path 
                d="M50 5 L85 20 C85 55 50 92 50 92 C50 92 15 55 15 20 L50 5Z" 
                stroke="currentColor" 
                strokeWidth="4" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
              {/* Internal decorative lines */}
              <path d="M50 5 V92" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
              <path d="M15 20 Q50 35 85 20" stroke="currentColor" strokeWidth="2" />
              {/* Stonegate Crown in center */}
              <path 
                d="M38 52 L42 42 L50 48 L58 42 L62 52 H38Z" 
                fill="currentColor" 
                opacity="0.9"
              />
              <circle cx="50" cy="34" r="4" fill="currentColor" />
              <circle cx="34" cy="42" r="2.5" fill="currentColor" />
              <circle cx="66" cy="42" r="2.5" fill="currentColor" />
              {/* Crossed Keys or Traditional Swords pattern */}
              <path d="M35 70 L65 40" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M65 70 L35 40" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
          <div className="flex flex-col select-none">
            <span className="font-display text-xl md:text-2xl font-bold tracking-widest text-white leading-none">
              STONEGATE
            </span>
            <span className="text-[9px] font-sans text-brand-gold tracking-[0.25em] font-semibold mt-1">
              PUB COMPANY
            </span>
          </div>
        </div>

        {/* Middle: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-8 text-xs font-semibold tracking-[0.2em] text-gray-400">
          <button
            onClick={() => onNavClick('pubs')}
            className="hover:text-brand-gold hover:tracking-[0.25em] transition-all duration-300 py-2 cursor-pointer uppercase border-b-2 border-transparent hover:border-brand-gold/40"
            id="nav-our-pubs"
          >
            Our Pubs
          </button>
          <button
            onClick={() => onNavClick('menu')}
            className="hover:text-brand-gold hover:tracking-[0.25em] transition-all duration-300 py-2 cursor-pointer uppercase border-b-2 border-transparent hover:border-brand-gold/40"
            id="nav-food-drink"
          >
            Food & Drink
          </button>
          <button
            onClick={() => onNavClick('events')}
            className="hover:text-brand-gold hover:tracking-[0.25em] transition-all duration-300 py-2 cursor-pointer uppercase border-b-2 border-transparent hover:border-brand-gold/40"
            id="nav-whats-on"
          >
            What's On
          </button>
          <button
            onClick={() => onNavClick('loyalty')}
            className="hover:text-brand-gold hover:tracking-[0.25em] transition-all duration-300 py-2 cursor-pointer uppercase border-b-2 border-transparent hover:border-brand-gold/40"
            id="nav-loyalty"
          >
            Loyalty
          </button>
          <button
            onClick={() => onNavClick('story')}
            className="hover:text-brand-gold hover:tracking-[0.25em] transition-all duration-300 py-2 cursor-pointer uppercase border-b-2 border-transparent hover:border-brand-gold/40"
            id="nav-about-us"
          >
            About Us
          </button>
        </nav>

        {/* Right: Quick BTC rate widget and Wallet connection */}
        <div className="flex items-center gap-3">
          
          {/* BTC Price dropdown wrapper */}
          <div className="relative">
            <button
              onClick={() => setShowBtcDropdown(!showBtcDropdown)}
              onBlur={() => setTimeout(() => setShowBtcDropdown(false), 200)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-brand-border bg-black/40 text-xs font-space font-medium text-brand-gold hover:border-brand-gold/50 transition-all duration-200"
              id="btc-rate-toggle"
            >
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-brand-gold/10 text-brand-gold">
                ₿
              </span>
              <span>BTC</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-60" />
            </button>

            <AnimatePresence>
              {showBtcDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-56 p-4 rounded-xl border border-brand-border bg-brand-panel text-white shadow-xl z-50 text-xs"
                >
                  <p className="text-[10px] text-gray-400 font-sans tracking-wide uppercase mb-2">Live Bitcoin Exchange</p>
                  <div className="flex items-center justify-between mb-1.5 font-mono">
                    <span className="text-gray-400">GBP (🇬🇧)</span>
                    <span className="font-semibold text-brand-gold">£{btcPriceGbp.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex items-center justify-between mb-3 font-mono">
                    <span className="text-gray-400">USD (🇺🇸)</span>
                    <span className="font-semibold text-gray-200">${(btcPriceGbp * 1.28).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="border-t border-brand-border pt-2 flex items-center justify-between text-[10px] font-sans text-gray-400">
                    <span>24h Change</span>
                    <span className={`font-mono font-medium ${btcPriceChange24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {btcPriceChange24h >= 0 ? '+' : ''}{btcPriceChange24h.toFixed(2)}%
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Wallet Connection */}
          {!wallet.connected ? (
            <button
              onClick={onConnectClick}
              className="px-4 py-2 border border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-brand-bg text-xs font-semibold tracking-wider uppercase rounded-lg shadow-lg hover:shadow-brand-gold/20 transition-all duration-300"
              id="connect-wallet-btn"
            >
              Connect Wallet
            </button>
          ) : (
            <div className="relative">
              <button
                onClick={() => setShowWalletDropdown(!showWalletDropdown)}
                onBlur={() => setTimeout(() => setShowWalletDropdown(false), 200)}
                className="flex items-center gap-2 px-4 py-2 border border-green-500/40 rounded-lg bg-green-500/5 text-xs text-green-400 font-mono hover:border-green-400 hover:bg-green-500/10 transition-all duration-200"
                id="wallet-connected-indicator"
              >
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span>{wallet.address?.slice(0, 6)}...{wallet.address?.slice(-4)}</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-60" />
              </button>

              <AnimatePresence>
                {showWalletDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-64 p-4 rounded-xl border border-brand-border bg-brand-panel text-white shadow-xl z-50 text-xs"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <Wallet className="w-4 h-4 text-brand-gold" />
                      <span className="font-semibold text-gray-200 font-space">{wallet.walletType} Connected</span>
                    </div>

                    <div className="p-2 bg-black/40 rounded-lg border border-brand-border font-mono mb-3 text-[10px] break-all select-all">
                      {wallet.address}
                    </div>

                    <div className="space-y-1.5 border-t border-brand-border pt-3 mb-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Balance:</span>
                        <span className="font-mono font-medium text-brand-gold">₿ {wallet.balanceBtc.toFixed(4)} BTC</span>
                      </div>
                      <div className="flex justify-between text-[11px]">
                        <span className="text-gray-400">Satoshis:</span>
                        <span className="font-mono text-gray-300">{wallet.balanceSatoshis.toLocaleString()} sats</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Loyalty Stamps:</span>
                        <span className="font-mono text-brand-gold-light font-semibold">{wallet.stampCount} / 10 🍺</span>
                      </div>
                    </div>

                    <button
                      onClick={onDisconnectClick}
                      className="w-full py-1.5 border border-red-500/30 rounded-lg text-red-400 hover:text-white hover:bg-red-500/20 text-center flex items-center justify-center gap-2 font-semibold transition-all duration-200 cursor-pointer"
                      id="disconnect-wallet-action"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Disconnect</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

        </div>
      </div>
    </header>
  );
}
