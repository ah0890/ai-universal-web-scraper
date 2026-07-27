import ipaddress
import socket
from urllib.parse import urlparse

import requests

ALLOWED_SCHEMES = {"http", "https"}
MAX_BYTES = 5_000_000
TIMEOUT_SECONDS = 10
USER_AGENT = "AI-Universal-Web-Scraper/0.1 (+local Chrome extension)"


class FetchError(Exception):
    pass


def _is_safe_host(hostname: str) -> bool:
    try:
        infos = socket.getaddrinfo(hostname, None)
    except socket.gaierror:
        return False
    for info in infos:
        ip = ipaddress.ip_address(info[4][0])
        if ip.is_private or ip.is_loopback or ip.is_link_local or ip.is_reserved or ip.is_multicast:
            return False
    return True


def fetch_html(url: str) -> str:
    """Fetch a page's HTML, rejecting non-http(s) schemes and internal/private hosts.

    The backend is a general-purpose "fetch this URL for me" endpoint, so it must not
    become a vector for reaching internal network services (SSRF).
    """
    parsed = urlparse(url)
    if parsed.scheme not in ALLOWED_SCHEMES:
        raise FetchError("Only http/https URLs are supported")
    if not parsed.hostname or not _is_safe_host(parsed.hostname):
        raise FetchError("This URL's host is not allowed")

    headers = {"User-Agent": USER_AGENT}
    try:
        with requests.get(url, headers=headers, timeout=TIMEOUT_SECONDS, stream=True) as resp:
            resp.raise_for_status()
            content = bytearray()
            for chunk in resp.iter_content(8192):
                content.extend(chunk)
                if len(content) > MAX_BYTES:
                    raise FetchError("Response exceeded the size limit")
            return content.decode(resp.encoding or "utf-8", errors="replace")
    except requests.RequestException as exc:
        raise FetchError(f"Failed to fetch URL: {exc}") from exc
