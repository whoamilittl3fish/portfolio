---
title: "Synchronous and Asynchronous Code Flow"
description: "What is synchronous/asynchronous code flow? How are they different?"
date: 2026-01-15
tags: ["code", "base-knowledge"]
---

# Synchronous and Asynchronous Code Flow

## What is synchronous code?

Synchronous code runs line by line. Each line must finish before the next one starts. If a line takes a long time, everything else has to wait.

```typescript
console.log("Step 1");
console.log("Step 2");
console.log("Step 3");
// Output: Step 1, Step 2, Step 3 — always in order
```

A blocking example:

```typescript
function waitFor(ms: number): void {
  const end = Date.now() + ms;
  while (Date.now() < end) {} // busy-wait, blocks everything
}

console.log("Before wait");
waitFor(3000); // freezes for 3 seconds
console.log("After wait"); // only runs after the freeze
```

This works fine for simple scripts, but in a browser that handles user interactions, blocking is a serious problem — the page becomes unresponsive.

## Why does JavaScript need asynchronous code?

JavaScript is single-threaded — it has one call stack, meaning it can only run one piece of code at a time. If you make a network request synchronously, the entire page freezes until the response arrives.

Asynchronous code solves this: "start this task, and when it finishes, let me know — keep running other code in the meantime."

```typescript
console.log("Start");

setTimeout(() => {
  console.log("This runs later");
}, 1000);

console.log("End");
// Output: Start, End, (after 1 second) This runs later
```

`setTimeout` does not block. JavaScript hands the timer off to the browser's Web APIs, continues to the next line, and comes back when the timer fires.

## The event loop (brief)

The event loop is what makes this possible:

- **Call stack**: where JavaScript runs code right now.
- **Task queue**: where completed async callbacks wait to be picked up.
- **Event loop**: checks "is the call stack empty? If yes, run the next callback from the queue."

This is why async callbacks never interrupt code that is currently running.

## Async patterns: callbacks → Promises → async/await

### Callbacks (old way)

```typescript
function fetchUser(id: number, callback: (user: { name: string }) => void): void {
  setTimeout(() => callback({ name: "Khoa" }), 500);
}

fetchUser(1, (user) => {
  console.log(user.name); // "Khoa"
});
```

Problem: nesting callbacks leads to "callback hell" — deeply indented, hard-to-read code.

### Promises

```typescript
function fetchUser(id: number): Promise<{ name: string }> {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ name: "Khoa" }), 500);
  });
}

fetchUser(1)
  .then((user) => console.log(user.name))
  .catch((err) => console.error(err));
```

Promises chain cleanly and separate the success and error paths.

### async/await (modern)

```typescript
async function loadUser(id: number): Promise<void> {
  try {
    const user = await fetchUser(id);
    console.log(user.name);
  } catch (err) {
    console.error(err);
  }
}
```

`async/await` is syntactic sugar over Promises — reads like synchronous code, does not block.

## When to use each

- **Synchronous**: calculations, data transformation, anything fast with no external dependencies.
- **async/await**: API calls, file reads, database queries — any I/O operation.
- **Callbacks**: event listeners (`addEventListener`) — when the callback needs to fire repeatedly, not just once.
- **Promises directly**: `Promise.all` or `Promise.race` to run multiple async operations in parallel.
