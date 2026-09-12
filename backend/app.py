from pathlib import Path

from flask import Flask, jsonify, request, send_from_directory

from sensor_simulator import SensorSimulator


frontend_dir = Path(__file__).resolve().parent.parent / "frontend"
app = Flask(__name__, static_folder=str(frontend_dir), static_url_path="")
simulator = SensorSimulator()


@app.route("/")
def index():
    return send_from_directory(app.static_folder, "index.html")


@app.route("/api/sensors", methods=["GET"])
def get_sensors():
    return jsonify({"sensors": simulator.get_sensors(), "summary": simulator.get_summary()})


@app.route("/api/sensors/<sensor_id>", methods=["GET"])
def get_sensor(sensor_id):
    sensor = simulator.get_sensor(sensor_id)
    if not sensor:
        return jsonify({"error": "Sensor not found"}), 404
    return jsonify(sensor)


@app.route("/api/alerts", methods=["GET"])
def get_alerts():
    return jsonify({"alerts": simulator.get_alerts()})


@app.route("/api/simulate-expiry", methods=["POST"])
def simulate_expiry():
    payload = request.get_json(silent=True) or {}
    sensor_id = payload.get("sensor_id")
    updated_sensor = simulator.simulate_expiry(sensor_id)
    if not updated_sensor:
        return jsonify({"error": "Sensor not found"}), 404

    return jsonify(
        {
            "message": "Certificate expiry simulation triggered",
            "sensor": updated_sensor,
            "alerts": simulator.get_alerts(),
            "summary": simulator.get_summary(),
        }
    )


if __name__ == "__main__":
    app.run()
