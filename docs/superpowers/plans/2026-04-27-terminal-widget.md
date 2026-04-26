# Terminal Widget Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a global interactive terminal widget (floating popup / mobile bottom sheet) to all pages, and simplify the hero section by removing skill pills and adding a terminal hint.

**Architecture:** `Terminal.astro` queries blogs + projects at build time and injects them as inline JSON. `terminal.ts` reads that JSON on init and drives all interactive logic with a plain closure-based state. The floating trigger + popup render via `BaseLayout.astro` so they appear on every page.

**Tech Stack:** Astro 5, TypeScript (strict), plain CSS custom properties.

---

## File Map

| Action | Path |
|--------|------|
| **Create** | `src/styles/components/terminal.css` |
| **Create** | `src/components/Terminal.astro` |
| **Create** | `src/scripts/terminal.ts` |
| **Modify** | `src/components/BaseLayout.astro` |
| **Modify** | `src/pages/index.astro` |
| **Modify** | `src/styles/pages/home.css` |

---

### Task 1: Create terminal CSS

**Files:** Create `src/styles/components/terminal.css`

- [ ] **Step 1: Create the file**

```css
/* Terminal Widget */

:root {
  --terminal-bottom-extra: 0px;
}

.terminal-trigger {
  position: fixed;
  bottom: calc(var(--space-lg) + var(--terminal-bottom-extra));
  right: var(--space-lg);
  z-index: 100;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  color: var(--text-muted);
  font-family: ui-monospace, 'Cascadia Code', monospace;
  font-size: 11px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s, border-color 0.2s, color 0.2s;
  user-select: none;
}

.terminal-trigger:hover {
  background: var(--accent);
  border-color: var(--accent);
  color: #fff;
}

.terminal-overlay {
  display: none;
  position: fixed;
  inset: 0;
  z-index: 99;
}

.terminal-overlay.is-open {
  display: block;
}

.terminal-popup {
  position: fixed;
  bottom: calc(var(--space-lg) + 48px + var(--terminal-bottom-extra));
  right: var(--space-lg);
  width: 420px;
  height: 300px;
  background: #111118;
  border: 1px solid #2a2a3a;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  z-index: 101;
  font-family: ui-monospace, 'Cascadia Code', 'Fira Code', monospace;
  font-size: 13px;
  color: #e0e0e0;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  transform: translateY(10px);
  opacity: 0;
  pointer-events: none;
  transition: transform 0.15s ease, opacity 0.15s ease;
}

.terminal-popup.is-open {
  transform: translateY(0);
  opacity: 1;
  pointer-events: auto;
}

.terminal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  border-bottom: 1px solid #2a2a3a;
  background: #0d0d14;
  border-radius: 8px 8px 0 0;
  flex-shrink: 0;
}

.terminal-header__title {
  font-size: 11px;
  color: #555;
  user-select: none;
}

.terminal-header__close {
  background: none;
  border: none;
  color: #555;
  cursor: pointer;
  font-size: 14px;
  line-height: 1;
  padding: 2px 5px;
  border-radius: 3px;
  font-family: inherit;
  transition: color 0.15s, background 0.15s;
}

.terminal-header__close:hover {
  color: #e0e0e0;
  background: #2a2a3a;
}

.terminal-output {
  flex: 1;
  overflow-y: auto;
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.terminal-output::-webkit-scrollbar { width: 4px; }
.terminal-output::-webkit-scrollbar-track { background: transparent; }
.terminal-output::-webkit-scrollbar-thumb { background: #333; border-radius: 2px; }

.terminal-line {
  margin: 0;
  padding: 1px 0;
  white-space: pre-wrap;
  word-break: break-all;
  line-height: 1.55;
  font-size: 13px;
  font-family: inherit;
}

.terminal-line--command { color: #e0e0e0; }
.terminal-line--output  { color: #aaa; }
.terminal-line--muted   { color: #555; }
.terminal-line--error   { color: #f07070; }

a.terminal-line--link {
  display: block;
  color: #7eb8f7;
  text-decoration: none;
  cursor: pointer;
}
a.terminal-line--link:hover { color: #aad4ff; text-decoration: underline; }

.terminal-input-row {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  border-top: 1px solid #2a2a3a;
  flex-shrink: 0;
  gap: 8px;
}

.terminal-prompt {
  color: #7eb8f7;
  white-space: nowrap;
  user-select: none;
  flex-shrink: 0;
  font-family: inherit;
  font-size: 13px;
}

.terminal-input {
  flex: 1;
  background: none;
  border: none;
  outline: none;
  color: #e0e0e0;
  font-family: inherit;
  font-size: 13px;
  caret-color: #7eb8f7;
  min-width: 0;
}

/* Mobile: bottom sheet */
@media (max-width: 600px) {
  .terminal-popup {
    width: 100%;
    height: 60dvh;
    bottom: 0;
    right: 0;
    border-radius: 12px 12px 0 0;
    border-bottom: none;
    transform: translateY(100%);
    opacity: 1;
    transition: transform 0.2s ease;
    padding-bottom: env(safe-area-inset-bottom, 0px);
  }

  .terminal-popup.is-open {
    transform: translateY(0);
  }

  .terminal-overlay.is-open {
    background: rgba(0, 0, 0, 0.5);
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/styles/components/terminal.css
git commit -m "style: add terminal widget styles"
```

