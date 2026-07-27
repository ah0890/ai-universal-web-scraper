# Roadmap

## Milestone 1 — Project Scaffolding ✅

Folder structure, docs, Python venv, minimal FastAPI backend, minimal Manifest V3 extension with a popup that verifies backend connectivity.

## Milestone 2 — DOM Extraction Core ✅

Content script that scans the active page and extracts generic structured data (links, images, emails, phone numbers) and surfaces it in the popup.

## Milestone 3 — Targeted Extractors

Product data (name, price, images, description), tables, reviews, and social media links, built on top of the extraction core from Milestone 2.

## Milestone 4 — Export ✅

CSV, Excel (SheetJS Community Edition), and JSON export of extracted data, triggered from the popup. (Built ahead of Milestone 3, at user request, on top of the generic extraction from Milestone 2 — CSV serialization is hand-rolled rather than PapaParse since flat CSV output doesn't need a parsing library.)

## Milestone 5 — Backend-Assisted Extraction ✅ (partial)

Backend `POST /extract` fetches an arbitrary URL server-side (`requests` + `BeautifulSoup`) and returns the same extraction shape as the client-side content script, with SSRF guards (scheme + private/loopback host rejection), a size cap, and a timeout. Popup now supports both a URL field (routes to the backend) and per-category checkboxes (routes to either path). Built ahead of Milestone 3, at user request.

Still open: JS-rendered pages (Playwright) — the current backend fetch is static HTML only, so pages that need JS execution to produce their content won't extract fully via the URL path yet. Extracting from the active tab already handles JS-rendered content, since it runs after the page has loaded.

## Milestone 6 — Polish & Packaging

Options page, error handling/logging pass, icon/branding pass, Chrome Web Store packaging.
