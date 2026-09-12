import React from 'react';
import { Factory, ShieldCheck, ShieldAlert, AlertTriangle, ArrowRight } from 'lucide-react';

export default function ZoneCard({
  zoneName,
  sensors = [],
  isSelected = false,
  onClick = null,
}) {
  const total = sensors.length;
  const criticalCount = sensors.filter(
    (s) => s.telemetry === 'Offline' || s.certificate?.status === 'Expired'
  ).length;
  const expiringCount = sensors.filter(
    (s) => s.certificate?.status === 'Expiring' && s.telemetry !== 'Offline'
  ).length;
  const healthyCount = sensors.filter(
    (s) => s.certificate?.status === 'Healthy' && s.telemetry === 'Online'
  ).length;

  // Zone status evaluation: Red if any critical/expired, Amber if any expiring, Green if all healthy
  let zoneStatus = 'Healthy';
  if (criticalCount > 0) {
    zoneStatus = 'Critical';
  } else if (expiringCount > 0) {
    zoneStatus = 'Warning';
  }

  const getStatusStyles = () => {
    switch (zoneStatus) {
      case 'Critical':
        return {
          cardBg: 'bg-rose-50/60 hover:bg-rose-50',
          border: 'border-rose-400',
          ring: isSelected ? 'ring-2 ring-rose-500 shadow-md' : '',
          badge: 'bg-rose-600 text-white animate-pulse',
          badgeText: 'CRITICAL / OFFLINE',
          iconBg: 'bg-rose-100 text-rose-700',
          accent: 'text-rose-700',
        };
      case 'Warning':
        return {
          cardBg: 'bg-amber-50/40 hover:bg-amber-50',
          border: 'border-amber-300',
          ring: isSelected ? 'ring-2 ring-amber-500 shadow-md' : '',
          badge: 'bg-amber-500 text-white',
          badgeText: 'EXPIRATION WARNING',
          iconBg: 'bg-amber-100 text-amber-700',
          accent: 'text-amber-700',
        };
      default:
        return {
          cardBg: 'bg-white hover:bg-slate-50',
          border: 'border-slate-200 hover:border-emerald-300',
          ring: isSelected ? 'ring-2 ring-blue-500 shadow-md' : '',
          badge: 'bg-emerald-100 text-emerald-800 border border-emerald-300',
          badgeText: 'ALL CHANNELS SECURE',
          iconBg: 'bg-emerald-50 text-emerald-600',
          accent: 'text-emerald-700',
        };
    }
  };

  const styles = getStatusStyles();

  return (
    <div
      onClick={onClick}
      className={`rounded-xl border ${styles.border} ${styles.cardBg} ${styles.ring} p-5 shadow-sm transition-all cursor-pointer relative overflow-hidden`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className={`p-2.5 rounded-lg border border-slate-200/60 ${styles.iconBg}`}>
            <Factory className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm font-mono tracking-tight">
              {zoneName}
            </h3>
            <span className="text-xs text-slate-500 font-medium">
              {total} Telemetry {total === 1 ? 'Node' : 'Nodes'} Configured
            </span>
          </div>
        </div>

        <span className={`text-[10px] font-mono font-extrabold px-2 py-0.5 rounded tracking-wider ${styles.badge}`}>
          {styles.badgeText}
        </span>
      </div>

      {/* Metrics breakdown */}
      <div className="grid grid-cols-3 gap-2 my-4 text-center font-mono text-xs">
        <div className="p-2 rounded bg-white/80 border border-slate-200">
          <span className="text-[10px] text-slate-400 block font-bold">TOTAL</span>
          <span className="text-base font-extrabold text-slate-800">{total}</span>
        </div>
        <div className="p-2 rounded bg-white/80 border border-slate-200">
          <span className="text-[10px] text-emerald-600 block font-bold">ONLINE</span>
          <span className="text-base font-extrabold text-emerald-700">{healthyCount}</span>
        </div>
        <div className={`p-2 rounded border ${criticalCount > 0 ? 'bg-rose-100/80 border-rose-300' : 'bg-white/80 border-slate-200'}`}>
          <span className={`text-[10px] block font-bold ${criticalCount > 0 ? 'text-rose-700' : 'text-slate-400'}`}>
            CRITICAL
          </span>
          <span className={`text-base font-extrabold ${criticalCount > 0 ? 'text-rose-700' : 'text-slate-800'}`}>
            {criticalCount}
          </span>
        </div>
      </div>

      {/* Footer click prompt */}
      <div className="flex items-center justify-between text-xs pt-3 border-t border-slate-200/60 text-slate-500">
        <span className="font-mono text-[11px]">
          {criticalCount > 0
            ? '⚠️ Cryptographic drop detected'
            : expiringCount > 0
            ? '⚡ Renewal due in <15 days'
            : '✓ mTLS encryption valid'}
        </span>
        <div className="flex items-center space-x-1 font-semibold text-blue-600">
          <span>{isSelected ? 'Filtering Active' : 'View Sensors'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </div>
  );
}