---

### Task 2: Create Terminal.astro

**Files:** Create `src/components/Terminal.astro`

- [ ] **Step 1: Create the file**

```astro
---
import { getCollection } from 'astro:content';
import { projects } from '../content/projects';
import '../styles/components/terminal.css';

const allBlogs = await getCollection('blogs');
const enBlogs = allBlogs
  .filter(post => post.id.endsWith('/en.md') && !post.data.tags.includes('upcoming'))
  .map(post => ({
    slug: post.id.split('/')[0],
    title: post.data.title,
    url: `/blogs/en/${post.id.split('/')[0]}`
  }));

const terminalData = {
  blogs: enBlogs,
  projects: projects.map(p => ({
    name: p.title,
    url: p.links.live ?? p.links.source ?? '#'
  }))
};
---

<script type="application/json" id="terminal-data" set:html={JSON.stringify(terminalData)} />

<button
  id="terminal-trigger"
  class="terminal-trigger"
  aria-label="Open terminal"
  aria-expanded="false"
  aria-controls="terminal-popup"
>&gt;_</button>

<div id="terminal-overlay" class="terminal-overlay" aria-hidden="true"></div>

<div
  id="terminal-popup"
  class="terminal-popup"
  role="dialog"
  aria-label="Interactive terminal"
  aria-modal="true"
>
  <div class="terminal-header">
    <span class="terminal-header__title">zoskisk@portfolio</span>
    <button id="terminal-close" class="terminal-header__close" aria-label="Close terminal">✕</button>
  </div>
  <div id="terminal-output" class="terminal-output" aria-live="polite" aria-atomic="false"></div>
  <div class="terminal-input-row">
    <span id="terminal-prompt" class="terminal-prompt">~$</span>
    <input
      id="terminal-input"
      class="terminal-input"
      type="text"
      aria-label="Terminal input"
      autocomplete="off"
      autocorrect="off"
      autocapitalize="off"
      spellcheck="false"
    />
  </div>
</div>

<script>
  import { initTerminal } from '../scripts/terminal';
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTerminal);
  } else {
    initTerminal();
  }
</script>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Terminal.astro
git commit -m "feat: add Terminal.astro component with data injection"
```

---

### Task 3: Create terminal.ts

**Files:** Create `src/scripts/terminal.ts`

- [ ] **Step 1: Create the file**

