# Development Guide

## Prerequisites

- Python 3.10+
- Google Chrome (or any Chromium-based browser supporting Manifest V3)

## Backend Setup

```bash
python -m venv .venv
.venv\Scripts\activate        # Windows
source .venv/bin/activate     # Linux/macOS
pip install -r requirements.txt
```

Run the API:

```bash
uvicorn backend.app.main:app --reload
```

Test it:

```bash
curl http://127.0.0.1:8000/health
# {"status":"ok"}
```

## Extension Setup

1. Go to `chrome://extensions`
2. Enable **Developer mode** (top-right toggle)
3. Click **Load unpacked**
4. Select the `extension/` folder
5. Pin the extension and click its icon to open the popup

### Reloading after changes

Click the refresh icon on the extension card in `chrome://extensions` after editing any extension file.

## Testing Milestone 1

| Check | Expected result |
| --- | --- |
| `uvicorn backend.app.main:app --reload` starts without errors | Server listening on `127.0.0.1:8000` |
| `GET /health` | `{"status": "ok"}` |
| Load unpacked extension | No errors on the extension card |
| Click extension icon | Popup opens showing "Backend status: online" (with backend running) or "offline" (without it) |

## Testing Milestone 2

| Check | Expected result |
| --- | --- |
| Open any regular webpage (not `chrome://...`), click extension icon, click **Extract Data** | Popup shows "Links", "Images", "Emails", "Phone Numbers" sections with counts |
| Page with no emails/phones | Section shows "None found" instead of erroring |
| Click **Copy JSON** after extracting | Full extraction result copied to clipboard as JSON |
| Click **Extract Data** on a `chrome://` page | Shows "Extraction failed: ..." (injection isn't allowed on internal pages) |

## Testing Milestone 4

| Check | Expected result |
| --- | --- |
| After extracting, click **Download JSON** | A `scrape-<host>.json` file downloads with the full extraction result |
| Click **Download CSV** | A `scrape-<host>.csv` downloads; opens cleanly in Excel/Sheets with `category, text, url` columns |
| Click **Download CSV** on data containing commas/quotes in link text | Fields are quoted correctly, no column misalignment |
| Click **Download Excel** | A `scrape-<host>.xlsx` downloads and opens in Excel/LibreOffice with the same rows on an "Extracted Data" sheet |

## Testing Milestone 5

| Check | Expected result |
| --- | --- |
| Uncheck all four category checkboxes, click **Extract Data** | "Select at least one data type to extract." shown, no request made |
| Uncheck "Images"/"Phones", leave URL blank, click **Extract Data** on a normal page | Only "Links" and "Emails" sections render |
| Leave URL blank | Extracts from the current tab, as before (Milestone 2 behavior) |
| Enter `https://example.com` in the URL field, click **Extract Data** (backend running) | Extracts `example.com` server-side regardless of what tab is open |
| Enter `https://example.com` with backend **not** running | Shows "Extraction failed: Failed to fetch" |
| Enter `http://127.0.0.1:8000/health` (or `http://localhost/...`) as the URL | Shows "Extraction failed: This URL's host is not allowed" (SSRF guard) |
| Enter a `file://` or `ftp://` URL | Browser's `<input type="url">` / backend validation rejects it before/at the request |

## Common Errors

- **`ModuleNotFoundError: fastapi`** — virtual environment not activated, or dependencies not installed.
- **Popup shows "offline" even though backend is running** — check the backend is bound to `127.0.0.1:8000` and no firewall is blocking localhost.
- **Extension fails to load** — check `chrome://extensions` for a red error message; usually a JSON syntax error in `manifest.json`.
- **`pip install -r requirements.txt` fails building `lxml`** — not applicable anymore; the backend uses the stdlib `html.parser` via BeautifulSoup specifically to avoid needing a C compiler toolchain.
- **URL extraction fails with "This URL's host is not allowed"** — the target resolves to a private/loopback/link-local address; the backend deliberately refuses to fetch internal hosts (SSRF guard). Use the active-tab path (leave the URL field blank) for internal pages instead.
