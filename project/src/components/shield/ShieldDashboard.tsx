import { useState } from 'react';
import { Shield, AlertTriangle, CheckCircle, XCircle, Plus, ChevronRight, Flag, Users, Eye, Clock, Ban, DollarSign } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';
import { mockCards, mockShieldRules, mockTransactions, mockScamReports } from '../../stores/appStore';
import type { Card, ShieldRule, Transaction } from '../../stores/appStore';

function CardItem({ card, isSelected, onClick }: { card: Card; isSelected: boolean; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className={`relative rounded-xl p-4 cursor-pointer transition-all duration-300 overflow-hidden ${isSelected ? 'ring-2 ring-blue-500/50 scale-[1.02]' : 'hover:scale-[1.01]'}`}
      style={{ background: `linear-gradient(135deg, ${card.color}33, ${card.color}11)`, border: `1px solid ${card.color}44` }}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">{card.brand}</span>
        <span className="text-xs text-slate-400">{card.cardType}</span>
      </div>
      <div className="text-lg font-mono tracking-widest text-white/80 mb-3">
        •••• •••• •••• {card.lastFour}
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-white/90 font-medium">{card.name}</span>
        <span className="text-sm font-semibold text-white">{card.balance.toLocaleString('de-DE', { style: 'currency', currency: card.currency })}</span>
      </div>
      {isSelected && (
        <div className="absolute top-2 right-2">
          <CheckCircle size={18} className="text-blue-400" />
        </div>
      )}
    </div>
  );
}

