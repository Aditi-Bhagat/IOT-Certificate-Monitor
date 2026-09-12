async function fetchSensors() {
  const response = await fetch("/api/sensors");
  return response.json();
}

async function fetchAlerts() {
  const response = await fetch("/api/alerts");
  return response.json();
}

function renderSummary(summary) {
  document.getElementById("totalCount").textContent = summary.total_sensors;
  document.getElementById("validCount").textContent = summary.counts.VALID;
  document.getElementById("warningCount").textContent = summary.counts.WARNING;
  document.getElementById("criticalCount").textContent = summary.counts.CRITICAL;
  document.getElementById("expiredCount").textContent = summary.counts.EXPIRED;
  document.getElementById("invalidCount").textContent = summary.counts.INVALID;

  const overallStatus = document.getElementById("overallStatus");
  overallStatus.className = "overall-status";
  if (summary.overall_status === "SECURE") {
    overallStatus.classList.add("overall-secure");
    overallStatus.textContent = "🟢 Sensors secure";
  } else if (summary.overall_status === "ATTENTION") {
    overallStatus.classList.add("overall-attention");
    overallStatus.textContent = "🟠 Warning: certificate attention needed";
  } else {
    overallStatus.classList.add("overall-alert");
    overallStatus.textContent = "🔴 CRITICAL ALERT: TLS certificate risk detected";
  }
}

function renderSensors(sensors) {
  const tbody = document.getElementById("sensorsBody");
  tbody.innerHTML = "";

  sensors.forEach((sensor) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${sensor.name}</td>
      <td>${sensor.type}</td>
      <td>${sensor.endpoint}:${sensor.port}</td>
      <td>${sensor.current_value}</td>
      <td><span class="status-pill status-${sensor.certificate_status}">${sensor.certificate_status}</span></td>
      <td>${sensor.certificate_expiry_date || "-"}</td>
      <td>${sensor.certificate_days_remaining ?? "-"}</td>
    `;
    tbody.appendChild(row);
  });
}

function renderAlerts(alerts) {
  const container = document.getElementById("alertsContainer");
  if (!alerts.length) {
    container.textContent = "No active alerts";
    return;
  }

  container.innerHTML = "";
  alerts.forEach((alert) => {
    const alertElement = document.createElement("div");
    alertElement.className = "alert-item";
    alertElement.innerHTML = `
      <strong>🚨 ${alert.severity} ALERT</strong><br>
      ${alert.sensor}: ${alert.message}<br>
      <small>${new Date(alert.timestamp).toLocaleString()}</small>
    `;
    container.appendChild(alertElement);
  });
}

async function refreshDashboard() {
  try {
    const sensorsData = await fetchSensors();
    const alertsData = await fetchAlerts();
    renderSummary(sensorsData.summary);
    renderSensors(sensorsData.sensors);
    renderAlerts(alertsData.alerts);
  } catch (error) {
    console.error("Failed to refresh dashboard:", error);
  }
}

async function simulateExpiry() {
  const sensorId = document.getElementById("sensorSelect").value;
  await fetch("/api/simulate-expiry", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sensor_id: sensorId }),
  });
  await refreshDashboard();
}

function populateSensorSelect(sensors) {
  const select = document.getElementById("sensorSelect");
  if (select.options.length > 0) {
    return;
  }
  sensors.forEach((sensor) => {
    const option = document.createElement("option");
    option.value = sensor.sensor_id;
    option.textContent = `${sensor.name} (${sensor.sensor_id})`;
    select.appendChild(option);
  });
}

async function initialize() {
  const sensorsData = await fetchSensors();
  populateSensorSelect(sensorsData.sensors);
  document.getElementById("simulateButton").addEventListener("click", simulateExpiry);
  await refreshDashboard();
  setInterval(refreshDashboard, 10000);
}

initialize();
