interface TerminalData {
  blogs: { slug: string; title: string; url: string }[];
  projects: { name: string; url: string }[];
}

type Dir = string;

const GH_USER = 'whoamilittl3fish';
const GH_CACHE_KEY = 'gh_stats_cache_v1';
const HISTORY_CACHE_KEY = 'terminal_history_v1';
const MAX_HISTORY = 100;
const SKILLS = 'JS/TS  Node.js  C#/.NET  Docker  Git  Astro';

const NAV_MAP: Record<string, string> = {
  'projects': '/projects',
  'blogs': '/blogs',
  'contact': '/contact',
};

const HELP_LINES = [
  'available commands:',
  '  zoskisk --help        show this help',
  '  whoami                who is this person',
  '  ls                    list directory contents',
  '  cd <dir>              change directory (blogs, projects)',
  '  cd blogs/<slug>       open blog post directly',
  '  cd contact            go to contact page',
  '  cd ..                 go back',
  '  cat <name>            view file or open item',
  '  ./clock.exe           current time / timezones',
  '  activity              show last github push',
  '  history               show recent github activity',
  '  clear                 clear terminal',
  '',
  '  on home:  cd projects | blogs | contact',
  '  on blog:  ctrl+c  →  /blogs',
];

const ALL_COMMANDS = ['zoskisk', 'whoami', 'ls', 'cd', 'cat', 'activity', 'history', 'clear'];

function getPrompt(dir: Dir): string {
  return dir === '/' ? '~$' : `~/${dir} $`;
}

function timeAgo(date: Date): string {
  const s = Math.floor((Date.now() - date.getTime()) / 1000);
  const t: [number, string][] = [[31536000,'y'],[2592000,'mo'],[86400,'d'],[3600,'h'],[60,'m']];
  for (const [n, l] of t) { const v = Math.floor(s / n); if (v >= 1) return `${v}${l} ago`; }
  return 'just now';
}

