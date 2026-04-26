import { forceRepaint } from './utils/dom';

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

