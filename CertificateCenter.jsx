import React from 'react';
import { Key, ShieldCheck, ShieldAlert, Cpu, CalendarClock, Lock, CheckCircle2 } from 'lucide-react';
import CertificateTable from '../components/CertificateTable';
import CertChainViewer from '../components/CertChainViewer';

export default function CertificateCenter({ certificates = [], sensors = [] }) {
  const totalCerts = certificates.length;
  const healthyCerts = certificates.filter((c) => c.status === 'Healthy').length;
  const expiringCerts = certificates.filter((c) => c.status === 'Expiring').length;
  const expiredCerts = certificates.filter((c) => c.status === 'Expired').length;

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              PKI REPOSITORY
            </span>
            <span className="text-xs text-slate-400 font-mono">X.509 v3 Standard</span>
          </div>
          <h1 className="text-xl font-extrabold text-slate-900 mt-1 font-mono tracking-tight">
            Chemical Plant SSL/TLS Certificate Center
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Cryptographic identity registry for all SCADA sensors, edge gateways, and pipeline monitors. Monitored continuously to prevent telemetry blackout.
          </p>
        </div>

        {/* Quick Summary Badges */}
        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800">
            <span className="block text-[10px] text-emerald-600 uppercase font-bold">HEALTHY</span>
            <span className="text-base font-extrabold">{healthyCerts}</span>
          </div>
          <div className="px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg text-amber-800">
            <span className="block text-[10px] text-amber-600 uppercase font-bold">EXPIRING</span>
            <span className="text-base font-extrabold">{expiringCerts}</span>
          </div>
          <div className="px-3 py-2 bg-rose-50 border border-rose-200 rounded-lg text-rose-800">
            <span className="block text-[10px] text-rose-600 uppercase font-bold">EXPIRED</span>
            <span className="text-base font-extrabold">{expiredCerts}</span>
          </div>
        </div>
      </div>

      {/* Main Certificate Inventory Table with Search & Drawer */}
      <section>
        <CertificateTable certificates={certificates} />
      </section>

      {/* Static Visual PKI Hierarchy Demonstration */}
      <section className="mt-8">
        <CertChainViewer
          certificate={
            certificates.find((c) => c.status === 'Expired') ||
            certificates.find((c) => c.status === 'Expiring') ||
            certificates[0]
          }
        />
      </section>
    </div>
  );
}