```typescript
interface TerminalData {
  blogs: { slug: string; title: string; url: string }[];
  projects: { name: string; url: string }[];
}

type Dir = '/' | 'blogs' | 'projects';

const SKILLS = 'JS/TS  Node.js  C#/.NET  Docker  Git  Astro';

const HELP_LINES = [
  'available commands:',
  '  zoskisk --help   show this help',
  '  whoami           who is this person',
  '  ls               list directory contents',
  '  cd <dir>         change directory (blogs, projects)',
  '  cd ..            go back to root',
  '  cat skills.txt   view skills (from root only)',
  '  open <item>      open item in browser',
  '  clear            clear terminal',
];

function getPrompt(dir: Dir): string {
  return dir === '/' ? '~$' : `~/${dir} $`;
}

export function initTerminal(): void {
  const dataEl = document.getElementById('terminal-data');
  if (!dataEl) return;

  const data: TerminalData = JSON.parse(
    dataEl.textContent || '{"blogs":[],"projects":[]}'
  );

  const trigger = document.getElementById('terminal-trigger') as HTMLButtonElement | null;
  const popup = document.getElementById('terminal-popup') as HTMLElement | null;
  const overlay = document.getElementById('terminal-overlay') as HTMLElement | null;
  const closeBtn = document.getElementById('terminal-close') as HTMLButtonElement | null;
  const outputEl = document.getElementById('terminal-output') as HTMLElement | null;
  const inputEl = document.getElementById('terminal-input') as HTMLInputElement | null;
  const promptEl = document.getElementById('terminal-prompt') as HTMLElement | null;

  if (!trigger || !popup || !outputEl || !inputEl || !promptEl) return;

  let currentDir: Dir = '/';
  const cmdHistory: string[] = [];
  let historyIdx = -1;

  // Lift trigger + popup above BottomNav when present
  if (document.querySelector('.bottom-nav')) {
    document.documentElement.style.setProperty('--terminal-bottom-extra', '72px');
  }

  function updatePrompt(): void {
    promptEl!.textContent = getPrompt(currentDir);
  }

  function scrollToBottom(): void {
    outputEl!.scrollTop = outputEl!.scrollHeight;
  }

  function appendLine(text: string, cls: string = 'terminal-line--output'): void {
    const el = document.createElement('p');
    el.className = `terminal-line ${cls}`;
    el.textContent = text;
    outputEl!.appendChild(el);
  }

  function appendLink(label: string, url: string): void {
    const el = document.createElement('a');
    el.className = 'terminal-line terminal-line--link';
    el.textContent = label;
    el.href = url;
    if (url.startsWith('/')) {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        closeTerminal();
        window.location.href = url;
      });
    } else {
      el.target = '_blank';
      el.rel = 'noopener noreferrer';
    }
    outputEl!.appendChild(el);
  }

  function openTerminal(): void {
    popup!.classList.add('is-open');
    overlay?.classList.add('is-open');
    trigger!.setAttribute('aria-expanded', 'true');
    inputEl!.focus();
  }

  function closeTerminal(): void {
    popup!.classList.remove('is-open');
    overlay?.classList.remove('is-open');
    trigger!.setAttribute('aria-expanded', 'false');
    trigger!.focus();
  }

  function processCommand(raw: string): void {
    const trimmed = raw.trim();
    if (!trimmed) return;

    cmdHistory.push(trimmed);
    historyIdx = -1;

    appendLine(`${getPrompt(currentDir)} ${trimmed}`, 'terminal-line--command');

    const parts = trimmed.split(/\s+/);
    const cmd = parts[0];
    const arg = parts.slice(1).join(' ');

    switch (cmd) {
      case 'clear':
        outputEl!.innerHTML = '';
        return;

      case 'zoskisk':
        if (arg === '--help') {
          HELP_LINES.forEach(l => appendLine(l));
        } else {
          appendLine("usage: zoskisk --help", 'terminal-line--error');
        }
        break;

      case 'whoami':
        appendLine('khoa ngo — web developer');
        break;

      case 'ls':
        if (currentDir === '/') {
          appendLine('skills.txt');
          appendLine('blogs/');
          appendLine('projects/');
        } else if (currentDir === 'blogs') {
          data.blogs.forEach(b => appendLink(b.slug, b.url));
        } else {
          data.projects.forEach(p => appendLink(p.name, p.url));
        }
        break;

      case 'cd':
        if (arg === '..') {
          if (currentDir !== '/') {
            currentDir = '/';
            updatePrompt();
          } else {
            appendLine('already at root', 'terminal-line--muted');
          }
        } else if (arg === 'blogs' || arg === 'projects') {
          if (currentDir !== '/') {
            appendLine(`cd: run 'cd ..' first`, 'terminal-line--error');
          } else {
            currentDir = arg as Dir;
            updatePrompt();
          }
        } else if (!arg) {
          appendLine('usage: cd <blogs|projects> or cd ..', 'terminal-line--error');
        } else {
          appendLine(`cd: no such directory: ${arg}`, 'terminal-line--error');
        }
        break;

      case 'cat':
        if (arg === 'skills.txt') {
          if (currentDir === '/') {
            appendLine(SKILLS);
          } else {
            appendLine('cat: skills.txt: no such file in current directory', 'terminal-line--error');
          }
        } else if (!arg) {
          appendLine('usage: cat <file>', 'terminal-line--error');
        } else {
          appendLine(`cat: ${arg}: no such file`, 'terminal-line--error');
        }
        break;

      case 'open': {
        if (!arg) {
          appendLine('usage: open <item>', 'terminal-line--error');
          break;
        }
        if (currentDir === 'blogs') {
          const blog = data.blogs.find(b => b.slug === arg);
          if (blog) {
            closeTerminal();
            window.location.href = blog.url;
            return;
          }
          appendLine(`open: not found: ${arg}`, 'terminal-line--error');
        } else if (currentDir === 'projects') {
          const project = data.projects.find(p => p.name === arg);
          if (project) {
            window.open(project.url, '_blank', 'noopener,noreferrer');
            return;
          }
          appendLine(`open: not found: ${arg}`, 'terminal-line--error');
        } else {
          appendLine("open: cd into blogs/ or projects/ first", 'terminal-line--muted');
        }
        break;
      }

      default:
        appendLine(`command not found: ${cmd}. run 'zoskisk --help'`, 'terminal-line--error');
    }

    scrollToBottom();
  }

  // Toggle button
  trigger.addEventListener('click', () => {
    popup!.classList.contains('is-open') ? closeTerminal() : openTerminal();
  });

  closeBtn?.addEventListener('click', closeTerminal);

  // Mobile overlay tap to close
  overlay?.addEventListener('click', closeTerminal);

  // Keyboard shortcuts
  document.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Escape' && popup!.classList.contains('is-open')) {
      closeTerminal();
      return;
    }
    if (e.key === '`' && !e.ctrlKey && !e.metaKey && !e.altKey) {
      const active = document.activeElement;
      const isOtherInput =
        (active?.tagName === 'INPUT' ||
          active?.tagName === 'TEXTAREA' ||
          (active as HTMLElement)?.isContentEditable) &&
        active !== inputEl;
      if (isOtherInput) return;
      e.preventDefault();
      popup!.classList.contains('is-open') ? closeTerminal() : openTerminal();
    }
  });

  // Input: enter submits, arrows navigate history, tab cycles focus
  inputEl.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      const val = inputEl.value;
      inputEl.value = '';
      processCommand(val);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!cmdHistory.length) return;
      historyIdx =
        historyIdx === -1 ? cmdHistory.length - 1 : Math.max(0, historyIdx - 1);
      inputEl.value = cmdHistory[historyIdx];
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIdx === -1) return;
      if (historyIdx < cmdHistory.length - 1) {
        historyIdx++;
        inputEl.value = cmdHistory[historyIdx];
      } else {
        historyIdx = -1;
        inputEl.value = '';
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      closeBtn?.focus();
    }
  });

  // Close button tab wraps back to input
  closeBtn?.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      inputEl.focus();
    }
  });

  // Welcome lines
  appendLine('zoskisk portfolio terminal', 'terminal-line--muted');
  appendLine("type 'zoskisk --help' to get started", 'terminal-line--muted');
  appendLine('', 'terminal-line--muted');
}
```

- [ ] **Step 2: Commit**

```bash
git add src/scripts/terminal.ts
git commit -m "feat: add terminal.ts interactive command processor"
```

---

### Task 4: Wire Terminal into BaseLayout.astro

**Files:** Modify `src/components/BaseLayout.astro`

- [ ] **Step 1: Add import**

Find this line at the top of the frontmatter (line 5 area):

```astro
import Analytics from '@vercel/analytics/astro';
```

Replace with:

```astro
import Analytics from '@vercel/analytics/astro';
import Terminal from './Terminal.astro';
```

- [ ] **Step 2: Render Terminal before closing body tag**

Find this block (lines 134–135):

```astro
  {!hideBottomNav && <BottomNav currentPage={currentPage} variant="main" />}
