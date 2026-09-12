# 🔐 IoT TLS Certificate Monitor

> **Real-Time SSL/TLS Certificate Monitoring for Critical Industrial IoT Systems**

A lightweight cybersecurity monitoring system designed to detect **expired, invalid, or soon-to-expire TLS/SSL certificates** used by IoT sensors in critical environments such as chemical plants.

## 🚨 Problem

Modern industrial environments rely heavily on IoT sensors to monitor parameters such as:

* 🌡️ Temperature
* 💨 Gas levels
* ⚙️ Pressure
* 💧 Flow
* 🔥 Other critical process parameters

These devices often communicate with monitoring servers through secure **HTTPS/TLS connections**.

When a TLS certificate expires or becomes invalid, trusted communication can fail. This can result in:

* Loss of sensor connectivity
* Missing or delayed sensor data
* Reduced visibility into plant conditions
* Increased operational and safety risk

The problem is that certificate failures may only be discovered **after communication has already been disrupted**.

## 💡 Our Solution

**IoT TLS Certificate Monitor** continuously checks certificates associated with critical IoT endpoints and provides real-time visibility into their security status.

The system:

1. 🔍 Discovers/checks TLS certificates
2. 📅 Calculates certificate expiration
3. 🚦 Classifies certificate health
4. 🚨 Generates alerts for critical certificates
5. 📊 Displays sensor and certificate status on a dashboard
6. 🧪 Simulates certificate failures for demonstration

## 🏭 System Architecture

```text
                  ┌──────────────────────┐
                  │   Industrial IoT     │
                  │      Sensors         │
                  └──────────┬───────────┘
                             │
                             │ HTTPS / TLS
                             ▼
                  ┌──────────────────────┐
                  │  TLS Certificate     │
                  │  Monitoring Engine   │
                  └──────────┬───────────┘
                             │
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
       ┌────────────┐ ┌────────────┐ ┌────────────┐
       │ Certificate│ │   Sensor   │ │   Alert    │
       │   Checker  │ │   Monitor  │ │   Engine   │
       └────────────┘ └────────────┘ └────────────┘
              │              │              │
              └──────────────┼──────────────┘
                             ▼
                  ┌──────────────────────┐
                  │     Web Dashboard    │
                  └──────────────────────┘
```

## 🚦 Certificate Status

| Status          | Meaning                               |
| --------------- | ------------------------------------- |
| 🟢 **VALID**    | Certificate is valid and healthy      |
| 🟡 **WARNING**  | Certificate is approaching expiration |
| 🟠 **CRITICAL** | Certificate is close to expiration    |
| 🔴 **EXPIRED**  | Certificate has expired               |
| 🔴 **INVALID**  | Certificate validation failed         |

## 🎯 Key Features

### 🔐 TLS Certificate Monitoring

Checks the validity and expiration status of TLS certificates.

### ⏳ Expiration Detection

Calculates the remaining lifetime of certificates and identifies certificates approaching expiration.

### 🚨 Real-Time Alerts

Raises alerts when a certificate becomes expired, invalid, or reaches a critical expiration threshold.

### 📊 Security Dashboard

Provides a centralized view of IoT devices and their certificate health.

### 🧪 Failure Simulation

Allows certificate expiration/failure scenarios to be simulated without requiring real industrial hardware.

### 🏭 Industrial IoT Focus

Designed around the communication requirements of critical IoT systems in environments such as chemical plants.

## 🛠️ Technology Stack

* **Python** — Backend and monitoring engine
* **Flask / FastAPI** — Web API
* **HTML/CSS/JavaScript** — Dashboard
* **Python SSL Library** — TLS certificate inspection
* **JSON** — Lightweight data storage
* **Simulated IoT Sensors** — Demonstration environment

## 📁 Project Structure

```text
iot-tls-cert-monitor/
│
├── backend/
│   ├── app.py
│   ├── certificate_monitor.py
│   └── sensor_simulator.py
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── data/
│   └── sensors.json
│
├── tests/
│   └── test_certificate.py
│
├── requirements.txt
├── .gitignore
└── README.md
```

## ⚙️ How It Works

```text
IoT Endpoint
     │
     ▼
Connect using TLS
     │
     ▼
Retrieve Certificate
     │
     ▼
Check Certificate
     │
     ├── Valid ──────────────► 🟢
     │
     ├── Expiring Soon ─────► 🟡
     │
     ├── Critical ───────────► 🟠
     │
     └── Expired/Invalid ────► 🔴
                                      │
                                      ▼
                               Security Alert
                                      │
                                      ▼
                                 Dashboard
```

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/YOUR-USERNAME/iot-tls-cert-monitor.git
cd iot-tls-cert-monitor
```

### 2. Create a virtual environment

```bash
python -m venv venv
```

Activate it:

**Windows**

```bash
venv\Scripts\activate
```

**Linux/macOS**

```bash
source venv/bin/activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Run the application

```bash
python backend/app.py
```

Then open the dashboard in your browser.

## 🧪 Demo Scenario

The project includes a simulated industrial IoT environment.

### Normal state

```text
Temperature Sensor    🟢 VALID
Pressure Sensor       🟢 VALID
Gas Sensor            🟢 VALID
```

### Certificate failure

A simulated certificate expiration event is triggered.

```text
Temperature Sensor    🔴 EXPIRED
Pressure Sensor       🟢 VALID
Gas Sensor            🟢 VALID
```

The monitoring system detects the change and generates a critical alert.

```text
🚨 CRITICAL ALERT

Temperature Sensor
TLS Certificate Expired

Secure communication requires attention.
```

## 🏆 Hackathon Objective

The goal of this project is to demonstrate how **proactive TLS certificate monitoring** can improve the reliability and security of industrial IoT communication.

Instead of discovering certificate problems after sensor communication fails, organizations can detect certificate issues early and take corrective action.

## 🔮 Future Improvements

For a production-grade system, the following capabilities could be added:

* Automated certificate renewal
* Integration with real industrial IoT devices
* MQTT/TLS monitoring
* Email/SMS notifications
* SIEM integration
* Role-based access control
* Certificate inventory management
* Historical security analytics
* Integration with industrial SCADA/OT monitoring systems
* High-availability monitoring
* Automated incident response

## ⚠️ Disclaimer

This project is a **hackathon prototype and simulation** intended to demonstrate certificate monitoring concepts.

It is not intended to directly control, modify, or interact with safety-critical chemical plant equipment.

## 👥 Team

Built during a hackathon by:

* **Team Member 1**
* **Team Member 2**
* **Team Member 3**
* **Team Member 4**

## 📜 License

This project is released under the MIT License.