function RuleItem({ rule, onToggle }: { rule: ShieldRule; onToggle: (id: string) => void }) {
  const typeIcons: Record<string, React.ReactNode> = {
    spending_limit: <DollarSign size={16} />,
    time_restriction: <Clock size={16} />,
    seller_verification: <Eye size={16} />,
    category_block: <Ban size={16} />,
    custom: <Shield size={16} />,
  };

  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.05] transition-all group">
      <div className="p-2 rounded-lg bg-blue-500/15 text-blue-400">
        {typeIcons[rule.ruleType]}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-slate-200 truncate">{rule.ruleText}</p>
      </div>
      <button
        onClick={() => onToggle(rule.id)}
        className={`w-9 h-5 rounded-full transition-all duration-200 ${rule.isActive ? 'bg-blue-500' : 'bg-white/10'} relative`}
      >
        <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all duration-200 ${rule.isActive ? 'left-[18px]' : 'left-0.5'}`} />
      </button>
    </div>
  );
}

function TransactionItem({ tx, onApprove }: { tx: Transaction; onApprove: (id: string) => void }) {
  const statusConfig: Record<string, { icon: React.ReactNode; badge: 'success' | 'warning' | 'danger' | 'info' | 'neutral'; label: string }> = {
    approved: { icon: <CheckCircle size={16} className="text-emerald-400" />, badge: 'success', label: 'Approved' },
    blocked: { icon: <XCircle size={16} className="text-red-400" />, badge: 'danger', label: 'Blocked' },
    pending: { icon: <Clock size={16} className="text-amber-400" />, badge: 'warning', label: 'Pending' },
    flagged: { icon: <AlertTriangle size={16} className="text-amber-400" />, badge: 'warning', label: 'Flagged' },
  };

  const config = statusConfig[tx.status];

  return (
    <div className={`p-4 rounded-xl border transition-all ${tx.status === 'blocked' ? 'bg-red-500/[0.05] border-red-500/20' : 'bg-white/[0.03] border-white/[0.06]'} hover:bg-white/[0.05]`}>
      <div className="flex items-start gap-3">
        <div className="mt-0.5">{config.icon}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium text-white truncate">{tx.sellerName}</span>
            <Badge variant={config.badge}>{config.label}</Badge>
            {tx.isScamReport && (
              <Badge variant="danger"><Flag size={10} className="mr-1" />Scam</Badge>
            )}
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span>{tx.amount.toLocaleString('de-DE', { style: 'currency', currency: tx.currency })}</span>
            <span>{tx.category}</span>
            <span>{new Date(tx.createdAt).toLocaleString('de-DE', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          {tx.blockReason && (
            <p className="mt-2 text-xs text-red-300/80 bg-red-500/10 p-2 rounded-lg border border-red-500/15">
              {tx.blockReason}
            </p>
          )}
          {tx.status === 'blocked' && (
            <Button variant="ghost" size="sm" className="mt-2 text-sky-400 hover:text-sky-300" onClick={() => onApprove(tx.id)}>
              Proceed Anyway <ChevronRight size={14} />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function CommunityStats() {
  const stats = [
    { label: 'Scams Blocked', value: '2,847', icon: <Shield size={18} />, color: 'text-blue-400' },
    { label: 'Active Users', value: '14.2K', icon: <Users size={18} />, color: 'text-emerald-400' },
    { label: 'Reports Today', value: '23', icon: <Flag size={18} />, color: 'text-amber-400' },
    { label: 'Money Saved', value: '€847K', icon: <DollarSign size={18} />, color: 'text-pink-400' },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {stats.map((s) => (
        <div key={s.label} className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
          <div className={`${s.color} mb-1`}>{s.icon}</div>
          <div className="text-lg font-semibold text-white">{s.value}</div>
          <div className="text-xs text-slate-400">{s.label}</div>
        </div>
      ))}
    </div>
  );
}

export function ShieldDashboard() {
  const [selectedCard, setSelectedCard] = useState<string>('1');
  const [rules, setRules] = useState(mockShieldRules);
  const [transactions, setTransactions] = useState(mockTransactions);
  const [showAddRule, setShowAddRule] = useState(false);
  const [newRuleText, setNewRuleText] = useState('');
  const [newRuleType, setNewRuleType] = useState<ShieldRule['ruleType']>('custom');

  const cardRules = rules.filter(r => r.cardId === selectedCard);
  const blockedCount = transactions.filter(t => t.status === 'blocked').length;
  const approvedCount = transactions.filter(t => t.status === 'approved').length;

  const toggleRule = (id: string) => {
    setRules(prev => prev.map(r => r.id === id ? { ...r, isActive: !r.isActive } : r));
  };

  const approveTransaction = (id: string) => {
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, status: 'approved' as const, blockReason: undefined } : t));
  };

  const addRule = () => {
    if (!newRuleText.trim()) return;
    const newRule: ShieldRule = {
      id: String(Date.now()),
      cardId: selectedCard,
      ruleText: newRuleText,
      ruleType: newRuleType,
      isActive: true,
      parameters: {},
    };
    setRules(prev => [...prev, newRule]);
    setNewRuleText('');
    setShowAddRule(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gradient-shield">Shield</h1>
          <p className="text-sm text-slate-400 mt-0.5">Protection without paranoia</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs text-slate-400">Blocked today</div>
            <div className="text-lg font-bold text-red-400">{blockedCount}</div>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="text-right">
            <div className="text-xs text-slate-400">Approved</div>
            <div className="text-lg font-bold text-emerald-400">{approvedCount}</div>
          </div>
        </div>
      </div>

      {/* Cards */}
      <div>
        <h2 className="text-sm font-medium text-slate-400 mb-3">Your Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {mockCards.map(card => (
            <CardItem key={card.id} card={card} isSelected={selectedCard === card.id} onClick={() => setSelectedCard(card.id)} />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Rules */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-medium text-slate-400">Active Rules</h2>
            <Button variant="shield" size="sm" onClick={() => setShowAddRule(true)}>
              <Plus size={14} /> Add Rule
            </Button>
          </div>
          <div className="space-y-2">
            {cardRules.map(rule => (
              <RuleItem key={rule.id} rule={rule} onToggle={toggleRule} />
            ))}
            {cardRules.length === 0 && (
              <div className="text-center py-8 text-slate-500">
                <Shield size={32} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">No rules for this card yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Community */}
        <div>
          <h2 className="text-sm font-medium text-slate-400 mb-3">Community Network</h2>
          <CommunityStats />
        </div>
      </div>

      {/* Transactions */}
      <div>
        <h2 className="text-sm font-medium text-slate-400 mb-3">Recent Transactions</h2>
        <div className="space-y-2">
          {transactions.slice(0, 5).map(tx => (
            <TransactionItem key={tx.id} tx={tx} onApprove={approveTransaction} />
          ))}
        </div>
      </div>

      {/* Scam Reports */}
      <div>
        <h2 className="text-sm font-medium text-slate-400 mb-3">Flagged Sellers</h2>
        <div className="space-y-2">
          {mockScamReports.map(report => (
            <div key={report.id} className="flex items-center gap-3 p-3 rounded-xl bg-red-500/[0.05] border border-red-500/15">
              <Flag size={16} className="text-red-400 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white truncate">{report.sellerName}</p>
                <p className="text-xs text-slate-400 truncate">{report.description}</p>
              </div>
              <div className="text-right shrink-0">
                <div className="text-xs text-red-400 font-medium">{report.reportCount} reports</div>
                <Badge variant={report.verified ? 'success' : 'warning'}>{report.verified ? 'Verified' : 'Unverified'}</Badge>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Rule Modal */}
      <Modal isOpen={showAddRule} onClose={() => setShowAddRule(false)} title="Add Shield Rule">
        <div className="space-y-4">
          <div>
            <label className="text-xs text-slate-400 block mb-1.5">Rule Type</label>
            <div className="grid grid-cols-2 gap-2">
              {(['spending_limit', 'time_restriction', 'seller_verification', 'category_block', 'custom'] as const).map(type => (
                <button
                  key={type}
                  onClick={() => setNewRuleType(type)}
                  className={`p-2 rounded-lg text-xs font-medium transition-all border ${newRuleType === type ? 'bg-blue-500/20 border-blue-500/40 text-blue-300' : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'}`}
                >
                  {type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs text-slate-400 block mb-1.5">Describe your rule</label>
            <input
              type="text"
              value={newRuleText}
              onChange={e => setNewRuleText(e.target.value)}
              placeholder="e.g., Ask me before any purchase over 50 EUR"
              className="w-full glass-input rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none"
            />
          </div>
          <div className="flex gap-3 justify-end">
            <Button variant="ghost" onClick={() => setShowAddRule(false)}>Cancel</Button>
            <Button variant="shield" onClick={addRule}>Add Rule</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
