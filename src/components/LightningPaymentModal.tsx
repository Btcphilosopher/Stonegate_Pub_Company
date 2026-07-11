import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { QrCode, Copy, Check, Clock, ShieldCheck, Zap, AlertCircle } from 'lucide-react';

interface LightningPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemName: string;
  priceSats: number;
  onPaymentSuccess: () => void;
}

export default function LightningPaymentModal({
  isOpen,
  onClose,
  itemName,
  priceSats,
  onPaymentSuccess
}: LightningPaymentModalProps) {
  const [copied, setCopied] = useState(false);
  const [timer, setTimer] = useState(120); // 2 minutes countdown
  const [status, setStatus] = useState<'pending' | 'broadcasting' | 'confirming' | 'paid'>('pending');

  const invoiceStr = `lnbc${priceSats}n1p39xf79q2grst8wz29y68s7p3y4f9xgm9d...sg_pub`;

  useEffect(() => {
    if (!isOpen) return;

    // Reset state
    setTimer(120);
    setStatus('pending');
    setCopied(false);

    // Countdown interval
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen]);

  const handleCopy = () => {
    navigator.clipboard.writeText(invoiceStr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulatePayment = () => {
    setStatus('broadcasting');

    setTimeout(() => {
      setStatus('confirming');

      setTimeout(() => {
        setStatus('paid');
        setTimeout(() => {
          onPaymentSuccess();
          onClose();
        }, 1500);
      }, 1200);
    }, 1000);
  };

  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-55 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        onClick={() => status === 'pending' && onClose()}
        className="fixed inset-0 bg-black/90 backdrop-blur-md" 
      />

      {/* Container */}
      <div className="relative w-full max-w-md p-6 bg-brand-panel border border-brand-border rounded-2xl text-white shadow-2xl z-10 overflow-hidden">
        
        {status === 'pending' && (
          <div className="space-y-5" id="lightning-pending-state">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-brand-gold font-space font-bold text-xs uppercase tracking-wider">
                <Zap className="w-4 h-4 fill-brand-gold animate-bounce" />
                <span>Lightning Invoice</span>
              </div>
              <div className="flex items-center gap-1.5 px-2 py-0.5 bg-black/40 border border-brand-border rounded text-[10px] font-mono text-gray-400">
                <Clock className="w-3.5 h-3.5 text-brand-gold" />
                <span>{formatTime(timer)}</span>
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="font-display text-lg font-semibold text-white tracking-wide">
                {itemName}
              </h3>
              <div className="text-xl font-mono font-bold text-brand-gold-light">
                {priceSats.toLocaleString()} Sats
              </div>
            </div>

            {/* Simulated QR Code Canvas */}
            <div className="relative w-48 h-48 mx-auto p-3 bg-white rounded-xl border-4 border-brand-gold/40 flex items-center justify-center shadow-lg shadow-brand-gold/5 group">
              {/* Complex SVG representation of QR code with Bitcoin icon inside */}
              <svg className="w-full h-full text-black" viewBox="0 0 100 100" fill="currentColor">
                {/* QR corner squares */}
                <rect x="5" y="5" width="25" height="25" fill="black" />
                <rect x="9" y="9" width="17" height="17" fill="white" />
                <rect x="13" y="13" width="9" height="9" fill="black" />

                <rect x="70" y="5" width="25" height="25" fill="black" />
                <rect x="74" y="9" width="17" height="17" fill="white" />
                <rect x="78" y="13" width="9" height="9" fill="black" />

                <rect x="5" y="70" width="25" height="25" fill="black" />
                <rect x="9" y="74" width="17" height="17" fill="white" />
                <rect x="13" y="78" width="9" height="9" fill="black" />

                {/* Simulated random qr pixel dots */}
                <path d="M35 5h10v5h-10zm20 0h10v5h-10zm5 5h5v5h-5zm-25 10h5v15h-5zm10 5h15v5h-15zm10 10h5v10h-5zm-25 15h10v5h-10zm20 0h15v5h-15zm-15 10h5v5h-5zm25 0h10v10h-10zm-35 5h5v5h-5zm25 5h5v5h-5zm-20 10h15v5h-15zm20 0h10v5h-10z" />
                <path d="M5 35h5v5h-5zm10 5h15v5h-15zm10 10h5v10h-5zm-25 15h10v5h-10zm20 0h15v5h-15zm-15 10h5v5h-5zm25 0h10v10h-10zm-35 5h5v5h-5zm25 5h5v5h-5zm-20 10h15v5h-15zm20 0h10v5h-10z" />
                <path d="M45 45h10v10H45z" fill="white" />
              </svg>
              {/* Bitcoin icon overlay in center */}
              <div className="absolute inset-0 m-auto w-10 h-10 rounded-full bg-brand-bg border-2 border-brand-gold flex items-center justify-center font-display font-bold text-brand-gold text-lg shadow-lg">
                ₿
              </div>
            </div>

            {/* Input field copy option */}
            <div className="space-y-1.5">
              <span className="text-[9px] text-gray-400 uppercase font-space tracking-wide">Invoice String</span>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={invoiceStr}
                  className="flex-1 px-3 py-1.5 bg-black/40 border border-brand-border rounded-lg text-[10px] font-mono text-gray-300 overflow-hidden text-ellipsis focus:outline-none"
                />
                <button
                  onClick={handleCopy}
                  className="p-1.5 border border-brand-border hover:border-brand-gold hover:bg-brand-border/30 rounded-lg text-gray-400 hover:text-white transition-all duration-200"
                  title="Copy Invoice"
                >
                  {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Simulation Action Button */}
            <button
              onClick={handleSimulatePayment}
              className="w-full py-2.5 bg-brand-gold hover:bg-brand-gold-light text-brand-bg text-xs font-space font-bold tracking-wider uppercase rounded-lg shadow-md transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Simulate Node Payment</span>
            </button>
          </div>
        )}

        {status === 'broadcasting' && (
          <div className="py-8 text-center space-y-5 animate-pulse" id="payment-broadcasting">
            <div className="w-16 h-16 mx-auto border-2 border-brand-gold/20 border-t-brand-gold rounded-full animate-spin" />
            <div className="space-y-1">
              <h4 className="font-space font-bold text-sm text-brand-gold-light">
                Broadcasting Payment...
              </h4>
              <p className="text-xs text-gray-400 font-sans">
                Scanning Peer Gossip Protocols
              </p>
            </div>
          </div>
        )}

        {status === 'confirming' && (
          <div className="py-8 text-center space-y-5" id="payment-confirming">
            <div className="w-16 h-16 mx-auto border-2 border-brand-gold/20 border-t-brand-gold rounded-full animate-spin" />
            <div className="space-y-1">
              <h4 className="font-space font-bold text-sm text-brand-gold-light">
                Settling HTLCs...
              </h4>
              <p className="text-xs text-gray-400 font-sans">
                Confirming atomic invoice state transition on local channel
              </p>
            </div>
          </div>
        )}

        {status === 'paid' && (
          <div className="py-8 text-center space-y-5" id="payment-paid">
            <div className="w-16 h-16 mx-auto bg-green-500/10 border border-green-500/30 rounded-full flex items-center justify-center text-green-400 animate-scaleUp">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div className="space-y-1.5">
              <h4 className="font-space font-bold text-sm text-green-400">
                Invoice Settled!
              </h4>
              <p className="text-[11px] text-gray-400 font-sans">
                Receipt logged, pint stamp appended to your wallet.
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
