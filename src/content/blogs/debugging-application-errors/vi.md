---
title: "Khi ứng dụng gặp lỗi thì em làm gì trước?"
description: "Khi ứng dụng gặp lỗi thì em làm gì trước?"
date: 2026-01-05
tags: ["short-post", "base-knowledge", "debugging"]
---

## Câu hỏi:

Khi ứng dụng gặp lỗi thì em làm gì trước? (Đo khả năng debug và tư duy logic.)

## Câu trả lời:

- Đầu tiên mình sẽ tìm đoạn lỗi đó bằng cách đặt log ở trong luồng chạy của ứng dụng để kiểm tra xem lỗi đó nằm ở khối code nào.

- Mình sẽ chia code ra làm nhiều block khác nhau, sau đó kiểm tra từng block một. Ví dụ ở đây mình có 3 block code và 2 block kiểm tra chắc chắn đúng, thì vấn đề sẽ nằm ở block còn lại.

- Sau khi tìm được block code bị lỗi. Mình sẽ tiếp tục thêm những log nữa chi tiết hơn và khi chạy ứng dụng, code sẽ chạy log đó để kể chi tiết mình cách mà hiện tại code vận hành, chạy bước tiếp theo ra điều gì, từ đó mình sẽ bắt được logic code đó lỗi ở đoạn nào ra sai kết quả. Đó là để code story telling cho mình cách đoạn mã chạy như nào.

- Điều đó sẽ khiến mình xác định được bug nằm ở đâu. Có thể lỗi logic, lỗi race condition khi 2 khối code chạy song song và một khối code chạy trước nhưng lại sai với ý định ban đầu của mình là đợi kết quả của khối còn lại chạy.

Tránh nên làm khi debug:

- Đọc toàn bộ code. Điều này khiến dễ bỏ sót lỗi nhỏ khó thấy và mệt mỏi.

- Có lý thuyết nhưng ở dạng đoán mò chưa kiểm chứng.

- Sửa lỗi ngay khi chưa hiểu bug cũ, có khả năng tạo bug mới.

- Không log. Không biết code chạy thế nào.

