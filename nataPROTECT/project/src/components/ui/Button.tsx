import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'shield' | 'autogrow' | 'practice' | 'goals';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const variantStyles: Record<string, string> = {
  primary: 'bg-sky-500/20 border-sky-500/30 text-sky-300 hover:bg-sky-500/30 hover:border-sky-500/50',
  secondary: 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:border-white/20',
  danger: 'bg-red-500/20 border-red-500/30 text-red-300 hover:bg-red-500/30 hover:border-red-500/50',
  ghost: 'bg-transparent border-transparent text-slate-400 hover:bg-white/5 hover:text-slate-200',
  shield: 'bg-blue-500/20 border-blue-500/30 text-blue-300 hover:bg-blue-500/30 hover:border-blue-500/50',
  autogrow: 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/30 hover:border-emerald-500/50',
  practice: 'bg-amber-500/20 border-amber-500/30 text-amber-300 hover:bg-amber-500/30 hover:border-amber-500/50',
  goals: 'bg-pink-500/20 border-pink-500/30 text-pink-300 hover:bg-pink-500/30 hover:border-pink-500/50',
};

const sizeStyles: Record<string, string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

export function Button({ variant = 'primary', size = 'md', children, className = '', disabled, ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-xl border font-medium transition-all duration-200 active:scale-95 ${variantStyles[variant]} ${sizeStyles[size]} ${disabled ? 'opacity-40 cursor-not-allowed' : ''} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