</body>
```

Replace with:

```astro
  {!hideBottomNav && <BottomNav currentPage={currentPage} variant="main" />}
  <Terminal />
</body>
```

- [ ] **Step 3: Verify lint passes**

```bash
npm run lint
```

Expected: 0 errors, 0 warnings.

- [ ] **Step 4: Commit**

```bash
git add src/components/BaseLayout.astro
git commit -m "feat: include Terminal widget in BaseLayout for all pages"
```

---

### Task 5: Simplify hero section

**Files:** Modify `src/pages/index.astro`, `src/styles/pages/home.css`

- [ ] **Step 1: Remove skill-list from index.astro, add terminal hint**

In `src/pages/index.astro`, find this block (lines 36–62):

```astro
        <p class="hero__tagline">Good things take time.</p>
        <ul class="skill-list" aria-label="Core skills">
          <li>
            <a
              href="https://www.codingame.com/profile/83603140793bc15d729e1516e11dda281538186"
              class="pill">JS/TS</a
            >
          </li>
          <li>
            <a href="https://github.com/whoamilittl3fish/portfolio" class="pill"
              >Docker</a
            >
          </li>
          <li>
            <a href="https://github.com/whoamilittl3fish" class="pill">Git</a>
          </li>
          <li>
            <a href="https://github.com/whoamilittl3fish/portfolio" class="pill"
              >Node.js</a
            >
          </li>
          <li>
            <a
              href="https://github.com/whoamilittl3fish/QuanLyHopDong"
              class="pill">C#/.NET</a
            >
          </li>
        </ul>
