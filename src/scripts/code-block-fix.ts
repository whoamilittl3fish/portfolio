// Fix code blocks color for theme switching
function fixCodeBlocks() {
  const isDark = document.documentElement.dataset.theme === 'dark';
  const codeBlocks = document.querySelectorAll<HTMLElement>('pre.astro-code');

  codeBlocks.forEach((pre) => {
    // Change background
    pre.style.background = isDark ? '#0d0d0d' : '#f4f4f4';

    pre.querySelectorAll<HTMLElement>('span').forEach((span) => {
      // Save original light color (only once)
      if (!span.dataset.lightColor && span.style.color) {
        span.dataset.lightColor = span.style.color;
      }

      if (isDark) {
        // Dark mode: use --shiki-dark color
        const darkColor = span.style.getPropertyValue('--shiki-dark');
        if (darkColor) span.style.color = darkColor;
      } else {
        // Light mode: restore original color
        const lightColor = span.dataset.lightColor;
        if (lightColor) span.style.color = lightColor;
      }
    });
  });
}

// Run after page load
setTimeout(fixCodeBlocks, 100);

// Run when theme changes
new MutationObserver(fixCodeBlocks).observe(document.documentElement, {
  attributes: true,
  attributeFilter: ['data-theme']
});

