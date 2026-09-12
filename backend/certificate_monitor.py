import socket
import ssl
from datetime import datetime, timezone
from typing import Dict, Optional


DEFAULT_THRESHOLDS = {
    "valid_days": 30,
    "warning_days": 7,
    "critical_days": 1,
}


def parse_certificate_expiry(not_after: str) -> datetime:
    """Convert certificate notAfter string into a UTC datetime."""
    return datetime.strptime(not_after, "%b %d %H:%M:%S %Y %Z").replace(tzinfo=timezone.utc)


def calculate_days_remaining(expiry_date: datetime, now: Optional[datetime] = None) -> int:
    """Calculate how many full days are left until certificate expiry."""
    current_time = now or datetime.now(timezone.utc)
    return (expiry_date - current_time).days


def classify_certificate_status(days_remaining: int, thresholds: Dict[str, int]) -> str:
    """Map remaining days to a certificate status label."""
    if days_remaining > thresholds["valid_days"]:
        return "VALID"
    if thresholds["warning_days"] <= days_remaining <= thresholds["valid_days"]:
        return "WARNING"
    if thresholds["critical_days"] <= days_remaining < thresholds["warning_days"]:
        return "CRITICAL"
    return "EXPIRED"


def fetch_certificate_expiry(host: str, port: int = 443, timeout: int = 5) -> datetime:
    """Open a TLS connection and return the certificate expiry datetime."""
    context = ssl.create_default_context()
    context.minimum_version = ssl.TLSVersion.TLSv1_2
    with socket.create_connection((host, port), timeout=timeout) as tcp_socket:
        with context.wrap_socket(tcp_socket, server_hostname=host) as tls_socket:
            certificate = tls_socket.getpeercert()
    not_after = certificate["notAfter"]
    return parse_certificate_expiry(not_after)


def check_certificate(
    host: str,
    port: int = 443,
    timeout: int = 5,
    thresholds: Optional[Dict[str, int]] = None,
) -> Dict[str, Optional[str]]:
    """Check TLS certificate health and return status data."""
    status_thresholds = thresholds or DEFAULT_THRESHOLDS
    try:
        expiry_date = fetch_certificate_expiry(host=host, port=port, timeout=timeout)
        days_remaining = calculate_days_remaining(expiry_date)
        status = classify_certificate_status(days_remaining, status_thresholds)
        return {
            "status": status,
            "expiry_date": expiry_date.isoformat(),
            "days_remaining": days_remaining,
            "error": None,
        }
    except Exception as error:
        return {
            "status": "INVALID",
            "expiry_date": None,
            "days_remaining": None,
            "error": str(error),
        }
