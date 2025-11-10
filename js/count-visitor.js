document.addEventListener("DOMContentLoaded", async () => {
  const visitorElement = document.querySelector("[data-visitor-count]");
  if (!visitorElement) {
    return;
  }

  const endpoint = "https://api.countapi.xyz/hit/khoan-portfolio/visitors";
  const localStorageKey = "visitor-count-local-total";
  const sessionStorageKey = "visitor-count-local-session";

  const setCount = (value, source = "remote") => {
    visitorElement.textContent = Number.isFinite(value)
      ? value.toLocaleString()
      : "—";
    visitorElement.dataset.source = source;
  };

  const updateLocalFallback = () => {
    const stored = Number.parseInt(
      window.localStorage.getItem(localStorageKey) ?? "0",
      10
    );
    const baseline = Number.isFinite(stored) ? stored : 0;

    const hasIncrementedThisSession = window.sessionStorage.getItem(
      sessionStorageKey
    );

    const nextValue = hasIncrementedThisSession ? baseline : baseline + 1;

    window.localStorage.setItem(localStorageKey, String(nextValue));
    window.sessionStorage.setItem(sessionStorageKey, "1");
    setCount(nextValue, "local");
  };

  try {
    const response = await fetch(endpoint, { cache: "no-store" });

    if (!response.ok) {
      throw new Error(`Count API responded with ${response.status}`);
    }

    const data = await response.json();
    const value = Number.parseInt(data.value, 10);
    setCount(value, "remote");
  } catch (error) {
    console.info(
      "Unable to reach CountAPI. Switching to local fallback counter.",
      error
    );
    updateLocalFallback();
  }
});

