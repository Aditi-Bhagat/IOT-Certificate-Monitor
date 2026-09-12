import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchSensors, fetchCertificates, fetchAlerts, simulateExpiry, resetDemo } from '../utils/api';

export function usePolling(intervalMs = 1000) {
  const [sensors, setSensors] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [healthScore, setHealthScore] = useState(100);
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [lastTick, setLastTick] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const isMountedRef = useRef(true);

  const refreshData = useCallback(async () => {
    try {
      const [sensorRes, certsRes, alertsRes] = await Promise.all([
        fetchSensors(),
        fetchCertificates(),
        fetchAlerts(),
      ]);

      if (!isMountedRef.current) return;

      if (sensorRes.sensors && sensorRes.sensors.length > 0) {
        setSensors(sensorRes.sensors);
        setHealthScore(sensorRes.healthScore);
        setIsConnected(true);
      } else {
        setIsConnected(false);
      }

      setCertificates(certsRes);
      setAlerts(alertsRes);
      setLastTick(new Date());
      setLoading(false);
    } catch (err) {
      if (isMountedRef.current) {
        setIsConnected(false);
        setLoading(false);
      }
    }
  }, []);

  // Polling loop
  useEffect(() => {
    isMountedRef.current = true;
    refreshData();

    const timer = setInterval(() => {
      refreshData();
    }, intervalMs);

    return () => {
      isMountedRef.current = false;
      clearInterval(timer);
    };
  }, [refreshData, intervalMs]);

  const handleSimulateExpiry = async (sensorId) => {
    setActionLoading(true);
    await simulateExpiry(sensorId);
    await refreshData();
    setActionLoading(false);
  };

  const handleResetDemo = async () => {
    setActionLoading(true);
    await resetDemo();
    await refreshData();
    setActionLoading(false);
  };

  return {
    sensors,
    certificates,
    alerts,
    healthScore,
    loading,
    isConnected,
    lastTick,
    actionLoading,
    refreshData,
    handleSimulateExpiry,
    handleResetDemo,
  };
}
