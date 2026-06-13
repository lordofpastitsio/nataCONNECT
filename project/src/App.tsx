import { useState, useEffect } from 'react';
import { Shield, TrendingUp, Trophy, Target, User, Search, Command, Sparkles, Brain } from 'lucide-react';
import { GuideDashboard } from './components/guide/GuideDashboard';
import { ShieldDashboard } from './components/shield/ShieldDashboard';
import { AutoGrowDashboard } from './components/autogrow/AutoGrowDashboard';
import { PracticeDashboard } from './components/practice/PracticeDashboard';
import { GoalsDashboard } from './components/goals/GoalsDashboard';
import { AccountDashboard } from './components/account/AccountDashboard';
import { CommandBar } from './components/shared/CommandBar';
import type { Pillar } from './stores/appStore';

const pillars: { key: Pillar; label: string; icon: React.ReactNode; gradient: string; color: string }[] = [
  { key: 'shield', label: 'Shield', icon: <Shield size={20} />, gradient: 'from-blue-500 to-blue-600', color: '#3b82f6' },
  { key: 'autogrow', label: 'Auto-Grow', icon: <TrendingUp size={20} />, gradient: 'from-emerald-500 to-emerald-600', color: '#10b981' },
  { key: 'practice', label: 'Practice', icon: <Trophy size={20} />, gradient: 'from-amber-500 to-amber-600', color: '#eab308' },
  { key: 'guide', label: 'Guide', icon: <Brain size={20} />, gradient: 'from-violet-500 to-violet-600', color: '#8b5cf6' },
  { key: 'goals', label: 'Goals', icon: <Target size={20} />, gradient: 'from-pink-500 to-pink-600', color: '#ec4899' },
];

function App() {
  const [activePillar, setActivePillar] = useState<Pillar>('shield');
  const [commandBarOpen, setCommandBarOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandBarOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleNavigate = (pillar: Pillar) => {
    setActivePillar(pillar);
  };

  const renderPillar = () => {
    switch (activePillar) {
      case 'shield': return <ShieldDashboard />;
      case 'autogrow': return <AutoGrowDashboard />;
      case 'practice': return <PracticeDashboard />;
      case 'guide': return <GuideDashboard />;
      case 'goals': return <GoalsDashboard />;
      case 'account': return <AccountDashboard />;
    }
  };

  const activePillarConfig = pillars.find(p => p.key === activePillar);

  return (
    <div className="h-screen flex flex-col bg-nata-bg overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-[0.03] animate-float" style={{ background: `radial-gradient(circle, ${activePillarConfig?.color || '#38bdf8'}, transparent)` }} />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full opacity-[0.02] animate-float" style={{ background: `radial-gradient(circle, ${activePillarConfig?.color || '#38bdf8'}, transparent)`, animationDelay: '3s' }} />
      </div>

      {/* Top Bar */}
      <header className="relative z-10 flex items-center justify-between px-6 py-3 border-b border-white/[0.06] bg-nata-bg/80 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center shadow-lg shadow-sky-500/20">
            <Sparkles size={16} className="text-white" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-white tracking-wide">NataCONNECT</h1>
            <p className="text-[10px] text-slate-500 -mt-0.5">Finance, finally effortless</p>
          </div>
        </div>

        {/* Command Trigger */}
        <button
          onClick={() => setCommandBarOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg glass border border-white/[0.08] hover:border-white/20 hover:bg-white/[0.08] transition-all text-sm text-slate-400 hover:text-slate-200"
        >
          <Search size={14} />
          <span className="hidden sm:inline">Command</span>
          <kbd className="hidden md:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-white/10 text-[10px] text-slate-500">
            <Command size={8} />K
          </kbd>
        </button>

        {/* Account */}
        <button
          onClick={() => setActivePillar('account')}
          className={`flex items-center gap-2 p-2 rounded-xl transition-all ${activePillar === 'account' ? 'bg-white/10 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
        >
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-sky-500/30 to-blue-500/30 border border-sky-500/20 flex items-center justify-center">
            <User size={14} className="text-sky-400" />
          </div>
        </button>
      </header>

      {/* Main Content */}
      <main className={`flex-1 overflow-y-auto px-6 py-6 relative z-10 transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <div className="max-w-6xl mx-auto">
          {renderPillar()}
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="relative z-10 flex items-center justify-around px-4 py-2 border-t border-white/[0.06] bg-nata-bg/80 backdrop-blur-xl">
        {pillars.map(pillar => {
          const isActive = activePillar === pillar.key;
          return (
            <button
              key={pillar.key}
              onClick={() => setActivePillar(pillar.key)}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-300 relative ${isActive ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}
            >
              {isActive && (
                <div className="absolute inset-0 rounded-xl bg-gradient-to-b opacity-10" style={{ background: `linear-gradient(to bottom, ${pillar.color}, transparent)` }} />
              )}
              <div className={`relative transition-transform duration-300 ${isActive ? 'scale-110' : 'scale-100'}`}>
                {pillar.icon}
              </div>
              <span className="relative text-[10px] font-medium">{pillar.label}</span>
              {isActive && (
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full" style={{ background: pillar.color }} />
              )}
            </button>
          );
        })}
      </nav>

      {/* Command Bar */}
      <CommandBar
        isOpen={commandBarOpen}
        onClose={() => setCommandBarOpen(false)}
        onNavigate={handleNavigate}
      />
    </div>
  );
}

export default App;
