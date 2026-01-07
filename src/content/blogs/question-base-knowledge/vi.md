---
title: "Một số câu hỏi kiểm tra kiến thức của bản thân"
description: "Những câu hỏi về kiến thức nền nên biết và hay được hỏi bởi nhà tuyển dụng. Và bạn có thể tự đặt câu hỏi để kiểm tra kiến thức bản thân nằm ở mức nào và tự trả lời để bớt lúng túng khi được hỏi. Tôi sẽ cập nhật những câu hỏi này nhiều hơn."
date: 2026-01-05
tags: ["short-post", "base-knowledge"]
---

Mình viết blog này để sau này sẽ ghi lại những câu hỏi kiểm tra xem kiến thức bản thân mình ở đâu và tự trả lời câu hỏi này để nhớ kỹ, và mình cũng nghĩ đây là những câu hỏi phổ biến nhà tuyển dụng sẽ hỏi.

Mình sẽ cập nhật các câu hỏi và câu trả lời của mình ở đây, nếu có gì sai sót mong bạn có thể đóng góp và nhắc nhở để cùng nhau học.

## Câu hỏi 1: 

Khi ứng dụng gặp lỗi thì em làm gì trước? (Đo khả năng debug và tư duy logic.)

### Câu trả lời:

- Đầu tiên mình sẽ tìm đoạn lỗi đó bằng cách đặt log ở trong luồng chạy của ứng dụng để kiểm tra xem lỗi đó nằm ở khối code nào.

- Mình sẽ chia code ra làm nhiều block khác nhau, sau đó kiểm tra từng block một. Ví dụ ở đây mình có 3 block code và 2 block kiểm tra chắc chắn đúng, thì vấn đề sẽ nằm ở block còn lại.

- Sau khi tìm được block code bị lỗi. Mình sẽ tiếp tục thêm những log nữa chi tiết hơn và khi chạy ứng dụng, code sẽ chạy log đó để kể chi tiết mình cách mà hiện tại code vận hành, chạy bước tiếp theo ra điều gì, từ đó mình sẽ bắt được logic code đó lỗi ở đoạn nào ra sai kết quả. Đó là để code story telling cho mình cách đoạn mã chạy như nào.

- Điều đó sẽ khiến mình xác định được bug nằm ở đâu. Có thể lỗi logic, lỗi race condition khi 2 khối code chạy song song và một khối code chạy trước nhưng lại sai với ý định ban đầu của mình là đợi kết quả của khối còn lại chạy.

Tránh nên làm khi debug:

- Đọc toàn bộ code. Điều này khiến dễ bỏ sót lỗi nhỏ khó thấy và mệt mỏi.

- Có lý thuyết nhưng ở dạng đoán mò chưa kiểm chứng.

- Sửa lỗi ngay khi chưa hiểu bug cũ, có khả năng tạo bug mới.

- Không log. Không biết code chạy thế nào.

## Câu hỏi 2: 

Gitflow, Github flow, Gitlab flow là gì, khác nhau như nào? (Kiểm tra khả năng làm việc nhóm với công cụ Git, tất nhiên khi làm chung một dự án thì sử dụng Git thành thạo là việc cần có.)

### Câu trả lời:

Các cách làm việc với Git thường thấy là Gitflow, Github flow, Gitlab flow. Mình sẽ gọi nhánh main (hoặc master) là main.

#### Gitflow:

- Là cách cổ điển chia dự án ra làm nhiều phần. Trong đó có 3 loại chính là main/production/release, develop, feature/hot-fix.

- Trong đó, main là nhánh chính, thường do người quản lý dự án quản lý nhánh này khi merge từ develop. Và có thể thêm một nhánh mới là production/release theo phiên bản.

- Tiếp theo là nhánh develop, đây là nhánh mọi người trong team sẽ làm việc với nhau, mọi tính năng mới sẽ được merge vào nhánh này, có thể dùng để đưa lên staging kiểm tra trước khi ra mắt chính thức trên production trên nhánh main.

- Cuối cùng là feature/. Thường đây là nhánh mà các devs sẽ tạo ra kèm tên với một tính năng mới, phát triển trong nhánh này, sau đó sẽ rebase lên develop trước khi merge và merge vào sau khi review code và hoàn chỉnh.

- Ngoài ra khi có lỗi thì sẽ có một nhánh hot-fix dùng để giải quyết bug lớn kịp thời khi production bị lỗi, sau khi hoàn thành sẽ được merge vào cả production/main/release và develop.

**Ưu nhược điểm:**

- Môi trường chi tiết, quy trình làm việc rõ ràng hơn.

- Phức tạp khi có nhiều môi trường và khi có càng nhiều nhánh thì khi merge càng dễ conflict hơn. :D Đây là điều mọi người sẽ khá quan ngại.

- CI/CD khó hơn, vì có cả production/release cho main, rồi dev cho staging. 

#### Github flow:

- Cách này nhanh hơn so với Gitflow, chỉ còn một nhánh main và các nhánh feature, hot-fix. Nhánh main sẽ là nhánh chính và mọi người làm việc xung quanh nó.

**Ưu nhược điểm:**

- Cách này giảm thiểu quy trình phức tạp của Gitflow nhưng đồng thời phiên bản sau khi merge sẽ là production/release thay vì có giai đoạn staging để kiểm tra.

- Dễ CI/CD hơn (nhánh main).

#### Gitlab flow:

- Đây là quy trình kết hợp cả hai Gitflow và Githubflow (hybrid). Tuỳ vào quy chuẩn của mọi người trong team. Thường cũng sẽ có main, feature, staging, production/release.

- Quy trình này có thể là:

`feature -> main -> staging -> release`

hoặc

`feature -> main -> release/1.0 -> production`

**Ưu điểm:**

- Linh hoạt hơn.

- Phù hợp với cả CI/CD.

- Môi trường rõ ràng đâu là (dev, staging, production).

## Câu hỏi 3: 

OOP là gì? (Kiến thức căn bản)

### Câu trả lời:

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

#### Encapsulation (Tính đóng gói)

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

#### Polymorphism (Tính đa hình)

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

## Mình còn 3 câu hỏi nữa:
- Liên quan tới SQL là SELECT, WHERE, JOIN.
- REST API là gì ?
- Mảng (array) và danh sách liên kết (linked list). So sánh stack và queue.
