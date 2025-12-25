/**
 * Project Card Interactions
 * - Toggle expand/collapse
 * - Image gallery navigation
 * - Image lightbox
 */

import { createLightbox } from './lightbox';

const SWIPE_THRESHOLD = 50;

/**
 * Creates a swipe handler for image navigation
 */
function createSwipeHandler(
  onSwipeLeft: () => void,
  onSwipeRight: () => void
): { handleTouchStart: (e: TouchEvent) => void; handleTouchEnd: (e: TouchEvent) => void } {
  let touchStartX = 0;
  let touchEndX = 0;

  const handleSwipe = () => {
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > SWIPE_THRESHOLD) {
      if (diff > 0) {
        onSwipeLeft();
      } else {
        onSwipeRight();
      }
    }
  };

  return {
    handleTouchStart: (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX;
    },
    handleTouchEnd: (e: TouchEvent) => {
      touchEndX = e.changedTouches[0].clientX;
      handleSwipe();
    }
  };
}

/**
 * Initializes image gallery navigation for a project card
 */
function initGallery(gallery: HTMLElement): void {
  const imagesData = gallery.getAttribute('data-images');
  if (!imagesData) return;
  
  const images: string[] = JSON.parse(imagesData);
  if (images.length <= 1) return;
  
  const container = gallery.querySelector('.project-gallery__container');
  const image = gallery.querySelector('.project-gallery__image') as HTMLImageElement;
  const prevBtn = gallery.querySelector('.project-gallery__nav--prev');
  const nextBtn = gallery.querySelector('.project-gallery__nav--next');
  const currentSpan = gallery.querySelector('.project-gallery__current');
  
  if (!container || !image || !prevBtn || !nextBtn || !currentSpan) return;
  
  let currentIndex = 0;
  
  const updateImage = (): void => {
    image.src = images[currentIndex];
    image.alt = `Screenshot ${currentIndex + 1}`;
    currentSpan.textContent = `${currentIndex + 1}`;
  };
  
  const showPrev = (): void => {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    updateImage();
  };
  
  const showNext = (): void => {
    currentIndex = (currentIndex + 1) % images.length;
    updateImage();
  };
  
  // Button navigation
  prevBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    showPrev();
  });
  
  nextBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    showNext();
  });
  
  // Swipe support
  const swipeHandler = createSwipeHandler(showNext, showPrev);
  container.addEventListener('touchstart', swipeHandler.handleTouchStart as EventListener, { passive: true });
  container.addEventListener('touchend', swipeHandler.handleTouchEnd as EventListener, { passive: true });
  
  // Open lightbox on image click
  image.addEventListener('click', () => {
    createLightbox(images, currentIndex);
  });
}

/**
 * Toggles project card expansion state
 */
function handleCardToggle(btn: Element): void {
  const card = btn.closest('.project-card');
  const isExpanded = btn.getAttribute('aria-expanded') === 'true';
  
  btn.setAttribute('aria-expanded', (!isExpanded).toString());
  card?.classList.toggle('is-expanded');
}

/**
 * Expands a project card
 */
function expandCard(card: Element): void {
  const toggleBtn = card.querySelector('.project-card__toggle');
  if (!toggleBtn) return;
  
  const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
  if (!isExpanded) {
    toggleBtn.setAttribute('aria-expanded', 'true');
    card.classList.add('is-expanded');
  }
}

/**
 * Initializes all project card interactions
 */
export function initProjectCards(): void {
  // Toggle project card expansion via button
  document.querySelectorAll('.project-card__toggle').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      handleCardToggle(btn);
    });
  });

  // Expand card when clicking on card (but not on interactive elements)
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', (e) => {
      // Don't expand if clicking on interactive elements
      const target = e.target as HTMLElement;
      if (
        target.closest('.project-card__toggle') ||
        target.closest('a') ||
        target.closest('button') ||
        target.closest('.project-gallery__nav') ||
        target.closest('.project-gallery__image')
      ) {
        return;
      }
      
      expandCard(card);
    });
  });

  // Initialize galleries
  document.querySelectorAll('.project-card__gallery').forEach(gallery => {
    initGallery(gallery as HTMLElement);
  });
}

