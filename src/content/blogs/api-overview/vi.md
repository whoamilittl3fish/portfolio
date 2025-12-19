---
title: "API & Microservice"
description: "Hiểu cách API và microservices giao tiếp qua request và response."
date: 2025-11-10
tags: ["API", "short-post"]
---

API có thể là command, function, object… nhưng chung quy là **nhận request – trả response** để thực hiện một việc, mà chúng ta không cần biết bên trong nó làm gì. Chỉ cần biết **input, output và cách dùng**.

API thường trả về **dữ liệu thuần (pure data)**, không phải giao diện. Việc hiển thị hay xử lý tiếp do ứng dụng xử lý.

Trong ứng dụng lớn, nhiều server nhỏ giao tiếp qua API. Những server này làm các tác vụ nhỏ, độc lập gọi là **microservice** — nhận input, xử lý, trả output, giống một module riêng.

Tóm lại:

**Mỗi chức năng nhỏ có thể coi như một mini-app, cung cấp các thao tác như thêm, xoá, sửa dữ liệu — đó chính là API.**

![API Overview Diagram](/assets/blogs/api-overview/1.png)

