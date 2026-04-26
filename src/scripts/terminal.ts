interface TerminalData {
  blogs: { slug: string; title: string; url: string }[];
  projects: { name: string; url: string }[];
}

type Dir = '/' | 'blogs' | 'projects';

const GH_USER = 'whoamilittl3fish';
const GH_CACHE_KEY = 'gh_stats_cache_v1';

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
  '  activity         show last github push',
  '  history          show recent github activity',
  '  clear            clear terminal',
];

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
  const outputEl = document.getElementById('terminal-output') as HTMLElement | null;
  const inputEl = document.getElementById('terminal-input') as HTMLInputElement | null;
  const promptEl = document.getElementById('terminal-prompt') as HTMLElement | null;

  if (!trigger || !popup || !outputEl || !inputEl || !promptEl) return;

  let currentDir: Dir = '/';
  const cmdHistory: string[] = [];
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
                const ago = timeAgo(new Date(push.created_at));
                appendLine(`last push: ${repo} · ${ago}`);
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
                const ago = timeAgo(new Date(e.created_at));
                appendLine(`${repo} · ${ago}`);
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
  overlay?.addEventListener('click', closeTerminal);

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
      closeBtn?.focus();
    }
  });

  closeBtn?.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      inputEl.focus();
    }
  });

  appendLine('zoskisk portfolio terminal', 'terminal-line--muted');
  appendLine("type 'zoskisk --help' to get started", 'terminal-line--muted');
  appendLine('', 'terminal-line--muted');
}
