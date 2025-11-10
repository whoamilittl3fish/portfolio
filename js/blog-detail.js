let markdownRenderer;

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
    month: "long",
    day: "numeric",
  });
}

async function loadMarkdown(path) {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Failed to load ${path}`);
  }
  return response.text();
}

function updatePageMeta(slug, metadata) {
  const titleElement = document.querySelector("title");
  if (metadata.title && titleElement) {
    titleElement.textContent = `${metadata.title} • Blog`;
  }

  const heading = document.querySelector("[data-blog-title]");
  if (heading && metadata.title) {
    heading.textContent = metadata.title;
  }

  const dateElement = document.querySelector("[data-blog-date]");
  if (dateElement) {
    dateElement.textContent = formatDate(metadata.date);
  }

  const tagsElement = document.querySelector("[data-blog-tags]");
  if (tagsElement) {
    tagsElement.innerHTML = "";
    (Array.isArray(metadata.tags) ? metadata.tags : []).forEach((tag) => {
      const badge = document.createElement("span");
      badge.className = "blog-tag";
      badge.textContent = tag;
      tagsElement.appendChild(badge);
    });
  }

  const summaryElement = document.querySelector("[data-blog-summary]");
  if (summaryElement && metadata.summary) {
    summaryElement.textContent = metadata.summary;
  }

  const thumbImage = document.querySelector("[data-blog-thumb]");
  if (thumbImage) {
    let thumbnail = metadata.thumbnail;
    if (!thumbnail) {
      thumbnail = `/blogs/${slug}/1.png`;
    } else if (!thumbnail.startsWith("/")) {
      thumbnail = `/blogs/${slug}/${thumbnail.replace(/^.\//, "")}`;
    }
    thumbImage.src = thumbnail;
    thumbImage.alt = metadata.title || `${slug} cover image`;
  }
}

function setActiveLanguage(lang) {
  document.querySelectorAll(".lang-switcher__button").forEach((button) => {
    const isActive = button.dataset.lang === lang;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", isActive ? "true" : "false");
  });
}

function rewriteRelativePaths(markdown, slug) {
  if (!slug) {
    return markdown;
  }

  const assetPrefix = `/blogs/${slug}/`;

  return markdown
    .replace(/(!\[[^\]]*\]\()\.\//g, `$1${assetPrefix}`)
    .replace(/(\[[^\]]*\]\()\.\//g, `$1${assetPrefix}`)
    .replace(/(<img[^>]*src=["'])(\.\/)([^"']+)(["'][^>]*>)/g, `$1${assetPrefix}$3$4`);
}

async function renderBlogContent(slug, lang) {
  const contentContainer = document.querySelector("#blog-content");
  if (!contentContainer) {
    return;
  }

  if (!window.blogCache) {
    window.blogCache = new Map();
  }

  const cacheKey = `${slug}/${lang}`;
  if (!window.blogCache.has(cacheKey)) {
    const markdown = await loadMarkdown(`/blogs/${slug}/${lang}.md`);
    window.blogCache.set(cacheKey, markdown);
  }

  const markdown = window.blogCache.get(cacheKey);

  const processedMarkdown = rewriteRelativePaths(markdown, slug);

  if (!markdownRenderer) {
    if (typeof marked === "undefined") {
      throw new Error("Markdown renderer not available");
    }

    markdownRenderer = marked;
    if (typeof markdownRenderer.setOptions === "function") {
      markdownRenderer.setOptions({
        breaks: true,
      });
    }
  }

  contentContainer.innerHTML = markdownRenderer.parse(processedMarkdown);
  setActiveLanguage(lang);

  const url = new URL(window.location.href);
  url.searchParams.set("lang", lang);
  window.history.replaceState({}, "", url);
}

function setupLanguageSwitcher(slug, languages, defaultLang) {
  const switcher = document.querySelector("[data-lang-switcher]");
  if (!switcher) {
    return defaultLang;
  }

  switcher.innerHTML = "";

  const uniqueLangs = languages.filter(Boolean);
  if (!uniqueLangs.length) {
    switcher.hidden = true;
    return defaultLang;
  }

  uniqueLangs.forEach((lang) => {
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.lang = lang;
    button.className = "lang-switcher__button";
    button.textContent = lang.toUpperCase();
    button.addEventListener("click", () => renderBlogContent(slug, lang));
    switcher.appendChild(button);
  });

  switcher.hidden = uniqueLangs.length <= 1;

  return uniqueLangs.includes(defaultLang) ? defaultLang : uniqueLangs[0];
}

async function initBlogDetailPage() {
  const body = document.body;
  let slug = body.dataset.blogSlug;

  if (!slug) {
    const params = new URLSearchParams(window.location.search);
    slug = params.get("slug");

    if (!slug) {
      const parts = window.location.pathname.split("/").filter(Boolean);
      const lastSegment = parts[parts.length - 1] || "";
      const inferred =
        lastSegment && lastSegment !== "blog-post"
          ? lastSegment.replace(/\.html$/, "")
          : "";
      if (inferred) {
        slug = inferred;
      }
    }

    if (slug) {
      body.dataset.blogSlug = slug;
    }
  }

  if (!slug) {
    console.error("Missing blog slug. Provide ?slug=your-post.");
    const contentContainer = document.querySelector("#blog-content");
    if (contentContainer) {
      contentContainer.innerHTML =
        "<p>We couldn't determine which article to load. Please return to the blogs page.</p>";
    }
    return;
  }

  const thumbImage = document.querySelector("[data-blog-thumb]");
  if (thumbImage) {
    thumbImage.src = `/blogs/${slug}/1.png`;
  }

  const queryLang = new URLSearchParams(window.location.search).get("lang");
  const fallbackLang = body.dataset.defaultLang || "en";

  try {
    const metadataRaw = await loadMarkdown(`/blogs/${slug}/index.md`);
    const metadata = parseFrontmatter(metadataRaw);
    updatePageMeta(slug, metadata);

    const languages = Array.isArray(metadata.languages)
      ? metadata.languages
      : [];

    const effectiveLang = setupLanguageSwitcher(
      slug,
      languages.length ? languages : [fallbackLang],
      queryLang || fallbackLang
    );

    await renderBlogContent(slug, effectiveLang);
  } catch (error) {
    console.error(error);
    const contentContainer = document.querySelector("#blog-content");
    if (contentContainer) {
      contentContainer.innerHTML =
        "<p>We couldn't load this article right now. Please try again later.</p>";
    }
  }
}

document.addEventListener("DOMContentLoaded", initBlogDetailPage);

