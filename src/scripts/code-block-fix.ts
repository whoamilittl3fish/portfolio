/**
 * Fix code blocks color for theme switching
 * Handles Shiki syntax highlighting theme changes
 */

function fixCodeBlocks() {
  const isDark = document.documentElement.dataset.theme === 'dark';
  const codeBlocks = document.querySelectorAll<HTMLElement>('pre.astro-code');

  codeBlocks.forEach((pre) => {
    // Update background color
    pre.style.background = isDark ? '#0d0d0d' : '#f4f4f4';

    // Update text colors for all spans
    pre.querySelectorAll<HTMLElement>('span').forEach((span) => {
      // Save original light color on first run
      if (!span.dataset.lightColor && span.style.color) {
        span.dataset.lightColor = span.style.color;
      }

      if (isDark) {
        // Dark mode: use Shiki dark theme color
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

// Initialize on page load
setTimeout(fixCodeBlocks, 100);

// Watch for theme changes
new MutationObserver(fixCodeBlocks).observe(document.documentElement, {
  attributes: true,
  attributeFilter: ['data-theme']
});

