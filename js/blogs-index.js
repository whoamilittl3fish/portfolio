const blogSlugs = ["api-overview"];

const blogState = {
  posts: [],
};

function parseFrontmatter(markdown) {
  const match = markdown.match(/^---\s*([\s\S]*?)\s*---/);
  if (!match) {
    return {};
  }

  const frontmatterRaw = match[1]
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return frontmatterRaw.reduce((acc, line) => {
    const [rawKey, ...rest] = line.split(":");
    if (!rawKey || rest.length === 0) {
      return acc;
    }

    const key = rawKey.trim();
    const rawValue = rest.join(":").trim();

    if (!rawValue) {
      return acc;
    }

    let value = rawValue;

    try {
      if (rawValue.startsWith("[") || rawValue.startsWith("{")) {
        value = JSON.parse(rawValue);
      } else if (
        (rawValue.startsWith('"') && rawValue.endsWith('"')) ||
        (rawValue.startsWith("'") && rawValue.endsWith("'"))
      ) {
        value = rawValue.slice(1, -1);
      }
    } catch (error) {
      console.warn(`Unable to parse value for key "${key}"`, error);
      value = rawValue;
    }

    acc[key] = value;
    return acc;
  }, {});
}

function resolveThumbnail(slug, metadata) {
  if (!metadata.thumbnail) {
    return `/blogs/${slug}/1.png`;
  }

  if (metadata.thumbnail.startsWith("/")) {
    return metadata.thumbnail;
  }

  const sanitized = metadata.thumbnail.replace(/^.\//, "");
  return `/blogs/${slug}/${sanitized}`;
}

async function fetchPostMetadata(slug) {
  try {
    const response = await fetch(`/blogs/${slug}/index.md`);
    if (!response.ok) {
      throw new Error(`Failed to load metadata for ${slug}`);
    }

    const markdown = await response.text();
    const metadata = parseFrontmatter(markdown);

    return {
      slug,
      title: metadata.title ?? slug,
      date: metadata.date ?? "",
      summary:
        metadata.summary ??
        "Read more to explore the full story behind this post.",
      tags: Array.isArray(metadata.tags) ? metadata.tags : [],
      thumbnail: resolveThumbnail(slug, metadata),
      languages: Array.isArray(metadata.languages)
        ? metadata.languages
        : ["en"],
    };
  } catch (error) {
    console.error(error);
    return null;
  }
}

function formatDate(dateString) {
  if (!dateString) {
    return "";
  }

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function createBlogCard(post) {
  const article = document.createElement("article");
  article.className = "blog-card";

  const link = document.createElement("a");
  link.href = `/blog-post.html?slug=${post.slug}`;
  link.className = "blog-card__link";
  link.setAttribute("aria-label", `Read ${post.title}`);

  const thumb = document.createElement("img");
  thumb.className = "blog-card__thumb";
  thumb.alt = `${post.title} cover`;
  thumb.loading = "lazy";
  thumb.src = post.thumbnail;

  const content = document.createElement("div");
  content.className = "blog-card__content";

  const meta = document.createElement("div");
  meta.className = "blog-card__meta";

  const dateEl = document.createElement("span");
  dateEl.textContent = formatDate(post.date);

  const langBadges = document.createElement("span");
  langBadges.className = "lang-badges";
  post.languages.forEach((lang) => {
    const badge = document.createElement("span");
    badge.className = "lang-badge";
    badge.textContent = lang;
    badge.setAttribute("aria-label", `${lang} available`);
    langBadges.appendChild(badge);
  });

  meta.append(dateEl, langBadges);

  const title = document.createElement("h2");
  title.className = "blog-card__title";
  title.textContent = post.title;

  const summary = document.createElement("p");
  summary.className = "blog-card__summary";
  summary.textContent = post.summary;

  const tags = document.createElement("ul");
  tags.className = "blog-card__tags";
  post.tags.forEach((tag) => {
    const item = document.createElement("li");
    item.className = "blog-tag";
    item.textContent = tag;
    tags.appendChild(item);
  });

  const footer = document.createElement("div");
  footer.className = "blog-card__footer";
  footer.innerHTML = `<span>Continue reading</span><span>Open</span>`;

  content.append(meta, title, summary, tags, footer);
  link.append(thumb, content);
  article.append(link);

  return article;
}

function renderBlogs() {
  const container = document.querySelector("#blog-posts");
  const loading = document.querySelector(".loading-dots");

  if (!container) {
    return;
  }

  container.innerHTML = "";

  if (!blogState.posts.length) {
    container.innerHTML =
      '<p class="blog-card__summary">No blog posts yet. Check back soon!</p>';
  } else {
    blogState.posts.forEach((post) => {
      const card = createBlogCard(post);
      container.appendChild(card);
    });
  }

  if (loading) {
    loading.style.display = "none";
  }
}

async function loadBlogs() {
  const metadataList = await Promise.all(blogSlugs.map(fetchPostMetadata));
  blogState.posts = metadataList.filter(Boolean).sort((a, b) => {
    if (!a.date || !b.date) {
      return 0;
    }
    return new Date(b.date) - new Date(a.date);
  });
  renderBlogs();
}

document.addEventListener("DOMContentLoaded", loadBlogs);

