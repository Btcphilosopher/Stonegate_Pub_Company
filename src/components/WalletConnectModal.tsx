import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Smartphone, ChevronRight, CheckCircle2, ArrowRight } from 'lucide-react';
import { WalletState } from '../types';

interface WalletConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnectSuccess: (walletType: 'MetaMask' | 'UniSat' | 'Leather' | 'Xverse') => void;
}

export default function WalletConnectModal({ isOpen, onClose, onConnectSuccess }: WalletConnectModalProps) {
  const [connectingTo, setConnectingTo] = useState<'MetaMask' | 'UniSat' | 'Leather' | 'Xverse' | null>(null);
  const [step, setStep] = useState<'list' | 'signing' | 'success'>('list');

  const walletOptions = [
    {
      id: 'UniSat' as const,
      name: 'UniSat Wallet',
      description: 'Popular choice for Bitcoin Native Ordinals & BRC-20',
      logoChar: 'U',
      logoBg: 'bg-orange-500/10 border-orange-500/30 text-orange-500'
    },
    {
      id: 'Leather' as const,
      name: 'Leather Wallet',
      description: 'The premier Bitcoin wallet for Stacks & Lightning Network',
      logoChar: 'L',
      logoBg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500'
    },
    {
      id: 'Xverse' as const,
      name: 'Xverse Wallet',
      description: 'Secure, modern Bitcoin wallet for Ordinals & Web3 apps',
      logoChar: 'X',
      logoBg: 'bg-blue-500/10 border-blue-500/30 text-blue-500'
    },
    {
      id: 'MetaMask' as const,
      name: 'MetaMask Snap',
      description: 'Use your existing MetaMask with standard Bitcoin Snaps',
      logoChar: 'M',
      logoBg: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-600'
    }
  ];

  const handleSelect = (walletId: 'MetaMask' | 'UniSat' | 'Leather' | 'Xverse') => {
    setConnectingTo(walletId);
    setStep('signing');

    // Simulate connection / signing steps
    setTimeout(() => {
      setStep('success');
      setTimeout(() => {
        onConnectSuccess(walletId);
        // Reset state for next use
        setConnectingTo(null);
        setStep('list');
        onClose();
      }, 1500);
    }, 1800);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-55 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        onClick={() => step !== 'signing' && onClose()}
        className="fixed inset-0 bg-black/90 backdrop-blur-md" 
      />

      {/* Container */}
      <div className="relative w-full max-w-md p-6 bg-brand-panel border border-brand-border rounded-2xl text-white shadow-2xl z-10 overflow-hidden">
        
        {step === 'list' && (
          <div className="space-y-6" id="wallet-connect-list">
            <div className="space-y-1 text-center">
              <h3 className="font-display text-xl font-bold tracking-wide text-brand-gold-light">
                Connect Bitcoin Wallet
              </h3>
              <p className="text-xs text-gray-400 font-sans">
                Select your preferred Web3 provider to authorize secure on-chain actions
              </p>
            </div>

            {/* List */}
            <div className="space-y-3">
              {walletOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleSelect(opt.id)}
                  className="w-full p-3.5 flex items-center justify-between border border-brand-border hover:border-brand-gold/60 bg-black/20 hover:bg-black/40 rounded-xl transition-all duration-200 group text-left cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-display font-bold text-lg border ${opt.logoBg}`}>
                      {opt.logoChar}
                    </div>
                    <div>
                      <h4 className="font-space font-semibold text-xs text-gray-200 group-hover:text-brand-gold transition-colors duration-150">
                        {opt.name}
                      </h4>
                      <p className="text-[10px] text-gray-400 font-sans leading-tight mt-0.5 max-w-[240px]">
                        {opt.description}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-brand-gold group-hover:translate-x-1 transition-all duration-150" />
                </button>
              ))}
            </div>

            <div className="pt-3 border-t border-brand-border/60 flex items-center gap-2 text-[10px] text-gray-400 font-sans justify-center">
              <Shield className="w-3.5 h-3.5 text-brand-gold" />
              <span>Cryptographically secured. We never access your private keys.</span>
            </div>
          </div>
        )}

        {step === 'signing' && (
          <div className="py-8 text-center space-y-6 animate-pulse" id="wallet-connecting-signing">
            <div className="relative w-16 h-16 mx-auto flex items-center justify-center border-2 border-brand-gold/20 border-t-brand-gold rounded-full animate-spin" />
            <div className="space-y-2">
              <h4 className="font-space font-bold text-sm text-brand-gold-light">
                Connecting {connectingTo}...
              </h4>
              <p className="text-xs text-gray-400 font-sans max-w-[280px] mx-auto leading-relaxed">
                Please approve the secure signature request in your wallet extension.
              </p>
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="py-8 text-center space-y-5" id="wallet-connect-success">
            <div className="w-16 h-16 mx-auto bg-green-500/10 border border-green-500/30 rounded-full flex items-center justify-center text-green-400 animate-scaleUp">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-1.5">
              <h4 className="font-space font-bold text-sm text-green-400">
                Wallet Successfully Linked!
              </h4>
              <p className="text-[11px] text-gray-400 font-mono">
                Session active via secure RPC handshake.
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
