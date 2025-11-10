// toggle theme
const toggleBtn = document.getElementById("theme-toggle");
const body = document.body;

const applyTheme = (theme) => {
  const normalizedTheme = theme === "dark" ? "dark" : "light";

  body.classList.remove("light-mode", "dark-mode");
  body.classList.add(`${normalizedTheme}-mode`);

  const label = normalizedTheme === "dark" ? "🌙 Dark Mode" : "☀️ Light Mode";
  toggleBtn.textContent = label;
  localStorage.setItem("theme", normalizedTheme);
};

// if theme is not set, default to light mode
const savedTheme = localStorage.getItem("theme") || "light";
applyTheme(savedTheme);

toggleBtn.addEventListener("click", () => {
  const nextTheme = body.classList.contains("dark-mode") ? "light" : "dark";
  applyTheme(nextTheme);
});

console.log("Theme on load:", localStorage.getItem("theme"));