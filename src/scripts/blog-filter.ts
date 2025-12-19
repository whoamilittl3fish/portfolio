/**
 * Blog Tag Filter
 * - Multi-tag selection (AND logic)
 * - URL sync
 */

export function initBlogFilters() {
  const emptyMessage = document.getElementById('empty-message');
  const allButton = document.querySelector('[data-filter="all"]');

  function updateFilters() {
    const filterButtons = document.querySelectorAll('[data-filter]');
    const blogCards = document.querySelectorAll('.blog-grid article');
    
    // Get all active tags (except "all")
    const activeTags = Array.from(filterButtons)
      .filter(btn => {
        const filter = btn.getAttribute('data-filter');
        return filter && filter !== 'all' && btn.classList.contains('is-active');
      })
      .map(btn => btn.getAttribute('data-filter')?.trim())
      .filter(Boolean) as string[];

    const isAllActive = allButton?.classList.contains('is-active') || false;

    // Filter cards
    let visibleCount = 0;
    blogCards.forEach(card => {
      const cardTagsStr = card.getAttribute('data-tags');
      if (!cardTagsStr) {
        (card as HTMLElement).style.display = 'none';
        return;
      }
      
      const cardTags = cardTagsStr.split(',').map(t => t.trim()).filter(Boolean);
      
      let shouldShow = false;
      if (isAllActive) {
        shouldShow = true;
      } else if (activeTags.length > 0) {
        // AND logic: card must have ALL active tags
        shouldShow = activeTags.every(tag => cardTags.includes(tag));
      } else {
        shouldShow = true;
      }
      
      (card as HTMLElement).style.display = shouldShow ? 'flex' : 'none';
      if (shouldShow) visibleCount++;
    });
    
    // Show/hide empty message
    if (emptyMessage) {
      emptyMessage.style.display = visibleCount === 0 ? 'block' : 'none';
    }

    // Update URL
    const url = new URL(window.location.href);
    if (activeTags.length > 0 && !isAllActive) {
      url.searchParams.set('tags', activeTags.join(','));
    } else {
      url.searchParams.delete('tags');
    }
    window.history.replaceState({}, '', url);
  }

  // Handle filter button clicks
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const filterBtn = target.closest('[data-filter]') as HTMLElement;
    
    if (!filterBtn) return;
    
    const filter = filterBtn.getAttribute('data-filter');
    if (!filter) return;
    
    if (filterBtn.tagName === 'BUTTON') {
      e.preventDefault();
      e.stopPropagation();
    }
    
    const filterButtons = document.querySelectorAll('[data-filter]');
    
    if (filter === 'all') {
      filterButtons.forEach(b => {
        if (b !== allButton) b.classList.remove('is-active');
      });
      allButton?.classList.add('is-active');
    } else {
      filterBtn.classList.toggle('is-active');
      
      // Sync with top filter button
      const topFilterBtn = Array.from(filterButtons).find(
        b => b !== allButton && b.getAttribute('data-filter') === filter
      );
      if (topFilterBtn && topFilterBtn !== filterBtn) {
        topFilterBtn.classList.toggle('is-active');
      }
      
      const hasActiveTags = Array.from(filterButtons)
        .some(b => b !== allButton && b.classList.contains('is-active'));
      if (hasActiveTags) {
        allButton?.classList.remove('is-active');
      } else {
        allButton?.classList.add('is-active');
      }
    }
    
    updateFilters();
  });

  // Initialize from URL params
  const urlParams = new URLSearchParams(window.location.search);
  const tagsParam = urlParams.get('tags') || urlParams.get('tag');
  if (tagsParam) {
    const tags = tagsParam.split(',').map(t => t.trim()).filter(Boolean);
    tags.forEach(tag => {
      document.querySelectorAll(`[data-filter="${tag}"]`).forEach(btn => {
        btn.classList.add('is-active');
      });
    });
    if (tags.length > 0) {
      allButton?.classList.remove('is-active');
    }
  }
  
  updateFilters();
}

