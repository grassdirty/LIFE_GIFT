# Hướng dẫn kích hoạt bộ đếm LƯỢT XEM toàn cục (Google Apps Script + Google Sheets)

Trang `index.html` của thư mục **NTDD** đã được bổ sung phần code đếm lượt xem.
- Khi chưa cài đặt bên dưới: bộ đếm chạy ở **chế độ cục bộ** (localStorage) —
  trang vẫn hiển thị số lượt xem trên chính thiết bị/trình duyệt của bạn.
- Muốn bộ đếm hoạt động **TOÀN CỤC** (đếm lượt xem của mọi người, lưu trên
  Google Sheets), hãy thực hiện một lần 6 bước sau (~5 phút).

---

## Bước 1 — Tạo Google Sheets
1. Mở **https://sheets.new** — trình duyệt sẽ tự tạo một bảng tính mới.

## Bước 2 — Mở trình soạn thảo Apps Script
2. Trong bảng tính: menu **「Tiện ích mở rộng」→「Apps Script」**.

## Bước 3 — Dán code Apps Script
3. Xóa toàn bộ nội dung mặc định trong trình soạn thảo, sau đó mở file
   **`AppsScript_Code.gs`** (trong thư mục NTDD) bằng Notepad/VS Code,
   copy **toàn bộ** rồi dán vào.
4. Nhấn **Ctrl+S** để lưu.

## Bước 4 — Triển khai dưới dạng Web App
5. Bấm nút **「Triển khai」**(Deploy) → **「Triển khai mới」**(New deployment).
6. Bấm biểu tượng bánh răng bên cạnh **「Loại web ứng dụng」**(Web app).
7. **Thực thi với tư cách:** *Tôi* (Me).
8. **Ai có quyền truy cập:** *Bất kỳ ai* (Anyone) — ⚠️ rất quan trọng!
9. Bấm **「Triển khai」**, khi hiện thông báo cấp quyền hãy xác nhận
   (menu **「Nâng cao」→「Tới trang ... (không an toàn)」→「Cho phép」**).

## Bước 5 — Sao chép URL
10. Sau khi triển khai xong, copy địa chỉ dạng:
    `https://script.google.com/macros/s/XXXX/exec`

## Bước 6 — Dán URL vào index.html
11. Mở `index.html` trong thư mục NTDD, tìm dòng:
    ```js
    const APPS_SCRIPT_URL = ''; // ex: https://script.google.com/macros/s/XXXX/exec
    ```
12. Dán địa chỉ đã copy vào:
    ```js
    const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/XXXX/exec';
    ```
13. Lưu file, mở lại `index.html` và làm mới trang — số lượt xem sẽ được
    cập nhật từ Google Sheets.

---

## Kiểm tra & ghi chú

- Bảng tính sẽ tự sinh sheet **`Counter`** với các cột:
  `Tổng lượt xem | Hôm nay | Ngày | Lần truy cập gần nhất`.
- Bộ đếm tăng **1** mỗi khi có người truy cập trang `index.html`, kể cả
  khi mở lại nhiều lần trong ngày.
- Nếu không có internet hoặc URL chưa đúng, `index.html` **tự động chuyển
  về chế độ localStorage** nên trang không bao giờ lỗi.
- Khi chỉnh sửa lại code Apps Script sau khi đã deploy: vào
  **「Triển khai」→「Quản lý lần triển khai」→ Edit** → chọn phiên bản
  **«Mới» (New version)** và cập nhật URL (hoặc thêm `?v=2` vào cuối URL)
  để tránh bị Google cache bản cũ.