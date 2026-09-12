# ChemSecure TLS Guardian
### Real-Time SSL/TLS Certificate Posture & Telemetry Disruption Monitor for Chemical Plants

Built for the **DigiFormers Hackathon**.

---

## 1. Problem Statement

> **"Expired SSL/TLS certificates breaking real-time IoT sensor telemetry in chemical plants."**

Modern industrial chemical operations increasingly mandate cryptographic validation for operational technology (OT) under standards like **IEC 62443** and **NIST SP 800-82**. Field instruments—such as reactor core temperature probes, VOC gas detectors, overpressure relief valves, and storage tanks—stream telemetry over Mutual TLS (mTLS) to SCADA ingress gateways.

When an X.509 SSL/TLS certificate silently expires:
1. **mTLS Handshake Fails:** The gateway instantly rejects unauthenticated packets with `SSL_ERROR_CERT_HAS_EXPIRED`.
2. **Telemetry Freezes:** The sensor becomes "Offline" or enters an unmonitored silent state.
3. **Loss of Situational Awareness:** Control room operators are blinded to runaway exothermic reactions, toxic gas leaks, or dangerous boiler pressure spikes.
4. **False Plant Trips or Explosions:** Inability to distinguish between an instrument fault and an active physical disaster leads to costly emergency plant shutdowns ($500k+/hr) or catastrophic safety violations.

---

## 2. Why SSL/TLS Expiry is Dangerous in Chemical Plants

