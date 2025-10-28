const toggleBtn = document.getElementById("theme-toggle");
const body = document.body;

const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark"){
    body.classList.add("dark-mode");
    toggleBtn.textContent = "🌙 Dark Mode";
} else {
    toggleBtn.textContent = "☀️ Light Mode";
}

toggleBtn.addEventListener("click", () => {
  body.classList.toggle("dark-mode");

  if (body.classList.contains("dark-mode")) {
    toggleBtn.textContent = "🌙 Dark Mode";
    localStorage.setItem("theme", "dark");
  } else {
    toggleBtn.textContent = "☀️ Light Mode";
    localStorage.setItem("theme", "light");
  }

  console.log(`Theme is ${localStorage.getItem("theme")}`);
});

console.log("Theme on load:", localStorage.getItem("theme"));