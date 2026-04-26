export function forceRepaint(): void {
  document.body.style.setProperty('--grid-opacity', '0.71');
  void document.body.offsetHeight;
  document.body.style.setProperty('--grid-opacity', '0.7');
  void document.body.offsetHeight;
  document.body.style.removeProperty('--grid-opacity');

  void document.documentElement.offsetHeight;
  void document.body.offsetHeight;
  getComputedStyle(document.body);
  getComputedStyle(document.documentElement);

  document.querySelectorAll('section, main, header, footer, .hero, .section, .timeline, .btn, .pill').forEach(el => {
    void (el as HTMLElement).offsetHeight;
    getComputedStyle(el);
  });
}
