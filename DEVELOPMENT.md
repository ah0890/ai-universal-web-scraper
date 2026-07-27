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
|---|---|
| `uvicorn backend.app.main:app --reload` starts without errors | Server listening on `127.0.0.1:8000` |
| `GET /health` | `{"status": "ok"}` |
| Load unpacked extension | No errors on the extension card |
| Click extension icon | Popup opens showing "Backend status: online" (with backend running) or "offline" (without it) |

## Common Errors

- **`ModuleNotFoundError: fastapi`** — virtual environment not activated, or dependencies not installed.
- **Popup shows "offline" even though backend is running** — check the backend is bound to `127.0.0.1:8000` and no firewall is blocking localhost.
- **Extension fails to load** — check `chrome://extensions` for a red error message; usually a JSON syntax error in `manifest.json`.
