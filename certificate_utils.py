"""
Certificate Utilities for ChemSecure TLS Guardian
Provides certificate health calculation and status evaluation.
"""

def get_certificate_status(days_remaining):
    """
    Determines certificate status based on remaining days until expiration.
    Returns: 'Expired', 'Expiring', or 'Healthy'
    """
    if days_remaining <= 0:
        return "Expired"
    elif days_remaining <= 15:
        return "Expiring"
    return "Healthy"


def calculate_health_score(sensors):
    """
    Calculates overall plant security health score (0-100).
    Formula:
      Base: 100
      -15 for every expired certificate
      -5 for every expiring certificate
      Minimum: 0
    """
    score = 100
    for sensor in sensors:
        cert = sensor.get("certificate", {})
        status = cert.get("status")
        # In case status isn't pre-computed, compute from daysRemaining
        if not status and "daysRemaining" in cert:
            status = get_certificate_status(cert["daysRemaining"])
        
        if status == "Expired":
            score -= 15
        elif status == "Expiring":
            score -= 5

    return max(0, min(100, score))
