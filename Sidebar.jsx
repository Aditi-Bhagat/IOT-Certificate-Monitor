import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ShieldCheck, Factory, Radio, ShieldAlert, Cpu, Layers } from 'lucide-react';

export default function Sidebar({ alertCount = 0, healthScore = 100 }) {
  const navItems = [
    {
      to: '/',
      label: 'Control Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      to: '/certificates',
      label: 'Certificate Center',
      icon: ShieldCheck,
      badge: null,
    },
    {
      to: '/zones',
      label: 'Plant Zones',
      icon: Factory,
      badge: null,
    },
  ];

  return (
    <aside className="w-64 bg-[#0B132B] text-slate-200 min-h-[calc(100vh-61px)] flex flex-col justify-between border-r border-slate-800 shrink-0">
      <div className="py-6 px-4">
        {/* Category Label */}
        <div className="px-3 pb-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
          SCADA Telemetry & PKI
        </div>

        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`
                }
              >
                <div className="flex items-center space-x-3">
                  <Icon className="w-4 h-4 text-slate-400 group-hover:text-white" />
                  <span>{item.label}</span>
                </div>
                {item.to === '/' && alertCount > 0 && (
                  <span className="bg-rose-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-full animate-pulse">
                    {alertCount}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Industrial Architecture Info */}
        <div className="mt-8 p-3.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs">
          <div className="flex items-center space-x-2 text-blue-400 font-mono font-semibold mb-2">
            <Cpu className="w-3.5 h-3.5" />
            <span>IEC 62443 PKI LAYER</span>
          </div>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            Mutual TLS (mTLS) enforces cryptographic authenticity across chemical plant sensor gateways. Unverified telemetry is dropped.
          </p>
        </div>
      </div>

      {/* Footer Security Status */}
      <div className="p-4 border-t border-slate-800 bg-[#080E21]">
        <div className="flex items-center justify-between text-xs mb-1.5 font-mono">
          <span className="text-slate-400">PLANT INTEGRITY:</span>
          <span className={`font-bold ${healthScore >= 85 ? 'text-emerald-400' : healthScore >= 60 ? 'text-amber-400' : 'text-rose-400'}`}>
            {healthScore}%
          </span>
        </div>
        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${
              healthScore >= 85 ? 'bg-emerald-500' : healthScore >= 60 ? 'bg-amber-500' : 'bg-rose-500'
            }`}
            style={{ width: `${healthScore}%` }}
          />
        </div>
        <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <span>DigiFormers PKI</span>
          <span>SHA-256 / RSA4096</span>
        </div>
      </div>
    </aside>
  );
}
