# How to add new project

Project is added directly in [projects.html](../../projects.html).

## Steps

1. Open `projects.html`
2. Add new `<article class="project-card">` inside `#projects-list`
3. Follow the template below

## Template

```html
<!-- project - YOUR PROJECT NAME -->
<article class="project-card">
    <header class="project-card__header">
        <div class="project-card__title-row">
            <h3>Project Title</h3>
            <span class="project-card__toggle">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>
            </span>
        </div>
        <span class="project-card__period">Month Year – Month Year</span>
    </header>
    <p class="project-card__preview text-fade">Short preview description (shown when collapsed)...</p>
    <div class="project-card__content">
        <p class="project-card__description">Full description (shown when expanded)...</p>
        <ul class="project-card__tech">
            <li class="tech-pill tech-pill--link"><a href="https://..." target="_blank" rel="noreferrer noopener">Tech1</a></li>
            <li class="tech-pill tech-pill--link"><a href="https://..." target="_blank" rel="noreferrer noopener">Tech2</a></li>
        </ul>
        <div class="project-card__links">
            <a href="https://..." target="_blank" rel="noreferrer noopener">Live Demo</a>
            <a href="https://github.com/..." target="_blank" rel="noreferrer noopener">
                <svg viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
                Source
            </a>
        </div>
    </div>
</article>
```

## Notes
- You can search SVG for icon on [here](https://simpleicons.org/) :D.
