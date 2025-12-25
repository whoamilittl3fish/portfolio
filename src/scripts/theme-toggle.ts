// Get theme from localStorage or system preference
function getInitialTheme(): 'light' | 'dark' {
  const stored = localStorage.getItem('theme');
  if (stored === 'dark' || stored === 'light') {
    return stored;
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

// Apply theme
function applyTheme(theme: 'light' | 'dark') {
  // Temporarily disable transitions for instant theme change
  const style = document.createElement('style');
  style.textContent = '* { transition: none !important; }';
  document.head.appendChild(style);

  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;

  const icon = document.querySelector('.theme-toggle__icon');
  if (icon) {
    icon.textContent = theme === 'dark' ? '🌙' : '☀️';
  }

  localStorage.setItem('theme', theme);

  // Force repaint of body::before (grid background) by toggling opacity
  // This is critical for mobile browsers that cache pseudo-element styles
  document.body.style.setProperty('--grid-opacity', '0.71');
  void document.body.offsetHeight;
  document.body.style.setProperty('--grid-opacity', '0.7');
  void document.body.offsetHeight;
  document.body.style.removeProperty('--grid-opacity');
  
  // Force reflow to ensure theme is applied immediately (fixes mobile issue)
  void document.documentElement.offsetHeight;
  void document.body.offsetHeight;
  
  // Force browser to recalculate styles for all elements
  getComputedStyle(document.body).color;
  getComputedStyle(document.documentElement).color;
  getComputedStyle(document.body).backgroundColor;
  
  // Force repaint of all elements by temporarily adding/removing a class
  document.documentElement.classList.add('theme-changing');
  void document.documentElement.offsetHeight;
  document.documentElement.classList.remove('theme-changing');
  
  // Force repaint of all sections and main elements with more aggressive approach
  const allElements = document.querySelectorAll('section, main, .hero, .section, .timeline, .btn, .pill, h1, h2, p, a, li');
  allElements.forEach(el => {
    const htmlEl = el as HTMLElement;
    // Force style recalculation
    void htmlEl.offsetHeight;
    void htmlEl.offsetWidth;
    getComputedStyle(htmlEl).color;
    getComputedStyle(htmlEl).backgroundColor;
  });
  
  // Force repaint of header and footer
  const header = document.querySelector('header');
  const footer = document.querySelector('footer');
  if (header) {
    void (header as HTMLElement).offsetHeight;
    getComputedStyle(header).backgroundColor;
  }
  if (footer) {
    void (footer as HTMLElement).offsetHeight;
    getComputedStyle(footer).color;
  }
  
  // Final reflow to ensure everything is painted
  void document.body.offsetHeight;
  void document.documentElement.offsetHeight;
  
  // Additional force repaint for mobile browsers
  requestAnimationFrame(() => {
    void document.body.offsetHeight;
  });

  // Re-enable transitions after a short delay
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.head.removeChild(style);
    });
  });

  // Dispatch custom event for other components to react to theme change
  window.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
}

applyTheme(getInitialTheme());

// Click event for theme toggle
document.getElementById('theme-toggle')?.addEventListener('click', () => {
  const current = document.documentElement.dataset.theme;
  const next = current === 'dark' ? 'light' : 'dark';
  applyTheme(next);
});

// Follow system preference change
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  if (!localStorage.getItem('theme')) {
    applyTheme(e.matches ? 'dark' : 'light');
  }
});

