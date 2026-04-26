const PAGE_SIZE = 5;

interface State {
  page: number;
  filters: string[];
  query: string;
}

interface DOMElements {
  cards: HTMLElement[];
  emptyMessage: HTMLElement | null;
  allButton: Element | null;
  filterButtons: Element[];
  searchInput: HTMLInputElement | null;
  pagination: HTMLElement | null;
  prevBtn: HTMLButtonElement | null;
  nextBtn: HTMLButtonElement | null;
  pageIndicator: HTMLElement | null;
}

function getMatchingCards(cards: HTMLElement[], state: State): HTMLElement[] {
  const { filters, query } = state;

  return cards.filter(card => {
    if (filters.length > 0) {
      const cardTags = (card.dataset.tags || '')
        .split(',')
        .map(t => t.trim())
        .filter(Boolean);
      if (!filters.every(f => cardTags.includes(f))) return false;
    }

    if (query) {
      const title = card.querySelector('.blog-card__title')?.textContent?.toLowerCase() || '';
      const tags = (card.dataset.tags || '').toLowerCase();
      if (!title.includes(query) && !tags.includes(query)) return false;
    }

    return true;
  });
}

function renderPagination(els: DOMElements, page: number, totalPages: number): void {
  if (!els.pagination) return;
  els.pagination.style.display = totalPages <= 1 ? 'none' : 'flex';
  if (els.pageIndicator) els.pageIndicator.textContent = `${page} / ${totalPages}`;
  if (els.prevBtn) els.prevBtn.disabled = page <= 1;
  if (els.nextBtn) els.nextBtn.disabled = page >= totalPages;
}

function render(cards: HTMLElement[], matching: HTMLElement[], state: State, els: DOMElements): void {
  const totalPages = Math.max(1, Math.ceil(matching.length / PAGE_SIZE));
  const start = (state.page - 1) * PAGE_SIZE;
  const pageSet = new Set(matching.slice(start, start + PAGE_SIZE));

  cards.forEach(card => {
    card.classList.toggle('is-hidden', !pageSet.has(card));
  });

  if (els.emptyMessage) {
    els.emptyMessage.style.display = matching.length === 0 ? 'block' : 'none';
  }

  renderPagination(els, state.page, totalPages);
}

function syncUrl(state: State): void {
  const url = new URL(window.location.href);
  if (state.filters.length > 0) {
    url.searchParams.set('tags', state.filters.join(','));
  } else {
    url.searchParams.delete('tags');
  }
  if (state.query) {
    url.searchParams.set('q', state.query);
  } else {
    url.searchParams.delete('q');
  }
  window.history.replaceState({}, '', url);
}

function update(
  state: State,
  patch: Partial<Omit<State, 'page'>>,
  cards: HTMLElement[],
  els: DOMElements
): void {
  Object.assign(state, patch);
  state.page = 1;
  const matching = getMatchingCards(cards, state);
  render(cards, matching, state, els);
  syncUrl(state);
}

function initUpcomingCards(): void {
  document.addEventListener('click', (e: Event) => {
    const target = e.target as HTMLElement;
    if (!target.closest('[data-upcoming="true"]')) return;

    const link = target.closest('.blog-card__link') as HTMLAnchorElement | null;
    if (!link) return;

    e.preventDefault();
    e.stopPropagation();

    const href = link.getAttribute('href') || '';
    const lang = href.includes('/blogs/vi/') ? 'vi' : 'en';
    const messages = {
      en: 'This post is currently being written. Please check back later!',
      vi: 'Bài viết này đang được viết. Vui lòng quay lại sau!'
    };

    import('./message-box').then(({ showMessageBox }) => {
      showMessageBox(messages[lang]);
    });
  });
}

export function initBlogController(): void {
  const state: State = { page: 1, filters: [], query: '' };

  const els: DOMElements = {
    cards: Array.from(document.querySelectorAll<HTMLElement>('.blog-grid article')),
    emptyMessage: document.getElementById('empty-message'),
    allButton: document.querySelector('[data-filter="all"]'),
    filterButtons: Array.from(document.querySelectorAll('[data-filter]')),
    searchInput: document.getElementById('blog-search') as HTMLInputElement | null,
    pagination: document.getElementById('blogs-pagination') as HTMLElement | null,
    prevBtn: document.getElementById('prev-page') as HTMLButtonElement | null,
    nextBtn: document.getElementById('next-page') as HTMLButtonElement | null,
    pageIndicator: document.getElementById('page-indicator') as HTMLElement | null,
  };

  // Tag filter clicks
  document.addEventListener('click', (e: Event) => {
    const target = e.target as HTMLElement;
    const filterBtn = target.closest('[data-filter]') as HTMLElement | null;
    if (!filterBtn) return;

    const filter = filterBtn.getAttribute('data-filter');
    if (!filter) return;

    if (filterBtn.tagName === 'BUTTON') {
      e.preventDefault();
      e.stopPropagation();
    }

    if (filter === 'all') {
      els.filterButtons.forEach(b => b.classList.remove('is-active'));
      els.allButton?.classList.add('is-active');
      update(state, { filters: [] }, els.cards, els);
    } else {
      filterBtn.classList.toggle('is-active');

      // Sync duplicate button (tag pill inside a blog card acts as filter too)
      const duplicate = els.filterButtons.find(
        b => b !== els.allButton && b !== filterBtn && b.getAttribute('data-filter') === filter
      );
      duplicate?.classList.toggle('is-active');

      const activeFilters = els.filterButtons
        .filter(b => b !== els.allButton && b.classList.contains('is-active'))
        .map(b => b.getAttribute('data-filter') as string);

      els.allButton?.classList.toggle('is-active', activeFilters.length === 0);
      update(state, { filters: activeFilters }, els.cards, els);
    }
  });

  // Search
  els.searchInput?.addEventListener('input', (e: Event) => {
    const query = (e.target as HTMLInputElement).value.trim().toLowerCase();
    update(state, { query }, els.cards, els);
  });

  // Pagination: prev/next navigate without resetting filters
  els.prevBtn?.addEventListener('click', () => {
    if (state.page <= 1) return;
    state.page--;
    const matching = getMatchingCards(els.cards, state);
    render(els.cards, matching, state, els);
  });

  els.nextBtn?.addEventListener('click', () => {
    const matching = getMatchingCards(els.cards, state);
    const totalPages = Math.max(1, Math.ceil(matching.length / PAGE_SIZE));
    if (state.page >= totalPages) return;
    state.page++;
    render(els.cards, matching, state, els);
  });

  // Restore from URL params
  const urlParams = new URLSearchParams(window.location.search);
  const tagsParam = urlParams.get('tags') || urlParams.get('tag');
  if (tagsParam) {
    const tags = tagsParam.split(',').map(t => t.trim()).filter(Boolean);
    tags.forEach(tag => {
      els.filterButtons
        .filter(b => b.getAttribute('data-filter') === tag)
        .forEach(b => b.classList.add('is-active'));
    });
    if (tags.length > 0) {
      els.allButton?.classList.remove('is-active');
      state.filters = tags;
    }
  }

  const searchParam = urlParams.get('q');
  if (searchParam && els.searchInput) {
    state.query = searchParam.toLowerCase();
    els.searchInput.value = searchParam;
  }

  // Initial render
  const matching = getMatchingCards(els.cards, state);
  render(els.cards, matching, state, els);

  initUpcomingCards();
}
