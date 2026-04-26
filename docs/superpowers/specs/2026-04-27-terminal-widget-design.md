# Terminal Widget — Design Spec

**Date:** 2026-04-27  
**Scope:** Global interactive terminal widget (floating popup / mobile bottom sheet) accessible from every page. Simplify hero section to remove skill pills and add a terminal hint.

---

## Context

The portfolio hero currently shows a centered greeting + tagline + static skill pills. The goal is to replace the skill pills with a more distinctive, interactive terminal widget — a developer easter egg and navigation tool that reflects personality and is genuinely fun to use.

The terminal is **not** a real shell; it emulates a small virtual filesystem with a fixed command set and navigable blog/project directories.

---

## Scope

- New global floating terminal widget (all pages via `BaseLayout.astro`)
- Simplified hero section (remove skill pills, add terminal hint)
- No changes to any other existing page/component

---

## Virtual Filesystem

```
/
├── skills.txt          (cat-able file)
├── blogs/
│   ├── api-overview
│   ├── asynchronus-synchronus-flow
│   ├── debugging-application-errors
│   ├── git-workflows-comparison
│   ├── mutation-collection
│   ├── o-auth
│   └── what-is-oop
└── projects/
    ├── little-world-portfolio
    └── pawnshop-management-app
```

Blog entries link to `/blogs/en/<slug>`. Project entries link to their `live` URL if available, otherwise `source` URL.

---

## Commands

| Command | Available in | Output |
|---------|-------------|--------|
| `zoskisk --help` | everywhere | list of all commands |
| `whoami` | everywhere | "khoa ngo — web developer" |
| `ls` | everywhere | contents of current dir |
| `cd <name>` | / only | navigate to blogs/ or projects/ |
| `cd ..` | blogs/, projects/ | return to / |
| `cat skills.txt` | / only | skills list |
| `clear` | everywhere | clear all output |
| `open <item>` | blogs/, projects/ | navigate browser to item URL |
| ↑ arrow key | everywhere | cycle through command history |
| invalid | everywhere | "command not found: <cmd>. run 'zoskisk --help'" |

`ls` output in blogs/ and projects/ renders each item as a **clickable link** (same as `open <item>`). `cat skills.txt` is a file only in `/`; attempting it from a subdirectory returns "no such file".

---

## Data

Data injected at build time by `Terminal.astro` as an inline `<script type="application/json" id="terminal-data">` block. Schema:

```typescript
interface TerminalData {
  blogs: { slug: string; title: string; url: string }[];
  projects: { name: string; url: string }[];
}
```

`terminal.ts` reads and parses this on init — zero API calls, works fully offline/static.

---

## State

```typescript
interface TerminalState {
  isOpen: boolean;
  currentDir: '/' | 'blogs' | 'projects';
  history: string[];       // command history, most-recent last
  historyIndex: number;    // -1 = not browsing history
}
```

State lives in a closure in `terminal.ts`. No localStorage persistence needed — terminal resets on page load.

---

## UI — Desktop

Floating popup, bottom-right corner, above bottom navigation if present.

```
┌─────────────────────────────────────┐
│ zoskisk@portfolio:~$  ─────────  ✕ │
├─────────────────────────────────────┤
│ $ zoskisk --help                    │
│   whoami   ls      cd    cat        │
│   open     clear                    │
│                                     │
│ $ whoami                            │
│   khoa ngo — web developer          │
│                                     │
│ $ _                                 │
│                                     │
│                                     │
├─────────────────────────────────────┤
│ ~/blogs $ █                         │
└─────────────────────────────────────┘
```

- Size: 420px × 300px, fixed, no resize
- Dark background in both light and dark mode (terminal aesthetic)
- Monospace font (inherit from CSS variable or fallback to `ui-monospace, monospace`)
- Output area: scrollable, auto-scrolls to bottom on new output
- Input line: prompt prefix (`$ ` or `~/blogs $ `) + plain text input, no browser default styling
- Trigger: floating `>_` button bottom-right + backtick `` ` `` keyboard shortcut
- Open/close animation: `transform: translateY` slide-up, 150ms ease

---

## UI — Mobile

Bottom sheet instead of popup:

- 100% viewport width
- ~60% viewport height (CSS: `60dvh`)
- Slides up from bottom, `transform: translateY(100%) → translateY(0)`
- Input always visible above virtual keyboard (using `env(safe-area-inset-bottom)`)
- Same dark background and monospace font
- Close: tap the `✕` in header, or tap the overlay behind the sheet
- Floating `>_` button: bottom-right, but `bottom` offset increases by ~80px on pages that have a `BottomNav` component to avoid overlap

---

## Hero Simplification

Remove skill pills (`<ul class="skill-list">`). Keep `h1` and `.hero__tagline`. Add a one-line hint below the tagline:

```html
<p class="hero__terminal-hint">press <kbd>`</kbd> or <span>>_</span> to explore</p>
```

Style: `font-size: var(--font-size-sm)`, `color: var(--text-muted)`, subtle. The hint does not link anywhere — it just points to the button/shortcut.

---

## File Map

| Action | Path |
|--------|------|
| **Create** | `src/components/Terminal.astro` |
| **Create** | `src/scripts/terminal.ts` |
| **Create** | `src/styles/components/terminal.css` |
| **Modify** | `src/components/BaseLayout.astro` — import Terminal |
| **Modify** | `src/pages/index.astro` — remove skill-list, add terminal hint |
| **Modify** | `src/styles/pages/home.css` — remove `.skill-list`, add `.hero__terminal-hint` |

---

## Accessibility

- Floating button has `aria-label="Open terminal"` and `aria-expanded` state
- Terminal popup has `role="dialog"` and `aria-label="Interactive terminal"`
- Input has `aria-label="Terminal input"`
- Escape key closes the terminal
- Focus trapped inside terminal while open (focus returns to trigger button on close)

---

## Non-goals

- No real shell execution
- No command editing (cursor movement within input line)
- No tab completion
- No localStorage persistence of command history across sessions
- No resize/drag
