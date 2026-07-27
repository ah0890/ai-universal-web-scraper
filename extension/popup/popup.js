const BACKEND_URL = "http://127.0.0.1:8000/health";
const statusEl = document.getElementById("backend-status");

async function checkBackend() {
  statusEl.textContent = "checking...";
  try {
    const res = await fetch(BACKEND_URL);
    const data = await res.json();
    statusEl.textContent = data.status === "ok" ? "online" : "unknown";
  } catch (err) {
    statusEl.textContent = "offline";
  }
}

document.getElementById("check-backend").addEventListener("click", checkBackend);
checkBackend();
