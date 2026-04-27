import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

export default defineConfig({
  adapter: vercel(),
  site: 'https://zoskisk.com',
  security: {
    checkOrigin: true,
    allowedDomains: [
      { hostname: 'zoskisk.com', protocol: 'https' },
      { hostname: 'zoskisk.vercel.app', protocol: 'https' },
      { hostname: 'localhost', protocol: 'http', port: '3000' }
    ]
  },
  integrations: [sitemap({
    changefreq: 'weekly',
    priority: 0.7,
    lastmod: new Date(),
  })],
  markdown: {
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark'
      },
      wrap: true
    }
  },
  server: {
    host: true,
    port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
    watch: {
      // hot reload file watching
      usePolling: true,
      interval: 100
    }
  }
});

