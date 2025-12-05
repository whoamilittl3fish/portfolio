# Portfolio

This is my source portfolio.
(Viet Khoa, also name as zoskisk).

## Project Structure

```
portfolio/
├── index.html              # homepage
├── blogs.html              # blog list page
├── projects.html           # projects list page
├── blogs/                  # blog posts container (each post has its own folder)
│   └── api-overview/       # folder example contain two language version and image
│       ├── en.html         # english version
│       ├── vi.html         # vietnamese version
│       └── 1.png           # image
│
├── src/
│   ├── main.js             # entry point for all js, css
│   ├── css/
│   │   ├── style.css       # global, base style
│   │   ├── btn.css         # button style
│   │   ├── projects.css    # projects style
│   │   ├── blogs-index.css # blog list index style
│   │   └── blog-post.css   # every blog style
│   ├── js/
│   │   ├── layout.js       # header and footer
│   │   ├── theme.js        # theme like dark and light mode
│   │   ├── theme-init.js   # theme init (prevent flash so I run it first)
│   │   ├── projects-index.js # project interaction here, expand card
│   │   └── blogs-index.js  # blog list, filter tag and pagination for a lot of blogs
│   │   
│   └── partials/
│       └── head.html       # share content <head> (:D I don't to write many <head> in the same) this is for SEO (meta tags) and prevent flash with theme script
│
├── public/
│   ├── assets/
│   │   ├── icon/           # site icon
│   │   └── skill-icon/     # tech icon (I removed it now, but it will be here if I need it again)
│   ├── fonts/              # custom font (Jetbrains Mono). Right now just applying on button
│   └── partials/
│       ├── header.html     # site header
│       └── footer.html     # site footer
│
├── vite.config.js          # vite conf (I am learning with this)
├── eslint.config.js        # esline conf (I am also learning with this)
├── docker-compose.dev.yml  # docker dev environment
└── package.json            # dependencies & scripts
```

## Tech Stack

- **Build Tool:** Vite
- **Styling:** Vanilla CSS with CSS Variables
- **JavaScript:** Vanilla JS (no framework)
- **Deployment:** Vercel
- **Development:** Docker

## How to Run

### Development (with Vite)

```bash
npm install
npm run dev
```

### Development (with Docker)

Make sure Docker is running first.

```bash
docker compose -f docker-compose.dev.yml up builder
```

Hot reload enabled (100ms delay in vite.config.js)

### Production (Docker) 

#### It is removed, before I used to use nginx to build static website and now it is deploy with vite.

```bash
docker compose -f docker-compose.prod.yml up -d
```

### Stop

```bash
docker compose down
```

## Link

- **Local:** http://localhost:8080
- **Live:** https://zoskisk.vercel.app

## Adding Content

- [How to add a new blog post](./src/js/README-NEWBLOG.md)
- [How to add a new project](./src/js/README-PROJECT.md)

## Notes

- Blog content is static HTML.
- JS only handles interactions (expand, filter, pagination) right now. Maybe I will update it with Astro framework.
- Theme preference saved in localStorage.
