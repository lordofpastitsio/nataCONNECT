import { User, Bell, Lock, CreditCard, LogOut, ChevronRight, Shield, TrendingUp, Trophy, Target, Moon, Globe, HelpCircle, Mail, Phone } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { mockCards } from '../../stores/appStore';

function SettingRow({ icon, label, value, onClick }: { icon: React.ReactNode; label: string; value?: string; onClick?: () => void }) {
  return (
    <div
      onClick={onClick}
      className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.05] transition-all cursor-pointer group"
    >
      <div className="p-2 rounded-lg bg-white/5 text-slate-400 group-hover:text-white transition-colors">
        {icon}
      </div>
      <div className="flex-1">
        <div className="text-sm text-white">{label}</div>
      </div>
      {value && <span className="text-xs text-slate-400">{value}</span>}
      <ChevronRight size={14} className="text-slate-500 group-hover:text-slate-300 transition-colors" />
    </div>
  );
}

export function AccountDashboard() {
  const totalBalance = mockCards.reduce((sum, c) => sum + c.balance, 0);

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Account</h1>
        <p className="text-sm text-slate-400 mt-0.5">Manage your profile and preferences</p>
      </div>

      {/* Profile Card */}
      <GlassCard className="p-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-500/30 to-blue-500/30 border border-sky-500/30 flex items-center justify-center">
            <User size={28} className="text-sky-400" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-white">Alex Mueller</h2>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Mail size={10} /> alex.mueller@email.com
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
              <Phone size={10} /> +49 123 456 7890
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-slate-400">Total Balance</div>
            <div className="text-xl font-bold text-white">€{totalBalance.toLocaleString('de-DE', { minimumFractionDigits: 2 })}</div>
          </div>
        </div>
      </GlassCard>

      {/* Cards Summary */}
      <div>
        <h2 className="text-sm font-medium text-slate-400 mb-3">Your Cards</h2>
        <div className="space-y-2">
          {mockCards.map(card => (
            <div key={card.id} className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <div className="p-2 rounded-lg" style={{ background: `${card.color}20`, color: card.color }}>
                <CreditCard size={18} />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-white">{card.name}</div>
                <div className="text-xs text-slate-400">{card.brand} •••• {card.lastFour}</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-white">€{card.balance.toLocaleString('de-DE', { minimumFractionDigits: 2 })}</div>
                <Badge variant={card.isActive ? 'success' : 'neutral'}>{card.isActive ? 'Active' : 'Inactive'}</Badge>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pillar Summary */}
      <div className="grid grid-cols-2 gap-3">
        <GlassCard className="p-4" hover>
          <div className="flex items-center gap-2 mb-2">
            <Shield size={16} className="text-blue-400" />
            <span className="text-xs text-slate-400">Shield</span>
          </div>
          <div className="text-lg font-bold text-white">4 Rules</div>
          <div className="text-xs text-slate-500">2 scams blocked today</div>
        </GlassCard>
        <GlassCard className="p-4" hover>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={16} className="text-emerald-400" />
            <span className="text-xs text-slate-400">Auto-Grow</span>
          </div>
          <div className="text-lg font-bold text-emerald-400">+23.5%</div>
          <div className="text-xs text-slate-500">Portfolio active</div>
        </GlassCard>
        <GlassCard className="p-4" hover>
          <div className="flex items-center gap-2 mb-2">
            <Trophy size={16} className="text-amber-400" />
            <span className="text-xs text-slate-400">Practice</span>
          </div>
          <div className="text-lg font-bold text-white">Score: 72</div>
          <div className="text-xs text-slate-500">4 achievements</div>
        </GlassCard>
        <GlassCard className="p-4" hover>
          <div className="flex items-center gap-2 mb-2">
            <Target size={16} className="text-pink-400" />
            <span className="text-xs text-slate-400">Goals</span>
          </div>
          <div className="text-lg font-bold text-white">4 Goals</div>
          <div className="text-xs text-slate-500">€8,927 total saved</div>
        </GlassCard>
      </div>

      {/* Settings */}
      <div>
        <h2 className="text-sm font-medium text-slate-400 mb-3">Settings</h2>
        <GlassCard className="p-2">
          <SettingRow icon={<Bell size={16} />} label="Notifications" value="All on" />
          <SettingRow icon={<Lock size={16} />} label="Privacy & Security" value="2FA on" />
          <SettingRow icon={<Moon size={16} />} label="Appearance" value="Dark" />
          <SettingRow icon={<Globe size={16} />} label="Language" value="English" />
          <SettingRow icon={<CreditCard size={16} />} label="Payment Methods" value="3 cards" />
          <SettingRow icon={<HelpCircle size={16} />} label="Help & Support" />
        </GlassCard>
      </div>

      {/* Danger Zone */}
      <div className="pt-2">
        <Button variant="danger" size="md" className="w-full">
          <LogOut size={16} /> Sign Out
        </Button>
      </div>
    </div>
  );
}
