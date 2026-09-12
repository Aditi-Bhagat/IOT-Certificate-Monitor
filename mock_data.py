"""
Mock Data and State Management for ChemSecure TLS Guardian
Simulates chemical plant IoT sensors, SSL/TLS certificates, and telemetry feeds.
"""

import copy
import random
from datetime import datetime, timedelta
from certificate_utils import get_certificate_status

# Initial sensor definitions (10 chemical plant sensors across 5 zones)
INITIAL_SENSORS = [
    {
        "sensorId": "TEMP-101",
        "name": "Reactor Core Alpha Temp",
        "zone": "Reactor Area",
        "type": "Temperature",
        "baseValue": 242.5,
        "currentVal": 242.5,
        "value": "242.5 °C",
        "unit": "°C",
        "telemetry": "Online",
        "lastSeen": "Just now",
        "deltaRange": (-0.6, 0.6),
        "history": [],
        "certificate": {
            "certName": "tls-reactor-core-01.chemsec.local",
            "issuer": "DigiFormers Plant CA - Area Alpha",
            "validFrom": "2025-09-15",
            "expiryDate": "2026-09-25",
            "daysRemaining": 13,
            "status": "Expiring",
            "serialNumber": "4A:9F:88:21:0B:C7:E1",
            "keyAlgorithm": "RSA 4096-bit (SHA-256)",
            "cipherSuite": "TLS_AES_256_GCM_SHA384"
        }
    },
    {
        "sensorId": "TEMP-102",
        "name": "Reactor Jacket Temp B",
        "zone": "Reactor Area",
        "type": "Temperature",
        "baseValue": 184.2,
        "currentVal": 184.2,
        "value": "184.2 °C",
        "unit": "°C",
        "telemetry": "Online",
        "lastSeen": "Just now",
        "deltaRange": (-0.4, 0.4),
        "history": [],
        "certificate": {
            "certName": "tls-reactor-jacket-02.chemsec.local",
            "issuer": "DigiFormers Plant CA - Area Alpha",
            "validFrom": "2025-11-01",
            "expiryDate": "2026-11-01",
            "daysRemaining": 50,
            "status": "Healthy",
            "serialNumber": "7B:2C:19:90:5F:AA:03",
            "keyAlgorithm": "ECDSA P-384 (SHA-384)",
            "cipherSuite": "TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384"
        }
    },
    {
        "sensorId": "PRES-301",
        "name": "Storage Vessel A Pressure",
        "zone": "Storage Tank",
        "type": "Pressure",
        "baseValue": 6.8,
        "currentVal": 6.8,
        "value": "6.8 bar",
        "unit": "bar",
        "telemetry": "Online",
        "lastSeen": "Just now",
        "deltaRange": (-0.1, 0.1),
        "history": [],
        "certificate": {
            "certName": "tls-tank-pres-01.chemsec.local",
            "issuer": "DigiFormers Plant CA - Storage Grid",
            "validFrom": "2025-10-01",
            "expiryDate": "2027-04-10",
            "daysRemaining": 210,
            "status": "Healthy",
            "serialNumber": "8D:34:F1:66:99:EE:4B",
            "keyAlgorithm": "RSA 2048-bit (SHA-256)",
            "cipherSuite": "TLS_AES_128_GCM_SHA256"
        }
    },
    {
        "sensorId": "GAS-204",
        "name": "Pipeline VOC Gas Leak Detector",
        "zone": "Pipeline Network",
        "type": "Gas",
        "baseValue": 12.4,
        "currentVal": 12.4,
        "value": "12.4 ppm",
        "unit": "ppm",
        "telemetry": "Online",
        "lastSeen": "Just now",
        "deltaRange": (-0.3, 0.3),
        "history": [],
        "certificate": {
            "certName": "tls-pipe-voc-detector.chemsec.local",
            "issuer": "DigiFormers Pipeline Security SubCA",
            "validFrom": "2025-09-12",
            "expiryDate": "2026-10-02",
            "daysRemaining": 18,
            "status": "Healthy",
            "serialNumber": "1E:44:AC:B2:77:99:32",
            "keyAlgorithm": "RSA 4096-bit (SHA-256)",
            "cipherSuite": "TLS_AES_256_GCM_SHA384"
        }
    },
    {
        "sensorId": "LVL-401",
        "name": "Benzene Storage Tank Level",
        "zone": "Storage Tank",
        "type": "Level",
        "baseValue": 78.5,
        "currentVal": 78.5,
        "value": "78.5 %",
        "unit": "%",
        "telemetry": "Online",
        "lastSeen": "Just now",
        "deltaRange": (-0.2, 0.2),
        "history": [],
        "certificate": {
            "certName": "tls-tank-lvl-benzene.chemsec.local",
            "issuer": "DigiFormers Plant CA - Storage Grid",
            "validFrom": "2025-08-20",
            "expiryDate": "2026-12-15",
            "daysRemaining": 94,
            "status": "Healthy",
            "serialNumber": "99:A1:C8:41:2F:B0:88",
            "keyAlgorithm": "ECDSA P-256 (SHA-256)",
            "cipherSuite": "TLS_AES_128_GCM_SHA256"
        }
    },
    {
        "sensorId": "PH-501",
        "name": "Effluent Neutralization pH",
        "zone": "Pipeline Network",
        "type": "pH",
        "baseValue": 7.15,
        "currentVal": 7.15,
        "value": "7.15 pH",
        "unit": "pH",
        "telemetry": "Online",
        "lastSeen": "Just now",
        "deltaRange": (-0.05, 0.05),
        "history": [],
        "certificate": {
            "certName": "tls-effluent-ph-sensor.chemsec.local",
            "issuer": "DigiFormers Pipeline Security SubCA",
            "validFrom": "2025-07-10",
            "expiryDate": "2026-10-30",
            "daysRemaining": 48,
            "status": "Healthy",
            "serialNumber": "33:FA:59:71:B4:CD:12",
            "keyAlgorithm": "RSA 2048-bit (SHA-256)",
            "cipherSuite": "TLS_AES_128_GCM_SHA256"
        }
    },
    {
        "sensorId": "FLOW-601",
        "name": "Reactor Coolant Line Flow",
        "zone": "Pipeline Network",
        "type": "Flow",
        "baseValue": 340.0,
        "currentVal": 340.0,
        "value": "340.0 L/min",
        "unit": "L/min",
        "telemetry": "Online",
        "lastSeen": "Just now",
        "deltaRange": (-2.5, 2.5),
        "history": [],
        "certificate": {
            "certName": "tls-flow-coolant-primary.chemsec.local",
            "issuer": "DigiFormers Pipeline Security SubCA",
            "validFrom": "2025-06-01",
            "expiryDate": "2027-01-10",
            "daysRemaining": 120,
            "status": "Healthy",
            "serialNumber": "55:DD:72:01:4E:99:99",
            "keyAlgorithm": "RSA 2048-bit (SHA-256)",
            "cipherSuite": "TLS_AES_128_GCM_SHA256"
        }
    },
    {
        "sensorId": "BOIL-701",
        "name": "High-Pressure Steam Boiler",
        "zone": "Boiler Area",
        "type": "Boiler",
        "baseValue": 42.1,
        "currentVal": 42.1,
        "value": "42.1 bar",
        "unit": "bar",
        "telemetry": "Online",
        "lastSeen": "Just now",
        "deltaRange": (-0.3, 0.3),
        "history": [],
        "certificate": {
            "certName": "tls-boiler-gateway-01.chemsec.local",
            "issuer": "DigiFormers Thermal Plant Intermediate CA",
            "validFrom": "2025-05-10",
            "expiryDate": "2026-10-05",
            "daysRemaining": 23,
            "status": "Healthy",
            "serialNumber": "66:9A:88:BB:11:00:FF",
            "keyAlgorithm": "RSA 4096-bit (SHA-256)",
            "cipherSuite": "TLS_AES_256_GCM_SHA384"
        }
    },
    {
        "sensorId": "VLV-801",
        "name": "Boiler Emergency Relief Valve",
        "zone": "Boiler Area",
        "type": "Valve",
        "baseValue": 99.8,
        "currentVal": 99.8,
        "value": "99.8 % Sealed",
        "unit": "%",
        "telemetry": "Online",
        "lastSeen": "Just now",
        "deltaRange": (-0.1, 0.1),
        "history": [],
        "certificate": {
            "certName": "tls-vlv-relief-boiler.chemsec.local",
            "issuer": "DigiFormers Thermal Plant Intermediate CA",
            "validFrom": "2025-08-01",
            "expiryDate": "2027-02-14",
            "daysRemaining": 155,
            "status": "Healthy",
            "serialNumber": "77:33:AA:99:C4:22:67",
            "keyAlgorithm": "ECDSA P-384 (SHA-384)",
            "cipherSuite": "TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384"
        }
    },
    {
        "sensorId": "HUM-901",
        "name": "Cooling Tower Vapor Humidity",
        "zone": "Cooling Tower",
        "type": "Humidity",
        "baseValue": 88.4,
        "currentVal": 88.4,
        "value": "88.4 %RH",
        "unit": "%RH",
        "telemetry": "Online",
        "lastSeen": "Just now",
        "deltaRange": (-0.5, 0.5),
        "history": [],
        "certificate": {
            "certName": "tls-cooling-tower-vapor.chemsec.local",
            "issuer": "DigiFormers Utilities CA Sub-03",
            "validFrom": "2025-09-01",
            "expiryDate": "2027-03-20",
            "daysRemaining": 189,
            "status": "Healthy",
            "serialNumber": "CC:44:88:12:09:AF:81",
            "keyAlgorithm": "RSA 2048-bit (SHA-256)",
            "cipherSuite": "TLS_AES_128_GCM_SHA256"
        }
    }
]

