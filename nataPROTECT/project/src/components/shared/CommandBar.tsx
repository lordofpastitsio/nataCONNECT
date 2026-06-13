import { useState, useRef, useEffect } from 'react';
import { Search, Shield, TrendingUp, Trophy, Target, ArrowRight, X } from 'lucide-react';

interface CommandItem {
  id: string;
  label: string;
  pillar: 'shield' | 'autogrow' | 'practice' | 'goals';
  action: string;
}

const commands: CommandItem[] = [
  { id: '1', label: 'Protect my card', pillar: 'shield', action: 'shield_add_rule' },
  { id: '2', label: 'Block unverified sellers', pillar: 'shield', action: 'shield_block_unverified' },
  { id: '3', label: 'Set spending limit', pillar: 'shield', action: 'shield_spending_limit' },
  { id: '4', label: 'Report a scam', pillar: 'shield', action: 'shield_report_scam' },
  { id: '5', label: 'Start trading with 100 EUR', pillar: 'autogrow', action: 'autogrow_start_100' },
  { id: '6', label: 'Stop and secure all positions', pillar: 'autogrow', action: 'autogrow_stop' },
  { id: '7', label: 'View portfolio performance', pillar: 'autogrow', action: 'autogrow_view' },
  { id: '8', label: 'Practice investing', pillar: 'practice', action: 'practice_start' },
  { id: '9', label: 'Open simulated trade', pillar: 'practice', action: 'practice_trade' },
  { id: '10', label: 'View my skill score', pillar: 'practice', action: 'practice_score' },
  { id: '11', label: 'Set a savings goal', pillar: 'goals', action: 'goals_new' },
  { id: '12', label: 'Protect my rent buffer', pillar: 'goals', action: 'goals_rent' },
  { id: '13', label: 'Set spending limit for entertainment', pillar: 'goals', action: 'goals_limit_entertainment' },
  { id: '14', label: 'Track my vacation savings', pillar: 'goals', action: 'goals_vacation' },
];

const pillarConfig: Record<string, { icon: React.ReactNode; color: string; gradient: string }> = {
  shield: { icon: <Shield size={14} />, color: 'text-blue-400', gradient: 'from-blue-500/20 to-blue-500/5' },
  autogrow: { icon: <TrendingUp size={14} />, color: 'text-emerald-400', gradient: 'from-emerald-500/20 to-emerald-500/5' },
  practice: { icon: <Trophy size={14} />, color: 'text-amber-400', gradient: 'from-amber-500/20 to-amber-500/5' },
  goals: { icon: <Target size={14} />, color: 'text-pink-400', gradient: 'from-pink-500/20 to-pink-500/5' },
};

interface CommandBarProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (pillar: 'shield' | 'autogrow' | 'practice' | 'goals') => void;
}

export function CommandBar({ isOpen, onClose, onNavigate }: CommandBarProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = commands.filter(c =>
    c.label.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const executeCommand = (cmd: CommandItem) => {
    onNavigate(cmd.pillar);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && filtered[selectedIndex]) {
      executeCommand(filtered[selectedIndex]);
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in" />
      <div className="relative max-w-lg mx-auto mt-[15vh] px-4" onClick={e => e.stopPropagation()}>
        <div className="glass-card rounded-2xl overflow-hidden animate-scale-in">
          <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.06]">
            <Search size={18} className="text-slate-400" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="What would you like to do?"
              className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 outline-none"
            />
            <button onClick={onClose} className="p-1 rounded hover:bg-white/10 transition-colors text-slate-400 hover:text-white">
              <X size={14} />
            </button>
          </div>
          <div className="max-h-80 overflow-y-auto py-2">
            {filtered.length === 0 ? (
              <div className="px-5 py-8 text-center text-sm text-slate-500">No commands found</div>
            ) : (
              filtered.map((cmd, i) => {
                const config = pillarConfig[cmd.pillar];
                return (
                  <button
                    key={cmd.id}
                    onClick={() => executeCommand(cmd)}
                    onMouseEnter={() => setSelectedIndex(i)}
                    className={`w-full flex items-center gap-3 px-5 py-2.5 text-left transition-all ${i === selectedIndex ? 'bg-white/[0.08]' : 'hover:bg-white/[0.04]'}`}
                  >
                    <div className={`p-1.5 rounded-lg bg-gradient-to-r ${config.gradient} ${config.color}`}>
                      {config.icon}
                    </div>
                    <span className="flex-1 text-sm text-white">{cmd.label}</span>
                    <ArrowRight size={14} className={`${i === selectedIndex ? 'text-slate-300' : 'text-slate-600'} transition-colors`} />
                  </button>
                );
              })
            )}
          </div>
          <div className="px-5 py-3 border-t border-white/[0.06] flex items-center gap-4 text-xs text-slate-500">
            <span><kbd className="px-1.5 py-0.5 rounded bg-white/10 text-slate-400">↑↓</kbd> navigate</span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-white/10 text-slate-400">↵</kbd> select</span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-white/10 text-slate-400">esc</kbd> close</span>
          </div>
        </div>
      </div>
    </div>
  );
}
