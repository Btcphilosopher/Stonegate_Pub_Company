import React, { useState } from 'react';
import { Plus, MessageSquare, Clock, ThumbsUp, ThumbsDown, CheckCircle, Vote, AlertTriangle } from 'lucide-react';
import { Proposal, WalletState } from '../types';

interface GovernanceHubProps {
  wallet: WalletState;
  proposals: Proposal[];
  userVotes: Record<string, 'yes' | 'no'>;
  onVote: (proposalId: string, choice: 'yes' | 'no') => void;
  onAddProposal: (title: string, desc: string, category: 'beers' | 'events' | 'facilities' | 'governance') => void;
  onConnectWallet: () => void;
}

export default function GovernanceHub({
  wallet,
  proposals,
  userVotes,
  onVote,
  onAddProposal,
  onConnectWallet
}: GovernanceHubProps) {
  const [showForm, setShowForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState<'beers' | 'events' | 'facilities' | 'governance'>('beers');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDesc) return;
    onAddProposal(newTitle, newDesc, newCategory);
    setNewTitle('');
    setNewDesc('');
    setShowForm(false);
  };

  return (
    <div className="space-y-6" id="governance-hub-container">
      {/* Intro section */}
      <div className="bg-gradient-to-r from-black/50 to-brand-panel p-6 rounded-xl border border-brand-border/60 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
        <div className="space-y-2 max-w-xl">
          <h3 className="font-display text-xl font-bold text-white tracking-wide flex items-center gap-2">
            <Vote className="w-5 h-5 text-brand-gold" />
            <span>Community Governance Hub</span>
          </h3>
          <p className="text-xs text-gray-400 font-sans leading-relaxed">
            Stonegate Pub Company is UK's first co-governed hospitality group. Bitcoin patrons can suggest menu updates, events, or facility upgrades. Voting weight is proportional to your connected satoshi balance.
          </p>
        </div>

        {!wallet.connected ? (
          <button
            onClick={onConnectWallet}
            className="px-4 py-2 bg-brand-gold text-brand-bg hover:bg-brand-gold-light text-[10px] font-space font-bold tracking-wider uppercase rounded-lg shadow-md transition-all duration-200 cursor-pointer shrink-0"
          >
            Connect Wallet to Vote
          </button>
        ) : (
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-brand-gold/10 hover:bg-brand-gold text-brand-gold hover:text-brand-bg border border-brand-gold/20 hover:border-brand-gold text-[10px] font-space font-bold tracking-wider uppercase rounded-lg transition-all duration-200 cursor-pointer shrink-0 flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Create Proposal</span>
          </button>
        )}
      </div>

      {/* New Proposal Form */}
      {showForm && wallet.connected && (
        <form onSubmit={handleSubmit} className="bg-black/40 border border-brand-border rounded-xl p-5 space-y-4 animate-fadeIn">
          <h4 className="font-display font-semibold text-white text-sm">Submit New Community Proposal</h4>
          
          <div className="space-y-1">
            <label className="text-[10px] font-space text-gray-400 uppercase">Proposal Title</label>
            <input
              type="text"
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. Add locally crafted Organic IPA guest tap"
              className="w-full px-3 py-2 bg-brand-panel border border-brand-border rounded-lg text-xs font-sans text-white placeholder-gray-500 focus:outline-none focus:border-brand-gold"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-space text-gray-400 uppercase">Category</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as any)}
                className="w-full px-3 py-2 bg-brand-panel border border-brand-border rounded-lg text-xs font-sans text-white focus:outline-none focus:border-brand-gold"
              >
                <option value="beers">Cask & Guest Beers</option>
                <option value="events">Live Events & Meetups</option>
                <option value="facilities">Pub Facilities & Upgrades</option>
                <option value="governance">DAO Treasury & Rules</option>
              </select>
            </div>
            
            <div className="space-y-1 flex items-end">
              <div className="text-[10px] text-gray-400 flex items-center gap-1.5 mb-2.5">
                <AlertTriangle className="w-3.5 h-3.5 text-brand-gold" />
                <span>Requires a deposit of 5,000 Sats (simulated)</span>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-space text-gray-400 uppercase">Detailed Description</label>
            <textarea
              required
              rows={3}
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              placeholder="Provide context, costs, or partner breweries who will fulfill the project..."
              className="w-full px-3 py-2 bg-brand-panel border border-brand-border rounded-lg text-xs font-sans text-white placeholder-gray-500 focus:outline-none focus:border-brand-gold"
            />
          </div>

          <div className="flex gap-2 justify-end pt-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-1.5 border border-brand-border rounded-lg text-[10px] font-space text-gray-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-brand-gold text-brand-bg hover:bg-brand-gold-light text-[10px] font-space font-bold uppercase rounded-lg"
            >
              Submit Proposal
            </button>
          </div>
        </form>
      )}

      {/* Proposals list */}
      <div className="space-y-5" id="proposals-list">
        {proposals.map((prop) => {
          const userVote = userVotes[prop.id];
          const totalVotes = prop.votesYes + prop.votesNo;
          const yesPercent = totalVotes > 0 ? Math.round((prop.votesYes / totalVotes) * 100) : 0;
          const noPercent = totalVotes > 0 ? Math.round((prop.votesNo / totalVotes) * 100) : 0;

          return (
            <div
              key={prop.id}
              className="border border-brand-border bg-black/40 hover:border-brand-border-light rounded-xl p-5 space-y-4 transition-all duration-200"
            >
              {/* Top Meta info */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-brand-border/60 border border-brand-border text-[8px] font-mono font-bold uppercase text-brand-gold rounded">
                    {prop.category}
                  </span>
                  <span className="text-[10px] text-gray-400 font-sans flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 opacity-60" />
                    <span>Ends: {prop.endsAt}</span>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-gray-400">
                    Proposer: {prop.proposer.slice(0, 8)}...{prop.proposer.slice(-4)}
                  </span>
                  {prop.status === 'passed' ? (
                    <span className="px-2 py-0.5 bg-green-500/10 border border-green-500/20 text-green-400 text-[8px] font-space font-bold uppercase rounded">
                      Passed ✓
                    </span>
                  ) : prop.status === 'defeated' ? (
                    <span className="px-2 py-0.5 bg-red-500/10 border border-red-500/20 text-red-400 text-[8px] font-space font-bold uppercase rounded">
                      Defeated
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 bg-brand-gold/10 border border-brand-gold/20 text-brand-gold text-[8px] font-space font-bold uppercase rounded animate-pulse">
                      Active
                    </span>
                  )}
                </div>
              </div>

              {/* Title and description */}
              <div className="space-y-2">
                <h4 className="font-display font-semibold text-white text-base tracking-wide leading-snug">
                  {prop.title}
                </h4>
                <p className="text-xs text-gray-400 font-sans leading-relaxed">
                  {prop.description}
                </p>
              </div>

              {/* Voting Interface */}
              <div className="pt-4 border-t border-brand-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                
                {/* Result progress bars */}
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between text-[10px] font-mono text-gray-400">
                    <span>YES: {prop.votesYes.toLocaleString()} Sats ({yesPercent}%)</span>
                    <span>NO: {prop.votesNo.toLocaleString()} Sats ({noPercent}%)</span>
                  </div>
                  {/* Visual sliding bar */}
                  <div className="h-2 w-full bg-brand-panel border border-brand-border rounded-full overflow-hidden flex">
                    <div 
                      className="bg-brand-gold h-full transition-all duration-500" 
                      style={{ width: `${yesPercent}%` }} 
                    />
                    <div 
                      className="bg-red-500/40 h-full transition-all duration-500" 
                      style={{ width: `${noPercent}%` }} 
                    />
                  </div>
                </div>

                {/* Vote buttons or Voted state */}
                <div className="flex items-center gap-2 self-end sm:self-center">
                  {!wallet.connected ? (
                    <span className="text-[9px] text-gray-500 uppercase font-space tracking-wide">
                      Connect wallet to cast votes
                    </span>
                  ) : userVote ? (
                    <div className="flex items-center gap-1.5 text-xs text-brand-gold font-semibold bg-brand-gold/5 border border-brand-gold/20 px-3 py-1.5 rounded-lg">
                      <CheckCircle className="w-4 h-4 text-brand-gold" />
                      <span>Voted {userVote.toUpperCase()}</span>
                    </div>
                  ) : prop.status !== 'active' ? (
                    <span className="text-[9px] text-gray-500 uppercase font-space tracking-wide">
                      Voting Closed
                    </span>
                  ) : (
                    <>
                      <button
                        onClick={() => onVote(prop.id, 'yes')}
                        className="px-3.5 py-2 border border-brand-border hover:border-brand-gold hover:bg-brand-gold/5 rounded-lg flex items-center gap-1.5 text-[10px] font-space font-semibold uppercase text-gray-300 hover:text-brand-gold transition-all duration-200 cursor-pointer"
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>Support</span>
                      </button>
                      <button
                        onClick={() => onVote(prop.id, 'no')}
                        className="px-3.5 py-2 border border-brand-border hover:border-red-500 hover:bg-red-500/5 rounded-lg flex items-center gap-1.5 text-[10px] font-space font-semibold uppercase text-gray-300 hover:text-red-400 transition-all duration-200 cursor-pointer"
                      >
                        <ThumbsDown className="w-3.5 h-3.5" />
                        <span>Oppose</span>
                      </button>
                    </>
                  )}
                </div>

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
