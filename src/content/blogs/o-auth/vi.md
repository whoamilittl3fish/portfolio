---
title: "OAuth là gì và làm được gì? Luồng hoạt động?"
description: "Định nghĩa OAuth thường sử dụng rất nhiều nhưng chưa chắc đã hiểu rõ luồng hoạt động như nào, và tại sao lại dùng OAuth."
date: 2026-01-15
tags: ["OAuth, base-knowledge, short-post"]
---

# OAuth là gì?

OAuth là một chuẩn mở quy định luồng uỷ quyền (authorization flow) giữa các hệ thống. Ứng dụng/web có thể lấy token để uỷ quyền truy cập, tài nguyên của người dùng từ hệ thống khác mà ứng dụng/web cần mà không cần biết mật khẩu của người dùng. Thay vì yêu cầu ứng dụng bên thứ ba lưu trữ thông tin đăng nhập của người dùng, OAuth cho phép người dùng cấp quyền trực tiếp, và ứng dụng chỉ nhận được một access token đại diện cho quyền truy cập đó.

# OAuth dùng để làm gì?

Ví dụ như google calendar, google drive, gmail.

Gmail thì chúng ta sẽ gặp Outlook chẳng hạn trên Windows, chúng ta sẽ đăng nhập vào google sau đó cấp quyền truy cập về gmail, tạo mới, chỉnh sửa, xoá, ... cho Outlook thay vì đưa thông tin đăng nhập cho Outlook.

Ứng dụng cần truy cập thông qua API của google để có thể tương tác với tài nguyên, và ứng dụng/web hiện tại cần có token để uỷ quyền và phạm vi quyền hạn của mình đối với tài nguyên đó của người dùng. Điều này cần phương thức để lấy token này qua các bước.

Chúng ta sẽ đi qua OAuth 2.0, tiêu chuẩn mới thay thế hoàn toàn version 1.0 (phức tạp trong quy trình trao đổi, hạn chế quy trình triển khai mặc dù an toàn).

Web (Javascript) từ ứng dụng trên máy của khách (client):

![Google OAuth 2.0 communicate](/asssets/blogs/o-auth/1.pgn)

# Các bước:

- Đầu tiên khi người dùng truy cập vào ứng dụng/ web cần tài nguyên từ google, ứng dùng này sẽ gửi một `Authorization request` tới google servers, trong request này còn gồm có thông tin người dùng nào, tài nguyên nào mà ứng dụng cần để truy cập.

- User đăng nhập vào Google để Google xác thực danh tính (authentication) của người dùng.

- Sau khi người dùng đăng nhập sẽ thấy màn hình ứng dụng cần quyền nào từ google, sau đó xác nhận mình cấp quyền cho ứng dụng/web.

- Google đã biết người dùng cho truy cập tài nguyên, gửi ngược lại `Authorization code` (còn gọi là `exchange code`) và xem như bằng chứng tôi đã đươc người dùng cấp quyền truy cập những tài nguyên cho ứng dụng. Trong đó có chứa exchange code, bằng chứng.

- `Authorization code` dùng làm bằng chứng để bắt đầu trao đổi token quan trọng nhất, `access token` để truy cập tài nguyên. Ứng dụng sẽ gửi tới google bằng chứng cùng code trao đổi token cuối cùng này, và nhận về `access token`.

- Bây giờ đã có `access token`, dùng kèm theo để gọi API tương tác với tài nguyên với các quyền đã được cấp.

## Trong đó:

- Authorization request: xin quyền truy cập được tài nguyên ứng dụng cần, đợi người dùng xác thực.

- Authorization code (exchange code): dùng để làm bằng chứng người dùng đã cấp những quyền cho tài nguyên, và không chứa thông tin truy cập vào tài nguyên.

- Access token: token này mới là nơi ứng dụng sử dụng truy cập tài nguyên với quyền được cấp.

- Resource Owner: người dùng (bạn).

- Client: ứng dụng/web của bên thứ ba.

- Authorization Server: server cấp token (Google OAuth Server).

- Resource Server: server chứa tài nguyên (Google Drive API, Gmail API, ...).


## Lưu ý:

- Authorization và Authentication khác nhau.

- Authorization là cấp quyền, Authentication là xác thực.

# Nguồn:

[Sử dụng OAuth 2.0 để truy cập API google](https://developers.google.com/identity/protocols/oauth2?hl=vi#1.-obtain-oauth-2.0-credentials-from-the-dynamic_data.setvar.console_name.)