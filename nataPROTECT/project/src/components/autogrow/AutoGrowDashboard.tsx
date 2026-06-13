import { useState } from 'react';
import { TrendingUp, TrendingDown, Play, BarChart3, Activity, Brain, StopCircle, DollarSign, Percent, Shield } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';
import { mockPortfolio, mockTrades, mockPortfolioHistory } from '../../stores/appStore';
import type { Trade, Portfolio } from '../../stores/appStore';

function PortfolioChart({ history, maxLoss, initialCapital }: { history: { time: string; value: number }[]; maxLoss: number; initialCapital: number }) {
  const values = history.map(h => h.value);
  const min = Math.min(...values, initialCapital - maxLoss);
  const max = Math.max(...values);
  const range = max - min || 1;
  const height = 200;
  const width = 600;
  const padding = 40;

  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  const points = history.map((h, i) => {
    const x = padding + (i / (history.length - 1)) * chartWidth;
    const y = padding + chartHeight - ((h.value - min) / range) * chartHeight;
    return `${x},${y}`;
  });

  const floorY = padding + chartHeight - ((initialCapital - maxLoss - min) / range) * chartHeight;

  const linePath = `M${points.join(' L')}`;
  const fillPath = `${linePath} L${padding + chartWidth},${padding + chartHeight} L${padding},${padding + chartHeight} Z`;

  return (
    <div className="w-full overflow-hidden">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
        <defs>
          <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="lossLine" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#ef4444" stopOpacity="0.5" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[0.25, 0.5, 0.75].map(frac => (
          <line key={frac} x1={padding} y1={padding + chartHeight * frac} x2={padding + chartWidth} y2={padding + chartHeight * frac} stroke="rgba(255,255,255,0.05)" strokeDasharray="4,4" />
        ))}

        {/* Max loss floor */}
        <line x1={padding} y1={floorY} x2={padding + chartWidth} y2={floorY} stroke="url(#lossLine)" strokeWidth="1.5" strokeDasharray="6,4" />
        <text x={padding + chartWidth - 2} y={floorY - 6} textAnchor="end" fill="#ef4444" fontSize="9" fontWeight="500">Loss Limit: €{(initialCapital - maxLoss).toFixed(0)}</text>

        {/* Chart area fill */}
        <path d={fillPath} fill="url(#chartFill)" />

        {/* Chart line */}
        <path d={linePath} fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

        {/* Current value dot */}
        {points.length > 0 && (
          <>
            <circle cx={points[points.length - 1].split(',')[0]} cy={points[points.length - 1].split(',')[1]} r="4" fill="#10b981" />
            <circle cx={points[points.length - 1].split(',')[0]} cy={points[points.length - 1].split(',')[1]} r="8" fill="#10b981" fillOpacity="0.2" className="animate-pulse-glow" />
          </>
        )}
      </svg>
    </div>
  );
}

