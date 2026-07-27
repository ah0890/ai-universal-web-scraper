import re
from urllib.parse import urljoin

from bs4 import BeautifulSoup

MAX_ITEMS = 200
MAX_TEXT_LENGTH = 200_000
ALL_CATEGORIES = {"links", "images", "emails", "phones"}

EMAIL_RE = re.compile(r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}")
# Heuristic matcher for common phone formats; bounded quantifiers only to stay ReDoS-safe.
PHONE_RE = re.compile(
    r"(?:\+\d{1,3}[\s.-]?)?\(?\d{2,4}\)?[\s.-]?\d{3,4}[\s.-]?\d{3,4}(?:[\s.-]?\d{2,4})?"
)


def _dedupe(items):
    return list(dict.fromkeys(items))[:MAX_ITEMS]


def extract_from_html(html: str, base_url: str, categories: set[str]) -> dict:
    soup = BeautifulSoup(html, "html.parser")
    title = soup.title.get_text(strip=True) if soup.title else ""

    result = {"url": base_url, "title": title, "links": [], "images": [], "emails": [], "phones": []}

    if "links" in categories:
        for a in soup.find_all("a", href=True):
            href = urljoin(base_url, a["href"])
            if href.startswith("javascript:"):
                continue
            result["links"].append({"text": a.get_text(strip=True)[:200], "href": href})
            if len(result["links"]) >= MAX_ITEMS:
                break

    if "images" in categories:
        for img in soup.find_all("img", src=True):
            src = urljoin(base_url, img["src"])
            result["images"].append({"src": src, "alt": (img.get("alt") or "")[:200]})
            if len(result["images"]) >= MAX_ITEMS:
                break

    if "emails" in categories or "phones" in categories:
        text = soup.get_text(" ")[:MAX_TEXT_LENGTH]
        if "emails" in categories:
            result["emails"] = _dedupe(EMAIL_RE.findall(text))
        if "phones" in categories:
            candidates = PHONE_RE.findall(text)
            filtered = [m for m in candidates if len(re.sub(r"\D", "", m)) >= 7]
            result["phones"] = _dedupe(filtered)

    return result
