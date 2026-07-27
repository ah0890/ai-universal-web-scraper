from typing import List, Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, HttpUrl

from .extractor import ALL_CATEGORIES, extract_from_html
from .fetcher import FetchError, fetch_html

app = FastAPI(title="AI Universal Web Scraper API", version="0.1.0")

# Chrome extensions call this API from a chrome-extension:// origin.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class ExtractRequest(BaseModel):
    url: HttpUrl
    categories: Optional[List[str]] = None


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.post("/extract")
def extract(req: ExtractRequest):
    categories = (set(req.categories) & ALL_CATEGORIES) if req.categories else set(ALL_CATEGORIES)
    if not categories:
        raise HTTPException(status_code=400, detail="No valid categories requested")

    url = str(req.url)
    try:
        html = fetch_html(url)
    except FetchError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    return extract_from_html(html, url, categories)
