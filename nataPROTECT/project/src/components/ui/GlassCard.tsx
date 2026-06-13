import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  glow?: 'blue' | 'green' | 'amber' | 'pink' | 'none';
  onClick?: () => void;
  hover?: boolean;
}

export function GlassCard({ children, className = '', glow = 'none', onClick, hover = false }: GlassCardProps) {
  const glowClass = glow !== 'none' ? `glow-${glow}` : '';
  const hoverClass = hover ? 'hover:border-white/20 hover:bg-white/[0.07] hover:scale-[1.01] transition-all duration-300 cursor-pointer' : '';

  return (
    <div
      className={`glass-card rounded-2xl p-5 ${glowClass} ${hoverClass} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
