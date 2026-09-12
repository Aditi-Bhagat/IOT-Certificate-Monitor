import json
import random
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Callable, Dict, List, Optional

from certificate_monitor import check_certificate


class SensorSimulator:
    def __init__(
        self,
        data_file: Optional[str] = None,
        certificate_checker: Optional[Callable[..., Dict[str, object]]] = None,
    ) -> None:
        default_data_file = Path(__file__).resolve().parent.parent / "data" / "sensors.json"
        self.data_file = Path(data_file) if data_file else default_data_file
        self.certificate_checker = certificate_checker or check_certificate
        self.sensors = self._load_sensors()
        self.alerts: List[Dict[str, str]] = []
        self.simulated_expired_sensor_ids = set()

    def _load_sensors(self) -> List[Dict[str, object]]:
        with open(self.data_file, "r", encoding="utf-8") as source:
            return json.load(source)

    def _simulate_sensor_value(self, sensor_type: str) -> float:
        ranges = {
            "temperature": (22.0, 95.0),
            "pressure": (15.0, 220.0),
            "gas": (0.0, 9.5),
            "flow": (8.0, 180.0),
        }
        low, high = ranges.get(sensor_type.lower(), (0.0, 100.0))
        return round(random.uniform(low, high), 2)

    def _update_certificate_status(self, sensor: Dict[str, object]) -> None:
        sensor_id = sensor["sensor_id"]
        if sensor_id in self.simulated_expired_sensor_ids:
            expired_time = datetime.now(timezone.utc) - timedelta(days=1)
            sensor["certificate_status"] = "EXPIRED"
            sensor["certificate_expiry_date"] = expired_time.isoformat()
            sensor["certificate_days_remaining"] = 0
            return

        certificate_data = self.certificate_checker(sensor["endpoint"], sensor["port"])
        sensor["certificate_status"] = certificate_data["status"]
        sensor["certificate_expiry_date"] = certificate_data["expiry_date"]
        sensor["certificate_days_remaining"] = certificate_data["days_remaining"]

    def _refresh_sensors(self) -> None:
        for sensor in self.sensors:
            sensor["current_value"] = self._simulate_sensor_value(sensor["type"])
            self._update_certificate_status(sensor)

    def get_sensors(self) -> List[Dict[str, object]]:
        self._refresh_sensors()
        return self.sensors

    def get_sensor(self, sensor_id: str) -> Optional[Dict[str, object]]:
        self._refresh_sensors()
        return next((sensor for sensor in self.sensors if sensor["sensor_id"] == sensor_id), None)

    def simulate_expiry(self, sensor_id: Optional[str] = None) -> Optional[Dict[str, object]]:
        target_sensor_id = sensor_id or self.sensors[0]["sensor_id"]
        target_sensor = next((sensor for sensor in self.sensors if sensor["sensor_id"] == target_sensor_id), None)
        if not target_sensor:
            return None

        self.simulated_expired_sensor_ids.add(target_sensor_id)
        self._refresh_sensors()

        alert = {
            "severity": "CRITICAL",
            "sensor": target_sensor["name"],
            "message": "TLS certificate has expired",
            "timestamp": datetime.now(timezone.utc).isoformat(),
        }
        self.alerts.insert(0, alert)
        return target_sensor

    def get_alerts(self) -> List[Dict[str, str]]:
        return self.alerts

    def get_summary(self) -> Dict[str, object]:
        sensors = self.get_sensors()
        counts = {"VALID": 0, "WARNING": 0, "CRITICAL": 0, "EXPIRED": 0, "INVALID": 0}
        for sensor in sensors:
            status = sensor.get("certificate_status", "INVALID")
            counts[status] = counts.get(status, 0) + 1

        if counts["EXPIRED"] > 0 or counts["CRITICAL"] > 0 or counts["INVALID"] > 0:
            overall_status = "ALERT"
        elif counts["WARNING"] > 0:
            overall_status = "ATTENTION"
        else:
            overall_status = "SECURE"

        return {
            "total_sensors": len(sensors),
            "counts": counts,
            "overall_status": overall_status,
        }