# Generate initial 20 historical readings for smooth chart initialization
def generate_initial_history(sensor):
    now = datetime.now()
    history = []
    val = sensor["baseValue"]
    low, high = sensor["deltaRange"]
    
    for i in range(19, -1, -1):
        t = now - timedelta(seconds=i)
        drift = random.uniform(low, high)
        val = round(max(0.0, val + drift), 2)
        history.append({
            "timestamp": t.strftime("%H:%M:%S"),
            "value": val
        })
    sensor["currentVal"] = val
    sensor["value"] = f"{val} {sensor['unit']}"
    sensor["history"] = history

# Working state
SENSORS = copy.deepcopy(INITIAL_SENSORS)
for s in SENSORS:
    generate_initial_history(s)

ALERTS = []

def get_sensors():
    return SENSORS

def get_certificates():
    certs = []
    for s in SENSORS:
        cert_info = copy.deepcopy(s["certificate"])
        cert_info["sensorId"] = s["sensorId"]
        cert_info["sensorName"] = s["name"]
        cert_info["zone"] = s["zone"]
        certs.append(cert_info)
    return certs

def get_alerts():
    return ALERTS

def tick():
    """
    Simulates live telemetry clock tick.
    If sensor telemetry is Online:
      - updates current reading slightly
      - appends to history (capped at 20)
      - updates lastSeen to 'Just now'
    If sensor telemetry is Offline:
      - DO NOT update reading
      - History freezes
    """
    now_str = datetime.now().strftime("%H:%M:%S")

    for s in SENSORS:
        if s.get("telemetry") == "Online":
            low, high = s["deltaRange"]
            drift = random.uniform(low, high)
            new_val = round(max(0.0, s["currentVal"] + drift), 2)
            s["currentVal"] = new_val
            s["value"] = f"{new_val} {s['unit']}"
            s["lastSeen"] = "Just now"

            # Append to history
            s["history"].append({
                "timestamp": now_str,
                "value": new_val
            })
            if len(s["history"]) > 20:
                s["history"].pop(0)
        else:
            # Telemetry is Offline: freeze history, set value to '--'
            s["value"] = "--"
            s["lastSeen"] = "Signal Lost"

