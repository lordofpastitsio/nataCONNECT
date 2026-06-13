import { useState } from 'react';
import { GlassCard } from '../ui/GlassCard';
import { Button } from '../ui/Button';
import { Brain } from 'lucide-react';

function generateSuggestions(input: string) {
  const s = input.trim();
  if (!s) return [];

  const suggestions: Array<{ title: string; detail: string }> = [];

  // detect tickers (simple A-Z letters 1-5)
  const tickers = Array.from(new Set((s.match(/[A-Z]{1,5}/g) || [])));
  if (tickers.length > 0) {
    tickers.forEach(t => {
      suggestions.push({
        title: `Consider ${t} (Long)` ,
        detail: `Idea: Buy a small starter position in ${t} (1-3% of portfolio). Set stop-loss ~3% below entry and consider scaling in on dips.`
      });
      suggestions.push({
        title: `Short idea for ${t}` ,
        detail: `If near a clear resistance, consider a short with tight stop. Keep position size small and watch macro news.`
      });
    });
  }

  // sector keywords
  if (/ai|artificial intelligence|semiconductor|chip/i.test(s)) {
    suggestions.push({ title: 'AI / Semiconductors', detail: 'Allocation idea: overweight top AI chip names; use diversified ETFs to reduce single-stock risk.' });
  }

  if (/dividend|income/i.test(s)) {
    suggestions.push({ title: 'Dividend / Income', detail: 'Look for high-quality dividend payers with sustainable payout ratios. Consider laddering entry over 2-3 weeks.' });
  }

  if (suggestions.length === 0) {
    suggestions.push({ title: 'General Idea', detail: 'Break your idea into: thesis, timeframe, risk per trade, and exit plan. Suggest 1-2 concrete tickers or an ETF.' });
  }

  return suggestions;
}

export function GuideDashboard() {
  const [input, setInput] = useState('');
  const [results, setResults] = useState<Array<{ title: string; detail: string }>>([]);

  const suggest = () => {
    setResults(generateSuggestions(input));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gradient-practice">Guide</h1>
          <p className="text-sm text-slate-400 mt-0.5">Tell the assistant what you're thinking and get structured suggestions</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => { setInput(''); setResults([]); }}>Clear</Button>
          <Button variant="primary" size="md" onClick={suggest}><Brain size={14} /> Suggest</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard className="lg:col-span-2 p-4">
          <label className="text-xs text-slate-400 block mb-2">Describe what you're thinking (tickers, sectors, timeframe, goals)</label>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            rows={6}
            className="w-full glass-input rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none bg-transparent"
            placeholder="E.g. thinking about AAPL and NVDA for long-term AI exposure"
          />
        </GlassCard>

        <div className="space-y-3">
          <GlassCard className="p-4">
            <div className="text-xs text-slate-400 mb-2">Quick Tips</div>
            <ul className="text-sm text-slate-300 space-y-2">
              <li>- Define timeframe and max loss before entering.</li>
              <li>- Use position sizing: 1-3% for speculative, 5-10% for conviction.</li>
              <li>- Prefer ETFs for broad exposure to a theme.</li>
            </ul>
          </GlassCard>

          <GlassCard className="p-4">
            <div className="text-xs text-slate-400 mb-2">Suggestions</div>
            <div className="space-y-2">
              {results.length === 0 && <div className="text-sm text-slate-500">No suggestions yet. Type your idea and press Suggest.</div>}
              {results.map((r, i) => (
                <div key={i} className="p-2 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                  <div className="text-sm font-semibold text-white">{r.title}</div>
                  <div className="text-xs text-slate-400 mt-1">{r.detail}</div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}

export default GuideDashboard;
