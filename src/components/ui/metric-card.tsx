'use client';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  iconColor?: string;
  trend?: string;
  trendUp?: boolean;
  onClick?: () => void;
  className?: string;
}

export function MetricCard({
  title, value, subtitle, icon: Icon, iconColor = 'text-blue-400',
  trend, trendUp, onClick, className
}: MetricCardProps) {
  const bgColor = iconColor.includes('blue') ? 'bg-blue-500/10'
    : iconColor.includes('purple') ? 'bg-purple-500/10'
    : iconColor.includes('emerald') ? 'bg-emerald-500/10'
    : iconColor.includes('amber') ? 'bg-amber-500/10'
    : iconColor.includes('red') ? 'bg-red-500/10'
    : iconColor.includes('teal') ? 'bg-teal-500/10'
    : 'bg-slate-500/10';

  return (
    <div
      className={cn('glass metric-card rounded-2xl p-5 cursor-default', onClick && 'cursor-pointer', className)}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center', bgColor)}>
          <Icon size={22} className={iconColor} />
        </div>
        {trend && (
          <span className={cn('text-xs font-semibold px-2 py-0.5 rounded-full', trendUp ? 'text-emerald-400 bg-emerald-500/10' : 'text-red-400 bg-red-500/10')}>
            {trend}
          </span>
        )}
      </div>
      <div className="space-y-0.5">
        <div className="text-3xl font-bold text-white">{value}</div>
        <div className="text-sm font-medium text-white/80">{title}</div>
        {subtitle && <div className="text-xs text-slate-400">{subtitle}</div>}
      </div>
    </div>
  );
}
