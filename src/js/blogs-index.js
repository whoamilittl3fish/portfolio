// config
const postPerPage = {
  mobile: 4,
  desktop: 6,
};

// state
let allPosts = [];
let filteredPosts = [];
let currentPage = 1;
let currentTag = null;
let resizeTimeout;

// helpers
function getPostsPerPage() {
  return window.innerWidth < 640 ? postPerPage.mobile : postPerPage.desktop;
}

function getTotalPages() {
  return Math.ceil(filteredPosts.length / getPostsPerPage());
}

function getTagFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("tag");
}

function filterPosts() {
  if (!currentTag) {
    filteredPosts = allPosts;
  } else {
    filteredPosts = allPosts.filter((post) =>
      (post.tags || []).some((t) => t.toLowerCase() === currentTag.toLowerCase())
    );
  }
}

function formatDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// ui
function createBlogCard(post) {
  const tagsHtml = (post.tags || [])
    .map((t) => {
      const isActive = currentTag && t.toLowerCase() === currentTag.toLowerCase();
      return `<li><a href="?tag=${encodeURIComponent(t)}" class="blog-tag ${isActive ? "is-active" : ""}" data-tag="${t}">${t}</a></li>`;
    })
    .join("");

  return `
    <article class="blog-card">
      <a href="/blogs/${post.slug}/en.html" class="blog-card__link">
        <h2 class="blog-card__title">${post.title || post.slug}</h2>
        <p class="blog-card__summary">${post.summary || ""}</p>
      </a>
      <ul class="blog-card__tags">${tagsHtml}</ul>
      <div class="blog-card__meta">
        <span>${formatDate(post.date)}</span>
      </div>
    </article>
  `;
}

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
    return `<button class="pagination__btn ${page === currentPage ? "is-active" : ""}" data-page="${page}">${page}</button>`;
  }).join("");
}

function renderBlogs() {
  const container = document.querySelector("#blog-posts");
  if (!container) return;

  const perPage = getPostsPerPage();
  const start = (currentPage - 1) * perPage;
  const pagePosts = filteredPosts.slice(start, start + perPage);

  container.innerHTML = pagePosts.length
    ? pagePosts.map(createBlogCard).join("")
    : `<p class="blog-empty">${currentTag ? `No posts with tag "${currentTag}".` : "No blog posts yet."}</p>`;

  renderFilterStatus();
  updatePagination();
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

function handleResize() {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    const newTotalPages = getTotalPages();
    if (currentPage > newTotalPages) currentPage = newTotalPages || 1;
    renderBlogs();
  }, 200);
}

// init
function init() {
  // get tag from URL
  currentTag = getTagFromURL();

  // get posts from blogs-data.js, sort by date (newest first)
  allPosts = (window.blogPosts || [])
    .slice()
    .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));

  // filter posts
  filterPosts();
  renderBlogs();

  // pagination click
  const pagination = document.querySelector("#pagination");
  if (pagination) {
    pagination.addEventListener("click", handlePaginationClick);
  }

  // resize
  window.addEventListener("resize", handleResize);
}

document.addEventListener("DOMContentLoaded", init);
