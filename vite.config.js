import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        blogs: resolve(__dirname, 'blogs.html'),
        'blog-post': resolve(__dirname, 'blog-post.html'),
        projects: resolve(__dirname, 'projects.html'),
      },
    },
  },
});

