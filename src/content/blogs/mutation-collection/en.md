---
title: "Mutating an Array While Iterating Over It"
description: "A classic bug when mutating an array while iterating over it. Example from a real snake game project."
date: 2025-12-19
tags: ["bug", "short-post"]
---

When I worked on a snake game at the company, I encountered a classic bug that was very hard to spot in a large codebase. It was the issue of mutating an array while iterating over it. You can see the example below:

```typescript
  roomData.players.forEach((player) => {
    console.log(...roomData.players);
    console.log(player.id);
    console.log("[DEBUG]: " + roomData.players.length);
    this.killPlayer(player.id, DeathReason.TimesUp);
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

## How to solve

There is always more than one way to solve a problem unless the problem is just boolean, I mean binary. :D

### Solution 1:

Delete the last element of the array and the index will run from the end to 0, the length changes each time an element is deleted but i also `-1` to delete the last element of the array.

Example:

```typescript
for (let i = roomData.players.length - 1; i >= 0; i--) {
  const player = roomData.players[i];
  console.log(...roomData.players);
  console.log(player);
  console.log("[DEBUG]: " + roomData.players.length);
  this.killPlayer(player.id, DeathReason.TimesUp);
}
```


**Output:**

```terminal
{ id: 'hLxAlYSUHVmryFyyAAAD', type: 'snake', avatar: 'snake4' } { id: 'Zw6lzr0fQW-rQQ3tAAAF', type: 'human', avatar: 'human2' } { id: 'Dpq0vcWR1C6jwYKvAAAJ', type: 'human', avatar: 'human1' }                                                                                                                                
app-1  | { id: 'Dpq0vcWR1C6jwYKvAAAJ', type: 'human', avatar: 'human1' }
app-1  | [DEBUG]: 3                                                                                                                                                 
app-1  | [DEATH] Game: 1766979246579-jdwemtzz8xf, Socket: Dpq0vcWR1C6jwYKvAAAJ, Player: human1, Reason: timesUp, Position: (615, 435)                               
app-1  | [DISCONNECT] Player "human1" with socket Dpq0vcWR1C6jwYKvAAAJ disconnected in room 1766979246579-jdwemtzz8xf.                                              
app-1  | { id: 'hLxAlYSUHVmryFyyAAAD', type: 'snake', avatar: 'snake4' } { id: 'Zw6lzr0fQW-rQQ3tAAAF', type: 'human', avatar: 'human2' }                            
app-1  | { id: 'Zw6lzr0fQW-rQQ3tAAAF', type: 'human', avatar: 'human2' }                                                                                            
app-1  | [DEBUG]: 2                                                                                                                                                 
app-1  | [DEATH] Game: 1766979246579-jdwemtzz8xf, Socket: Zw6lzr0fQW-rQQ3tAAAF, Player: human2, Reason: timesUp, Position: (585, 255)                               
app-1  | [DISCONNECT] Player "human2" with socket Zw6lzr0fQW-rQQ3tAAAF disconnected in room 1766979246579-jdwemtzz8xf.                                              
app-1  | { id: 'hLxAlYSUHVmryFyyAAAD', type: 'snake', avatar: 'snake4' }                                                                                            
app-1  | { id: 'hLxAlYSUHVmryFyyAAAD', type: 'snake', avatar: 'snake4' }                                                                                            
app-1  | [DEBUG]: 1                                                                                                                                                 
app-1  | [DEATH] Game: 1766979246579-jdwemtzz8xf, Socket: hLxAlYSUHVmryFyyAAAD, Player: snake4, Reason: timesUp, Body Positions: (525, 345), (495, 345), (465, 345) 
app-1  | [DISCONNECT] Player "snake4" with socket hLxAlYSUHVmryFyyAAAD disconnected in room 1766979246579-jdwemtzz8xf.
```

With this approach, initially the array will have 3 elements, we will delete from the last element of the array and decrease down to 0. But the code will be harder to read.

#### Why does this work?

Because the old way instead of iterating from 0 to the end, the length of the array has changed and makes roomData.players.length smaller each time we iterate through the index and cannot iterate through all of them. But currently we iterate through the last element first, delete the last element then `- 1` for the next iteration and the length will be correct.

#### Good: 

This approach doesn't need to create a new copy variable.

### Solution 2:

Create a copy of that data and iterate through the copy to modify/delete the data. We can just copy the index of the object if we only need ids to know which element to delete, for example.

The example below has this.games[gameId].players as an array containing all indices of roomData.players and we will use these indices to delete elements in roomData.

```typescript
Object.entries(this.games[gameId].players).forEach(([player]) => {
  console.log(...roomData.players);
  console.log(player);
  console.log("[DEBUG]: " + roomData.players.length);
  this.killPlayer(player, DeathReason.TimesUp);
});
```

**Output:** similar to solution 1

```
 { id: '0CqNmgn663afDdaJAAAB', type: 'snake', avatar: 'snake1' } { id: 'Ub-jLHWBB_3mA5uWAAAD', type: 'human', avatar: 'human1' } { id: 'P6tNeqCfyuP_im7SAAAH', type: 'human', avatar: 'human2' }                                                                                                                                
app-1  | 0CqNmgn663afDdaJAAAB
app-1  | [DEBUG]: 3                                                                                                                                                 
app-1  | [DEATH] Game: 1766979497017-8yxtctnvbmx, Socket: 0CqNmgn663afDdaJAAAB, Player: snake1, Reason: timesUp, Body Positions: (675, 465), (675, 495)             
app-1  | [DISCONNECT] Player "snake1" with socket 0CqNmgn663afDdaJAAAB disconnected in room 1766979497017-8yxtctnvbmx.                                              
app-1  | { id: 'Ub-jLHWBB_3mA5uWAAAD', type: 'snake', avatar: 'snake2' } { id: 'P6tNeqCfyuP_im7SAAAH', type: 'human', avatar: 'human2' }                            
app-1  | Ub-jLHWBB_3mA5uWAAAD                                                                                                                                       
app-1  | [DEBUG]: 2                                                                                                                                                 
app-1  | [DEATH] Game: 1766979497017-8yxtctnvbmx, Socket: Ub-jLHWBB_3mA5uWAAAD, Player: human1, Reason: timesUp, Position: (345, 255)                               
app-1  | [DISCONNECT] Player "human1" with socket Ub-jLHWBB_3mA5uWAAAD disconnected in room 1766979497017-8yxtctnvbmx.                                              
app-1  | { id: 'P6tNeqCfyuP_im7SAAAH', type: 'snake', avatar: 'snake6' }                                                                                            
app-1  | P6tNeqCfyuP_im7SAAAH                                                                                                                                       
app-1  | [DEBUG]: 1                                                                                                                                                 
app-1  | [DEATH] Game: 1766979497017-8yxtctnvbmx, Socket: P6tNeqCfyuP_im7SAAAH, Player: human2, Reason: timesUp, Position: (645, 285)                               
app-1  | [DISCONNECT] Player "human2" with socket P6tNeqCfyuP_im7SAAAH disconnected in room 1766979497017-8yxtctnvbmx.     
```

#### Good:

This code is very easy to read, using a new variable containing the old array information and deleting that array from here.

#### Limitation:

Need to create a new variable, requires more handling.

## endl

This is the end of this post. If there are any mistakes, please contribute your feedback directly through the information at the end (footer) of the portfolio. I hope this information will be helpful. :D


