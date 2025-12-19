import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://zoskisk.vercel.app',
  integrations: [sitemap()],
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
    port: 3000,
    watch: {
      // hot reload file watching
      usePolling: true,
      interval: 100
    }
  }
});

