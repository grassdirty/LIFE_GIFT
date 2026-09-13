# Hướng dẫn kích hoạt bộ đếm LƯỢT XEM TOÀN CỤC
### (Google Apps Script + Google Sheets)

Bộ đếm lượt xem của trang `index.html` có **hai chế độ**:

- 🌐 **Toàn cục**: mọi người trên thế giới truy cập → số tăng lên, lưu chung trong **Google Sheets**.
- 📴 **Cục bộ**: chỉ đếm trên đúng máy/browser bạn đang dùng (lưu `localStorage`).

> **Cách hoạt động**: trang `index.html` gọi một **Google Apps Script Web App** (chạy miễn phí, không cần server). Web App này sẽ tăng số trong Google Sheets và trả về số mới cho trình duyệt.
>
> Nếu gọi web app **thất bại** (chưa cài đặt, hết mạng, URL sai...), trang tự động rơi về chế độ 📴 Cục bộ — **page không bao giờ lỗi**.

---

## 🔍 Hiện trạng: tại sao bây giờ chỉ đếm "Cục bộ"?

Mình đã kiểm tra (9/2026) và phát hiện:

1. ✅ Trang đã được đăng lên internet: `https://grassdirty.github.io/LIFE_GIFT/`
2. ✅ Code `index.html` **đã có sẵn** URL Apps Script và sẵn sàng chạy toàn cục.
3. ❌ Nhưng khi gọi thử URL Apps Script (ở chế độ khách, không đăng nhập),
   Google trả về trang **"Bạn cần quyền truy cập"** (request access) chứ **không** trả JSON.

**→ Nguyên nhân**: deployment đang đặt **"Ai có quyền truy cập: Chỉ mình tôi"** (Only myself).
Người khác không gọi được nên trang rơi về 📴 Cục bộ.

**→ Không cần sửa code.** Chỉ cần làm theo **CÁCH A** hoặc **CÁCH B** bên dưới.

---

## ✅ CÁCH A — Mở quyền "Bất kỳ ai" cho deployment hiện có (nhanh, ~5 phút)

> Làm theo cách này nếu bạn **biết tài khoản Google đã tạo** deployment
> (chính là tài khoản tạo bảng tính/script đang trả về URL `...AKfycby.../exec`).

1. Vào **https://script.google.com** bằng đúng tài khoản đó.
2. Ở danh sách **"Các dự án gần đây"**, mở dự án Apps Script của bạn
   (dự án chứa code giống file `AppsScript_Code.gs`).
3. Cột bên trái nhấn **Triển khai (Deploy) → Quản lý lần triển khai (Manage deployments)**.
4. Tìm dòng đang dùng, nhấn icon **✏️ Edit** (bút chì) ở góc phải.
5. Kéo xuống mục **"Ai có quyền truy cập"** (Who has access):
   - Chuyển thành **"Bất kỳ ai" (Anyone)** ✅
   - Giữ nguyên **"Thực thi với tư cách: Tôi (Me)"** ✅
6. Nhấn **Triển khai (Deploy)** → chọn phiên bản **New version** → nhấn
   **Cập nhật (Update)**.
7. Nếu Google hỏi cấp quyền: chọn tài khoản → **Nâng cao (Advanced)** →
   **Tới trang "..." (không an toàn)** → **Cho phép (Allow)**.

✅ **Xong!** URL trong `index.html` không đổi → **không cần push lại code**.
Trang live sẽ tự chạy toàn cục ngay sau đó.

---

## 🔁 CÁCH B — Tạo mới hoàn toàn (nếu không tìm được dự án cũ / muốn làm lại)

### Bước 1 — Tạo Google Sheets
1. Mở **https://sheets.new** → trình duyệt tự tạo một bảng tính mới.

### Bước 2 — Mở trình soạn thảo Apps Script
2. Trong bảng tính: menu **Tiện ích mở rộng (Extensions) → Apps Script**.
   ⚠️ Đừng dùng `script.new` (tạo script riêng lẻ) — phải mở từ bảng tính.

### Bước 3 — Dán code backend
3. Xóa nội dung mặc định, mở file **`AppsScript_Code.gs`** (trong thư mục NTDD)
   bằng Notepad/VS Code, **copy toàn bộ** rồi dán vào.
