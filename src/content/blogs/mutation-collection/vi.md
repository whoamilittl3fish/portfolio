---
title: "Thay đổi mảng trong khi đang lặp"
description: "Một classic bug khi thay đổi một mảng trong khi đang chạy vòng lặp qua mảng đó. Ví dụ từ dự án snake game thực tế."
date: 2025-12-19
tags: ["bug", "short-post"]
---

Khi tôi tham gia làm snake game tại công ty, có một classic bug mà tôi mắc phải nhưng lại rất khó nhận ra trong source code lớn. Đó chính là việc thay đổi một mảng (array) trong khi đang chạy vòng lặp. Bạn có thể nhìn ví dụ bên dưới:

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

Đây là một ví dụ đơn giản như bạn thấy tôi đang chạy vòng lặp qua mỗi player ở trong roomData ở console.log đầu tiên thì hiển thị ra 2 người, và roomData.players.length cũng hiển thị là 2 nhưng ở `console.log(player.id);` chỉ chạy ra một.

## Why

Lý do thì bạn có thể thấy tôi gọi hàm `killPlayer` trong khi tôi chạy vòng lặp, và chính hàm này tác động đến array `roomData` xoá một người chơi, nghĩa là ban đầu có 2 người chơi nhưng khi chạy thì xoá 1 người chơi mất. Và vì thế log ra chỉ có một mặc dù ban đầu là 2.

Đây chính là một classic bug điển hình mà bạn có thể mắc phải khi xoá một phần tử trong mảng khi đang chạy vòng lặp qua mảng đó.

