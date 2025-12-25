/**
 * Lightbox Module
 * Shared lightbox functionality for viewing images
 */

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
 * Creates and manages a lightbox for viewing images
 */
export function createLightbox(images: string[], initialIndex: number = 0): void {
  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  
  let currentIndex = initialIndex;
  const hasMultipleImages = images.length > 1;
  const cleanupFunctions: (() => void)[] = [];
  
  const updateImage = (): void => {
    const img = lightbox.querySelector('.lightbox__image') as HTMLImageElement;
    const counter = lightbox.querySelector('.lightbox__counter');
    
    if (img) {
      img.src = images[currentIndex];
      img.alt = `Image ${currentIndex + 1} of ${images.length}`;
    }
    if (counter) {
      counter.textContent = `${currentIndex + 1} / ${images.length}`;
    }
  };
  
  const showPrev = (): void => {
    if (images.length <= 1) return;
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    updateImage();
  };
  
  const showNext = (): void => {
    if (images.length <= 1) return;
    currentIndex = (currentIndex + 1) % images.length;
    updateImage();
  };
  
  const close = (): void => {
    cleanupFunctions.forEach(cleanup => cleanup());
    lightbox.remove();
  };
  
  // Build lightbox HTML
  lightbox.innerHTML = `
    <div class="lightbox__backdrop"></div>
    ${hasMultipleImages ? `
      <button class="lightbox__nav lightbox__nav--prev" aria-label="Previous image">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M15 18l-6-6 6-6"/>
        </svg>
      </button>
      <button class="lightbox__nav lightbox__nav--next" aria-label="Next image">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M9 18l6-6-6-6"/>
        </svg>
      </button>
      <div class="lightbox__counter">${currentIndex + 1} / ${images.length}</div>
    ` : ''}
    <div class="lightbox__content">
      <img src="${images[currentIndex]}" class="lightbox__image" alt="Image ${currentIndex + 1} of ${images.length}">
      <div class="lightbox__bottom-bar">
        <div class="lightbox__bottom-bar__pill">
          <button class="lightbox__back btn btn--ghost btn--sm" aria-label="Back">Back</button>
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(lightbox);
  
  // Setup navigation for multiple images
  if (hasMultipleImages) {
    const prevBtn = lightbox.querySelector('.lightbox__nav--prev');
    const nextBtn = lightbox.querySelector('.lightbox__nav--next');
    
    prevBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      showPrev();
    });
    
    nextBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      showNext();
    });
    
    // Keyboard navigation
    const handleKeydown = (e: KeyboardEvent): void => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        showPrev();
        // Remove focus from any focused element
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        showNext();
        // Remove focus from any focused element
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
      }
    };
    document.addEventListener('keydown', handleKeydown);
    cleanupFunctions.push(() => document.removeEventListener('keydown', handleKeydown));
    
    // Swipe support
    const swipeHandler = createSwipeHandler(showNext, showPrev);
    lightbox.addEventListener('touchstart', swipeHandler.handleTouchStart as EventListener, { passive: true });
    lightbox.addEventListener('touchend', swipeHandler.handleTouchEnd as EventListener, { passive: true });
  }
  
  // Close handlers
  const backdrop = lightbox.querySelector('.lightbox__backdrop');
  const backBtn = lightbox.querySelector('.lightbox__back');
  
  backdrop?.addEventListener('click', close);
  backBtn?.addEventListener('click', close);
  
  // Escape key handler
  const handleEscape = (e: KeyboardEvent): void => {
    if (e.key === 'Escape') {
      close();
    }
  };
  document.addEventListener('keydown', handleEscape);
  cleanupFunctions.push(() => document.removeEventListener('keydown', handleEscape));
}

/**
 * Initializes lightbox for all images in a container
 */
export function initLightboxForImages(container: HTMLElement | Document = document): void {
  const images = container.querySelectorAll<HTMLImageElement>('.blog-post__content img');
  
  images.forEach(img => {
    // Skip if already initialized
    if (img.dataset.lightboxInit) return;
    img.dataset.lightboxInit = 'true';
    
    img.style.cursor = 'pointer';
    img.addEventListener('click', () => {
      const src = img.getAttribute('src');
      if (src) {
        createLightbox([src], 0);
      }
    });
  });
}

