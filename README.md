# IOT-Certificate-Monitor

Real-time TLS/SSL certificate monitoring and alert system for simulated critical IoT sensors in chemical plants.

## Hackathon MVP Scope

This project is a **simulation-only prototype** for a 6-hour hackathon.  
It does not control real equipment and does not claim to guarantee industrial safety.

## Project Structure

```text
iot-tls-cert-monitor/
├── backend/
│   ├── app.py
│   ├── certificate_monitor.py
│   └── sensor_simulator.py
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── data/
│   └── sensors.json
├── tests/
│   └── test_certificate.py
├── requirements.txt
└── README.md
```

## Features

- Simulated sensors: Temperature, Pressure, Gas, Flow
- TLS certificate health checks with statuses:
  - `VALID` (> 30 days)
  - `WARNING` (7–30 days)
  - `CRITICAL` (1–6 days)
  - `EXPIRED` (0 or fewer days)
  - `INVALID` (connection/validation failure)
- REST API:
  - `GET /api/sensors`
  - `GET /api/sensors/<sensor_id>`
  - `GET /api/alerts`
  - `POST /api/simulate-expiry`
- Dashboard with auto-refresh and alert panel
- Demo action: **Simulate Certificate Expiry**

## Run Locally

From `/home/runner/work/IOT-Certificate-Monitor/IOT-Certificate-Monitor`:

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python backend/app.py
```

Open:

```text
http://127.0.0.1:5000
```

## Run Tests

```bash
pytest tests/test_certificate.py
```
