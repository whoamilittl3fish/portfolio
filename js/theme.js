// toggle theme with CSS color-scheme support
document.addEventListener("DOMContentLoaded", () => {
  const root = document.documentElement;
  const toggleBtn = document.getElementById("theme-toggle");

  if (!toggleBtn) {
    return;
  }

  const applyTheme = (theme) => {
    const normalizedTheme = theme === "dark" ? "dark" : "light";

    root.dataset.theme = normalizedTheme;
    root.style.colorScheme = normalizedTheme;

    toggleBtn.textContent =
      normalizedTheme === "dark" ? "🌙 Dark Mode" : "☀️ Light Mode";
    try {
      localStorage.setItem("theme", normalizedTheme);
    } catch (error) {
      console.warn("Unable to persist theme preference", error);
    }
  };

  const getInitialTheme = () => {
    const storedTheme = (() => {
      try {
        return localStorage.getItem("theme");
      } catch {
        return null;
      }
    })();

    if (storedTheme === "dark" || storedTheme === "light") {
      return storedTheme;
    }

    if (root.dataset.theme === "dark" || root.dataset.theme === "light") {
      return root.dataset.theme;
    }

    return window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  };

  applyTheme(getInitialTheme());

  toggleBtn.addEventListener("click", () => {
    const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
    applyTheme(nextTheme);
  });
});