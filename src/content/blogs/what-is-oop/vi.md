---
title: "OOP là gì? - Lập trình hướng đối tượng được giải thích"
description: "OOP là gì? Lập trình hướng đối tượng là một mô hình lập trình cơ bản tổ chức code theo cách có cấu trúc bởi các đối tượng."
date: 2026-01-05
tags: ["short-post", "base-knowledge", "oop"]
---

## Câu hỏi:

OOP là gì? (Kiến thức căn bản)

## Câu trả lời:

OOP là Object-oriented programming (lập trình hướng đối tượng). Nghĩa là cách tổ chức code có cấu trúc theo từng đối tượng.

- Lấy ví dụ đơn giản như khi có một đối tượng là người dùng: `user` sẽ có các hàm và thuộc tính như: `login()`, `name`, `payBy()`.

- Nếu chúng ta không tổ chức cái này theo đối tượng, code sẽ trộn lẫn vào nhau (coupling), điều này gây khó bảo trì code, sửa code lại và cũng khó đọc code hơn.

- Nếu như cấu trúc lại với một `user` sẽ có:

```typescript

class user {
    userName: string;
    login() {}
    payBy(whichBank: string) {
        if (whichBank === "momo")
        ...
    }
}

```

thì khi gọi hàm sẽ là `user.userName = Khoa`, `user.login()`.

### Encapsulation (Tính đóng gói)

Code lúc này dễ đọc hơn và các function này của riêng đối tượng đó và chỉ để lộ các thành phần cần sử dụng đưa ra ngoài. Do đó logic trong đối tượng sẽ được bảo vệ và không bị bên ngoài thay đổi.

- Lớp con có thể sử dụng lại lớp cha và giảm lặp code:

```typescript

class engine {
    howManyOilPerKm() {}
}

class car {
    engine: engine;
    run() {}
}
```

Mặc dù giảm lặp code nhưng điều này cũng có khả năng code bị phụ thuộc vào nhau và khi thay đổi lớp cha, lớp con sẽ bị vỡ.

### Polymorphism (Tính đa hình)

Ví dụ của tính đa hình như phép cộng, chúng ta có một hàm add() đơn giản, nhưng khi ta điền tham số vào a.add(b) với b là số thực, số nguyên, phân số, thì object sẽ tự hiểu và làm phép toán cộng. Đây là chính là tính đa hình. Nhưng không đồng nghĩa với việc sử dụng if () và else(). Cụ thể:

```typescript
interface Add {
    sum(first: number, second: number): number;
}

class AddNumber implements Add {
    sum(first: number, second: number): number {
        return Math.round(first + second);
    }
}

class AddFloat implements Add {
    sum(first: number, second: number): number {
        return first + second;
    }
}

function addThreeArgument(adder: Add, first: number, second: number, third: number): number {
    return adder.sum(adder.sum(first, second), third);
}

const numberAdder = new AddNumber();
const floatAdder = new AddFloat();

addThreeArgument(numberAdder, 1, 2, 3);
addThreeArgument(floatAdder, 1.1, 2.2, 3.3);
```

Đơn giản là sẽ tạo nhiều hình mẫu cho một đối tượng, đối tượng sẽ tự chọn tuỳ theo type mà không cần kiểm tra.

Việc này cũng giúp dễ đưa log vào kiểm tra xem lỗi thực sự nằm ở class nào, vì nếu dùng if else thì code sẽ có logic coupling với nhau và khó mock test hơn.

