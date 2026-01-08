---
title: "Gitflow, Github flow và Gitlab flow - Hiểu về Git Workflows"
description: "Gitflow, Github flow, Gitlab flow là gì, khác nhau như nào?"
date: 2026-01-05
tags: ["short-post", "base-knowledge", "git"]
---

## Câu hỏi:

Gitflow, Github flow, Gitlab flow là gì, khác nhau như nào? (Kiểm tra khả năng làm việc nhóm với công cụ Git, tất nhiên khi làm chung một dự án thì sử dụng Git thành thạo là việc cần có.)

## Câu trả lời:

Các cách làm việc với Git thường thấy là Gitflow, Github flow, Gitlab flow. Mình sẽ gọi nhánh main (hoặc master) là main.

### Gitflow:

- Là cách cổ điển chia dự án ra làm nhiều phần. Trong đó có 3 loại chính là main/production/release, develop, feature/hot-fix.

- Trong đó, main là nhánh chính, thường do người quản lý dự án quản lý nhánh này khi merge từ develop. Và có thể thêm một nhánh mới là production/release theo phiên bản.

- Tiếp theo là nhánh develop, đây là nhánh mọi người trong team sẽ làm việc với nhau, mọi tính năng mới sẽ được merge vào nhánh này, có thể dùng để đưa lên staging kiểm tra trước khi ra mắt chính thức trên production trên nhánh main.

- Cuối cùng là feature/. Thường đây là nhánh mà các devs sẽ tạo ra kèm tên với một tính năng mới, phát triển trong nhánh này, sau đó sẽ rebase lên develop trước khi merge và merge vào sau khi review code và hoàn chỉnh.

- Ngoài ra khi có lỗi thì sẽ có một nhánh hot-fix dùng để giải quyết bug lớn kịp thời khi production bị lỗi, sau khi hoàn thành sẽ được merge vào cả production/main/release và develop.

**Ưu nhược điểm:**

- Môi trường chi tiết, quy trình làm việc rõ ràng hơn.

- Phức tạp khi có nhiều môi trường và khi có càng nhiều nhánh thì khi merge càng dễ conflict hơn. :D Đây là điều mọi người sẽ khá quan ngại.

- CI/CD khó hơn, vì có cả production/release cho main, rồi dev cho staging.

### Github flow:

- Cách này nhanh hơn so với Gitflow, chỉ còn một nhánh main và các nhánh feature, hot-fix. Nhánh main sẽ là nhánh chính và mọi người làm việc xung quanh nó.

**Ưu nhược điểm:**

- Cách này giảm thiểu quy trình phức tạp của Gitflow nhưng đồng thời phiên bản sau khi merge sẽ là production/release thay vì có giai đoạn staging để kiểm tra.

- Dễ CI/CD hơn (nhánh main).

### Gitlab flow:

- Đây là quy trình kết hợp cả hai Gitflow và Githubflow (hybrid). Tuỳ vào quy chuẩn của mọi người trong team. Thường cũng sẽ có main, feature, staging, production/release.

- Quy trình này có thể là:

`feature -> main -> staging -> release`

hoặc

`feature -> main -> release/1.0 -> production`

**Ưu điểm:**

- Linh hoạt hơn.

- Phù hợp với cả CI/CD.

- Môi trường rõ ràng đâu là (dev, staging, production).

