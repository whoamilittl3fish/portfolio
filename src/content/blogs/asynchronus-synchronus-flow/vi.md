---
title: "Luồng code chạy đồng bộ (Synchronus) và bất đồng bộ (Asynchronus)."
description: "Luồng code chạy đồng bộ/bất đồng bộ là gì? Khác nhau như thế nào?"
date: 2026-01-15
tags: ["code", "base-knowledge"]
---

# Luồng code đồng bộ và bất đồng bộ

## Code đồng bộ là gì?

Code đồng bộ chạy từng dòng một, theo thứ tự. Mỗi dòng phải chạy xong thì dòng tiếp theo mới được chạy. Nếu một dòng mất nhiều thời gian, toàn bộ chương trình phải đứng chờ.

```typescript
console.log("Bước 1");
console.log("Bước 2");
console.log("Bước 3");
// Output: Bước 1, Bước 2, Bước 3 — luôn theo thứ tự
```

Ví dụ về blocking:

```typescript
function waitFor(ms: number): void {
  const end = Date.now() + ms;
  while (Date.now() < end) {} // vòng lặp chờ, chặn toàn bộ luồng
}

console.log("Trước khi chờ");
waitFor(3000); // đóng băng 3 giây
console.log("Sau khi chờ"); // chỉ chạy sau khi hết đóng băng
```

Với script đơn giản thì không vấn đề, nhưng trên browser khi người dùng đang tương tác, việc chặn như vậy khiến trang web bị đóng băng hoàn toàn.

## Tại sao JavaScript cần code bất đồng bộ?

JavaScript chỉ có một luồng (single-threaded) — tại một thời điểm chỉ chạy một đoạn code. Nếu gọi network request theo kiểu đồng bộ, toàn bộ trang sẽ đóng băng cho đến khi nhận được response.

Code bất đồng bộ giải quyết điều này: "bắt đầu tác vụ này, khi xong thì báo lại — trong lúc đó tiếp tục chạy việc khác."

```typescript
console.log("Bắt đầu");

setTimeout(() => {
  console.log("Chạy sau 1 giây");
}, 1000);

console.log("Kết thúc");
// Output: Bắt đầu, Kết thúc, (sau 1 giây) Chạy sau 1 giây
```

`setTimeout` không chặn luồng. JavaScript giao timer cho Web API của browser, tiếp tục chạy dòng tiếp theo, và quay lại gọi callback khi timer kết thúc.

## Event loop (giải thích ngắn gọn)

Event loop chính là cơ chế cho phép điều này hoạt động:

- **Call stack**: nơi JavaScript đang chạy code tại thời điểm đó.
- **Task queue**: nơi các callback bất đồng bộ đã hoàn thành đứng chờ.
- **Event loop**: kiểm tra "call stack có trống không? Nếu có thì chạy callback tiếp theo từ queue."

Đó là lý do callback bất đồng bộ không bao giờ ngắt ngang code đang chạy.

## Các kiểu viết async: callback → Promise → async/await

### Callback (cách cũ)

```typescript
function fetchUser(id: number, callback: (user: { name: string }) => void): void {
  setTimeout(() => callback({ name: "Khoa" }), 500);
}

fetchUser(1, (user) => {
  console.log(user.name); // "Khoa"
});
```

Vấn đề: lồng callback vào nhau tạo ra "callback hell" — code thụt lề sâu, rất khó đọc và bảo trì.

### Promise

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

Promise chain liên tiếp và tách riêng luồng xử lý thành công và xử lý lỗi.

### async/await (cách hiện đại)

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

`async/await` là cú pháp bọc bên ngoài Promise — code trông như đồng bộ nhưng không chặn luồng. Đây là cách viết được khuyến khích hiện nay.

## Khi nào dùng cái gì?

- **Đồng bộ**: tính toán, xử lý dữ liệu, bất cứ thứ gì nhanh và không phụ thuộc tài nguyên bên ngoài.
- **async/await**: gọi API, đọc file, query database — mọi tác vụ I/O.
- **Callback**: event listener (`addEventListener`) — khi callback cần kích hoạt nhiều lần, không chỉ một lần.
- **Promise trực tiếp**: `Promise.all` hoặc `Promise.race` để chạy nhiều tác vụ bất đồng bộ song song.
