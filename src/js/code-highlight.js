import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';
import 'highlight.js/styles/github-dark.css';

// initialize highlight.js for all code blocks
function initCodeHighlight() {
  // find all code blocks in blog posts
  document.querySelectorAll('.blog-content pre code').forEach((block) => {
    // highlight the code block
    hljs.highlightElement(block);
  });
}

// DOMContentLoaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCodeHighlight);
} else {
  initCodeHighlight();
}

