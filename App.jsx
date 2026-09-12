import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import CertificateCenter from './pages/CertificateCenter';
import PlantZones from './pages/PlantZones';
import { usePolling } from './hooks/usePolling';

export default function App() {
  const {
    sensors,
    certificates,
    alerts,
    healthScore,
    isConnected,
    actionLoading,
    handleSimulateExpiry,
    handleResetDemo,
  } = usePolling(1000);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      {/* SCADA Top Header */}
      <Header isConnected={isConnected} healthScore={healthScore} />

      {/* Main Body Layout: Sidebar + Operational Viewport */}
      <div className="flex-1 flex overflow-hidden">
        <Sidebar alertCount={alerts.length} healthScore={healthScore} />

        <main className="flex-1 overflow-y-auto p-6 md:p-8 max-w-7xl mx-auto w-full">
          <Routes>
            <Route
              path="/"
              element={
                <Dashboard
                  sensors={sensors}
                  certificates={certificates}
                  alerts={alerts}
                  healthScore={healthScore}
                  onSimulateExpiry={handleSimulateExpiry}
                  onResetDemo={handleResetDemo}
                  actionLoading={actionLoading}
                />
              }
            />
            <Route
              path="/certificates"
              element={
                <CertificateCenter
                  certificates={certificates}
                  sensors={sensors}
                />
              }
            />
            <Route
              path="/zones"
              element={<PlantZones sensors={sensors} />}
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