function TradeItem({ trade }: { trade: Trade }) {
  const isProfitable = trade.pnl !== undefined && trade.pnl > 0;
  const isRejected = trade.status === 'rejected';

  return (
    <div className={`p-3 rounded-xl border transition-all ${isRejected ? 'bg-red-500/[0.05] border-red-500/15' : 'bg-white/[0.03] border-white/[0.06]'} hover:bg-white/[0.05]`}>
      <div className="flex items-center gap-3">
        <div className={`p-1.5 rounded-lg ${trade.side === 'buy' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'}`}>
          {trade.side === 'buy' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-white">{trade.symbol}</span>
            <Badge variant={trade.side === 'buy' ? 'success' : 'danger'}>{trade.side.toUpperCase()}</Badge>
            {trade.status === 'rejected' && <Badge variant="danger">Rejected</Badge>}
            {trade.status === 'open' && <Badge variant="info">Open</Badge>}
            {trade.status === 'closed' && <Badge variant="success">Closed</Badge>}
          </div>
          <div className="flex items-center gap-3 mt-0.5 text-xs text-slate-400">
            <span>{trade.quantity} shares @ €{trade.entryPrice.toFixed(2)}</span>
            {trade.exitPrice && <span>→ €{trade.exitPrice.toFixed(2)}</span>}
            {trade.pnl !== undefined && (
              <span className={isProfitable ? 'text-emerald-400' : 'text-red-400'}>
                {isProfitable ? '+' : ''}€{trade.pnl.toFixed(2)}
              </span>
            )}
          </div>
        </div>
        <div className="text-xs text-slate-500">
          {new Date(trade.createdAt).toLocaleString('de-DE', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
      {trade.aiReasoning && (
        <div className={`mt-2 text-xs p-2 rounded-lg border ${isRejected ? 'text-red-300/80 bg-red-500/10 border-red-500/15' : 'text-slate-400 bg-white/[0.03] border-white/[0.05]'}`}>
          <Brain size={10} className="inline mr-1" />{trade.aiReasoning}
        </div>
      )}
    </div>
  );
}

export function AutoGrowDashboard() {
  const [portfolio, setPortfolio] = useState<Portfolio>(mockPortfolio);
  const [trades] = useState<Trade[]>(mockTrades);
  const [showNewPortfolio, setShowNewPortfolio] = useState(false);
  const [newCapital, setNewCapital] = useState('');
  const [newMaxLoss, setNewMaxLoss] = useState('');
  const [newRisk, setNewRisk] = useState<Portfolio['riskProfile']>('moderate');
  const [isStopping, setIsStopping] = useState(false);

  const totalPnl = portfolio.currentValue - portfolio.initialCapital;
  const pnlPercent = ((totalPnl / portfolio.initialCapital) * 100).toFixed(1);
  const floorValue = portfolio.initialCapital - portfolio.maxLoss;

  const stopAndSecure = () => {
    setIsStopping(true);
    setTimeout(() => {
      setPortfolio(prev => ({ ...prev, status: 'stopped' }));
      setIsStopping(false);
    }, 1500);
  };

  const resumeTrading = () => {
    setPortfolio(prev => ({ ...prev, status: 'active' }));
  };

  const createPortfolio = () => {
    const capital = parseFloat(newCapital);
    const loss = parseFloat(newMaxLoss);
    if (!capital || !loss) return;
    setPortfolio({
      id: String(Date.now()),
      name: 'New Portfolio',
      initialCapital: capital,
      currentValue: capital,
      maxLoss: loss,
      riskProfile: newRisk,
      status: 'active',
    });
    setShowNewPortfolio(false);
    setNewCapital('');
    setNewMaxLoss('');
  };

  const closedTrades = trades.filter(t => t.status === 'closed');
  const winRate = closedTrades.length > 0 ? ((closedTrades.filter(t => (t.pnl || 0) > 0).length / closedTrades.length) * 100).toFixed(0) : '0';

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gradient-autogrow">Auto-Grow</h1>
          <p className="text-sm text-slate-400 mt-0.5">Growth without expertise</p>
        </div>
        <div className="flex items-center gap-2">
          {portfolio.status === 'active' ? (
            <Button variant="danger" size="md" onClick={stopAndSecure} disabled={isStopping}>
              <StopCircle size={16} className={isStopping ? 'animate-pulse-glow' : ''} />
              {isStopping ? 'Securing...' : 'Stop & Secure'}
            </Button>
          ) : (
            <Button variant="autogrow" size="md" onClick={resumeTrading}>
              <Play size={16} /> Resume Trading
            </Button>
          )}
        </div>
      </div>

      {/* Portfolio Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <GlassCard className="p-4">
          <div className="flex items-center gap-2 text-emerald-400 mb-1">
            <DollarSign size={16} />
            <span className="text-xs text-slate-400">Current Value</span>
          </div>
          <div className="text-xl font-bold text-white">€{portfolio.currentValue.toFixed(2)}</div>
        </GlassCard>
        <GlassCard className="p-4">
          <div className="flex items-center gap-2 mb-1">
            <Percent size={16} className={totalPnl >= 0 ? 'text-emerald-400' : 'text-red-400'} />
            <span className="text-xs text-slate-400">Total P&L</span>
          </div>
          <div className={`text-xl font-bold ${totalPnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {totalPnl >= 0 ? '+' : ''}€{totalPnl.toFixed(2)} ({pnlPercent}%)
          </div>
        </GlassCard>
        <GlassCard className="p-4">
          <div className="flex items-center gap-2 text-red-400 mb-1">
            <Shield size={16} />
            <span className="text-xs text-slate-400">Loss Floor</span>
          </div>
          <div className="text-xl font-bold text-white">€{floorValue.toFixed(2)}</div>
          <div className="text-xs text-slate-500">Max loss: €{portfolio.maxLoss.toFixed(2)}</div>
        </GlassCard>
        <GlassCard className="p-4">
          <div className="flex items-center gap-2 text-sky-400 mb-1">
            <BarChart3 size={16} />
            <span className="text-xs text-slate-400">Win Rate</span>
          </div>
          <div className="text-xl font-bold text-white">{winRate}%</div>
          <div className="text-xs text-slate-500">{closedTrades.length} closed trades</div>
        </GlassCard>
      </div>

      {/* Chart */}
      <GlassCard>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-medium text-slate-400">Portfolio Performance</h2>
          <div className="flex items-center gap-2">
            <Badge variant={portfolio.status === 'active' ? 'success' : portfolio.status === 'paused' ? 'warning' : 'danger'}>
              <Activity size={10} className="mr-1" />{portfolio.status.charAt(0).toUpperCase() + portfolio.status.slice(1)}
            </Badge>
            <Badge variant="info">{portfolio.riskProfile}</Badge>
          </div>
        </div>
        <PortfolioChart history={mockPortfolioHistory} maxLoss={portfolio.maxLoss} initialCapital={portfolio.initialCapital} />
      </GlassCard>

      {/* Decision Log */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-medium text-slate-400">AI Decision Log</h2>
          <Button variant="autogrow" size="sm" onClick={() => setShowNewPortfolio(true)}>
            <TrendingUp size={14} /> New Portfolio
          </Button>
        </div>
        <div className="space-y-2">
          {trades.map(trade => (
            <TradeItem key={trade.id} trade={trade} />
          ))}
        </div>
      </div>

      {/* Risk Profile Info */}
      <GlassCard className="p-4">
        <div className="flex items-start gap-3">
          <Brain size={20} className="text-emerald-400 mt-0.5 shrink-0" />
          <div>
            <h3 className="text-sm font-medium text-white mb-1">AI Strategy — {portfolio.riskProfile.charAt(0).toUpperCase() + portfolio.riskProfile.slice(1)} Profile</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {portfolio.riskProfile === 'conservative' && 'Capital preservation is the top priority. The AI prioritizes low-volatility assets, uses tight stop-losses, and sizes positions conservatively. Maximum drawdown is strictly bounded by your loss limit.'}
              {portfolio.riskProfile === 'moderate' && 'Balanced approach between growth and safety. The AI pursues reasonable returns while maintaining strict risk controls. Position sizes are optimized using the Kelly Criterion with a fractional adjustment.'}
              {portfolio.riskProfile === 'aggressive' && 'Maximum growth within your loss boundary. The AI hunts for high-conviction opportunities and accepts higher volatility. Your loss limit is still absolute — no trade exceeds it.'}
            </p>
          </div>
        </div>
      </GlassCard>

      {/* New Portfolio Modal */}
      <Modal isOpen={showNewPortfolio} onClose={() => setShowNewPortfolio(false)} title="Create New Portfolio">
        <div className="space-y-4">
          <div>
            <label className="text-xs text-slate-400 block mb-1.5">Initial Capital (EUR)</label>
            <input
              type="number"
              value={newCapital}
              onChange={e => setNewCapital(e.target.value)}
              placeholder="e.g., 100"
              className="w-full glass-input rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none"
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 block mb-1.5">Maximum Loss (EUR)</label>
            <input
              type="number"
              value={newMaxLoss}
              onChange={e => setNewMaxLoss(e.target.value)}
              placeholder="e.g., 20"
              className="w-full glass-input rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none"
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 block mb-1.5">Risk Profile</label>
            <div className="grid grid-cols-3 gap-2">
              {(['conservative', 'moderate', 'aggressive'] as const).map(risk => (
                <button
                  key={risk}
                  onClick={() => setNewRisk(risk)}
                  className={`p-2.5 rounded-lg text-xs font-medium transition-all border ${newRisk === risk ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300' : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'}`}
                >
                  {risk.charAt(0).toUpperCase() + risk.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-3 justify-end">
            <Button variant="ghost" onClick={() => setShowNewPortfolio(false)}>Cancel</Button>
            <Button variant="autogrow" onClick={createPortfolio}>Create Portfolio</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
