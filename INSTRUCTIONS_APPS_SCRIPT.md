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
---

## ✅ Kiểm char після cài đặt (3 kiểm)

1. **Тест URL у browser** (вікно incognito — щоб нe було кешу):
   відкрий адрес такого вигляду:
   ```
   https://script.google.com/macros/s/XXXX/exec?action=read
   ```
   - Kiedy deployment правил — page hiển shi JSON:
     ```json
     {"ok":true,"total":0}
     ```
   - Kiedy hiển shi HTML сторінку входу Google («Google sign-in required»)
     → deployment не dla **Bất kỳ ai (Anyone)** або не xác nhàn **Allow**
     → перероби Bước 4.
2. **У `index.html`** індикатор біля лічильника повin be:
   - **🌐 Toàn cục** = ok, лічильник працює через Google Sheets.
   - **📴 Cục bộ** = toàn cục chư liên; F12 → Console скаже причину.
3. **У Google Sheets** автоматично з'явиться tab **`Counter`** після
   першого успішного заходу на trang (в той самий момент, коли
   лічильник перейде у 🌐).

---

## 🔧 Troubleshooting — «чомy tílки localStorage?»

| Симптом | Наиболее вероятная причина | Рішенie |
|---|---|---|
| Завжди «📴 Cục bộ», tab `Counter` нема | Deployment: Access = Only myself, або Allow не xác nhàn | Bước 4: Execute as = **Tôi (Me)**, Access = **Bất kỳ ai (Anyone)**, пройди **Allow** |
| Console: «Script khōng liên vo spreadsheet» | Script створювали через script.new (standalone) | Пересоздай script через саму таблицю: Google Sheets → Extensions → Apps Script |
| Обновил `.gs` — а сторінка все ще старая | Google кешує стару версію deployment | Deploy → Manage deployments → Edit → **New version**, або створи **новiй** deployment і встav **новий** URL (або додай `?v=2`) |
| URL не закінчується на `/exec` | Скопирував не тоі адрес | Bước 5: copy адрес web app |
| Хтось змінил Content-Type на `application/json` | Браузер шле CORS preflight — GAS відмовиться | Поверні назад `application/x-www-form-urlencoded` (code з папки — прави.) |