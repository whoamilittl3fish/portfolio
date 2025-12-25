/**
 * Blog Tag Filter & Search
 * - Multi-tag selection (AND logic)
 * - Search by title or tag
 * - URL sync
 */

function getActiveTags(filterButtons: NodeListOf<Element>): string[] {
  return Array.from(filterButtons)
    .filter(btn => {
      const filter = btn.getAttribute('data-filter');
      return filter && filter !== 'all' && btn.classList.contains('is-active');
    })
    .map(btn => btn.getAttribute('data-filter')?.trim())
    .filter(Boolean) as string[];
}

function shouldShowCard(cardTags: string[], activeTags: string[], isAllActive: boolean): boolean {
  if (isAllActive) return true;
  if (activeTags.length === 0) return true;
  // AND logic: card must have ALL active tags
  return activeTags.every(tag => cardTags.includes(tag));
}

function matchesSearch(card: Element, searchQuery: string): boolean {
  if (!searchQuery) return true;
  
  const query = searchQuery.toLowerCase();
  
  // Get title from card
  const titleEl = card.querySelector('.blog-card__title');
  const title = titleEl?.textContent?.toLowerCase() || '';
  
  // Get tags from card
  const cardTagsStr = card.getAttribute('data-tags') || '';
  const tags = cardTagsStr.toLowerCase();
  
  return title.includes(query) || tags.includes(query);
}

export function initBlogFilters() {
  const emptyMessage = document.getElementById('empty-message');
  const allButton = document.querySelector('[data-filter="all"]');
  const searchInput = document.getElementById('blog-search') as HTMLInputElement | null;
  
  let currentSearch = '';

  function updateFilters() {
    const filterButtons = document.querySelectorAll('[data-filter]');
    const blogCards = document.querySelectorAll('.blog-grid article');
    
    const activeTags = getActiveTags(filterButtons);
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
      const matchesTags = shouldShowCard(cardTags, activeTags, isAllActive);
      const matchesQuery = matchesSearch(card, currentSearch);
      const shouldShow = matchesTags && matchesQuery;
      
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
    if (currentSearch) {
      url.searchParams.set('q', currentSearch);
    } else {
      url.searchParams.delete('q');
    }
    window.history.replaceState({}, '', url);
  }

  function handleFilterClick(e: Event) {
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
      // Deactivate all other filters
      filterButtons.forEach(b => {
        if (b !== allButton) b.classList.remove('is-active');
      });
      allButton?.classList.add('is-active');
    } else {
      // Toggle filter
      filterBtn.classList.toggle('is-active');
      
      // Sync with duplicate filter button (if exists)
      const duplicateBtn = Array.from(filterButtons).find(
        b => b !== allButton && b !== filterBtn && b.getAttribute('data-filter') === filter
      );
      if (duplicateBtn) {
        duplicateBtn.classList.toggle('is-active');
      }
      
      // Update "all" button state
      const hasActiveTags = Array.from(filterButtons)
        .some(b => b !== allButton && b.classList.contains('is-active'));
      allButton?.classList.toggle('is-active', !hasActiveTags);
    }
    
    updateFilters();
  }

  // Handle filter button clicks
  document.addEventListener('click', handleFilterClick);

  // Handle search input
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearch = (e.target as HTMLInputElement).value.trim();
      updateFilters();
    });
  }

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
  
  // Initialize search from URL
  const searchParam = urlParams.get('q');
  if (searchParam && searchInput) {
    currentSearch = searchParam;
    searchInput.value = searchParam;
  }
  
  updateFilters();
}

