document.addEventListener("DOMContentLoaded", async () => {
  const visitorElement = document.querySelector("[data-visitor-count]");
  if (!visitorElement) {
    return;
  }

  const endpoint = "https://api.countapi.xyz/hit/khoan-portfolio/visitors";

  try {
    const response = await fetch(endpoint);

    if (!response.ok) {
      throw new Error(`Count API responded with ${response.status}`);
    }

    const data = await response.json();
    const value = Number.parseInt(data.value, 10);

    visitorElement.textContent = Number.isFinite(value)
      ? value.toLocaleString()
      : "—";
  } catch (error) {
    console.warn("Unable to load visitor count", error);
    visitorElement.textContent = "—";
  }
});

