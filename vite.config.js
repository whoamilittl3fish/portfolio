import { defineConfig } from 'vite';
import { resolve } from 'path';
import { sync } from 'glob';
import handlebars from 'vite-plugin-handlebars';

// search by loop through all blog HTML files and get the path and name of the file then convert to object
const blogInputs = Object.fromEntries( // convert the array to object
  sync('blogs/**/*.html').map(file => [ // send blog html files to the object
    file.replace(/\.html$/, '').replace(/\//g, '-'), // remove the html extension and replace the / with -
    resolve(__dirname, file) // resolve the path of the file
  ])
);

export default defineConfig({

  // plugin for handlebars to load partials and html is shorter and easier to manage
  plugins: [
    handlebars({
      partialDirectory: resolve(__dirname, 'src/partials'),
    }),
  ],

  // server config 100ms to reload the page when the file is changed
  server: {
    host: true,
    watch: {
      usePolling: true,
      interval: 100
    }
  },

  // build config
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        blogs: resolve(__dirname, 'blogs.html'),
        projects: resolve(__dirname, 'projects.html'),
        ...blogInputs // blog inputs from the object before loop through
      },
    },
  },
});
