from datetime import datetime, timedelta, timezone
from pathlib import Path
import json
import sys

sys.path.append(str(Path(__file__).resolve().parent.parent / "backend"))

from certificate_monitor import classify_certificate_status, calculate_days_remaining, DEFAULT_THRESHOLDS
from sensor_simulator import SensorSimulator


def test_certificate_status_thresholds():
    assert classify_certificate_status(40, DEFAULT_THRESHOLDS) == "VALID"
    assert classify_certificate_status(30, DEFAULT_THRESHOLDS) == "WARNING"
    assert classify_certificate_status(7, DEFAULT_THRESHOLDS) == "WARNING"
    assert classify_certificate_status(3, DEFAULT_THRESHOLDS) == "CRITICAL"
    assert classify_certificate_status(0, DEFAULT_THRESHOLDS) == "EXPIRED"


def test_days_remaining_calculation():
    now = datetime.now(timezone.utc)
    assert calculate_days_remaining(now + timedelta(days=10), now=now) == 10


def test_simulate_expiry_creates_alert(tmp_path):
    data_file = tmp_path / "sensors.json"
    sensors = [
        {
            "sensor_id": "SENSOR-001",
            "name": "Temperature Sensor",
            "type": "temperature",
            "endpoint": "example.com",
            "port": 443,
            "current_value": 0,
            "certificate_status": "UNKNOWN",
        }
    ]
    data_file.write_text(json.dumps(sensors), encoding="utf-8")

    def fake_checker(host, port):
        return {
            "status": "VALID",
            "expiry_date": "2030-01-01T00:00:00+00:00",
            "days_remaining": 365,
            "error": None,
        }

    simulator = SensorSimulator(data_file=str(data_file), certificate_checker=fake_checker)
    updated_sensor = simulator.simulate_expiry("SENSOR-001")

    assert updated_sensor["certificate_status"] == "EXPIRED"
    assert simulator.get_alerts()[0]["severity"] == "CRITICAL"
