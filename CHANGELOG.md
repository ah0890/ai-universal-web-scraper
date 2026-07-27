# Changelog

## [Unreleased]

### Added — Milestone 5: URL Targeting & Category Selection

- Popup gained a URL field (optional) and per-category checkboxes (Links, Images, Emails, Phones)
- Blank URL → extracts from the active tab, as before, now scoped to the selected categories only (`content.js` refactored to expose `window.__aiScraperExtract(categories)`, injected once then invoked with args)
- Non-blank URL → sent to a new backend `POST /extract` endpoint, which fetches the page server-side (`requests` + `BeautifulSoup`, stdlib `html.parser` — no `lxml`/compiler toolchain needed) and returns the same extraction shape, letting you scrape a URL you don't have open
- Backend fetch rejects non-http(s) schemes and private/loopback/link-local hosts (SSRF guard), caps response size at 5MB and timeout at 10s
- Result rendering now only shows sections for the categories actually requested

### Added — Branding

- Replaced placeholder solid-color icons with a designed icon (magnifying glass + data grid on a violet gradient, with an AI sparkle accent), generated programmatically at 16/48/128px. The 16px toolbar size uses a simplified variant (no grid/sparkle) for legibility at that size.

### Added — Milestone 4: Export

- "Download JSON" — raw extraction result as `.json`
- "Download CSV" — flattened (category, text, url) rows as `.csv`, hand-rolled serializer with proper quote escaping (no dependency needed for plain CSV)
- "Download Excel" — same flattened rows as `.xlsx` via vendored [SheetJS](extension/libs/xlsx.core.min.js) (Community Edition, MIT licensed)
- Downloads use `Blob` + object URL + a temporary anchor click — no `downloads` permission required

### Added — Milestone 2: DOM Extraction Core

- `extension/scripts/content.js` — on-demand content script extracting links, images, emails, and phone numbers from the active tab
- Popup "Extract Data" button injects the content script via `chrome.scripting.executeScript` and renders results grouped by type
- "Copy JSON" button to copy the full extraction result to the clipboard for debugging/testing
- Extraction results rendered via safe DOM APIs (`textContent`/`createElement`), not `innerHTML`, since extracted content originates from untrusted web pages

### Added — Milestone 1: Project Scaffolding

- Repository structure: `extension/`, `backend/`, `docs/`, `tests/`
- FastAPI backend skeleton with `GET /health`
- Manifest V3 Chrome extension skeleton: popup UI, background service worker, icons
- Popup checks backend health status live
- Project documentation: README, DEVELOPMENT, API, PROJECT_STRUCTURE, CONTRIBUTING, TODO, ROADMAP, LICENSE
