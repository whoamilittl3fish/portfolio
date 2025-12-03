// helpers
async function loadPartial(url, targetSelector) {
  const target = document.querySelector(targetSelector);
  if (!target) return;

  try {
    const response = await fetch(url);
    if (!response.ok) return;
    target.outerHTML = await response.text();
  } catch (error) {
    console.warn(`Failed to load ${url}`, error);
  }
}

// init
async function init() {
  await Promise.all([
    loadPartial("/partials/header.html", "[data-header]"),
    loadPartial("/partials/footer.html", "[data-footer]"),
  ]);

  window.dispatchEvent(new Event("layout-ready"));
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
