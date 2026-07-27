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
│   │   ├── background.js
│   │   └── content.js      # On-demand DOM extraction (links, images, emails, phones)
│   ├── libs/               # Vendored third-party libs (SheetJS, for Excel export)
│   └── icons/              # Extension icons (16/48/128)
├── backend/                # FastAPI backend
│   └── app/
│       ├── main.py         # App entrypoint, routes
│       ├── fetcher.py      # SSRF-guarded URL fetch for POST /extract
│       └── extractor.py    # HTML -> structured data (mirrors content.js)
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

- Extraction runs in one of two places: `content.js` in the active tab (no backend needed, handles JS-rendered content), or `POST /extract` on the backend when the user targets an arbitrary URL (static HTML only — see `backend/app/fetcher.py` / `extractor.py`). Both paths return the same `{url, title, links, images, emails, phones}` shape and share the same regexes/limits.
- Export (JSON/CSV/Excel) runs entirely client-side in the popup, regardless of which extraction path produced the data.
- Targeted extractors (product, tables, reviews, social links) will build on this same extraction core once Milestone 3 starts.
