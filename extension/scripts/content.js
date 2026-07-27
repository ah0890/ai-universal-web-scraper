// Defines window.__aiScraperExtract(categories) so the popup can inject this file once
// (via files:) then invoke the function separately with the user's chosen categories
// (via func:), since chrome.scripting.executeScript's `files` mode can't take arguments.
(function () {
  if (window.__aiScraperExtract) return;

  const MAX_ITEMS = 200;
  const MAX_TEXT_LENGTH = 200000;

  function extractLinks() {
    const links = [];
    for (const a of document.querySelectorAll("a[href]")) {
      const href = a.href;
      if (!href || href.startsWith("javascript:")) continue;
      links.push({ text: a.textContent.trim().slice(0, 200), href });
      if (links.length >= MAX_ITEMS) break;
    }
    return links;
  }

  function extractImages() {
    const images = [];
    for (const img of document.querySelectorAll("img[src]")) {
      images.push({ src: img.src, alt: (img.alt || "").slice(0, 200) });
      if (images.length >= MAX_ITEMS) break;
    }
    return images;
  }

  function extractEmails(text) {
    const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    return [...new Set(text.match(EMAIL_REGEX) || [])].slice(0, MAX_ITEMS);
  }

  function extractPhones(text) {
    // Heuristic matcher for common phone formats; bounded quantifiers only to stay ReDoS-safe.
    const PHONE_REGEX = /(?:\+\d{1,3}[\s.-]?)?\(?\d{2,4}\)?[\s.-]?\d{3,4}[\s.-]?\d{3,4}(?:[\s.-]?\d{2,4})?/g;
    const candidates = text.match(PHONE_REGEX) || [];
    const filtered = candidates.filter((m) => m.replace(/\D/g, "").length >= 7);
    return [...new Set(filtered)].slice(0, MAX_ITEMS);
  }

  window.__aiScraperExtract = function (categories) {
    const cats = new Set(
      categories && categories.length ? categories : ["links", "images", "emails", "phones"]
    );
    const needsText = cats.has("emails") || cats.has("phones");
    const bodyText = needsText && document.body ? document.body.innerText.slice(0, MAX_TEXT_LENGTH) : "";

    return {
      url: location.href,
      title: document.title,
      links: cats.has("links") ? extractLinks() : [],
      images: cats.has("images") ? extractImages() : [],
      emails: cats.has("emails") ? extractEmails(bodyText) : [],
      phones: cats.has("phones") ? extractPhones(bodyText) : [],
    };
  };
})();
