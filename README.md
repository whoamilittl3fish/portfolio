# Portfolio

This is my source portfolio.
(Viet Khoa, also name as zoskisk).

## Key Features

- **SSR & API Routes**: Built with Astro + Vercel for fast server-side rendering.
- **Advanced Security**: 
  - **Cloudflare Turnstile**: Modern, non-intrusive CAPTCHA to prevent bot spam.
  - **Honeypot Protection**: Secondary bot trap to silently ignore automated submissions.
  - **CSRF Protection**: Domain-specific origin checking for API security.
- **Smart Contact System**: 
  - **Resend Integration**: High-deliverability email service for contact notifications.
  - **Auto-Reply**: Automated, time-aware confirmation emails to clients (Good morning/afternoon/evening).
  - **Thank-You Flow**: Dedicated success page with automated redirection.
- **Responsive UI**: 
  - **Dual-mode Navigation**: Custom bottom navigation bar optimized for mobile with a 2-row layout.
  - **Terminal Overlay**: Interactive mini-terminal for a tech-focused UX.
  - **Theme Toggle**: Dark/Light mode support.

## Project Structure

```
portfolio/
├── src/
│   ├── components/          # UI Components + Layouts
│   │   ├── BaseLayout.astro
│   │   ├── BlogPost.astro
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── BlogCard.astro
│   │   ├── ThemeToggle.astro
│   │   └── LanguageSwitcher.astro
│   │
│   ├── content/            # Data + Blog Content
│   │   ├── config.ts       # Content Collections schema
│   │   ├── projects.ts     # Projects data
│   │   └── blogs/          # Blog posts (Markdown)
│   │       ├── api-overview/
│   │       │   ├── en.md   # English version
│   │       │   └── vi.md   # Vietnamese version
│   │       └── mutation-collection/
│   │           ├── en.md
│   │           └── vi.md
│   │
│   ├── pages/              # Routes
│   │   ├── index.astro     # Homepage
│   │   ├── projects.astro  # Projects page
│   │   └── blogs/
│   │       ├── index.astro  # Blog list
│   │       └── [lang]/[slug].astro  # Dynamic blog route
│   │
│   ├── scripts/            # Client-side JavaScript
│   │   ├── blog-filter.ts
│   │   └── project-card.ts
│   │
│   └── styles/             # CSS
│       ├── global.css      # Global styles with CSS variables
│       ├── components/     # Component styles
│       └── pages/          # Page styles
│
├── public/
│   ├── assets/
│   │   ├── blogs/          # Blog images
│   │   │   ├── api-overview/
│   │   │   │   └── 1.png   # Images for each blog
│   │   │   └── mutation-collection/
│   │   ├── projects/       # Project screenshots
│   │   └── icon/           # Site icons
│   └── fonts/             # Custom fonts (JetBrains Mono)
│
├── astro.config.mjs       # Astro configuration
├── tsconfig.json          # TypeScript config
└── package.json           # Dependencies & scripts
```

## How to Run

### Development with hot reload vite.

```bash
npm install
npm run dev
```

Server will start at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

Output will be in `dist/` directory and test preview before I push on Github and deploy by Vercel.

### Preview Production Build

```bash
npm run preview
```

### Development hot reload with Docker

```bash
docker compose up
```

Server will start at `http://localhost:8000`

--- 
### **Live:** [zoskisk](https://zoskisk.vercel.app)