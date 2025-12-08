// config
const postPerPage = {
  mobile: 4,
  desktop: 6,
};

// state
let allCards = [];
let filteredCards = [];
let currentPage = 1;
let currentTag = null;
let resizeTimeout;

// helpers
function getPostsPerPage() {
  return window.innerWidth < 640 ? postPerPage.mobile : postPerPage.desktop;
}

function getTotalPages() {
  return Math.ceil(filteredCards.length / getPostsPerPage());
}

function getTagFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("tag");
}

function getCardTags(card) {
  const tagElements = card.querySelectorAll(".blog-tag");
  return Array.from(tagElements).map((el) => el.dataset.tag?.toLowerCase() || "");
}

function filterCards() {
  if (!currentTag) {
    filteredCards = allCards;
  } else {
    filteredCards = allCards.filter((card) =>
      getCardTags(card).some((t) => t === currentTag.toLowerCase())
    );
  }
}

// ui
function renderFilterStatus() {
  const container = document.querySelector("#filter-status");
  if (!container) return;

  if (currentTag) {
    container.innerHTML = `
      <span>Filtering by: <strong>${currentTag}</strong></span>
      <a href="/blogs.html" class="filter-clear">Clear filter</a>
    `;
  } else {
    container.innerHTML = "";
  }
}

function updatePagination() {
  const container = document.querySelector("#pagination");
  if (!container) return;

  const totalPages = getTotalPages();
  if (totalPages <= 1) {
    container.innerHTML = "";
    return;
  }

  container.innerHTML = Array.from({ length: totalPages }, (_, i) => {
    const page = i + 1;
    const isActive = page === currentPage;
    return `<button class="pagination__btn ${isActive ? "is-active" : ""}" data-page="${page}" aria-label="${isActive ? `Current page, page ${page}` : `Go to page ${page}`}" ${isActive ? 'aria-current="page"' : ''}>${page}</button>`;
  }).join("");
}

function updateActiveTagStyles() {
  // update active state for tag links
  document.querySelectorAll(".blog-tag").forEach((tag) => {
    const tagName = tag.dataset.tag?.toLowerCase() || "";
    if (currentTag && tagName === currentTag.toLowerCase()) {
      tag.classList.add("is-active"); // check if the tag is the current tag to highlight it
    } else {
      tag.classList.remove("is-active"); // remove the active state if the tag is not the current tag
    }
  });
}

function renderBlogs() {
  const container = document.querySelector("#blog-posts");
  if (!container) return;

  const perPage = getPostsPerPage();
  const start = (currentPage - 1) * perPage;
  const end = start + perPage;

  // set none if there is wrong with url, so can use this to say that no blog with tag (defensive coding)
  allCards.forEach((card) => {
    card.style.display = "none";
  });

  // show only cards for current page from filtered set
  const pageCards = filteredCards.slice(start, end);
  pageCards.forEach((card) => {
    card.style.display = "";
  });

  // empty state with no card (defensive coding) but every blog will have tag :D
  let emptyMsg = container.querySelector(".blog-empty");
  if (filteredCards.length === 0) {
    if (!emptyMsg) {
      emptyMsg = document.createElement("p");
      emptyMsg.className = "blog-empty";
      container.appendChild(emptyMsg);
    }
    emptyMsg.textContent = currentTag 
      ? `No posts with tag "${currentTag}".` 
      : "No blog posts yet."; // just for something wrong, blog will always there
    emptyMsg.style.display = "";
  } else if (emptyMsg) {
    emptyMsg.style.display = "none";
  }

  renderFilterStatus();
  updatePagination();
  updateActiveTagStyles();
}

// event handlers
function handlePaginationClick(e) {
  const btn = e.target.closest("[data-page]");
  if (!btn) return;

  const page = parseInt(btn.dataset.page, 10);
  if (page === currentPage) return;

  currentPage = page;
  renderBlogs();
}

// resize when the window is resized to update the cards
function handleResize() {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    const newTotalPages = getTotalPages();
    if (currentPage > newTotalPages) currentPage = newTotalPages || 1;
    renderBlogs();
  }, 200);
}

// init for blogs page
function init() {
  const container = document.querySelector("#blog-posts");
  if (!container) return;

  // get all existing cards from HTML
  allCards = Array.from(container.querySelectorAll(".blog-card"));
  
  // get tag from URL to filter the cards
  currentTag = getTagFromURL();

  // filter and render the cards
  filterCards();
  renderBlogs();

  // pagination click to change the page
  const pagination = document.querySelector("#pagination");
  if (pagination) {
    pagination.addEventListener("click", handlePaginationClick);
  }

  // resize handler to update the cards when the window is resized
  window.addEventListener("resize", handleResize);
}

document.addEventListener("DOMContentLoaded", init);
