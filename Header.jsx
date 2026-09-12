import React, { useState, useEffect } from 'react';
import { ShieldCheck, ShieldAlert, Activity, Cpu, Clock, RadioTower } from 'lucide-react';

export default function Header({ isConnected = true, healthScore = 100 }) {
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const isAlarm = healthScore < 85;

  return (
    <header className="bg-white border-b border-slate-200 px-6 py-3.5 sticky top-0 z-30 shadow-sm">
      <div className="flex items-center justify-between">
        {/* Logo & Facility Identification */}
        <div className="flex items-center space-x-3.5">
          <div className={`p-2 rounded-lg border ${isAlarm ? 'bg-rose-50 border-rose-200 text-rose-600' : 'bg-blue-50 border-blue-200 text-blue-700'}`}>
            {isAlarm ? <ShieldAlert className="w-6 h-6 animate-pulse" /> : <ShieldCheck className="w-6 h-6" />}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-base tracking-tight text-slate-900 font-mono">
                CHEMSECURE
              </span>
              <span className="bg-blue-700 text-white text-[10px] font-bold px-1.5 py-0.5 rounded tracking-wider uppercase">
                TLS GUARDIAN
              </span>
              <span className="text-[11px] bg-slate-100 text-slate-600 font-mono px-2 py-0.5 rounded border border-slate-200">
                SCADA v3.0
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              DigiFormers Chemical Operations — Plant 04 (Corridor B)
            </p>
          </div>
        </div>

        {/* Industrial Status and Live SCADA Clock */}
        <div className="flex items-center space-x-5">
          {/* Telemetry Connection Indicator */}
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-md bg-slate-50 border border-slate-200">
            <span className="relative flex h-2.5 w-2.5">
              {isConnected ? (
                <>
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </>
              ) : (
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
              )}
            </span>
            <span className="text-xs font-semibold tracking-wider text-slate-700 font-mono">
              {isConnected ? 'SCADA LINK: ENCRYPTED' : 'SCADA LINK: DISCONNECTED'}
            </span>
          </div>

          {/* Plant Security Posture Badge */}
          <div className="hidden sm:flex items-center space-x-2 text-xs font-mono px-3 py-1.5 rounded-md bg-slate-50 border border-slate-200">
            <RadioTower className="w-3.5 h-3.5 text-blue-600" />
            <span className="text-slate-500">mTLS Status:</span>
            <span className={`font-bold ${healthScore >= 85 ? 'text-emerald-600' : healthScore >= 60 ? 'text-amber-600' : 'text-rose-600'}`}>
              {healthScore >= 85 ? 'HEALTHY' : healthScore >= 60 ? 'DEGRADED' : 'COMPROMISED'}
            </span>
          </div>

          {/* Precision Clock */}
          <div className="flex items-center space-x-2 text-slate-800 bg-slate-100/80 px-3 py-1.5 rounded-md border border-slate-200 font-mono text-xs font-semibold">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>{timeStr || '--:--:--'}</span>
            <span className="text-[10px] text-slate-400 uppercase">UTC+5:30</span>
          </div>
        </div>
      </div>
    </header>
  );
}
