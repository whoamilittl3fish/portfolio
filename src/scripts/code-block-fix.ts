/**
 * Fix Shiki code blocks for theme switching
 * Handles syntax highlighting theme changes between light and dark modes
 */

/**
 * Fix code block colors within a container
 * @param containerSelector - CSS selector for the container (default: document)
 */
export function fixShikiCodeBlocks(containerSelector?: string): void {
  const isDark = document.documentElement.dataset.theme === 'dark';
  const container = containerSelector 
    ? document.querySelector(containerSelector) 
    : document;
  
  if (!container) return;
  
  const codeBlocks = container.querySelectorAll<HTMLElement>('pre.astro-code');
  
  codeBlocks.forEach((pre) => {
    // Check if it's plaintext
    const dataLang = pre.getAttribute('data-language');
    const codeElement = pre.querySelector('code');
    const isPlaintext = dataLang === 'plaintext' || 
                       codeElement?.classList.contains('language-plaintext');
    
    // Set font-family to JetBrains Mono
    pre.style.setProperty('font-family', 'var(--font-mono)', 'important');
    
    // Set font-family for all children
    pre.querySelectorAll('*').forEach((el: HTMLElement) => {
      el.style.setProperty('font-family', 'var(--font-mono)', 'important');
    });
    
    // Set background color
    const bgColor = isPlaintext 
      ? (isDark ? '#0f0f0f' : '#f8f8f8')
      : (isDark ? '#0d0d0d' : '#f4f4f4');
    
    pre.style.setProperty('background-color', bgColor, 'important');
    pre.style.setProperty('background', bgColor, 'important');

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
        // Light mode: restore original color or ensure readability
        const lightColor = span.dataset.lightColor;
        if (lightColor) {
          // Check if color is too light
          const rgb = lightColor.match(/\d+/g);
          if (rgb && rgb.length >= 3) {
            const brightness = (parseInt(rgb[0]) + parseInt(rgb[1]) + parseInt(rgb[2])) / 3;
            span.style.color = brightness > 200 ? '#24292e' : lightColor;
          } else {
            span.style.color = lightColor;
          }
        }
      }
    });
  });
}

/**
 * Initialize code block fix with theme change observer
 * @param containerSelector - CSS selector for the container
 */
export function initCodeBlockFix(containerSelector?: string): void {
  // Initial fix with retry for late-rendered blocks
  const attemptFix = () => {
    fixShikiCodeBlocks(containerSelector);
    setTimeout(() => fixShikiCodeBlocks(containerSelector), 100);
  };
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', attemptFix);
  } else {
    requestAnimationFrame(attemptFix);
  }
  
  // Watch for theme changes
  new MutationObserver(() => {
    setTimeout(() => fixShikiCodeBlocks(containerSelector), 50);
  }).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme']
  });
}

// Auto-initialize for global code blocks
initCodeBlockFix();
