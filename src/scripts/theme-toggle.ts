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
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;

  const icon = document.querySelector('.theme-toggle__icon');
  if (icon) {
    icon.textContent = theme === 'dark' ? '🌙' : '☀️';
  }

  localStorage.setItem('theme', theme);

  // Force reflow to ensure theme is applied immediately (fixes mobile issue)
  // Multiple reflows to ensure all elements are repainted
  void document.documentElement.offsetHeight;
  void document.body.offsetHeight;
  
  // Force browser to recalculate styles for all elements
  getComputedStyle(document.body).color;
  
  // Force repaint of all elements by temporarily adding/removing a class
  document.documentElement.classList.add('theme-changing');
  void document.documentElement.offsetHeight;
  document.documentElement.classList.remove('theme-changing');
  
  // Final reflow to ensure everything is painted
  void document.body.offsetHeight;

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

