import React from 'react';
import { AlertTriangle, ShieldAlert, CheckCircle2, Bell, AlertOctagon, Terminal } from 'lucide-react';

export default function AlertPanel({ alerts = [] }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col h-full">
      {/* Panel Header */}
      <div className="px-5 py-3.5 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <AlertOctagon className={`w-4 h-4 ${alerts.length > 0 ? 'text-rose-600 animate-pulse' : 'text-slate-500'}`} />
          <h3 className="font-bold text-slate-800 text-sm font-mono tracking-tight">
            ACTIVE SCADA SECURITY ALARMS
          </h3>
        </div>
        <span
          className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-full border ${
            alerts.length > 0
              ? 'bg-rose-100 text-rose-700 border-rose-300 animate-pulse'
              : 'bg-emerald-100 text-emerald-700 border-emerald-300'
          }`}
        >
          {alerts.length} {alerts.length === 1 ? 'ALARM' : 'ALARMS'}
        </span>
      </div>

      {/* Alert Feed Content */}
      <div className="p-4 flex-1 overflow-y-auto max-h-[360px] space-y-3">
        {alerts.length === 0 ? (
          <div className="h-44 flex flex-col items-center justify-center text-center p-4 border border-dashed border-emerald-200 bg-emerald-50/40 rounded-xl">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mb-2" />
            <h4 className="font-bold text-sm text-emerald-800 font-mono">
              ALL SCADA TELEMETRY CHANNELS SECURED
            </h4>
            <p className="text-xs text-emerald-600/90 mt-1 max-w-xs">
              No active certificate expiration faults. Mutual TLS tunnels operating within cryptographic validity window.
            </p>
          </div>
        ) : (
          alerts.map((alert) => {
            const isCritical = alert.severity === 'CRITICAL';
            return (
              <div
                key={alert.id}
                className={`p-3.5 rounded-lg border transition-all ${
                  isCritical
                    ? 'bg-rose-50/90 border-rose-300 shadow-sm ring-1 ring-rose-400/40'
                    : 'bg-amber-50 border-amber-300'
                }`}
              >
                <div className="flex items-start justify-between mb-1.5">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-extrabold uppercase tracking-wider ${
                        isCritical
                          ? 'bg-rose-600 text-white animate-pulse'
                          : 'bg-amber-500 text-white'
                      }`}
                    >
                      {alert.severity}
                    </span>
                    <span className="font-mono text-xs font-bold text-slate-800">
                      {alert.sensorId} • {alert.zone}
                    </span>
                  </div>
                  <span className="font-mono text-[11px] text-slate-500">
                    {alert.timestamp}
                  </span>
                </div>

                <h4 className="text-xs font-bold text-slate-900 mb-1">
                  {alert.title}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {alert.message}
                </p>

                {alert.certName && (
                  <div className="mt-2 pt-2 border-t border-rose-200/70 flex items-center space-x-1.5 text-[11px] font-mono text-rose-700">
                    <Terminal className="w-3 h-3 text-rose-500" />
                    <span className="truncate">Cert CN: {alert.certName}</span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
