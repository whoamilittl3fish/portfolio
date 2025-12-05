# How to add new blog

## Steps

1. Create new folder in `/blogs/` (e.g., `/blogs/your-topic/`) with `en.html`, `vi.html` (optional), images
3. Add blog card to [blogs.html](../../blogs.html) inside `#blog-posts`

## Blog Card Template

Add this to `blogs.html`:

```html
<!-- blog - YOUR BLOG TITLE -->
<article class="blog-card">
    <a href="/blogs/your-topic/en.html" class="blog-card__link">
        <h2 class="blog-card__title">Blog Title</h2>
        <p class="blog-card__summary">Short summary of your blog post...</p>
    </a>
    <ul class="blog-card__tags">
        <li><a href="?tag=TagName" class="blog-tag" data-tag="TagName">TagName</a></li>
    </ul>
    <div class="blog-card__meta">
        <span>Month DD, YYYY</span>
    </div>
</article>
```

## Folder Structure

```
blogs/
└── your-topic/
    ├── en.html     # english version
    ├── vi.html     # vietnamese version
    └── 1.png      
```

## Notes

- Tags must have matching `href="?tag=X"` and `data-tag="X"`
- Date format: `Month DD, YYYY` (e.g., Nov 10, 2025)