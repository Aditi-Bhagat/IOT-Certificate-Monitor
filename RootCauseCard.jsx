import React from 'react';
import { Sparkles, AlertOctagon, Terminal, ShieldX, Wrench, ArrowRight, CheckCircle } from 'lucide-react';

export default function RootCauseCard({ alert, onResolve = null }) {
  if (!alert || !alert.rootCause) return null;

  const { sensor, zone, expiredCert, issuer, whyTelemetryStopped, recommendedAction } = alert.rootCause;

  return (
    <div className="bg-gradient-to-br from-rose-900/90 via-slate-900 to-[#0B132B] text-white rounded-xl p-6 shadow-xl border border-rose-500/40 relative overflow-hidden">
      {/* Background industrial pattern */}
      <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
        <ShieldX className="w-48 h-48 text-rose-500" />
      </div>

      <div className="relative z-10">
        {/* Header with AI Badge */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-rose-500/30">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-rose-500/20 border border-rose-500/40 text-rose-400">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-rose-300">
                  SCADA ROOT CAUSE INTELLIGENCE
                </span>
                <span className="bg-rose-500/30 text-rose-200 border border-rose-400/40 text-[10px] font-mono font-extrabold px-2 py-0.5 rounded-full">
                  AUTONOMOUS INCIDENT TRIAGE
                </span>
              </div>
              <h3 className="text-base font-bold text-white tracking-tight mt-0.5">
                Mutual TLS Handshake Breakdown &amp; Cryptographic Blackout Analysis
              </h3>
            </div>
          </div>

          <div className="flex items-center space-x-2 font-mono text-xs text-rose-200 bg-rose-950/60 px-3 py-1.5 rounded-lg border border-rose-800">
            <AlertOctagon className="w-4 h-4 text-rose-400 animate-pulse" />
            <span>ALARM REF: {alert.id}</span>
          </div>
        </div>

        {/* Triage Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-5 font-mono text-xs">
          <div className="bg-slate-900/80 p-3.5 rounded-lg border border-slate-700/80">
            <span className="text-slate-400 text-[10px] uppercase font-bold block mb-1">AFFECTED SCADA NODE</span>
            <p className="font-bold text-white text-sm truncate">{sensor}</p>
            <span className="text-rose-400 text-[11px] mt-1 inline-block">Zone: {zone}</span>
          </div>

          <div className="bg-slate-900/80 p-3.5 rounded-lg border border-slate-700/80">
            <span className="text-slate-400 text-[10px] uppercase font-bold block mb-1">EXPIRED LEAF CERTIFICATE</span>
            <p className="font-bold text-rose-300 text-sm truncate">{expiredCert}</p>
            <span className="text-slate-400 text-[11px] mt-1 inline-block truncate">Issuer: {issuer || 'Plant CA SubCA'}</span>
          </div>

          <div className="bg-slate-900/80 p-3.5 rounded-lg border border-slate-700/80">
            <span className="text-slate-400 text-[10px] uppercase font-bold block mb-1">TELEMETRY IMPACT</span>
            <p className="font-bold text-rose-400 text-sm">ENCRYPTION TUNNEL BROKEN</p>
            <span className="text-slate-300 text-[11px] mt-1 inline-block">Sensor Signal: Dropped (Offline)</span>
          </div>
        </div>

        {/* Deep Dive Breakdown */}
        <div className="space-y-3.5">
          {/* Why telemetry stopped */}
          <div className="bg-slate-900/90 rounded-lg p-4 border border-slate-700/80">
            <div className="flex items-center space-x-2 text-rose-400 font-mono text-xs font-bold mb-1.5">
              <Terminal className="w-3.5 h-3.5" />
              <span>DIAGNOSTIC EVIDENCE: WHY DID TELEMETRY STOP?</span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed font-sans">
              {whyTelemetryStopped}
            </p>
          </div>

          {/* Recommended action */}
          <div className="bg-emerald-950/40 rounded-lg p-4 border border-emerald-500/40">
            <div className="flex items-center space-x-2 text-emerald-400 font-mono text-xs font-bold mb-1.5">
              <Wrench className="w-3.5 h-3.5" />
              <span>PRESCRIBED REMEDIATION WORKFLOW</span>
            </div>
            <p className="text-xs text-emerald-100 leading-relaxed font-sans">
              {recommendedAction}
            </p>
          </div>
        </div>

        {/* Footer info note */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-slate-400 font-mono gap-2">
          <span>Standards Compliance: IEC 62443-4-2 / NIST SP 800-82 Industrial Security</span>
          {onResolve && (
            <button
              onClick={onResolve}
              className="px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all flex items-center space-x-1 self-start sm:self-auto shadow-md"
            >
              <span>Simulate Emergency CA Re-Enrollment</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
