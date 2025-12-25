/**
 * Project Card Interactions
 * - Toggle expand/collapse
 * - Image lightbox
 */

function createLightbox(imageSrc: string) {
  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.innerHTML = `
    <div class="lightbox__backdrop"></div>
    <img src="${imageSrc}" class="lightbox__image" alt="">
    <button class="lightbox__close" aria-label="Close">×</button>
  `;
  
  document.body.appendChild(lightbox);
  
  const close = () => lightbox.remove();
  
  // Close on backdrop click
  lightbox.querySelector('.lightbox__backdrop')?.addEventListener('click', close);
  
  // Close on button click
  lightbox.querySelector('.lightbox__close')?.addEventListener('click', close);
  
  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  }, { once: true });
}

export function initProjectCards() {
  // Toggle project card expansion
  document.querySelectorAll('.project-card__toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.project-card');
      const isExpanded = btn.getAttribute('aria-expanded') === 'true';
      
      btn.setAttribute('aria-expanded', (!isExpanded).toString());
      card?.classList.toggle('is-expanded');
    });
  });

  // Image lightbox
  document.querySelectorAll('.project-gallery__thumb').forEach(img => {
    img.addEventListener('click', () => {
      const src = img.getAttribute('src');
      if (src) createLightbox(src);
    });
  });
}

