// helpers

function getInitialTheme() {
  const root = document.documentElement;
  
  try {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "dark" || storedTheme === "light") {
      return storedTheme;
    }
  } catch {
    // ignore error with line check :D
  }

  if (root.dataset.theme === "dark" || root.dataset.theme === "light") {
    return root.dataset.theme;
  }

  return window.matchMedia?.("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyTheme(theme, toggleBtn) {
  const root = document.documentElement;
  const normalizedTheme = theme === "dark" ? "dark" : "light";

  root.dataset.theme = normalizedTheme;
  root.style.colorScheme = normalizedTheme;

  if (toggleBtn) {
    toggleBtn.textContent = normalizedTheme === "dark" ? "🌙 Dark" : "☀️ Light";
  }

  try {
    localStorage.setItem("theme", normalizedTheme);
  } catch (error) {
    console.warn("Unable to persist theme preference", error);
  }
}

// init

function init() {
  const toggleBtn = document.getElementById("theme-toggle");
  applyTheme(getInitialTheme(), toggleBtn);

  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      const root = document.documentElement;
      const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
      
      // enable transition only when user clicks (no auto-enable transitions decrease CLS performance)
      document.body.classList.add("theme-transition");
      applyTheme(nextTheme, toggleBtn);
      
      // remove transition class after animation completes (matches --transition: 0.3s)
      setTimeout(() => {
        document.body.classList.remove("theme-transition");
      }, 300); // matches --transition: 0.3s
    });
  }
}

// run init when layout is ready (no auto-enable transitions)
window.addEventListener("layout-ready", init);
