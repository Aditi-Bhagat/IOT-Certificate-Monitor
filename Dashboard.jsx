import React from 'react';
import {
  Cpu,
  Radio,
  Clock,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  RotateCcw,
  Flame,
  Gauge,
  Factory,
  CheckCircle2,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import StatusCard from "./StatusCard";
import SensorTable from "./SensorTable";
import AlertPanel from "./AlertPanel";
import RootCauseCard from "./RootCauseCard";
import {
  TelemetryLineChart,
  CertHealthPieChart,
  ExpiryTimelineBarChart
} from "./Charts";
import { TelemetryLineChart, CertHealthPieChart, ExpiryTimelineBarChart } from "./Charts";
import { getHealthScoreCategory } from "./certificateUtils";

export default function Dashboard({
  sensors = [],
  certificates = [],
  alerts = [],
  healthScore = 100,
  onSimulateExpiry,
  onResetDemo,
  actionLoading = false,
}) {
  // KPI computations
  const totalSensors = sensors.length;
  const activeTelemetry = sensors.filter((s) => s.telemetry === 'Online').length;
  const expiringCerts = sensors.filter((s) => s.certificate?.status === 'Expiring').length;
  const expiredCerts = sensors.filter((s) => s.certificate?.status === 'Expired').length;
  const criticalAlerts = alerts.filter((a) => a.severity === 'CRITICAL').length;

  const healthCategory = getHealthScoreCategory(healthScore);

  // Circular gauge SVG calculations
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (healthScore / 100) * circumference;

  // Most recent critical alert for Root Cause Analysis
  const latestCriticalAlert = alerts.find((a) => a.severity === 'CRITICAL');

  return (
    <div className="space-y-6 pb-12">
      {/* Section G — Incident Simulator (Top Sticky Action Bar for Hackathon Demo) */}
      <div className="bg-gradient-to-r from-slate-900 via-[#0B132B] to-slate-900 text-white rounded-xl p-4 shadow-lg border border-slate-700 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-blue-500/20 border border-blue-400/40 text-blue-400">
            <Flame className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-blue-300">
                DIGIFORMERS HACKATHON
              </span>
              <span className="bg-blue-600/50 text-blue-200 text-[10px] font-mono px-2 py-0.5 rounded border border-blue-400/40">
                LIVE DEMO BENCH
              </span>
            </div>
            <h2 className="text-sm font-bold text-white tracking-tight">
              Chemical Plant TLS Incident Simulator
            </h2>
          </div>
        </div>

        {/* Demo Simulator Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Button 1: Gas Sensor Expiry */}
          <button
            onClick={() => onSimulateExpiry('GAS-204')}
            disabled={actionLoading}
            className="px-3.5 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-mono font-bold transition-all shadow-md flex items-center space-x-1.5 active:scale-95 disabled:opacity-50"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Simulate Gas Sensor Certificate Expiry</span>
          </button>

          {/* Button 2: Boiler Gateway Failure */}
          <button
            onClick={() => onSimulateExpiry('BOIL-701')}
            disabled={actionLoading}
            className="px-3.5 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-mono font-bold transition-all shadow-md flex items-center space-x-1.5 active:scale-95 disabled:opacity-50"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Simulate Boiler Gateway Failure</span>
          </button>

          {/* Button 3: Reset Plant */}
          <button
            onClick={onResetDemo}
            disabled={actionLoading}
            className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold transition-all shadow-md flex items-center space-x-1.5 active:scale-95 disabled:opacity-50"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Plant</span>
          </button>
        </div>
      </div>

      {/* Section H — Root Cause Analysis (Appears when critical alert exists) */}
      {latestCriticalAlert && (
        <section>
          <RootCauseCard alert={latestCriticalAlert} onResolve={onResetDemo} />
        </section>
      )}

      {/* Section B & C — KPIs and Circular Security Health Gauge */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Section C — Plant Security Health Gauge (4 cols on lg) */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="flex items-center space-x-2">
              <Gauge className="w-4 h-4 text-blue-600" />
              <h3 className="font-bold text-slate-800 text-sm font-mono tracking-tight">
                PLANT SECURITY HEALTH
              </h3>
            </div>
            <span className="text-[10px] font-mono text-slate-400">IEC-62443 PKI</span>
          </div>

          <div className="flex flex-col items-center justify-center my-4">
            <div className="relative w-44 h-44 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 160 160">
                {/* Background track */}
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  stroke="#E2E8F0"
                  strokeWidth="12"
                  fill="transparent"
                />
                {/* Colored progress */}
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  stroke={healthCategory.stroke}
                  strokeWidth="12"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-700 ease-out"
                />
              </svg>

              {/* Center Counter */}
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-3xl font-extrabold font-mono tracking-tight text-slate-900">
                  {healthScore}
                </span>
                <span className="text-xs text-slate-400 font-mono font-semibold">/ 100</span>
                <span className="text-[10px] font-mono text-slate-500 mt-1 uppercase tracking-wider">
                  HEALTH SCORE
                </span>
              </div>
            </div>

            {/* Health Status Category Pill */}
            <div className={`mt-2 px-3 py-1 rounded-full text-xs font-mono font-bold border ${healthCategory.bgColor} ${healthCategory.color} ${healthCategory.borderColor}`}>
              {healthCategory.label}
            </div>
          </div>

          <div className="text-[11px] font-mono text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-center">
            Formula: 100 - (15 × Expired) - (5 × Expiring)
          </div>
        </div>

        {/* Section B — 5 KPI Cards (8 cols on lg) */}
        <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-4">
          <StatusCard
            title="Total Sensors"
            value={totalSensors}
            subtitle="Industrial IoT nodes"
            icon={Cpu}
            variant="default"
            badge="100% Monitored"
          />

          <StatusCard
            title="Active Telemetry"
            value={`${activeTelemetry} / ${totalSensors}`}
            subtitle={activeTelemetry === totalSensors ? 'All streams healthy' : 'Signal loss detected'}
            icon={Radio}
            variant={activeTelemetry === totalSensors ? 'success' : 'critical'}
            pulse={activeTelemetry < totalSensors}
          />

          <StatusCard
            title="Expiring Certificates"
            value={expiringCerts}
            subtitle="< 15 days remaining"
            icon={AlertTriangle}
            variant={expiringCerts > 0 ? 'warning' : 'default'}
          />

          <StatusCard
            title="Expired Certificates"
            value={expiredCerts}
            subtitle={expiredCerts > 0 ? 'mTLS handshake blocked' : '0 security drops'}
            icon={ShieldAlert}
            variant={expiredCerts > 0 ? 'critical' : 'success'}
            pulse={expiredCerts > 0}
          />

          <StatusCard
            title="Critical Alarms"
            value={criticalAlerts}
            subtitle={criticalAlerts > 0 ? 'Action required immediately' : 'Quiet state'}
            icon={Flame}
            variant={criticalAlerts > 0 ? 'critical' : 'default'}
            pulse={criticalAlerts > 0}
          />

          <StatusCard
            title="Security Protocol"
            value="TLS 1.3"
            subtitle="Mutual Auth (mTLS)"
            icon={ShieldCheck}
            variant="primary"
            badge="RFC 8446"
          />
        </div>
      </div>

      {/* Section E & F — Live Telemetry Charts and Alerts Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Live Line Chart (8 cols on lg) */}
        <div className="lg:col-span-8">
          <TelemetryLineChart sensors={sensors} />
        </div>

        {/* Real-time Alerts Panel (4 cols on lg) */}
        <div className="lg:col-span-4">
          <AlertPanel alerts={alerts} />
        </div>
      </div>

      {/* Additional Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CertHealthPieChart sensors={sensors} />
        <ExpiryTimelineBarChart sensors={sensors} />
      </div>

      {/* Section D — Sensor Table */}
      <section>
        <SensorTable sensors={sensors} />
      </section>
    </div>
  );
}