Unlike consumer web applications where a broken certificate merely displays a browser warning:
* **No Human in the Loop:** Headless IoT sensors cannot click "Proceed Anyway". They abort connections automatically.
* **Cascading Failsafes:** Safety Instrumented Systems (SIS) may engage emergency shutdown valves (ESD), venting toxic volatile organic compounds (VOCs) or stopping coolant loops.
* **Air-Gapped Blind Spots:** Industrial control networks (Purdue Model Levels 1 & 2) frequently lack automated public internet ACME enrollment (Let's Encrypt), relying on poorly tracked manual spreadsheets or fragmented enterprise PKI.

---

## 3. Solution Overview

**ChemSecure TLS Guardian** is an industrial SCADA control-room monitoring console purpose-built for chemical plant telemetry integrity. 

It continuously correlates **X.509 certificate cryptographic lifecycles** with **live sensor telemetry streams**. When a certificate expires:
* Telemetry streams are immediately isolated.
* Affected plant zones shift from Healthy (Green) to Warning (Amber) or Critical (Red).
* An **Autonomous Root Cause Intelligence (AI Triage)** panel explains the cryptographic handshake failure in human-readable plain language.
* Operators receive instant actionable remediation procedures without guessing why readings froze.

---

## 4. System Architecture

```
+-----------------------------------------------------------------------------------+
|                        CHEMSECURE TLS GUARDIAN ARCHITECTURE                       |
+-----------------------------------------------------------------------------------+

   +--------------------------+       +--------------------------+
   |   Chemical Plant IoT     |       |    Plant Operational     |
   |   Sensors (10 Nodes)     |       |    Zones (5 Sectors)     |
   |  - Temp, Pressure, Gas,  |       |  - Reactor, Boiler,      |
   |    Level, pH, Flow, etc. |       |    Storage, Pipe, Tower  |
   +------------+-------------+       +------------+-------------+
                |                                  |
                +-----------------+----------------+
                                  |
                                  v
                      +-----------------------+
                      |   Mutual TLS (mTLS)   |
                      |  Cryptographic Tunnel |
                      |   (RSA-4096 / P-384)  |
                      +-----------+-----------+
                                  |
            [ Leaf Cert Valid ]   |   [ Cert Expired (Handshake Drop) ]
            +---------------------+---------------------+
            |                                           |
            v                                           v
+-----------------------+                   +-----------------------+
| SCADA Gateway Ingress |                   | SCADA Ingress Drop    |
| Live Telemetry Stream |                   | Telemetry Stream Freeze
+-----------+-----------+                   +-----------+-----------+
            |                                           |
            +---------------------+---------------------+
                                  |
                                  v
                    +---------------------------+
                    |  Flask REST Backend API   |
                    |  (mock_data, cert_utils)  |
                    |  - 1-Sec Telemetry Drift  |
                    |  - Live Health Scoring    |
                    +-------------+-------------+
                                  |
                        HTTP / JSON Polling (1s)
                                  |
                                  v
                    +---------------------------+
                    |   React / Vite SCADA UI   |
                    |  - SCADA Control Room     |
                    |  - Plant Security Gauge   |
                    |  - Real-Time Line Charts  |
                    |  - AI Root Cause Triage   |
                    |  - Interactive Simulator  |
                    +---------------------------+
```

---

## 5. Key Features

* **Real-Time Telemetry Simulation:** Dynamic 1-second drift across 10 chemical sensors mimicking actual industrial physics (temperature, pressure, gas ppm, tank level).
* **Cryptographic Health Scoring Gauge:** Dynamic 0–100 plant security score:
  $$\text{Health Score} = \max(0, 100 - (15 \times \text{Expired}) - (5 \times \text{Expiring}))$$
* **Interactive Plant Incident Simulator:**
  * **Simulate Gas Sensor Certificate Expiry:** Breaks sensor `GAS-204` in the Pipeline Network, severing volatile gas telemetry.
  * **Simulate Boiler Gateway Failure:** Severs high-pressure steam telemetry on `BOIL-701` in the Boiler Area.
  * **Reset Plant:** Instantly recovers the plant to pristine operational parameters.
* **Autonomous Root Cause Analysis (AI Triage Card):** Provides technical diagnostics on TLS handshake errors and outlines prescriptive recovery instructions.
* **X.509 PKI Trust Chain Visualizer:** Visual 4-level hierarchy (Root CA $\to$ Intermediate CA $\to$ Edge Gateway $\to$ Device Leaf Certificate).
* **Zone Containment:** Spatial monitoring across 5 critical zones (Reactor Area, Boiler Area, Storage Tank, Cooling Tower, Pipeline Network).
* **Slide-Out Certificate Inspector Drawer:** In-depth examination of common names, serial numbers, key algorithms, cipher suites, and expiration countdowns.

---

## 6. Tech Stack

### Frontend
* **React 19 (Vite):** Ultra-fast build tool and modular UI runtime.
* **Tailwind CSS:** Industrial SCADA light theme (#F8FAFC, #1D4ED8, #16A34A, #F59E0B, #DC2626).
* **React Router DOM v7:** Multi-view routing (Dashboard, Certificate Center, Plant Zones).
* **Recharts:** High-frequency time-series charts, certificate posture donut, and expiry timeline.
* **Lucide React:** Industrial iconography (radiotower, gauge, shield, factory, flame).

### Backend
* **Python 3 / Flask:** Lightweight REST API engine.
* **Flask-CORS:** Cross-origin resource sharing for SCADA client connections.
* **In-Memory State Machine:** Real-time clock tick and incident state engine.

---

## 7. API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | API health check and facility status |
| `GET` | `/api/sensors` | Executes telemetry `tick()`, returns all 10 sensors and aggregate security health score |
| `GET` | `/api/certificates` | Returns X.509 certificate metadata for all monitored sensors |
| `GET` | `/api/alerts` | Returns active real-time alarm queue with root-cause diagnostics |
| `POST` | `/api/simulate-expiry` | Simulates certificate expiration on target sensor (`sensorId`), drops telemetry |
| `POST` | `/api/reset-demo` | Restores pristine operational certificate state, clears alerts, resumes telemetry |

---

## 8. 45–60 Second Hackathon Demo Script

1. **Baseline Operations (0:00 - 0:15):**
   * Open the **Control Dashboard**.
   * Highlight the **Plant Security Health (95/100)** circular gauge.
   * Point out the live updating charts (Temperature, Pressure, Gas ppm, Tank Level) ticking every second.
   * Explain that all 10 chemical sensors stream telemetry through encrypted mTLS tunnels.
2. **Injecting the Incident (0:15 - 0:30):**
   * Click **"Simulate Gas Sensor Certificate Expiry"** in the top simulator bar.
   * Instantly observe:
     * Sensor `GAS-204` drops to **OFFLINE**, value changes to `--`.
     * The Gas Telemetry Chart freezes immediately.
     * The **Pipeline Network** turns Red on the dashboard.
     * The **Plant Security Health Score drops to 80/100**.
3. **Root Cause Analysis (0:30 - 0:45):**
   * Review the **Autonomous Root Cause Intelligence** card that appeared.
   * Show that the AI identified the exact leaf certificate `tls-pipe-voc-detector.chemsec.local`, explained the SSL handshake timeout, and warned against unencrypted bypass in hazardous gas areas.
   * Navigate to **Certificate Center** or **Plant Zones** to show cross-system propagation.
4. **Resolution & Recovery (0:45 - 0:55):**
   * Click **"Reset Plant"**.
   * All certificates return to Healthy, alerts clear, telemetry resumes streaming smoothly.

---

## 9. Quick Start Guide

### Prerequisites
* Python 3.10+
* Node.js 18+ and npm

### 1. Launch Backend (Port 5001)
```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install flask flask-cors
python3 app.py
```
*Backend runs at `http://127.0.0.1:5001`*

### 2. Launch Frontend (Port 5173)
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs at `http://localhost:5173`*

---

## 10. Future Scope

* **Automated ACME / EST Protocol Integration:** Automated micro-enroller daemon directly on Raspberry Pi / ESP32 industrial field gateways to auto-renew certs 30 days prior to expiry.
* **Hardware Security Module (HSM) Attestation:** TPM 2.0 and YubiHSM cryptographic hardware anchoring for critical emergency shutdown valves.
* **OPC-UA / MQTT-SN Native Protocol Interceptors:** Deep packet inspection plugin for industrial protocol gateways.
