"""
ChemSecure TLS Guardian — Backend API Server
Provides real-time chemical plant IoT telemetry and certificate monitoring endpoints.
"""

from flask import Flask, jsonify, request
from flask_cors import CORS
from mock_data import get_sensors, get_certificates, get_alerts, simulate_expiry, reset_demo, tick
from certificate_utils import calculate_health_score

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

@app.route("/", methods=["GET"])
def root():
    return jsonify({
        "status": "online",
        "service": "ChemSecure TLS Guardian Industrial API",
        "version": "3.0.0",
        "plant": "DigiFormers Chemical Operations Facility #4"
    })

@app.route("/api/sensors", methods=["GET"])
def api_sensors():
    # Advance telemetry simulation clock
    tick()
    sensors = get_sensors()
    health_score = calculate_health_score(sensors)
    return jsonify({
        "sensors": sensors,
        "healthScore": health_score
    })

@app.route("/api/certificates", methods=["GET"])
def api_certificates():
    certificates = get_certificates()
    return jsonify(certificates)

@app.route("/api/alerts", methods=["GET"])
def api_alerts():
    alerts = get_alerts()
    return jsonify(alerts)

@app.route("/api/simulate-expiry", methods=["POST"])
def api_simulate_expiry():
    data = request.get_json(silent=True) or {}
    sensor_id = data.get("sensorId", "GAS-204")
    result = simulate_expiry(sensor_id)
    return jsonify(result), (200 if result.get("success") else 400)

@app.route("/api/reset-demo", methods=["POST"])
def api_reset_demo():
    result = reset_demo()
    return jsonify(result), 200

if __name__ == "__main__":
    # Port 5001 avoids default macOS AirPlay receiver on 5000
    app.run(host="0.0.0.0", port=5001, debug=False)
