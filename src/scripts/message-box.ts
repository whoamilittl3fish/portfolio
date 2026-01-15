/**
 * MessageBox Module
 * Reusable modal component for displaying custom content
 * Supports HTML string, HTMLElement, and custom content
 */

let messageBoxContainer: HTMLElement | null = null;
let messageBoxBody: HTMLElement | null = null;
let messageBoxBackdrop: HTMLElement | null = null;
let messageBoxClose: HTMLElement | null = null;
let onCloseCallback: (() => void) | null = null;

/**
 * Initialize MessageBox structure in DOM (lazy load)
 */
function initMessageBox(): void {
  if (messageBoxContainer) return;

  // Import CSS (will be handled by Astro build, but we ensure it's available)
  // CSS is imported via MessageBox.astro component or global.css

  // Create message box structure
  messageBoxContainer = document.createElement('div');
  messageBoxContainer.id = 'message-box-container';
  messageBoxContainer.className = 'message-box';
  messageBoxContainer.style.display = 'none';

  messageBoxBackdrop = document.createElement('div');
  messageBoxBackdrop.className = 'message-box__backdrop';

  const content = document.createElement('div');
  content.className = 'message-box__content';

  messageBoxClose = document.createElement('button');
  messageBoxClose.className = 'message-box__close';
  messageBoxClose.setAttribute('aria-label', 'Close');
  messageBoxClose.setAttribute('type', 'button');
  messageBoxClose.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  `;

  messageBoxBody = document.createElement('div');
  messageBoxBody.className = 'message-box__body';
  messageBoxBody.id = 'message-box-body';

  content.appendChild(messageBoxClose);
  content.appendChild(messageBoxBody);
  messageBoxContainer.appendChild(messageBoxBackdrop);
  messageBoxContainer.appendChild(content);

  document.body.appendChild(messageBoxContainer);

  // Setup event listeners
  setupEventListeners();
}

/**
 * Setup event listeners for close actions
 */
function setupEventListeners(): void {
  if (!messageBoxContainer || !messageBoxBackdrop || !messageBoxClose) return;

  // Close button
  messageBoxClose.addEventListener('click', handleClose);

  // Backdrop click
  messageBoxBackdrop.addEventListener('click', handleClose);

  // ESC key
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && isMessageBoxOpen()) {
      handleClose();
    }
  };
  document.addEventListener('keydown', handleKeyDown);
}

/**
 * Handle close action
 */
function handleClose(): void {
  hideMessageBox();
  if (onCloseCallback) {
    onCloseCallback();
    onCloseCallback = null;
  }
}

/**
 * Show message box with content
 * @param content - HTML string, HTMLElement, or text content
 * @param options - Optional configuration (title, onClose callback)
 */
export function showMessageBox(
  content: string | HTMLElement,
  options?: {
    title?: string;
    onClose?: () => void;
  }
): void {
  // Initialize if not already done
  initMessageBox();

  if (!messageBoxContainer || !messageBoxBody) return;

  // Clear previous content
  messageBoxBody.innerHTML = '';

  // Set close callback
  onCloseCallback = options?.onClose || null;

  // Add title if provided
  if (options?.title) {
    const titleEl = document.createElement('h2');
    titleEl.textContent = options.title;
    titleEl.style.marginTop = '0';
    messageBoxBody.appendChild(titleEl);
  }

  // Add content
  if (typeof content === 'string') {
    // HTML string
    messageBoxBody.innerHTML += content;
  } else if (content instanceof HTMLElement) {
    // HTMLElement
    messageBoxBody.appendChild(content);
  } else {
    // Fallback: convert to string
    messageBoxBody.textContent = String(content);
  }

  // Show message box
  messageBoxContainer.style.display = 'flex';
  document.body.style.overflow = 'hidden'; // Prevent body scroll

  // Focus trap: focus on close button
  if (messageBoxClose) {
    messageBoxClose.focus();
  }
}

/**
 * Hide message box
 */
export function hideMessageBox(): void {
  if (!messageBoxContainer) return;

  messageBoxContainer.style.display = 'none';
  document.body.style.overflow = ''; // Restore body scroll

  // Clear content after animation
  setTimeout(() => {
    if (messageBoxBody) {
      messageBoxBody.innerHTML = '';
    }
  }, 300);
}

/**
 * Check if message box is currently open
 */
export function isMessageBoxOpen(): boolean {
  if (!messageBoxContainer) return false;
  return messageBoxContainer.style.display !== 'none';
}