```

Replace with:

```astro
        <p class="hero__tagline">Good things take time.</p>
        <p class="hero__terminal-hint">press <kbd>`</kbd> or <span>&gt;_</span> to explore</p>
```

- [ ] **Step 2: Update home.css**

In `src/styles/pages/home.css`, find and remove the entire `.skill-list` block:

```css
.skill-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--space-sm);
  list-style: none;
  padding: 0;
  margin-bottom: var(--space-xl);
}
```

In the same file, find:

```css
.hero__tagline {
  font-size: var(--font-size-lg);
  color: var(--text-muted);
  margin-bottom: var(--space-xl);
}
```

Replace with:

```css
.hero__tagline {
  font-size: var(--font-size-lg);
  color: var(--text-muted);
  margin-bottom: var(--space-sm);
}

.hero__terminal-hint {
  font-size: var(--font-size-sm);
  color: var(--text-muted);
  margin-bottom: var(--space-xl);
  opacity: 0.7;
}

.hero__terminal-hint kbd {
  font-family: ui-monospace, monospace;
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: 3px;
  padding: 1px 5px;
  font-size: 0.85em;
}

.hero__terminal-hint span {
  font-family: ui-monospace, monospace;
}
```

- [ ] **Step 3: Commit**

```bash
git add src/pages/index.astro src/styles/pages/home.css
git commit -m "feat: simplify hero section, replace skill pills with terminal hint"
```

---

### Task 6: Verify

- [ ] **Step 1: Run lint**

```bash
npm run lint
```

Expected: 0 errors, 0 warnings.

- [ ] **Step 2: Run build**

```bash
npm run build
```

Expected: build succeeds, pages built with no errors.

- [ ] **Step 3: Manual smoke test**

```bash
npm run preview
```

Open `http://localhost:4321` and verify:

| Scenario | Expected |
|----------|----------|
| Home page loads | `>_` button visible bottom-right, no skill pills, hint text visible |
| Click `>_` | Terminal popup slides up, input focused, welcome message shown |
| Type `zoskisk --help` + Enter | Help text displayed |
| Type `whoami` + Enter | "khoa ngo — web developer" |
| Type `ls` + Enter | `skills.txt`, `blogs/`, `projects/` |
| Type `cd blogs` + Enter | Prompt changes to `~/blogs $` |
| Type `ls` in blogs | Blog slugs shown as clickable links |
| Click a blog link | Terminal closes, navigate to blog post |
| Type `cd ..` + Enter | Prompt back to `~$` |
| Type `cat skills.txt` + Enter | Skills displayed |
| Type `cd projects` + Enter | Prompt `~/projects $` |
| Type `ls` in projects | Project names as links, click opens new tab |
| Type `badcmd` + Enter | Error with `zoskisk --help` suggestion |
| Press ↑ arrow | Previous command loaded into input |
| Press `` ` `` key | Toggles terminal open/close |
| Press Escape | Terminal closes |
| Navigate to `/blogs` | `>_` button still visible |
| Open a blog post | `>_` visible, terminal trigger positioned above BottomNav |
| Mobile (resize to <600px) | Bottom sheet slides up from bottom, overlay behind it |
| Tab from input | Focus moves to close button |
| Tab from close button | Focus returns to input |
