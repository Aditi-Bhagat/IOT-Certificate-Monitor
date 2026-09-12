/**
 * API client for ChemSecure TLS Guardian
 */

const API_BASE = 'http://127.0.0.1:5001';

export async function fetchSensors() {
  try {
    const res = await fetch(`${API_BASE}/api/sensors`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();
    return {
      sensors: Array.isArray(data) ? data : (data.sensors || []),
      healthScore: data.healthScore !== undefined ? data.healthScore : 100,
    };
  } catch (err) {
    console.error('Failed to fetch sensors:', err);
    return { sensors: [], healthScore: 0, error: err.message };
  }
}

export async function fetchCertificates() {
  try {
    const res = await fetch(`${API_BASE}/api/certificates`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error('Failed to fetch certificates:', err);
    return [];
  }
}

export async function fetchAlerts() {
  try {
    const res = await fetch(`${API_BASE}/api/alerts`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error('Failed to fetch alerts:', err);
    return [];
  }
}

export async function simulateExpiry(sensorId = 'GAS-204') {
  try {
    const res = await fetch(`${API_BASE}/api/simulate-expiry`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sensorId }),
    });
    return await res.json();
  } catch (err) {
    console.error('Failed to simulate expiry:', err);
    return { success: false, error: err.message };
  }
}

export async function resetDemo() {
  try {
    const res = await fetch(`${API_BASE}/api/reset-demo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    return await res.json();
  } catch (err) {
    console.error('Failed to reset demo:', err);
    return { success: false, error: err.message };
  }
}
