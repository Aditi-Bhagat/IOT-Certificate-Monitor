import React from 'react';
import { ShieldCheck, ShieldAlert, ArrowDown, Key, FileCode, CheckCircle, AlertTriangle } from 'lucide-react';
import { getStatusBadge } from './certificateUtils';

export default function CertChainViewer({ certificate = null }) {
  const leafName = certificate?.certName || 'tls-sensor-device.chemsec.local';
  const leafIssuer = certificate?.issuer || 'DigiFormers Intermediate SubCA';
  const leafStatus = certificate?.status || 'Healthy';
  const leafDays = certificate?.daysRemaining !== undefined ? certificate.daysRemaining : 45;
  const leafBadge = getStatusBadge(leafStatus);
  const isExpired = leafStatus === 'Expired';

  const chainNodes = [
    {
      level: 'ROOT CA',
      title: 'DigiFormers Global Industrial Root CA 2020',
      subject: 'CN=DigiFormers Chemical Plant Root G2, O=DigiFormers PKI Services',
      validity: '2020-01-01 to 2035-12-31 (10 years)',
      status: 'Healthy',
      key: 'RSA 4096 / SHA-384',
      badge: { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', text: 'VALID TRUST ANCHOR' },
    },
    {
      level: 'INTERMEDIATE CA',
      title: leafIssuer || 'DigiFormers Plant Intermediate CA',
      subject: `CN=${leafIssuer}, OU=SCADA Security Grid, O=DigiFormers`,
      validity: '2022-04-10 to 2030-04-10',
      status: 'Healthy',
      key: 'RSA 4096 / SHA-256',
      badge: { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', text: 'VERIFIED CHAIN' },
    },
    {
      level: 'EDGE GATEWAY CERTIFICATE',
      title: 'Plant Corridor B Edge SCADA Ingress Gateway',
      subject: 'CN=gateway-corridor-b.scada.chemsec.local, OU=Field Gateways',
      validity: '2024-01-01 to 2027-01-01',
      status: 'Healthy',
      key: 'ECDSA P-384 / SHA-384',
      badge: { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', text: 'ACTIVE LISTENER' },
    },
    {
      level: 'LEAF / DEVICE CERTIFICATE',
      title: leafName,
      subject: `CN=${leafName}, OU=IoT Chemical Sensors, L=Corridor-B`,
      validity: certificate?.expiryDate ? `Expires: ${certificate.expiryDate}` : 'Current validity period',
      status: leafStatus,
      key: certificate?.keyAlgorithm || 'RSA 2048 / SHA-256',
      badge: isExpired
        ? { bg: 'bg-rose-100 text-rose-700 border-rose-300 animate-pulse', text: 'INVALID: EXPIRED (0d)' }
        : leafStatus === 'Expiring'
        ? { bg: 'bg-amber-100 text-amber-700 border-amber-300', text: `EXPIRING SOON (${leafDays}d)` }
        : { bg: 'bg-emerald-100 text-emerald-700 border-emerald-300', text: `VALID (${leafDays}d left)` },
    },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200">
        <div className="flex items-center space-x-2">
          <Key className="w-4 h-4 text-blue-600" />
          <h3 className="font-bold text-slate-800 text-sm font-mono tracking-tight">
            X.509 PUBLIC KEY INFRASTRUCTURE (PKI) TRUST CHAIN
          </h3>
        </div>
        <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
          Hierarchical Path Validation
        </span>
      </div>

      {/* Visual Chain Progression */}
      <div className="space-y-3">
        {chainNodes.map((node, index) => {
          const isLast = index === chainNodes.length - 1;
          const nodeExpired = isLast && isExpired;

          return (
            <React.Fragment key={index}>
              <div
                className={`p-3.5 rounded-lg border transition-all ${
                  nodeExpired
                    ? 'bg-rose-50/70 border-rose-300 ring-2 ring-rose-400/40'
                    : 'bg-slate-50/80 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div>
                    <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-slate-400 block">
                      LEVEL {index + 1}: {node.level}
                    </span>
                    <h4 className={`text-xs font-bold font-mono ${nodeExpired ? 'text-rose-800' : 'text-slate-800'}`}>
                      {node.title}
                    </h4>
                  </div>
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${node.badge.bg}`}
                  >
                    {node.badge.text}
                  </span>
                </div>

                <p className="text-[11px] text-slate-500 font-mono truncate mt-0.5">
                  Subject: {node.subject}
                </p>

                <div className="mt-2 pt-2 border-t border-slate-200/60 flex flex-wrap items-center justify-between text-[10px] font-mono text-slate-500 gap-1">
                  <span>Crypto: {node.key}</span>
                  <span>{node.validity}</span>
                </div>
              </div>

              {!isLast && (
                <div className="flex justify-center -my-1">
                  <div className="flex flex-col items-center">
                    <div className="w-0.5 h-2 bg-slate-300"></div>
                    <ArrowDown className="w-4 h-4 text-slate-400 -my-0.5" />
                    <div className="w-0.5 h-2 bg-slate-300"></div>
                  </div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {isExpired && (
        <div className="mt-4 p-3 bg-rose-100/70 border border-rose-300 rounded-lg text-xs font-mono text-rose-800 flex items-start space-x-2">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block">PKI TRUST PATH EVALUATION: REJECTED</span>
            <p className="text-[11px] text-rose-700 mt-0.5">
              SCADA ingress rejected client handshake. Certificate revocation or expiry validation failed at Leaf Level 4. Handshake aborted before telemetry session key negotiation.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