def simulate_expiry(sensor_id):
    """
    Simulates TLS certificate expiry for a specific sensor.
    Immediately breaks secure telemetry channel and generates root-cause alert.
    """
    sensor = next((s for s in SENSORS if s["sensorId"] == sensor_id), None)
    if not sensor:
        return {"success": False, "error": f"Sensor {sensor_id} not found"}

    sensor["telemetry"] = "Offline"
    sensor["value"] = "--"
    sensor["certificate"]["status"] = "Expired"
    sensor["certificate"]["daysRemaining"] = 0
    sensor["lastSeen"] = "Signal Lost"

    now_str = datetime.now().strftime("%H:%M:%S")
    alert_id = f"ALT-{random.randint(1000, 9999)}"

    # Specific root cause narratives tailored for industrial chemical plant safety
    if sensor_id == "GAS-204":
        title = "CRITICAL: Gas Detector TLS Expired — Hazardous Telemetry Lost"
        msg = "Mutual TLS authentication failed on Pipeline VOC Gas Detector. Ingress gateway terminated encrypted session."
        why = "Sensor client certificate 'tls-pipe-voc-detector.chemsec.local' expired. SCADA Gateway rejected mTLS handshake with SSL_ERROR_CERT_HAS_EXPIRED. Per IEC-62443 industrial cybersecurity policy, unauthenticated telemetry packets are immediately dropped."
        action = "Issue immediate CA certificate re-enrollment via DigiFormers SubCA. Dispatch field engineer with handheld VOC monitor to Pipeline Corridor B until encryption is re-established."
    elif sensor_id == "BOIL-701":
        title = "CRITICAL: Steam Boiler Gateway TLS Failure"
        msg = "Boiler thermal gateway certificate expired. Live telemetry connection severed."
        why = "Thermal Plant SubCA certificate 'tls-boiler-gateway-01.chemsec.local' expired. The OPC-UA secure wrapper terminated the telemetry stream. Overpressure safety interlocking is operating blind without central SCADA telemetry."
        action = "Deploy emergency gateway certificate bypass or re-key using plant root credentials. Verify physical pressure gauges on Boiler Manifold 01 immediately."
    else:
        title = f"CRITICAL: Sensor {sensor['sensorId']} TLS Certificate Expired"
        msg = f"Telemetry stream interrupted for {sensor['name']} in {sensor['zone']}."
        why = f"Certificate '{sensor['certificate']['certName']}' reached 0 days remaining. SCADA Gateway dropped connection due to cryptographic validation failure."
        action = f"Renew certificate on {sensor['sensorId']} through DigiFormers CA portal."

    alert = {
        "id": alert_id,
        "timestamp": now_str,
        "severity": "CRITICAL",
        "sensorId": sensor["sensorId"],
        "sensorName": sensor["name"],
        "zone": sensor["zone"],
        "title": title,
        "message": msg,
        "certName": sensor["certificate"]["certName"],
        "rootCause": {
            "sensor": f"{sensor['sensorId']} ({sensor['name']})",
            "zone": sensor["zone"],
            "expiredCert": sensor["certificate"]["certName"],
            "issuer": sensor["certificate"]["issuer"],
            "whyTelemetryStopped": why,
            "recommendedAction": action
        }
    }

    # Insert alert at top
    ALERTS.insert(0, alert)
    return {"success": True, "alert": alert, "sensor": sensor}

def reset_demo():
    """
    Resets the plant to pristine operational state.
    Restores all certificates, clears alerts, and reactivates telemetry feeds.
    """
    global SENSORS, ALERTS
    SENSORS = copy.deepcopy(INITIAL_SENSORS)
    for s in SENSORS:
        generate_initial_history(s)
    ALERTS.clear()
    return {"success": True, "message": "Plant telemetry restored to healthy state."}
