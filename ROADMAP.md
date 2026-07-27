# Roadmap

## Milestone 1 — Project Scaffolding ✅

Folder structure, docs, Python venv, minimal FastAPI backend, minimal Manifest V3 extension with a popup that verifies backend connectivity.

## Milestone 2 — DOM Extraction Core

Content script that scans the active page and extracts generic structured data (text blocks, links, images, emails, phone numbers) and surfaces it in the popup.

## Milestone 3 — Targeted Extractors

Product data (name, price, images, description), tables, reviews, and social media links, built on top of the extraction core from Milestone 2.

## Milestone 4 — Export

CSV (PapaParse), Excel (SheetJS Community Edition), and JSON export of extracted data, triggered from the popup.

## Milestone 5 — Backend-Assisted Extraction

Optional backend processing (Playwright/BeautifulSoup) for pages that need JS rendering or heavier parsing than a content script can do alone.

## Milestone 6 — Polish & Packaging

Options page, error handling/logging pass, icon/branding pass, Chrome Web Store packaging.
