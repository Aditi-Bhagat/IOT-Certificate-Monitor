import React from 'react';

export default function StatusCard({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = 'default',
  trend = null,
  pulse = false,
  badge = null,
  onClick = null,
}) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return {
          border: 'border-emerald-200',
          bg: 'bg-white',
          iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-200',
          accent: 'text-emerald-700',
        };
      case 'warning':
        return {
          border: 'border-amber-200',
          bg: 'bg-white',
          iconBg: 'bg-amber-50 text-amber-600 border-amber-200',
          accent: 'text-amber-700',
        };
      case 'critical':
      case 'danger':
        return {
          border: 'border-rose-300',
          bg: 'bg-rose-50/30',
          iconBg: 'bg-rose-100 text-rose-600 border-rose-200',
          accent: 'text-rose-700',
        };
      case 'primary':
        return {
          border: 'border-blue-200',
          bg: 'bg-white',
          iconBg: 'bg-blue-50 text-blue-600 border-blue-200',
          accent: 'text-blue-700',
        };
      default:
        return {
          border: 'border-slate-200',
          bg: 'bg-white',
          iconBg: 'bg-slate-100 text-slate-700 border-slate-200',
          accent: 'text-slate-800',
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div
      onClick={onClick}
      className={`rounded-xl border ${styles.border} ${styles.bg} p-4 shadow-sm transition-all hover:shadow relative overflow-hidden ${
        pulse ? 'ring-2 ring-rose-500/50' : ''
      } ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono">
            {title}
          </span>
          <div className="mt-1 flex items-baseline space-x-2">
            <span className={`text-2xl font-extrabold font-mono tracking-tight ${styles.accent}`}>
              {value}
            </span>
            {badge && (
              <span className="text-[10px] px-2 py-0.5 rounded font-mono font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                {badge}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="mt-1 text-xs text-slate-500 font-medium">
              {subtitle}
            </p>
          )}
        </div>

        {Icon && (
          <div className={`p-2.5 rounded-lg border ${styles.iconBg} ${pulse ? 'animate-pulse' : ''}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {trend && (
        <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center text-xs text-slate-500">
          {trend}
        </div>
      )}
    </div>
  );
}