4. Nhấn **Ctrl + S** để lưu.

### Bước 4 — Triển khai Web App (⭐ quan trọng nhất)
5. Bấm **Triển khai (Deploy) → Triển khai mới (New deployment)**.
6. Bấm biểu tượng **bánh răng** cạnh **"Loại web ứng dụng" (Web app)**.
7. **Thực thi với tư cách (Execute as):** *Tôi (Me)*.
8. **Ai có quyền truy cập (Who has access):** *Bất kỳ ai (Anyone)* — ⚠️ *bắt buộc*,
   nếu chọn "Chỉ mình tôi" thì người khác không đếm được.
9. Bấm **Triển khai (Deploy)** → cấp quyền: chọn tài khoản → **Nâng cao** →
   **Tới trang "..." (không an toàn)** → **Cho phép (Allow)**.

### Bước 5 — Lấy URL
10. Sau khi triển khai, Copy địa chỉ dạng:
    `https://script.google.com/macros/s/XXXX/exec`

### Bước 6 — Dán URL vào index.html và đẩy lên GitHub
11. Mở `index.html`, tìm dòng:
    ```js
    const APPS_SCRIPT_URL = '...';
    ```
12. Thay bằng URL vừa copy:
    ```js
    const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/XXXX/exec';
    ```
13. Lưu file, commit và push lên GitHub (`main`) để GitHub Pages cập nhật.

---

## 🔍 Kiểm tra sau khi cài đặt

**Kiểm tra 1 — Test URL (cửa sổ ẩn danh/khách, không đăng nhập Google):**
mở địa chỉ:
```
https://script.google.com/macros/s/XXXX/exec?action=read
```
- ✅ Đúng → trả về JSON dạng: `{"ok":true,"total":5}`
- ❌ Sai → hiện trang "đăng nhập Google / yêu cầu quyền" nghĩa là chưa đặt **Anyone**.

**Kiểm tra 2 — Mở trang live ở cửa sổ ẩn danh:**
```
https://grassdirty.github.io/LIFE_GIFT/
```
- Hiện **🌐 Toàn cục** → thành công 🎉
- Hiện **📴 Cục bộ** → mở **F12 → Console**, đọc dòng `[counter] ...` để biết lý do.

**Kiểm tra 3 — Trong Google Sheets:** tự xuất hiện tab **`Counter`**
gồm `Tổng lượt xem | Hôm nay | Ngày | Lần truy cập gần nhất`, số tăng dần.

---

## 🆘 Bảng xử lý lỗi thường gặp

| Hiện tượng | Nguyên nhân | Cách xử lý |
|---|---|---|
| Luôn hiện "📴 Cục bộ", Sheets không có tab `Counter` | Deployment để "Chỉ mình tôi" hoặc chưa bấm "Cho phép" | Làm lại CÁCH A bước 5–7 (chọn **Bất kỳ ai** + bấm **Allow**) |
| Console báo "Script không liên kết với spreadsheet" | Tạo script qua `script.new` (đứng lẻ) | Tạo lại từ Google Sheets → Extensions → Apps Script |
| Sửa `.gs` xong mà web vẫn chạy code cũ | Google cache deployment cũ | Deploy → Manage deployments → Edit → chọn **New version** (hoặc thêm `?v=2` vào URL) |
| URL không kết thúc bằng `/exec` | Copy nhầm địa chỉ | Copy đúng địa chỉ Web App (bước 5) |
| Đổi `Content-Type` thành `application/json` | Trình duyệt gửi CORS preflight, Apps Script từ chối | Giữ nguyên `application/x-www-form-urlencoded` như code mặc định trong index.html |

---

## 📝 Ghi chú

- Bộ đếm tăng **1 mỗi lần truy cập** trang `index.html` (kể cả mở lại nhiều lần trong ngày).
- Giao thức tối đa ~ đồng thời cao, Apps Script gọi `LockService` để tránh chạm đua.
- Các file liên quan:
  - `index.html` — giao diện + gọi web app (frontend)
  - `AppsScript_Code.gs` — backend đếm (dán vào Apps Script)