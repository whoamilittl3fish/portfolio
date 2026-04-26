interface TerminalData {
  blogs: { slug: string; title: string; url: string }[];
  projects: { name: string; url: string }[];
}

type Dir = '/' | 'blogs' | 'projects';

const GH_USER = 'whoamilittl3fish';
const GH_CACHE_KEY = 'gh_stats_cache_v1';
const HISTORY_CACHE_KEY = 'terminal_history_v1';
const MAX_HISTORY = 100;

const SKILLS = 'JS/TS  Node.js  C#/.NET  Docker  Git  Astro';

const HELP_LINES = [
  'available commands:',
  '  zoskisk --help   show this help',
  '  whoami           who is this person',
  '  ls               list directory contents',
  '  cd <dir>         change directory (blogs, projects)',
  '  cd ..            go back to root',
  '  cat <name>       view file or open item',
  '  activity         show last github push',
  '  history          show recent github activity',
  '  clear            clear terminal',
];

const ALL_COMMANDS = ['zoskisk', 'whoami', 'ls', 'cd', 'cat', 'activity', 'history', 'clear'];

function getPrompt(dir: Dir): string {
  return dir === '/' ? '~$' : `~/${dir} $`;
}

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  const intervals: [number, string][] = [
    [31536000, 'y'],
    [2592000, 'mo'],
    [86400, 'd'],
    [3600, 'h'],
    [60, 'm'],
  ];
  for (const [secs, label] of intervals) {
    const val = Math.floor(seconds / secs);
    if (val >= 1) return `${val}${label} ago`;
  }
  return 'just now';
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
  const maximizeBtn = document.getElementById('terminal-maximize') as HTMLButtonElement | null;
  const resizeHandle = document.getElementById('terminal-resize-handle') as HTMLElement | null;
  const outputEl = document.getElementById('terminal-output') as HTMLElement | null;
  const inputEl = document.getElementById('terminal-input') as HTMLInputElement | null;
  const promptEl = document.getElementById('terminal-prompt') as HTMLElement | null;

  if (!trigger || !popup || !outputEl || !inputEl || !promptEl) return;

  let currentDir: Dir = '/';
  let isMaximized = false;

  const cmdHistory: string[] = (() => {
    try {
      const raw = localStorage.getItem(HISTORY_CACHE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  })();
  let historyIdx = -1;

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

  function toggleMaximize(): void {
    isMaximized = !isMaximized;
    if (isMaximized) {
      popup!.style.transition = 'height 0.2s ease, width 0.2s ease, bottom 0.2s ease, right 0.2s ease, border-radius 0.2s ease';
      popup!.style.height = '';
      popup!.classList.add('is-maximized');
      if (maximizeBtn) {
        maximizeBtn.textContent = '⊟';
        maximizeBtn.setAttribute('aria-label', 'Restore terminal');
      }
    } else {
      popup!.style.transition = '';
      popup!.classList.remove('is-maximized');
      if (maximizeBtn) {
        maximizeBtn.textContent = '⊞';
        maximizeBtn.setAttribute('aria-label', 'Maximize terminal');
      }
    }
    inputEl!.focus();
  }

  function saveHistory(): void {
    try {
      localStorage.setItem(HISTORY_CACHE_KEY, JSON.stringify(cmdHistory.slice(-MAX_HISTORY)));
    } catch {}
  }

  function autocomplete(): void {
    const val = inputEl!.value;
    const parts = val.trimStart().split(/\s+/);

    if (parts.length === 0 || !val.trim()) return;

    if (parts.length === 1) {
      const partial = parts[0];
      const matches = ALL_COMMANDS.filter(c => c.startsWith(partial) && c !== partial);
      if (matches.length === 1) {
        inputEl!.value = matches[0] + ' ';
      } else if (matches.length > 1) {
        appendLine(`${getPrompt(currentDir)} ${val}`, 'terminal-line--command');
        appendLine(matches.join('  '));
        scrollToBottom();
      }
      return;
    }

    const cmd = parts[0];
    const partial = parts.slice(1).join(' ');

    if (cmd === 'cat') {
      let candidates: string[] = [];
      if (currentDir === '/') {
        candidates = ['skills.txt'];
      } else if (currentDir === 'blogs') {
        candidates = data.blogs.map(b => b.slug);
      } else if (currentDir === 'projects') {
        candidates = data.projects.map(p => p.name);
      }
      const matches = candidates.filter(c => c.startsWith(partial));
      if (matches.length === 1) {
        inputEl!.value = `cat ${matches[0]}`;
      } else if (matches.length > 1) {
        appendLine(`${getPrompt(currentDir)} ${val}`, 'terminal-line--command');
        appendLine(matches.join('  '));
        scrollToBottom();
      }
    } else if (cmd === 'cd') {
      const candidates = currentDir === '/' ? ['blogs', 'projects'] : ['..'];
      const matches = candidates.filter(c => c.startsWith(partial));
      if (matches.length === 1) inputEl!.value = `cd ${matches[0]}`;
    } else if (cmd === 'zoskisk' && '--help'.startsWith(partial)) {
      inputEl!.value = 'zoskisk --help';
    }
  }

  function processCommand(raw: string): void {
    const trimmed = raw.trim();
    if (!trimmed) return;

    if (!cmdHistory.length || cmdHistory[cmdHistory.length - 1] !== trimmed) {
      cmdHistory.push(trimmed);
    }
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
        if (arg === '--help') {
          HELP_LINES.forEach(l => appendLine(l));
        } else {
          appendLine('usage: zoskisk --help', 'terminal-line--error');
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
        if (currentDir === '/') {
          if (arg === 'skills.txt') {
            appendLine(SKILLS);
          } else if (!arg) {
            appendLine('usage: cat <file>', 'terminal-line--error');
          } else {
            appendLine(`cat: ${arg}: no such file`, 'terminal-line--error');
          }
        } else if (currentDir === 'blogs') {
          if (!arg) {
            appendLine('usage: cat <slug>', 'terminal-line--error');
          } else {
            const blog = data.blogs.find(b => b.slug === arg);
            if (blog) {
              closeTerminal();
              window.location.href = blog.url;
              return;
            }
            appendLine(`cat: ${arg}: not found`, 'terminal-line--error');
          }
        } else {
          if (!arg) {
            appendLine('usage: cat <name>', 'terminal-line--error');
          } else {
            const project = data.projects.find(p => p.name === arg);
            if (project) {
              window.open(project.url, '_blank', 'noopener,noreferrer');
              return;
            }
            appendLine(`cat: ${arg}: not found`, 'terminal-line--error');
          }
        }
        break;

      case 'activity': {
        const cacheStr = localStorage.getItem(GH_CACHE_KEY);
        if (cacheStr) {
          try {
            const cached = JSON.parse(cacheStr);
            const ev = cached.data?.pushEvent;
            if (ev) {
              appendLine(`last push: ${ev.repoName} · ${timeAgo(new Date(ev.time))}`);
              appendLine(`  ${ev.message}`, 'terminal-line--muted');
              appendLink('  → open repo', ev.repoUrl);
            } else {
              appendLine('no push events in cache', 'terminal-line--muted');
              appendLink(`→ github.com/${GH_USER}`, `https://github.com/${GH_USER}`);
            }
          } catch {
            appendLink(`→ github.com/${GH_USER}`, `https://github.com/${GH_USER}`);
          }
        } else {
          appendLine('fetching last commit...', 'terminal-line--muted');
          fetch(`https://api.github.com/users/${GH_USER}/events/public?per_page=5`)
            .then(r => r.json())
            .then((events: any[]) => {
              const push = events.find(e => e.type === 'PushEvent' && e.payload.commits.length > 0);
              if (push) {
                const repo = push.repo.name.split('/')[1];
                const repoUrl = `https://github.com/${push.repo.name}`;
                const commit = push.payload.commits[push.payload.commits.length - 1];
                const msg = commit.message.split('\n')[0];
                appendLine(`last push: ${repo} · ${timeAgo(new Date(push.created_at))}`);
                appendLine(`  ${msg}`, 'terminal-line--muted');
                appendLink('  → open repo', repoUrl);
              } else {
                appendLine('no recent push events found', 'terminal-line--muted');
              }
              scrollToBottom();
            })
            .catch(() => {
              appendLine('rate limited or offline', 'terminal-line--error');
              appendLink(`→ github.com/${GH_USER}`, `https://github.com/${GH_USER}`);
              scrollToBottom();
            });
        }
        break;
      }

      case 'history': {
        appendLine('fetching recent activity...', 'terminal-line--muted');
        fetch(`https://api.github.com/users/${GH_USER}/events/public?per_page=15`)
          .then(r => r.json())
          .then((events: any[]) => {
            const pushEvents = events
              .filter(e => e.type === 'PushEvent' && e.payload.commits.length > 0)
              .slice(0, 5);
            if (!pushEvents.length) {
              appendLine('no recent push events', 'terminal-line--muted');
            } else {
              pushEvents.forEach(e => {
                const repo = e.repo.name.split('/')[1];
                const commit = e.payload.commits[e.payload.commits.length - 1];
                const msg = commit.message.split('\n')[0];
                appendLine(`${repo} · ${timeAgo(new Date(e.created_at))}`);
                appendLine(`  ${msg}`, 'terminal-line--muted');
              });
            }
            scrollToBottom();
          })
          .catch(() => {
            appendLine('rate limited or offline', 'terminal-line--error');
            scrollToBottom();
          });
        break;
      }

      default:
        appendLine(`command not found: ${cmd}. run 'zoskisk --help'`, 'terminal-line--error');
    }

    scrollToBottom();
  }

  trigger.addEventListener('click', () => {
    popup!.classList.contains('is-open') ? closeTerminal() : openTerminal();
  });

  closeBtn?.addEventListener('click', closeTerminal);
  maximizeBtn?.addEventListener('click', toggleMaximize);
  overlay?.addEventListener('click', closeTerminal);

  document.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Escape' && popup!.classList.contains('is-open')) {
      isMaximized ? toggleMaximize() : closeTerminal();
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

  inputEl.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      const val = inputEl.value;
      inputEl.value = '';
      processCommand(val);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!cmdHistory.length) return;
      historyIdx = historyIdx === -1 ? cmdHistory.length - 1 : Math.max(0, historyIdx - 1);
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
      if (inputEl.value.trim()) {
        autocomplete();
      } else {
        closeBtn?.focus();
      }
    }
  });

  closeBtn?.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Tab' && !e.shiftKey) {
      e.preventDefault();
      inputEl.focus();
    }
  });

  // Resize: drag top edge to change popup height
  let isResizing = false;
  let resizeStartY = 0;
  let resizeStartH = 0;

  resizeHandle?.addEventListener('mousedown', (e) => {
    if (isMaximized) return;
    isResizing = true;
    resizeStartY = e.clientY;
    resizeStartH = popup!.offsetHeight;
    e.preventDefault();
    document.body.style.cursor = 'ns-resize';
    document.body.style.userSelect = 'none';
  });

  document.addEventListener('mousemove', (e) => {
    if (!isResizing) return;
    const dy = resizeStartY - e.clientY;
    const newH = Math.max(150, Math.min(Math.floor(window.innerHeight * 0.85), resizeStartH + dy));
    popup!.style.height = `${newH}px`;
  });

  document.addEventListener('mouseup', () => {
    if (!isResizing) return;
    isResizing = false;
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  });

  appendLine('zoskisk portfolio terminal', 'terminal-line--muted');
  appendLine("type 'zoskisk --help' to get started", 'terminal-line--muted');
  appendLine('', 'terminal-line--muted');
}
