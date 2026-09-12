import React, { useState } from 'react';
import { Search, Filter, ShieldCheck, ShieldAlert, Key, X, ExternalLink, Calendar, Server, Cpu, CheckCircle2 } from 'lucide-react';
import { getStatusBadge } from './certificateUtils';
import CertChainViewer from './CertChainViewer';

export default function CertificateTable({ certificates = [] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedCert, setSelectedCert] = useState(null);

  // Filtering
  const filtered = certificates.filter((cert) => {
    const matchesSearch =
      cert.certName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.sensorId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.sensorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.zone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.issuer?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'ALL' || cert.status?.toUpperCase() === statusFilter.toUpperCase();

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4 relative">
      {/* Search & Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search certificates, device IDs, zones, or issuers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center space-x-1.5 font-mono text-xs overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              statusFilter === 'ALL'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All ({certificates.length})
          </button>
          <button
            onClick={() => setStatusFilter('HEALTHY')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center space-x-1 ${
              statusFilter === 'HEALTHY'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
            }`}
          >
            <span>Healthy</span>
            <span className="text-[10px] bg-white/30 px-1 rounded">
              {certificates.filter((c) => c.status === 'Healthy').length}
            </span>
          </button>
          <button
            onClick={() => setStatusFilter('EXPIRING')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center space-x-1 ${
              statusFilter === 'EXPIRING'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
            }`}
          >
            <span>Expiring</span>
            <span className="text-[10px] bg-white/30 px-1 rounded">
              {certificates.filter((c) => c.status === 'Expiring').length}
            </span>
          </button>
          <button
            onClick={() => setStatusFilter('EXPIRED')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center space-x-1 ${
              statusFilter === 'EXPIRED'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
            }`}
          >
            <span>Expired</span>
            <span className="text-[10px] bg-white/30 px-1 rounded">
              {certificates.filter((c) => c.status === 'Expired').length}
            </span>
          </button>
        </div>
      </div>

      {/* Main Certificates Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100/90 text-slate-600 font-mono text-[11px] uppercase tracking-wider border-b border-slate-200">
                <th className="py-3 px-4 font-semibold">Certificate Name</th>
                <th className="py-3 px-4 font-semibold">Assigned Device</th>
                <th className="py-3 px-4 font-semibold">Plant Zone</th>
                <th className="py-3 px-4 font-semibold">CA Issuer</th>
                <th className="py-3 px-4 font-semibold">Expiration Date</th>
                <th className="py-3 px-4 font-semibold">Days Remaining</th>
                <th className="py-3 px-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-slate-400 font-mono">
                    No certificates matched your filter criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((cert, idx) => {
                  const badge = getStatusBadge(cert.status);
                  const isExpired = cert.status === 'Expired';

                  return (
                    <tr
                      key={cert.certName || idx}
                      onClick={() => setSelectedCert(cert)}
                      className={`transition-colors hover:bg-slate-50 cursor-pointer ${
                        isExpired ? 'bg-rose-50/40' : ''
                      } ${selectedCert?.certName === cert.certName ? 'bg-blue-50/60' : ''}`}
                    >
                      {/* Cert Name */}
                      <td className="py-3.5 px-4 font-mono">
                        <div className="flex items-center space-x-2">
                          <Key className={`w-3.5 h-3.5 ${isExpired ? 'text-rose-500' : 'text-slate-400'}`} />
                          <span className={`font-semibold ${isExpired ? 'text-rose-800' : 'text-slate-800'}`}>
                            {cert.certName}
                          </span>
                        </div>
                      </td>

                      {/* Device */}
                      <td className="py-3.5 px-4 font-mono">
                        <span className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded border border-slate-200 font-bold">
                          {cert.sensorId}
                        </span>
                        <span className="text-slate-500 ml-1 text-[11px] truncate block sm:inline">
                          {cert.sensorName}
                        </span>
                      </td>

                      {/* Zone */}
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                          {cert.zone}
                        </span>
                      </td>

                      {/* Issuer */}
                      <td className="py-3.5 px-4 text-slate-600 font-mono text-[11px]">
                        {cert.issuer}
                      </td>

                      {/* Expiry Date */}
                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-700">
                        {cert.expiryDate}
                      </td>

                      {/* Days Remaining */}
                      <td className="py-3.5 px-4 font-mono font-bold">
                        <span
                          className={`${
                            cert.daysRemaining <= 0
                              ? 'text-rose-600 bg-rose-100 px-2 py-0.5 rounded border border-rose-300'
                              : cert.daysRemaining <= 15
                              ? 'text-amber-700 bg-amber-100 px-2 py-0.5 rounded border border-amber-300'
                              : 'text-slate-700'
                          }`}
                        >
                          {cert.daysRemaining <= 0 ? '0d (EXPIRED)' : `${cert.daysRemaining} days`}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${badge.bg} ${badge.text} ${badge.border}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                          <span>{badge.label}</span>
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slide-out Right Drawer for Certificate Inspection */}
      {selectedCert && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/30 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-xl bg-white h-full shadow-2xl border-l border-slate-200 flex flex-col transform transition-transform duration-300 ease-in-out">
            {/* Drawer Header */}
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-lg bg-blue-50 border border-blue-200 text-blue-700">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm font-mono tracking-tight">
                    X.509 CERTIFICATE INSPECTION
                  </h3>
                  <p className="text-xs text-slate-500 font-mono truncate max-w-md">
                    {selectedCert.certName}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCert(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-5 text-xs font-mono">
              {/* Status Banner */}
              <div
                className={`p-4 rounded-xl border flex items-center justify-between ${
                  selectedCert.status === 'Expired'
                    ? 'bg-rose-50 border-rose-300 text-rose-800'
                    : selectedCert.status === 'Expiring'
                    ? 'bg-amber-50 border-amber-300 text-amber-800'
                    : 'bg-emerald-50 border-emerald-300 text-emerald-800'
                }`}
              >
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider block">
                    CRYPTOGRAPHIC VALIDITY POSTURE
                  </span>
                  <p className="text-sm font-bold mt-0.5">
                    {selectedCert.status === 'Expired'
                      ? 'CERTIFICATE EXPIRED — HANDSHAKE BLOCKED'
                      : selectedCert.status === 'Expiring'
                      ? 'EXPIRATION IMMINENT — RENEWAL SCHEDULED'
                      : 'VALID OPERATIONAL CERTIFICATE'}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-extrabold">{selectedCert.daysRemaining}</span>
                  <span className="text-[11px] block text-slate-500">Days Left</span>
                </div>
              </div>

              {/* Attributes Grid */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2.5">
                <h4 className="text-[11px] font-bold uppercase text-slate-500 tracking-wider">
                  Certificate Properties
                </h4>

                <div className="grid grid-cols-2 gap-3 text-[11px]">
                  <div>
                    <span className="text-slate-400 block">Common Name (CN)</span>
                    <span className="font-bold text-slate-800 break-all">{selectedCert.certName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Assigned Sensor</span>
                    <span className="font-bold text-slate-800">{selectedCert.sensorId} ({selectedCert.sensorName})</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Plant Zone</span>
                    <span className="font-bold text-slate-800">{selectedCert.zone}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Issuing Authority</span>
                    <span className="font-bold text-slate-800">{selectedCert.issuer}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Valid Not After (Expiry)</span>
                    <span className="font-bold text-slate-800">{selectedCert.expiryDate}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Serial Number</span>
                    <span className="font-bold text-slate-800">{selectedCert.serialNumber || '4A:9F:88:21:0B:C7:E1'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Key Algorithm</span>
                    <span className="font-bold text-slate-800">{selectedCert.keyAlgorithm || 'RSA 4096-bit (SHA-256)'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Cipher Suite</span>
                    <span className="font-bold text-slate-800">{selectedCert.cipherSuite || 'TLS_AES_256_GCM_SHA384'}</span>
                  </div>
                </div>
              </div>

              {/* Chain Viewer Inside Drawer */}
              <div>
                <CertChainViewer certificate={selectedCert} />
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-mono">
                X.509 v3 / PKCS#10 Enrolled
              </span>
              <button
                onClick={() => setSelectedCert(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-mono font-semibold hover:bg-slate-800 transition-all"
              >
                Close Inspection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
