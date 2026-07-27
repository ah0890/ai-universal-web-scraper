# Project Structure

```
ai-universal-web-scraper/
├── extension/              # Chrome Extension (Manifest V3)
│   ├── manifest.json
│   ├── popup/              # Toolbar popup UI
│   │   ├── popup.html
│   │   ├── popup.css
│   │   └── popup.js
│   ├── scripts/            # Background / content scripts
│   │   └── background.js
│   └── icons/              # Extension icons (16/48/128)
├── backend/                # FastAPI backend
│   └── app/
│       └── main.py         # App entrypoint, routes
├── docs/                   # Additional design/reference docs
├── tests/                  # Backend and extraction tests
├── requirements.txt        # Python dependencies
├── README.md
├── CHANGELOG.md
├── CONTRIBUTING.md
├── LICENSE
├── PROJECT_STRUCTURE.md    # This file
├── DEVELOPMENT.md
├── API.md
├── TODO.md
└── ROADMAP.md
```

## Notes

- `extension/` and `backend/` are independent — the extension works standalone against DOM extraction (future milestone) and only calls the backend for features that need server-side processing (e.g. heavier parsing, export conversion).
- New extractors (product, contact info, tables, reviews, etc.) will live under a dedicated module once extraction logic is introduced — not yet created as of Milestone 1.
