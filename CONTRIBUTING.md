# Contributing

## Workflow

1. Create a branch from `main`.
2. Make focused changes for a single milestone or fix.
3. Update relevant docs (`CHANGELOG.md`, `API.md`, etc.) alongside code changes.
4. Open a pull request with a clear description of what changed and how to test it.

## Code Style

- **Python**: follow PEP 8, use type hints for public functions.
- **JavaScript**: ES6+, no frameworks in the extension — keep it vanilla.
- Keep functions small and single-purpose. Avoid speculative abstractions.

## Commit Messages

Use short, imperative messages, e.g.:

- `Add CSV export endpoint`
- `Fix popup status check on Firefox`

## Testing

- Backend changes: add/update tests under `tests/`.
- Extension changes: verify manually via `chrome://extensions` → Load unpacked (see [DEVELOPMENT.md](DEVELOPMENT.md)).
