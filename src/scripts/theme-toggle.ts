// Get theme from localStorage or system preference
function getInitialTheme(): 'light' | 'dark' {
  const stored = localStorage.getItem('theme');
  if (stored === 'dark' || stored === 'light') {
    return stored;
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

// Force repaint of elements (fixes mobile browser caching issues)
function forceRepaint() {
  // Force repaint of grid background (body::before)
  document.body.style.setProperty('--grid-opacity', '0.71');
  void document.body.offsetHeight;
  document.body.style.setProperty('--grid-opacity', '0.7');
  void document.body.offsetHeight;
  document.body.style.removeProperty('--grid-opacity');

  // Force reflow of root elements
  void document.documentElement.offsetHeight;
  void document.body.offsetHeight;

  // Force style recalculation
  getComputedStyle(document.body);
  getComputedStyle(document.documentElement);

  // Force repaint of key elements
  const elements = document.querySelectorAll('section, main, header, footer, .hero, .section, .timeline, .btn, .pill');
  elements.forEach(el => {
    void (el as HTMLElement).offsetHeight;
    getComputedStyle(el);
  });
}

// Apply theme
function applyTheme(theme: 'light' | 'dark') {
  // Temporarily disable transitions for instant theme change
  const style = document.createElement('style');
  style.textContent = '* { transition: none !important; }';
  document.head.appendChild(style);

  // Update theme attributes
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;

  // Update icon
  const icon = document.querySelector('.theme-toggle__icon');
  if (icon) {
    icon.textContent = theme === 'dark' ? '🌙' : '☀️';
  }

  // Save to localStorage
  localStorage.setItem('theme', theme);

  // Force repaint (critical for mobile browsers)
  forceRepaint();

  // Re-enable transitions after repaint
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.head.removeChild(style);
    });
  });

  // Dispatch event for other components
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

