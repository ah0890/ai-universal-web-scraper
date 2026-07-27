# AI Universal Web Scraper

An AI-powered Chrome Extension that intelligently extracts structured data from any website using DOM analysis, smart selectors, and automation. Export data to JSON, CSV, or Excel with minimal configuration.

## Status

🚧 Milestone 1 — project scaffolding. See [ROADMAP.md](ROADMAP.md) for what's next.

## Project Structure

See [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md).

## Quick Start

### Backend

```bash
python -m venv .venv
.venv\Scripts\activate        # Windows
source .venv/bin/activate     # Linux/macOS
pip install -r requirements.txt
uvicorn backend.app.main:app --reload
```

Visit `http://127.0.0.1:8000/health` — should return `{"status": "ok"}`.

### Chrome Extension

1. Open `chrome://extensions`
2. Enable **Developer mode**
3. Click **Load unpacked** and select the `extension/` folder
4. Click the extension icon — the popup shows backend connection status

See [DEVELOPMENT.md](DEVELOPMENT.md) for full setup and testing details.

## Documentation

- [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) — folder layout
- [DEVELOPMENT.md](DEVELOPMENT.md) — local setup, running, testing
- [API.md](API.md) — backend API reference
- [CONTRIBUTING.md](CONTRIBUTING.md) — contribution guidelines
- [CHANGELOG.md](CHANGELOG.md) — version history
- [TODO.md](TODO.md) — near-term tasks
- [ROADMAP.md](ROADMAP.md) — milestone plan

## License

[MIT](LICENSE)
