// config
const postPerPage = {
  mobile: 4,
  desktop: 6,
};

// state
let allPosts = [];
let currentPage = 1;
let resizeTimeout;

// helpers
function getPostsPerPage() {
  return window.innerWidth < 640 ? postPerPage.mobile : postPerPage.desktop;
}

function getTotalPages() {
  return Math.ceil(allPosts.length / getPostsPerPage());
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
  return `
    <article class="blog-card">
      <a href="/blogs/${post.slug}/en.html" class="blog-card__link">
        <h2 class="blog-card__title">${post.title || post.slug}</h2>
        <p class="blog-card__summary">${post.summary || ""}</p>
        <div class="blog-card__meta">
          <span>${formatDate(post.date)}</span>
          <ul class="blog-card__tags">
            ${(post.tags || []).map((t) => `<li class="blog-tag">${t}</li>`).join("")}
          </ul>
        </div>
      </a>
    </article>
  `;
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
  const pagePosts = allPosts.slice(start, start + perPage);

  container.innerHTML = pagePosts.length
    ? pagePosts.map(createBlogCard).join("")
    : '<p class="blog-card__summary">No blog posts yet.</p>';

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
  // get posts from blogs-data.js, sort by date (newest first)
  allPosts = (window.blogPosts || [])
    .slice()
    .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
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
