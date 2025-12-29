---
title: "Thay đổi mảng trong khi đang lặp"
description: "Một classic bug khi thay đổi một mảng trong khi đang chạy vòng lặp qua mảng đó. Ví dụ từ dự án snake game thực tế."
date: 2025-12-19
tags: ["bug", "short-post"]
---

Khi tôi tham gia làm snake game tại công ty, có một classic bug mà tôi mắc phải nhưng lại rất khó nhận ra trong source code lớn. Đó chính là việc thay đổi một mảng (array) trong khi đang chạy vòng lặp. 

Bạn có thể nhìn ví dụ bên dưới:

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

Đây là một ví dụ đơn giản như bạn thấy tôi đang chạy vòng lặp qua mỗi player ở trong roomData ở console.log đầu tiên thì hiển thị ra 2 người, và roomData.players.length cũng hiển thị là 2 nhưng ở `console.log(player.id);` chỉ chạy ra một.

## Why

Lý do thì bạn có thể thấy tôi gọi hàm `killPlayer` trong khi tôi chạy vòng lặp, và chính hàm này tác động đến array `roomData` xoá một người chơi, nghĩa là ban đầu có 2 người chơi nhưng khi chạy thì xoá 1 người chơi mất. Và vì thế log ra chỉ có một mặc dù ban đầu là 2.

Đây chính là một classic bug điển hình mà bạn có thể mắc phải khi xoá một phần tử trong mảng khi đang chạy vòng lặp qua mảng đó.

## How to solve

Luôn có nhiều hơn một cách để giải quyết một vấn đề trừ khi vấn đề đó chỉ là boolean, ý tôi là nhị phân. :D

### Cách 1:

Xoá phần tử cuối của mảng và index sẽ chạy từ cuối tới 0, độ dài thay đổi mỗi khi xoá một phần tử nhưng i cũng `-1` để xoá phần tử cuối của mảng.

Ví dụ như:

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

Với cách này thì ban đầu mảng sẽ có 3 phần tử, chúng ta sẽ xoá từ phần tử cuối cùng của mảng và giảm xuống dần tới 0. Nhưng đọc code đọc sẽ khó hiểu hơn.

#### Vì sao sử dụng được?

Vì cách cũ thay vì chạy vòng lặp từ 0 cho tới cuối độ dài của mảng đã thay đổi và khiến cho roomData.players.length nhỏ hơn mỗi lần lặp qua index và không thể lặp hết được. Nhưng hiện tại chúng ta lặp qua phần từ cuối đầu tiên, xoá phần tử cuối sau đó lại `- 1` cho lần tiếp theo và độ dài sẽ đúng.

#### Tốt: 

Cách này không cần tạo thêm biến copy mới.

#### Hạn chế: 

Cách này khiến code khó đọc hơn.

### Cách 2:

Tạo ra một bản copy của dữ liệu đó và chạy vòng lặp qua bản copy để thay đổi/xoá dữ liệu. Chúng ta có thể chỉ cần copy index của object nếu chỉ cần ids để biết phần từ nào cần xoá chẳng hạn. 

Ví dụ bên dưới có this.games[gameId].players là mảng chứa tất cả các index của roomData.players và chúng ta sẽ dùng những index này để xoá phần tử trong roomData.

```typescript
 Object.entries(this.games[gameId].players).forEach(([socketId]) => {
  console.log(...roomData.players);
  console.log(player);
  console.log("[DEBUG]: " + roomData.players.length);
  this.killPlayer(socketId, DeathReason.TimesUp);
  });
```

**Output:** tương tự như cách 1

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

#### Tốt:

Code này rất dễ đọc, dùng một biến mới chứa thông tin array cũ và xoá mảng đó từ đây.

#### Hạn chế:

Cần tạo biến mới, cần dọn xử lý nhiều hơn.

## endl

Đến đây là kết thúc của bài này. Nếu có gì sai sót mong bạn đóng góp ý kiến trực tiếp qua thông tin ở phần cuối (footer) của portfolio. Hy vọng những thông tin này sẽ giúp ích. :D



