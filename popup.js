import { SERVERS } from "./config.js";

const statusEl = document.getElementById("status");
const selectEl = document.getElementById("server");
const toggleBtn = document.getElementById("toggle");
const errorEl = document.getElementById("error");

let connected = false;

// Fill the dropdown (names only; credentials are never shown)
SERVERS.forEach((s) => {
  const opt = document.createElement("option");
  opt.value = s.id;
  opt.textContent = s.name;
  selectEl.appendChild(opt);
});

function render() {
  statusEl.textContent = connected ? "Connected ✅" : "Disconnected";
  statusEl.className = "status " + (connected ? "on" : "off");
  toggleBtn.textContent = connected ? "Disconnect" : "Connect";
  toggleBtn.className = "btn " + (connected ? "disconnect" : "connect");
  selectEl.disabled = connected;
}

function send(message) {
  return chrome.runtime.sendMessage(message);
}

async function init() {
  const res = await send({ action: "status" });
  connected = !!res.connected;
  if (res.serverId) selectEl.value = res.serverId;
  render();
}

toggleBtn.addEventListener("click", async () => {
  errorEl.textContent = "";
  toggleBtn.disabled = true;

  const res = connected
    ? await send({ action: "disconnect" })
    : await send({ action: "connect", serverId: selectEl.value });

  if (res.ok) {
    connected = !connected;
  } else {
    errorEl.textContent = res.error || "Something went wrong";
  }
  toggleBtn.disabled = false;
  render();
});

init();