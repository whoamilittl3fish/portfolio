// ui - handle expand/collapse for project cards
function initProjectCards() {
  const cards = document.querySelectorAll(".project-card");
  
  cards.forEach((card) => {
    const header = card.querySelector(".project-card__header");
    if (header) {
      header.addEventListener("click", () => {
        card.classList.toggle("is-expanded");
      });
    }
  });
}

// init
function init() {
  initProjectCards();
  console.log("🐾 Portfolio loaded successfully!");
}

document.addEventListener("DOMContentLoaded", init);
