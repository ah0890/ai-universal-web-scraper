# API Reference

Base URL: `http://127.0.0.1:8000`

## `GET /health`

Health check used by the extension popup to confirm the backend is reachable.

### Response

```json
{ "status": "ok" }
```

## `POST /extract`

Fetches an arbitrary URL server-side and extracts structured data from it. Used by the
popup when a URL is entered instead of using the active tab (the active-tab path instead
runs `extension/scripts/content.js` directly in the browser, no backend call needed).

### Request Body

```json
{
  "url": "https://example.com",
  "categories": ["links", "images", "emails", "phones"]
}
```

- `url` — required, must be `http`/`https`. Requests to loopback, private, link-local, or
  otherwise internal hosts are rejected (SSRF guard) — this endpoint fetches whatever URL
  it's given, so it must not become a way to reach internal network services.
- `categories` — optional. Omit or send all four to extract everything; send a subset to
  skip the rest.

### Response Body

```json
{
  "url": "https://example.com/",
  "title": "Example Domain",
  "links": [{ "text": "Learn more", "href": "https://iana.org/domains/example" }],
  "images": [{ "src": "https://example.com/logo.png", "alt": "Example logo" }],
  "emails": [],
  "phones": []
}
```

**Errors**

| Status | Cause |
| --- | --- |
| `422` | `url` isn't a valid `http`/`https` URL (Pydantic validation) |
| `400` | Host is disallowed (SSRF guard), fetch failed/timed out, response too large, or no valid `categories` given |

Each category is capped at 200 items; email/phone matching is limited to the first 200,000
characters of visible page text. These limits mirror the client-side content script so
behavior is consistent whether extraction runs in the browser or the backend.
