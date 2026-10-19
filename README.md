# ni-fit-docs

Tài liệu hướng dẫn sử dụng NiFit (tiếng Việt) cho người dùng cuối. Site Jekyll + [Just the Docs](https://just-the-docs.com/), publish bằng GitHub Pages. Cùng kiểu với `gp-knowledge-base`.

## Cấu trúc

| Đường dẫn | Nội dung |
|---|---|
| `index.md`, `pt/*.md` | Các trang hướng dẫn |
| `_includes/shot.html` | Chèn nhóm ảnh cho một bước (ảnh máy tính + ảnh điện thoại) |
| `assets/images/<flow>/` | Ảnh chụp có vòng số đỏ, do `capture/` sinh ra |
| `samples/plan-an-tap-mau.xlsx` | File Excel mẫu dùng trong hướng dẫn (sheet "Lịch tập" và "Ăn uống") |
| `capture/` | Script Playwright chụp màn hình trên môi trường Test |

## Viết hoặc sửa một trang

Mỗi bước dùng một include. Số ①②③ trong chữ phải khớp số trên ảnh:

```liquid
{% raw %}{% include shot.html dir="tao-hoc-vien" desktop="02-dien-form,02-dien-form-2" phone="02-dien-form-mobile" alt="..." %}{% endraw %}
```

- `desktop` / `phone`: tên file không có `.png`, cách nhau bằng dấu phẩy. Một bước dài được chia thành nhiều ảnh (`-2`, `-3`).
- `mode="phone"`: dùng cho ứng dụng học viên (chỉ có ảnh điện thoại, hiện thẳng, không gấp).

Kiểm tra ảnh được tham chiếu có tồn tại:

```bash
node capture/check-doc-images.mjs
```

## Chụp lại ảnh

Yêu cầu: môi trường Test đang chạy (`node scripts/deploy-test.mjs scale 1` trong repo `ni-fit-mvp`, xong việc thì `scale 0`), và file `ni-fit-mvp/frontend/apps/admin-v2/.env.test` có mật khẩu tài khoản `nifit_pta` (script chỉ đọc, không in ra).

```bash
cd capture
npm install
npx playwright install chromium   # lần đầu

node flows/01-tao-hoc-vien.mjs
node flows/02-nhap-chuong-trinh-tap.mjs
node flows/03-nhap-thuc-don.mjs
node flows/04-pt-dung-app-hoc-vien.mjs
```

Mỗi flow tự đăng nhập, thao tác thật trên Test, và với mỗi bước chụp hai khung hình (máy tính 1280px, điện thoại 390px) có vòng số đỏ (`lib/shot.mjs`). Dữ liệu mẫu nằm ở `lib/demo-data.mjs` (học viên "Minh Anh Nguyễn").

### Chạy lại khi dữ liệu đã tồn tại

Test không xóa cứng được user, và plan đã có buổi tập thì không xóa được. Các biến môi trường và script dọn dẹp:

| Tình huống | Cách xử lý |
|---|---|
| Học viên `minh.anh` đã có | `REUSE_CLIENT=1 node flows/01-tao-hoc-vien.mjs` (không bấm Tạo), hoặc đặt `DEMO_SUFFIX=.2` để tạo học viên mới |
| Chương trình tập demo đã có | `REUSE_PLAN=1 node flows/02-nhap-chuong-trinh-tap.mjs` (không lưu lại, chụp danh sách) |
| Thực đơn demo đã có | `ONLY=meal-plan node cleanup-demo-plans.mjs` (gỡ giao + xóa) rồi chạy lại flow 03 |
| Buổi tập dở của học viên demo | `node cleanup-demo-session.mjs` rồi chạy lại flow 04 |
| Học viên demo từ các lần chụp trước | `node cleanup-stale-demo-clients.mjs` (đổi tên cho dễ nhận) |

### Bước AI (Generate)

Flow 02 và 03 gọi AI của Test. Khi Test hết credit Gemini (đã xảy ra 2026-10-19: `Your prepayment credits are depleted`), flow dùng `lib/ai-stub.mjs`: dựng bản nháp từ chính các dòng trong file Excel mẫu và thư viện thật trên Test, rồi trả về như kết quả của AI. Các bước sau đó (ghép tên, xem lại, lưu, giao) vẫn chạy thật trên backend.

Khi đã nạp lại credit, chụp lại với AI thật: `LIVE_AI=1 node flows/02-nhap-chuong-trinh-tap.mjs` (đáp án AI được cache vào `capture/.cache/*.har` để lần chụp sau không tốn tiền; `HAR_REFRESH=1` để gọi lại).

## Publish

1. Tạo repo trên GitHub rồi push nhánh `main`.
2. Settings → Pages → Source: **Deploy from a branch** → `main` / root.
3. Site tại `https://<tài khoản>.github.io/ni-fit-docs/`. Đổi `baseurl` trong `_config.yml` nếu dùng domain riêng.

GitHub Pages (gói miễn phí) chỉ publish repo **public**; repo private cần gói trả phí.

## Xem thử trên máy

Cần Docker:

```bash
docker run --rm -v "$PWD:/site" -w /site -p 4000:4000 ruby:3.2 \
  sh -c "bundle install && bundle exec jekyll serve --host 0.0.0.0"
```
