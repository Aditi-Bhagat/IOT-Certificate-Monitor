import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Header from './Header';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';
import CertificateCenter from './CertificateCenter';
import PlantZones from './PlantZones';

import { usePolling } from './usePolling';

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
      <Header
        isConnected={isConnected}
        healthScore={healthScore}
      />

      {/* Main Body Layout */}
      <div className="flex-1 flex overflow-hidden">

        <Sidebar
          alertCount={alerts.length}
          healthScore={healthScore}
        />

        <main className="flex-1 overflow-y-auto p-6 md:p-8 max-w-7xl mx-auto w-full">

          <Routes>

            {/* Dashboard */}
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

            {/* Certificate Center */}
            <Route
              path="/certificates"
              element={
                <CertificateCenter
                  certificates={certificates}
                  sensors={sensors}
                />
              }
            />

            {/* Plant Zones */}
            <Route
              path="/zones"
              element={
                <PlantZones sensors={sensors} />
              }
            />

            {/* Unknown URL → Dashboard */}
            <Route
              path="*"
              element={<Navigate to="/" replace />}
            />

          </Routes>

        </main>
      </div>
    </div>
  );
}
