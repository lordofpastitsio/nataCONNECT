interface BadgeProps {
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<string, string> = {
  success: 'bg-slate-950/90 text-slate-300 border-slate-700',
  warning: 'bg-slate-950/90 text-slate-300 border-slate-700',
  danger: 'bg-slate-950/90 text-slate-300 border-slate-700',
  info: 'bg-slate-950/90 text-slate-300 border-slate-700',
  neutral: 'bg-slate-950/90 text-slate-300 border-slate-700',
};

export function Badge({ variant = 'neutral', children, className = '' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
}
