const BACKEND_ORIGIN = "http://127.0.0.1:8000";
const BACKEND_URL = `${BACKEND_ORIGIN}/health`;
const EXTRACT_URL = `${BACKEND_ORIGIN}/extract`;
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

const extractBtn = document.getElementById("extract-data");
const resultsEl = document.getElementById("results");
const urlInput = document.getElementById("target-url");
const categoryCheckboxes = document.querySelectorAll(".category-checkbox");
const copyBtn = document.getElementById("copy-json");
const downloadJsonBtn = document.getElementById("download-json");
const downloadCsvBtn = document.getElementById("download-csv");
const downloadXlsxBtn = document.getElementById("download-xlsx");
const exportButtons = [copyBtn, downloadJsonBtn, downloadCsvBtn, downloadXlsxBtn];

let lastData = null;

function getSelectedCategories() {
  return [...categoryCheckboxes].filter((cb) => cb.checked).map((cb) => cb.value);
}

const SECTION_CONFIG = {
  links: {
    title: "Links",
    render: (li, item) => {
      li.textContent = item.text || item.href;
      li.title = item.href;
    },
  },
  images: {
    title: "Images",
    render: (li, item) => {
      li.textContent = item.alt || item.src;
      li.title = item.src;
    },
  },
  emails: {
    title: "Emails",
    render: (li, item) => {
      li.textContent = item;
    },
  },
  phones: {
    title: "Phone Numbers",
    render: (li, item) => {
      li.textContent = item;
    },
  },
};

function addSection(title, items, renderItem) {
  const section = document.createElement("div");
  section.className = "section";

  const heading = document.createElement("h2");
  heading.textContent = `${title} (${items.length})`;
  section.appendChild(heading);

  if (items.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty";
    empty.textContent = "None found";
    section.appendChild(empty);
  } else {
    const list = document.createElement("ul");
    for (const item of items.slice(0, 20)) {
      const li = document.createElement("li");
      renderItem(li, item);
      list.appendChild(li);
    }
    section.appendChild(list);
  }

  resultsEl.appendChild(section);
}

function renderData(data, categories) {
  resultsEl.replaceChildren();

  for (const key of categories) {
    const config = SECTION_CONFIG[key];
    if (!config) continue;
    addSection(config.title, data[key], config.render);
  }

  for (const btn of exportButtons) btn.disabled = false;
}

// Flattens the extraction result into a single row-per-item table
// (category, text, url) so it can be written to CSV/Excel.
function flattenRows(data) {
  const rows = [];
  for (const item of data.links) {
    rows.push({ category: "Link", text: item.text, url: item.href });
  }
  for (const item of data.images) {
    rows.push({ category: "Image", text: item.alt, url: item.src });
  }
  for (const item of data.emails) {
    rows.push({ category: "Email", text: item, url: "" });
  }
  for (const item of data.phones) {
    rows.push({ category: "Phone Number", text: item, url: "" });
  }
  return rows;
}

function csvEscape(value) {
  const str = String(value ?? "");
  return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
}

function toCsv(rows) {
  const header = ["category", "text", "url"];
  const lines = [header.join(",")];
  for (const row of rows) {
    lines.push(header.map((key) => csvEscape(row[key])).join(","));
  }
  return lines.join("\n");
}

function filenameBase() {
  try {
    const host = new URL(lastData.url).hostname.replace(/[^a-z0-9.-]/gi, "_");
    return `scrape-${host}`;
  } catch {
    return "scrape";
  }
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

downloadJsonBtn.addEventListener("click", () => {
  if (!lastData) return;
  const blob = new Blob([JSON.stringify(lastData, null, 2)], { type: "application/json" });
  downloadBlob(blob, `${filenameBase()}.json`);
});

downloadCsvBtn.addEventListener("click", () => {
  if (!lastData) return;
  const csv = toCsv(flattenRows(lastData));
  const blob = new Blob([csv], { type: "text/csv" });
  downloadBlob(blob, `${filenameBase()}.csv`);
});

downloadXlsxBtn.addEventListener("click", () => {
  if (!lastData) return;
  const rows = flattenRows(lastData);
  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Extracted Data");
  const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([buffer], { type: "application/octet-stream" });
  downloadBlob(blob, `${filenameBase()}.xlsx`);
});

async function extractFromActiveTab(categories) {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ["scripts/content.js"],
  });
  const [{ result }] = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: (cats) => window.__aiScraperExtract(cats),
    args: [categories],
  });
  return result;
}

async function extractFromUrl(url, categories) {
  const res = await fetch(EXTRACT_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url, categories }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const detail = Array.isArray(body.detail)
      ? body.detail.map((d) => d.msg).join("; ")
      : body.detail;
    throw new Error(detail || `Backend error (${res.status})`);
  }
  return res.json();
}

async function extractData() {
  const categories = getSelectedCategories();
  if (categories.length === 0) {
    resultsEl.replaceChildren();
    resultsEl.textContent = "Select at least one data type to extract.";
    return;
  }

  resultsEl.replaceChildren();
  resultsEl.textContent = "Extracting...";
  for (const btn of exportButtons) btn.disabled = true;

  const targetUrl = urlInput.value.trim();
  try {
    const result = targetUrl
      ? await extractFromUrl(targetUrl, categories)
      : await extractFromActiveTab(categories);
    lastData = result;
    renderData(result, categories);
  } catch (err) {
    resultsEl.textContent = `Extraction failed: ${err.message}`;
  }
}

copyBtn.addEventListener("click", async () => {
  if (!lastData) return;
  await navigator.clipboard.writeText(JSON.stringify(lastData, null, 2));
  copyBtn.textContent = "Copied!";
  setTimeout(() => (copyBtn.textContent = "Copy JSON"), 1200);
});

extractBtn.addEventListener("click", extractData);