export function initTerminal(): void {
  const dataEl = document.getElementById('terminal-data');
  if (!dataEl) return;

  const data: TerminalData = JSON.parse(dataEl.textContent || '{"blogs":[],"projects":[]}');

  // ── Page context ──────────────────────────────────────────────────────────
  const path = window.location.pathname;
  const blogPostMatch = path.match(/^\/blogs\/(en|vi)\/([^/]+)/);
  const onHome = path === '/' || path === '';
  const ctxEl = document.getElementById('terminal-page-context');
  const pageCtx: { title?: string; description?: string; tags?: string[] } =
    ctxEl ? (() => { try { return JSON.parse(ctxEl.textContent || '{}'); } catch { return {}; } })() : {};

  const trigger     = document.getElementById('terminal-trigger') as HTMLButtonElement | null;
  const popup       = document.getElementById('terminal-popup') as HTMLElement | null;
  const overlay     = document.getElementById('terminal-overlay') as HTMLElement | null;
  const closeBtn    = document.getElementById('terminal-close') as HTMLButtonElement | null;
  const maximizeBtn = document.getElementById('terminal-maximize') as HTMLButtonElement | null;
  const resizeTop   = document.getElementById('terminal-resize-top') as HTMLElement | null;
  const resizeLeft  = document.getElementById('terminal-resize-left') as HTMLElement | null;
  const outputEl    = document.getElementById('terminal-output') as HTMLElement | null;
  const inputEl     = document.getElementById('terminal-input') as HTMLInputElement | null;
  const promptEl    = document.getElementById('terminal-prompt') as HTMLElement | null;
  const headerEl    = popup?.querySelector('.terminal-header') as HTMLElement | null;
  const sendBtn     = document.getElementById('terminal-send') as HTMLButtonElement | null;

  if (!popup || !outputEl || !inputEl || !promptEl) return;

  let currentDir: Dir = '/';
  let isMaximized = false;
  let isDragged = false;
  let hasShownBlogCtx = false;

  // Auto-set dir based on current page
  if (blogPostMatch) currentDir = 'blogs';
  else if (path.startsWith('/projects')) currentDir = 'projects';
  else if (path.startsWith('/blogs')) currentDir = 'blogs';
  else if (path.startsWith('/contact')) currentDir = 'contact';

  const cmdHistory: string[] = (() => {
    try { const r = localStorage.getItem(HISTORY_CACHE_KEY); return r ? JSON.parse(r) : []; }
    catch { return []; }
  })();
  let historyIdx = -1;

  // Position popup above bottom nav dynamically
  requestAnimationFrame(() => {
    const nav = document.querySelector('.bottom-nav') as HTMLElement | null;
    if (nav) {
      const r = nav.getBoundingClientRect();
      document.documentElement.style.setProperty('--terminal-popup-bottom', `${window.innerHeight - r.top + 8}px`);
    }
  });

  const updatePrompt = () => { promptEl!.textContent = getPrompt(currentDir); };
  updatePrompt();
  const scrollToBottom = () => { outputEl!.scrollTop = outputEl!.scrollHeight; };

  function appendLine(text: string, cls = 'terminal-line--output'): void {
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
      el.addEventListener('click', (e) => { e.preventDefault(); closeTerminal(); window.location.href = url; });
    } else {
      el.target = '_blank';
      el.rel = 'noopener noreferrer';
    }
    outputEl!.appendChild(el);
  }

  function openTerminal(): void {
    popup!.classList.add('is-open');
    overlay?.classList.add('is-open');
    trigger?.setAttribute('aria-expanded', 'true');
    if (blogPostMatch && pageCtx.title && !hasShownBlogCtx) {
      hasShownBlogCtx = true;
      const slug = blogPostMatch[2];
      appendLine(`${getPrompt(currentDir)} cat ${slug}`, 'terminal-line--command');
      appendLine(pageCtx.title);
      if (pageCtx.tags?.length) appendLine(`  [${pageCtx.tags.join(', ')}]`, 'terminal-line--muted');
      appendLine('  ctrl+c  →  back to /blogs', 'terminal-line--muted');
      appendLine('', 'terminal-line--muted');
      scrollToBottom();
    }
    inputEl!.focus();
  }

  function closeTerminal(): void {
    popup!.classList.remove('is-open');
    overlay?.classList.remove('is-open');
    trigger?.setAttribute('aria-expanded', 'false');
    trigger?.focus();
  }

  function toggleMaximize(): void {
    isMaximized = !isMaximized;
    if (isMaximized) {
      popup!.style.transition = 'width 0.2s ease, height 0.2s ease, bottom 0.2s ease, top 0.2s ease, left 0.2s ease, right 0.2s ease';
      popup!.classList.add('is-maximized');
      if (maximizeBtn) { maximizeBtn.textContent = '⊟'; maximizeBtn.setAttribute('aria-label', 'Restore terminal'); }
    } else {
      popup!.style.transition = '';
      popup!.classList.remove('is-maximized');
      if (maximizeBtn) { maximizeBtn.textContent = '⊞'; maximizeBtn.setAttribute('aria-label', 'Maximize terminal'); }
    }
    inputEl!.focus();
  }

  const saveHistory = () => {
    try { localStorage.setItem(HISTORY_CACHE_KEY, JSON.stringify(cmdHistory.slice(-MAX_HISTORY))); } catch {}
  };

  function autocomplete(): void {
    const val = inputEl!.value;
    const parts = val.trimStart().split(/\s+/);
    if (!val.trim()) return;

    if (parts.length === 1) {
      const lower = parts[0].toLowerCase();
      const m = ALL_COMMANDS.filter(c => c.startsWith(lower) && c !== lower);
      if (m.length === 1) inputEl!.value = m[0] + ' ';
      else if (m.length > 1) { appendLine(`${getPrompt(currentDir)} ${val}`, 'terminal-line--command'); appendLine(m.map(c => `/${c}`).join('  ')); scrollToBottom(); }
      return;
    }

    const [cmd, ...rest] = parts;
    const partial = rest.join(' ');

    if (cmd === 'cat') {
      const cands = currentDir === '/' ? ['skills.txt', 'clock.exe']
        : currentDir === 'blogs' ? data.blogs.map(b => b.slug)
        : data.projects.map(p => p.name);
      const lp = partial.toLowerCase();
      const m = cands.filter(c => c.toLowerCase().startsWith(lp));
      if (m.length === 1) inputEl!.value = `cat ${m[0]}`;
      else if (m.length > 1) { appendLine(`${getPrompt(currentDir)} ${val}`, 'terminal-line--command'); appendLine(m.join('  ')); scrollToBottom(); }
    } else if (cmd === 'cd') {
      if (partial.startsWith('blogs/') && currentDir === '/') {
        const slugPart = partial.slice(6);
        const slugCands = data.blogs.map(b => `blogs/${b.slug}`).filter(c => c.slice(6).startsWith(slugPart));
        if (slugCands.length === 1) inputEl!.value = `cd ${slugCands[0]}`;
        else if (slugCands.length > 1) { appendLine(`${getPrompt(currentDir)} ${val}`, 'terminal-line--command'); appendLine(slugCands.join('  ')); scrollToBottom(); }
        return;
      }
      let cands = currentDir === '/' ? ['blogs', 'projects'] : ['..'];
      if (onHome && currentDir === '/') cands = [...cands, 'contact'];
      const m = cands.filter(c => c.startsWith(partial) && c !== partial);
      if (m.length === 1) inputEl!.value = `cd ${m[0]}`;
    } else if (cmd === 'zoskisk' && '--help'.startsWith(partial)) {
      inputEl!.value = 'zoskisk --help';
    }
  }

  function processCommand(raw: string): void {
    const trimmed = raw.trim();
    if (!trimmed) return;
    if (!cmdHistory.length || cmdHistory[cmdHistory.length - 1] !== trimmed) cmdHistory.push(trimmed);
    historyIdx = -1;
    saveHistory();

    appendLine(`${getPrompt(currentDir)} ${trimmed}`, 'terminal-line--command');
    const parts = trimmed.split(/\s+/);
    const cmd = parts[0];
    const arg = parts.slice(1).join(' ');

    switch (cmd) {
      case 'clear':
        outputEl!.innerHTML = '';
        return;
      case 'zoskisk':
        arg === '--help' ? HELP_LINES.forEach(l => appendLine(l)) : appendLine('usage: zoskisk --help', 'terminal-line--error');
        break;
      case 'whoami':
        appendLine('khoa ngo — web developer');
        break;
      case 'ls':
        if (currentDir === '/') {
          appendLine('skills.txt');
          appendLine('clock.exe');
          appendLine('blogs/');
          appendLine('projects/');
          appendLine('contact/');
        }
        else if (currentDir === 'blogs') data.blogs.forEach(b => appendLink(b.slug, b.url));
        else data.projects.forEach(p => appendLink(p.name, p.url));
        break;
      case 'cd':
        if (arg === '..') {
          if (currentDir === '/') {
            appendLine('already at root', 'terminal-line--muted');
          } else {
            appendLine('→ returning to /', 'terminal-line--muted');
            closeTerminal();
            window.location.href = '/';
          }
        } else {
          // Handle relative paths like ../projects
          const targetDir = arg.startsWith('../') ? arg.slice(3) : arg;
          
          if (NAV_MAP[targetDir]) {
            if (currentDir === targetDir) {
              appendLine(`already in ${targetDir}/`, 'terminal-line--muted');
            } else {
              appendLine(`→ redirecting to ${NAV_MAP[targetDir]}`, 'terminal-line--muted');
              closeTerminal();
              window.location.href = NAV_MAP[targetDir];
            }
          } else if (arg.startsWith('blogs/') && currentDir === '/') {
          const slug = arg.slice(6);
          const b = data.blogs.find(b => b.slug === slug);
          if (b) { appendLine(`→ ${b.url}`, 'terminal-line--muted'); closeTerminal(); window.location.href = b.url; return; }
          appendLine(`cd: blogs/${slug}: not found`, 'terminal-line--error');
        } else if (!arg) {
          appendLine('usage: cd <dir> or cd ..', 'terminal-line--error');
        } else {
          appendLine(`cd: no such directory: ${arg}`, 'terminal-line--error');
        }
        break;
      case './clock.exe': {
        const now = new Date();
        const ft = (tz: string) => now.toLocaleTimeString('en-US', { timeZone: tz, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
        appendLine(`clock.exe  —  ${now.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}`);
        appendLine(`  VN  UTC+7   ${ft('Asia/Ho_Chi_Minh')}`);
        appendLine(`  UTC         ${ft('UTC')}`);
        const localTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        if (localTz !== 'Asia/Ho_Chi_Minh') appendLine(`  local       ${ft(localTz)}  (${localTz.split('/').pop()})`, 'terminal-line--muted');
        break;
      }
      case 'sudo':
        appendLine('sudo: permission denied', 'terminal-line--error');
        break;
      case 'docker':
        appendLine('docker: command not found');
        appendLine('  hint: sudo apt install docker.io', 'terminal-line--muted');
        break;
      case 'cat':
        if (arg === '/etc/passwd') {
          appendLine('root:x:0:0:root:/root:/bin/bash');
          appendLine('daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin');
          appendLine('syslog:x:104:110::/home/syslog:/usr/sbin/nologin');
          appendLine('messagebus:x:105:109::/nonexistent:/usr/sbin/nologin');
          appendLine('zoskisk:x:1337:1337:zoskisk179/hehehehehe:/home/zoskisk:/bin/zsh');
          break;
        }
        if (currentDir === '/') {
          if (arg === 'skills.txt') appendLine(SKILLS);
          else if (arg === 'clock.exe') appendLine('hint: run ./clock.exe to execute', 'terminal-line--muted');
          else if (!arg) appendLine('usage: cat <file>', 'terminal-line--error');
          else appendLine(`cat: ${arg}: no such file`, 'terminal-line--error');
        } else if (currentDir === 'blogs') {
          if (!arg) appendLine('usage: cat <slug>', 'terminal-line--error');
          else {
            const b = data.blogs.find(b => b.slug.toLowerCase() === arg.toLowerCase());
            if (b) { closeTerminal(); window.location.href = b.url; return; }
            appendLine(`cat: ${arg}: not found`, 'terminal-line--error');
          }
        } else {
          if (!arg) appendLine('usage: cat <name>', 'terminal-line--error');
          else {
            const p = data.projects.find(p => p.name.toLowerCase() === arg.toLowerCase());
            if (p) { window.open(p.url, '_blank', 'noopener,noreferrer'); return; }
            appendLine(`cat: ${arg}: not found`, 'terminal-line--error');
          }
        }
        break;
      case 'activity': {
        const cacheStr = localStorage.getItem(GH_CACHE_KEY);
        if (cacheStr) {
          try {
            const ev = JSON.parse(cacheStr).data?.pushEvent;
            if (ev) { appendLine(`last push: ${ev.repoName} · ${timeAgo(new Date(ev.time))}`); appendLine(`  ${ev.message}`, 'terminal-line--muted'); appendLink('  → open repo', ev.repoUrl); }
            else { appendLine('no push events in cache', 'terminal-line--muted'); appendLink(`→ github.com/${GH_USER}`, `https://github.com/${GH_USER}`); }
          } catch { appendLink(`→ github.com/${GH_USER}`, `https://github.com/${GH_USER}`); }
        } else {
          appendLine('fetching last commit...', 'terminal-line--muted');
          fetch(`https://api.github.com/users/${GH_USER}/events/public?per_page=5`)
            .then(r => r.json())
            .then((ev: any[]) => {
              const push = ev.find(e => e.type === 'PushEvent' && e.payload.commits.length > 0);
              if (push) {
                const repo = push.repo.name.split('/')[1];
                const commit = push.payload.commits[push.payload.commits.length - 1];
                appendLine(`last push: ${repo} · ${timeAgo(new Date(push.created_at))}`);
                appendLine(`  ${commit.message.split('\n')[0]}`, 'terminal-line--muted');
                appendLink('  → open repo', `https://github.com/${push.repo.name}`);
              } else appendLine('no recent push events found', 'terminal-line--muted');
              scrollToBottom();
            })
            .catch(() => { appendLine('rate limited or offline', 'terminal-line--error'); appendLink(`→ github.com/${GH_USER}`, `https://github.com/${GH_USER}`); scrollToBottom(); });
        }
        break;
      }
      case 'history': {
        appendLine('fetching recent activity...', 'terminal-line--muted');
        fetch(`https://api.github.com/users/${GH_USER}/events/public?per_page=15`)
          .then(r => r.json())
          .then((ev: any[]) => {
            const pushes = ev.filter(e => e.type === 'PushEvent' && e.payload.commits.length > 0).slice(0, 5);
            if (!pushes.length) appendLine('no recent push events', 'terminal-line--muted');
            else pushes.forEach(e => {
              appendLine(`${e.repo.name.split('/')[1]} · ${timeAgo(new Date(e.created_at))}`);
              appendLine(`  ${e.payload.commits[e.payload.commits.length - 1].message.split('\n')[0]}`, 'terminal-line--muted');
            });
            scrollToBottom();
          })
          .catch(() => { appendLine('rate limited or offline', 'terminal-line--error'); scrollToBottom(); });
        break;
      }
      case 'love':
        appendLine('♡ noe', 'terminal-line--output');
        break;
      case 'private':
        appendLine('why do you want to check my private', 'terminal-line--error');
        break;
      default:
        appendLine(`command not found: ${cmd}. run 'zoskisk --help'`, 'terminal-line--error');
    }
    scrollToBottom();
  }

  // Basic controls
  trigger?.addEventListener('click', () => popup!.classList.contains('is-open') ? closeTerminal() : openTerminal());
  closeBtn?.addEventListener('click', closeTerminal);
  sendBtn?.addEventListener('click', () => { const v = inputEl.value; inputEl.value = ''; processCommand(v); inputEl.focus(); });
  maximizeBtn?.addEventListener('click', toggleMaximize);
  overlay?.addEventListener('click', closeTerminal);

  document.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Escape' && popup!.classList.contains('is-open')) { isMaximized ? toggleMaximize() : closeTerminal(); return; }
    if (e.key === '`' && !e.ctrlKey && !e.metaKey && !e.altKey) {
      const a = document.activeElement;
      if ((a?.tagName === 'INPUT' || a?.tagName === 'TEXTAREA' || (a as HTMLElement)?.isContentEditable) && a !== inputEl) return;
      e.preventDefault();
      popup!.classList.contains('is-open') ? closeTerminal() : openTerminal();
    }
  });

  inputEl.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'c' && e.ctrlKey && blogPostMatch) {
      e.preventDefault();
      appendLine('^C', 'terminal-line--muted');
      scrollToBottom();
      setTimeout(() => { window.location.href = '/blogs'; }, 400);
      return;
    }
    if (e.key === 'Enter') { const v = inputEl.value; inputEl.value = ''; processCommand(v); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); if (!cmdHistory.length) return; historyIdx = historyIdx === -1 ? cmdHistory.length - 1 : Math.max(0, historyIdx - 1); inputEl.value = cmdHistory[historyIdx]; }
    else if (e.key === 'ArrowDown') { e.preventDefault(); if (historyIdx === -1) return; if (historyIdx < cmdHistory.length - 1) { historyIdx++; inputEl.value = cmdHistory[historyIdx]; } else { historyIdx = -1; inputEl.value = ''; } }
    else if (e.key === 'Tab') { e.preventDefault(); inputEl.value.trim() ? autocomplete() : closeBtn?.focus(); }
  });

  closeBtn?.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Tab' && !e.shiftKey) { e.preventDefault(); inputEl.focus(); }
  });

  // Double-click header → collapse into bar
  headerEl?.addEventListener('dblclick', (e) => {
    if ((e.target as Element).closest('button')) return;
    e.preventDefault();
    popup!.classList.add('is-collapsing');
    const onEnd = () => { popup!.classList.remove('is-collapsing'); closeTerminal(); };
    popup!.addEventListener('transitionend', onEnd, { once: true });
    setTimeout(onEnd, 250);
  });

  // ─── Drag (move by header) ───────────────────────────────────────────────
  let isDragging = false;
  let dragX = 0, dragY = 0, startL = 0, startT = 0;

  headerEl?.addEventListener('mousedown', (e) => {
    if ((e.target as Element).closest('button') || isMaximized) return;
    isDragging = true;
    isDragged = true;
    const r = popup!.getBoundingClientRect();
    startL = r.left; startT = r.top;
    dragX = e.clientX; dragY = e.clientY;
    popup!.style.right = 'auto';
    popup!.style.bottom = 'auto';
    popup!.style.left = `${r.left}px`;
    popup!.style.top = `${r.top}px`;
    e.preventDefault();
    document.body.style.cssText += ';cursor:grabbing;user-select:none';
  });

  // ─── Vertical resize (top handle) ────────────────────────────────────────
  let isResizingV = false;
  let rvY = 0, rvH = 0;

  resizeTop?.addEventListener('mousedown', (e) => {
    if (isMaximized) return;
    isResizingV = true; rvY = e.clientY; rvH = popup!.offsetHeight;
    e.preventDefault(); document.body.style.cssText += ';cursor:ns-resize;user-select:none';
  });

  // ─── Horizontal resize (left handle) ─────────────────────────────────────
  let isResizingH = false;
  let rhRight = 0, rhTop = 0;

  resizeLeft?.addEventListener('mousedown', (e) => {
    if (isMaximized) return;
    isResizingH = true;
    const r = popup!.getBoundingClientRect();
    rhRight = r.right; rhTop = r.top;
    if (!isDragged) {
      popup!.style.right = 'auto'; popup!.style.bottom = 'auto';
      popup!.style.top = `${r.top}px`; popup!.style.left = `${r.left}px`;
      isDragged = true;
    }
    e.preventDefault(); document.body.style.cssText += ';cursor:ew-resize;user-select:none';
  });

  document.addEventListener('mousemove', (e) => {
    if (isDragging) {
      const newL = Math.max(0, Math.min(window.innerWidth - popup!.offsetWidth, startL + e.clientX - dragX));
      const newT = Math.max(0, Math.min(window.innerHeight - popup!.offsetHeight, startT + e.clientY - dragY));
      popup!.style.left = `${newL}px`;
      popup!.style.top = `${newT}px`;
    } else if (isResizingV) {
      popup!.style.height = `${Math.max(150, Math.min(Math.floor(window.innerHeight * 0.85), rvH + rvY - e.clientY))}px`;
    } else if (isResizingH) {
      const newW = Math.max(280, Math.min(Math.floor(window.innerWidth * 0.9), rhRight - e.clientX));
      popup!.style.width = `${newW}px`;
      popup!.style.left = `${rhRight - newW}px`;
      popup!.style.top = `${rhTop}px`;
    }
  });

  document.addEventListener('mouseup', () => {
    if (isDragging || isResizingV || isResizingH) {
      isDragging = isResizingV = isResizingH = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }
  });

  appendLine('zoskisk portfolio terminal', 'terminal-line--muted');
  appendLine("type 'zoskisk --help' to get started", 'terminal-line--muted');
  appendLine('', 'terminal-line--muted');
}
