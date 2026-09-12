import React from 'react';
import { Radio, AlertTriangle, ShieldCheck, ShieldAlert, Clock, ArrowUpRight } from 'lucide-react';
import { getStatusBadge, getTelemetryBadge } from '../utils/certificateUtils';

export default function SensorTable({ sensors = [], onSelectSensor = null }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
      <div className="px-5 py-3.5 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Radio className="w-4 h-4 text-blue-600 animate-pulse" />
          <h3 className="font-bold text-slate-800 text-sm font-mono tracking-tight">
            LIVE INDUSTRIAL SENSOR TELEMETRY &amp; CRYPTOGRAPHIC STATE
          </h3>
        </div>
        <span className="text-xs font-mono text-slate-500">
          Showing {sensors.length} SCADA Nodes
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-100/90 text-slate-600 font-mono text-[11px] uppercase tracking-wider border-b border-slate-200">
              <th className="py-3 px-4 font-semibold">Sensor ID &amp; Name</th>
              <th className="py-3 px-4 font-semibold">Plant Zone</th>
              <th className="py-3 px-4 font-semibold">Current Reading</th>
              <th className="py-3 px-4 font-semibold">TLS Cert Status</th>
              <th className="py-3 px-4 font-semibold">Days Left</th>
              <th className="py-3 px-4 font-semibold">Telemetry</th>
              <th className="py-3 px-4 font-semibold">Last Seen</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {sensors.map((sensor) => {
              const isOffline = sensor.telemetry === 'Offline';
              const cert = sensor.certificate || {};
              const certStatus = cert.status || 'Healthy';
              const badge = getStatusBadge(certStatus);
              const telemetryBadge = getTelemetryBadge(sensor.telemetry);

              return (
                <tr
                  key={sensor.sensorId}
                  onClick={() => onSelectSensor && onSelectSensor(sensor)}
                  className={`transition-colors hover:bg-slate-50/90 ${
                    isOffline ? 'bg-rose-50/50 hover:bg-rose-50' : ''
                  } ${onSelectSensor ? 'cursor-pointer' : ''}`}
                >
                  {/* Sensor Name and ID */}
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-slate-800 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 text-[11px]">
                        {sensor.sensorId}
                      </span>
                      <span className="font-medium text-slate-700 truncate max-w-[160px] sm:max-w-none">
                        {sensor.name}
                      </span>
                    </div>
                  </td>

                  {/* Plant Zone */}
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                      {sensor.zone}
                    </span>
                  </td>

                  {/* Reading Value */}
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <span
                        className={`font-mono font-bold text-sm ${
                          isOffline ? 'text-rose-600 font-extrabold' : 'text-slate-900'
                        }`}
                      >
                        {sensor.value}
                      </span>
                      {!isOffline && (
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Certificate Status */}
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${badge.bg} ${badge.text} ${badge.border}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                      <span>{badge.label}</span>
                    </span>
                  </td>

                  {/* Days Left */}
                  <td className="py-3 px-4">
                    <span
                      className={`font-mono font-bold ${
                        cert.daysRemaining <= 0
                          ? 'text-rose-600 bg-rose-100 px-2 py-0.5 rounded border border-rose-300'
                          : cert.daysRemaining <= 15
                          ? 'text-amber-700 bg-amber-100 px-2 py-0.5 rounded border border-amber-300'
                          : 'text-slate-700'
                      }`}
                    >
                      {cert.daysRemaining <= 0 ? 'EXPIRED (0d)' : `${cert.daysRemaining} days`}
                    </span>
                  </td>

                  {/* Telemetry Stream */}
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center space-x-1.5 px-2 py-0.5 rounded font-mono font-bold text-[10px] tracking-wider border ${telemetryBadge.bg}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${telemetryBadge.dot}`} />
                      <span>{telemetryBadge.label}</span>
                    </span>
                  </td>

                  {/* Last Seen */}
                  <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span className={isOffline ? 'text-rose-600 font-bold' : ''}>
                        {sensor.lastSeen}
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
