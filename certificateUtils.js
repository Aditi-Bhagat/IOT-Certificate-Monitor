/**
 * Utility functions for certificate status formatting and styling.
 */

export function getStatusBadge(status) {
  switch (status) {
    case 'Healthy':
      return {
        bg: 'bg-emerald-50',
        text: 'text-emerald-700',
        border: 'border-emerald-200',
        dot: 'bg-emerald-500',
        label: 'Healthy',
      };
    case 'Expiring':
      return {
        bg: 'bg-amber-50',
        text: 'text-amber-700',
        border: 'border-amber-200',
        dot: 'bg-amber-500',
        label: 'Expiring Soon',
      };
    case 'Expired':
      return {
        bg: 'bg-rose-50',
        text: 'text-rose-700',
        border: 'border-rose-300',
        dot: 'bg-rose-500',
        label: 'Expired (Offline)',
      };
    default:
      return {
        bg: 'bg-slate-50',
        text: 'text-slate-700',
        border: 'border-slate-200',
        dot: 'bg-slate-400',
        label: status || 'Unknown',
      };
  }
}

export function getTelemetryBadge(telemetry) {
  if (telemetry === 'Online') {
    return {
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      dot: 'bg-emerald-500 animate-pulse',
      label: 'ONLINE',
    };
  }
  return {
    bg: 'bg-rose-50 text-rose-700 border-rose-300',
    dot: 'bg-rose-500',
    label: 'OFFLINE',
  };
}

export function getHealthScoreCategory(score) {
  if (score >= 85) {
    return {
      label: 'Optimal Plant Security',
      color: 'text-emerald-600',
      stroke: '#16A34A',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
    };
  } else if (score >= 60) {
    return {
      label: 'Degraded — Renewals Due',
      color: 'text-amber-600',
      stroke: '#F59E0B',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
    };
  } else {
    return {
      label: 'CRITICAL SECURITY BREACH',
      color: 'text-rose-600',
      stroke: '#DC2626',
      bgColor: 'bg-rose-50',
      borderColor: 'border-rose-300',
    };
  }
}
