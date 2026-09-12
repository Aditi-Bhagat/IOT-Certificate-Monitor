import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts';
import { Activity, ShieldCheck, CalendarClock, AlertTriangle } from 'lucide-react';

/**
 * Custom Tooltip for Industrial Charts
 */
function CustomTooltip({ active, payload, label, unit = '' }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/95 text-white p-2.5 rounded shadow-lg border border-slate-700 text-xs font-mono">
        <p className="text-slate-400 font-semibold mb-1">Time: {label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }}>
            {entry.name}: <span className="font-bold">{entry.value} {unit}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
}

/**
 * 1. TelemetryLineChart: Shows real-time sensor streams (Temp, Pressure, Gas, Tank Level)
 * Freezes when sensor telemetry is Offline.
 */
export function TelemetryLineChart({ sensors = [] }) {
  const [selectedSensorId, setSelectedSensorId] = useState('ALL');

  // Key demo sensors
  const keySensorIds = ['TEMP-101', 'PRES-301', 'GAS-204', 'LVL-401'];
  const monitoredSensors = sensors.filter((s) => keySensorIds.includes(s.sensorId));

  // Build merged time series for multi-line comparison or individual inspection
  const gasSensor = sensors.find((s) => s.sensorId === 'GAS-204');
  const tempSensor = sensors.find((s) => s.sensorId === 'TEMP-101');
  const presSensor = sensors.find((s) => s.sensorId === 'PRES-301');
  const lvlSensor = sensors.find((s) => s.sensorId === 'LVL-401');

  // Normalize history entries by index (up to last 20)
  const maxLength = Math.max(
    tempSensor?.history?.length || 0,
    presSensor?.history?.length || 0,
    gasSensor?.history?.length || 0,
    lvlSensor?.history?.length || 0
  );

  const combinedData = [];
  for (let i = 0; i < maxLength; i++) {
    const tItem = tempSensor?.history?.[i];
    const pItem = presSensor?.history?.[i];
    const gItem = gasSensor?.history?.[i];
    const lItem = lvlSensor?.history?.[i];

    combinedData.push({
      time: tItem?.timestamp || gItem?.timestamp || pItem?.timestamp || `--:--:${i}`,
      temperature: tItem ? tItem.value : null,
      pressure: pItem ? pItem.value : null,
      gas: gItem ? gItem.value : null,
      tankLevel: lItem ? lItem.value : null,
    });
  }

  const isGasOffline = gasSensor?.telemetry === 'Offline';
  const isTempOffline = tempSensor?.telemetry === 'Offline';

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-2 border-b border-slate-200 gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-blue-600" />
            <h3 className="font-bold text-slate-800 text-sm font-mono tracking-tight">
              LIVE INDUSTRIAL SENSOR TELEMETRY FEEDS (1-SEC INTERVAL)
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Streaming cryptographic mTLS payload buffers. Data stream freezes instantly on certificate expiration.
          </p>
        </div>

        {/* Sensor selector tabs */}
        <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-lg text-xs font-mono">
          <button
            onClick={() => setSelectedSensorId('ALL')}
            className={`px-2.5 py-1 rounded font-medium transition-all ${
              selectedSensorId === 'ALL' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All 4 Streams
          </button>
          <button
            onClick={() => setSelectedSensorId('GAS-204')}
            className={`px-2.5 py-1 rounded font-medium transition-all flex items-center space-x-1 ${
              selectedSensorId === 'GAS-204' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            } ${isGasOffline ? 'text-rose-600 font-bold' : ''}`}
          >
            <span>GAS-204</span>
            {isGasOffline && <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />}
          </button>
          <button
            onClick={() => setSelectedSensorId('TEMP-101')}
            className={`px-2.5 py-1 rounded font-medium transition-all ${
              selectedSensorId === 'TEMP-101' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            TEMP-101
          </button>
          <button
            onClick={() => setSelectedSensorId('PRES-301')}
            className={`px-2.5 py-1 rounded font-medium transition-all ${
              selectedSensorId === 'PRES-301' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            PRES-301
          </button>
        </div>
      </div>

      {/* Real-time multi-stream chart */}
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={combinedData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
            <XAxis
              dataKey="time"
              stroke="#94A3B8"
              fontSize={10}
              tickLine={false}
              fontFamily="JetBrains Mono, monospace"
            />
            <YAxis
              stroke="#94A3B8"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              fontFamily="JetBrains Mono, monospace"
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', paddingTop: '10px' }}
            />

            {(selectedSensorId === 'ALL' || selectedSensorId === 'TEMP-101') && (
              <Line
                type="monotone"
                name="TEMP-101 (Reactor °C)"
                dataKey="temperature"
                stroke="#1D4ED8"
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
            )}

            {(selectedSensorId === 'ALL' || selectedSensorId === 'PRES-301') && (
              <Line
                type="monotone"
                name="PRES-301 (Storage bar)"
                dataKey="pressure"
                stroke="#0284C7"
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
            )}

            {(selectedSensorId === 'ALL' || selectedSensorId === 'GAS-204') && (
              <Line
                type="monotone"
                name={isGasOffline ? 'GAS-204 [STREAM FROZEN - OFFLINE]' : 'GAS-204 (Pipeline VOC ppm)'}
                dataKey="gas"
                stroke={isGasOffline ? '#DC2626' : '#16A34A'}
                strokeWidth={isGasOffline ? 3 : 2}
                strokeDasharray={isGasOffline ? '5 5' : undefined}
                dot={isGasOffline ? { r: 4, fill: '#DC2626' } : false}
                isAnimationActive={false}
              />
            )}

            {(selectedSensorId === 'ALL' || selectedSensorId === 'LVL-401') && (
              <Line
                type="monotone"
                name="LVL-401 (Tank %)"
                dataKey="tankLevel"
                stroke="#D97706"
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {isGasOffline && (
        <div className="mt-3 p-2 bg-rose-50 border border-rose-200 rounded text-xs text-rose-700 flex items-center justify-between font-mono">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 animate-pulse" />
            <span>GAS-204 TELEMETRY DISRUPTED: Ingress dropped due to expired leaf certificate.</span>
          </div>
          <span className="font-bold uppercase tracking-wider text-[10px] bg-rose-200 text-rose-800 px-2 py-0.5 rounded">
            SIGNAL FROZEN
          </span>
        </div>
      )}
    </div>
  );
}

/**
 * 2. CertHealthPieChart: Certificate health distribution (Healthy, Expiring, Expired)
 */
export function CertHealthPieChart({ sensors = [] }) {
  let healthy = 0;
  let expiring = 0;
  let expired = 0;

  sensors.forEach((s) => {
    const status = s.certificate?.status || 'Healthy';
    if (status === 'Healthy') healthy++;
    else if (status === 'Expiring') expiring++;
    else if (status === 'Expired') expired++;
  });

  const data = [
    { name: 'Healthy', value: healthy, color: '#16A34A' },
    { name: 'Expiring (<15d)', value: expiring, color: '#F59E0B' },
    { name: 'Expired', value: expired, color: '#DC2626' },
  ].filter((d) => d.value > 0);

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center space-x-2 mb-1">
          <ShieldCheck className="w-4 h-4 text-blue-600" />
          <h3 className="font-bold text-slate-800 text-sm font-mono tracking-tight">
            TLS CERTIFICATE STATUS POSTURE
          </h3>
        </div>
        <p className="text-xs text-slate-500">Distribution across 10 SCADA leaf certificates.</p>
      </div>

      <div className="h-44 w-full my-2">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={45}
              outerRadius={68}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip unit="Certs" />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-center font-mono text-xs">
        <div className="bg-emerald-50/60 p-1.5 rounded border border-emerald-100">
          <span className="text-[10px] text-emerald-700 block font-semibold">HEALTHY</span>
          <span className="text-sm font-bold text-emerald-800">{healthy}</span>
        </div>
        <div className="bg-amber-50/60 p-1.5 rounded border border-amber-100">
          <span className="text-[10px] text-amber-700 block font-semibold">EXPIRING</span>
          <span className="text-sm font-bold text-amber-800">{expiring}</span>
        </div>
        <div className="bg-rose-50/60 p-1.5 rounded border border-rose-100">
          <span className="text-[10px] text-rose-700 block font-semibold">EXPIRED</span>
          <span className="text-sm font-bold text-rose-800">{expired}</span>
        </div>
      </div>
    </div>
  );
}

/**
 * 3. ExpiryTimelineBarChart: Upcoming expirations sorted by days remaining
 */
export function ExpiryTimelineBarChart({ sensors = [] }) {
  const sorted = [...sensors]
    .map((s) => ({
      sensorId: s.sensorId,
      name: s.name,
      days: s.certificate?.daysRemaining || 0,
      status: s.certificate?.status || 'Healthy',
    }))
    .sort((a, b) => a.days - b.days)
    .slice(0, 6);

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center space-x-2 mb-1">
          <CalendarClock className="w-4 h-4 text-blue-600" />
          <h3 className="font-bold text-slate-800 text-sm font-mono tracking-tight">
            CRITICAL EXPIRY TIMELINE (DAYS LEFT)
          </h3>
        </div>
        <p className="text-xs text-slate-500">Earliest expiration priorities requiring CA re-issuance.</p>
      </div>

      <div className="h-44 w-full my-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={sorted}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F1F5F9" />
            <XAxis
              type="number"
              stroke="#94A3B8"
              fontSize={10}
              tickLine={false}
              fontFamily="JetBrains Mono, monospace"
            />
            <YAxis
              type="category"
              dataKey="sensorId"
              stroke="#64748B"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              fontFamily="JetBrains Mono, monospace"
            />
            <Tooltip content={<CustomTooltip unit="days" />} />
            <Bar dataKey="days" radius={[0, 4, 4, 0]}>
              {sorted.map((entry, index) => {
                let fill = '#16A34A';
                if (entry.days <= 0) fill = '#DC2626';
                else if (entry.days <= 15) fill = '#F59E0B';
                return <Cell key={`bar-${index}`} fill={fill} />;
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="text-[11px] text-slate-500 font-mono flex items-center justify-between pt-2 border-t border-slate-100">
        <span>Target: Automated ACME renewal</span>
        <span className="text-rose-600 font-bold">&lt;15d = Urgent</span>
      </div>
    </div>
  );
}
