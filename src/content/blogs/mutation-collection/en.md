---
title: "Mutating an Array While Iterating Over It"
description: "A classic bug when mutating an array while iterating over it. Example from a real snake game project."
date: 2025-12-19
tags: ["bug", "short-post"]
---

When I worked on a snake game at the company, I encountered a classic bug that was very hard to spot in a large codebase. It was the issue of mutating an array while iterating over it. You can see the example below:

```typescript
const endTimer = this.time.delayedCall(TIME_GAME_LIMIT * 1000, () => {
  roomData.players.forEach((player) => {
    console.log(...roomData.players);
    console.log(player.id);
    console.log("[DEBUG]: " + roomData.players.length);
    this.killPlayer(player.id, DeathReason.TimesUp);
  });
});
```

**Output:**

```plaintext
app-1  | { id: 'o-YtjCYy050TW9H0AAAB', type: 'snake', avatar: 'snake4' } { id: 'swzaRwreukn6J--NAAAD', type: 'human', avatar: 'human1' }
app-1  | o-YtjCYy050TW9H0AAAB                                                                                                                                                    
app-1  | [DEBUG]: 2
```

## What

This is a simple example as you can see I'm iterating through each player in roomData. The first console.log shows 2 players, and roomData.players.length also shows 2, but `console.log(player.id);` only runs once.

## Why

The reason is that I'm calling the `killPlayer` function while iterating, and this function affects the `roomData` array by removing a player. This means there were initially 2 players, but when the loop runs, one player gets removed. That's why only one log appears even though there were initially 2.

This is a classic bug that you can easily encounter when deleting an element from an array while iterating over it.

