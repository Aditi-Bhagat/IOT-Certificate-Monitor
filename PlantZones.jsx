import React, { useState } from 'react';
import { Factory, ShieldCheck, ShieldAlert, AlertTriangle, Layers, Filter, CheckCircle2 } from 'lucide-react';
import ZoneCard from "./ZoneCard";
import SensorTable from "./SensorTable";

export default function PlantZones({ sensors = [] }) {
  const [selectedZone, setSelectedZone] = useState('ALL');

  // The 5 fixed plant zones as specified in requirements
  const PLANT_ZONES = [
    'Reactor Area',
    'Boiler Area',
    'Storage Tank',
    'Cooling Tower',
    'Pipeline Network',
  ];

  // Group sensors by zone
  const zoneSensors = {};
  PLANT_ZONES.forEach((zone) => {
    zoneSensors[zone] = sensors.filter((s) => s.zone === zone);
  });

  // Filtered sensor list based on selected zone
  const displayedSensors =
    selectedZone === 'ALL'
      ? sensors
      : sensors.filter((s) => s.zone === selectedZone);

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              FACILITY TOPOLOGY
            </span>
            <span className="text-xs text-slate-400 font-mono">5 Operational Sectors</span>
          </div>
          <h1 className="text-xl font-extrabold text-slate-900 mt-1 font-mono tracking-tight">
            Chemical Plant Operational Zones
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Physical-to-cryptographic zone mapping. If a leaf sensor certificate expires within a zone, that entire zone flags a containment alert.
          </p>
        </div>

        {/* Clear selection filter button */}
        {selectedZone !== 'ALL' && (
          <button
            onClick={() => setSelectedZone('ALL')}
            className="px-3.5 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-mono font-semibold hover:bg-slate-800 transition-all flex items-center space-x-1.5 self-start md:self-auto shadow-sm"
          >
            <span>Reset Zone Filter ({selectedZone})</span>
          </button>
        )}
      </div>

      {/* 5 Plant Zone Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {PLANT_ZONES.map((zone) => (
          <ZoneCard
            key={zone}
            zoneName={zone}
            sensors={zoneSensors[zone] || []}
            isSelected={selectedZone === zone}
            onClick={() => setSelectedZone(selectedZone === zone ? 'ALL' : zone)}
          />
        ))}
      </div>

      {/* Filtered Zone Sensor Table */}
      <section className="pt-4">
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center space-x-2">
            <Layers className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-bold text-slate-800 font-mono">
              {selectedZone === 'ALL'
                ? 'ALL PLANT SCADA SENSORS (10 NODES)'
                : `SCADA SENSORS IN ${selectedZone.toUpperCase()}`}
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-500">
            Showing {displayedSensors.length} of {sensors.length} sensors
          </span>
        </div>

        <SensorTable sensors={displayedSensors} />
      </section>
    </div>
  );
}
