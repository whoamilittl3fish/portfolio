export const SWIPE_THRESHOLD = 50;

export function createSwipeHandler(
  onSwipeLeft: () => void,
  onSwipeRight: () => void
): { handleTouchStart: (e: TouchEvent) => void; handleTouchEnd: (e: TouchEvent) => void } {
  let touchStartX = 0;
  let touchEndX = 0;

  const handleSwipe = () => {
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > SWIPE_THRESHOLD) {
      diff > 0 ? onSwipeLeft() : onSwipeRight();
    }
  };

  return {
    handleTouchStart: (e: TouchEvent) => { touchStartX = e.touches[0].clientX; },
    handleTouchEnd: (e: TouchEvent) => { touchEndX = e.changedTouches[0].clientX; handleSwipe(); }
  };
}
