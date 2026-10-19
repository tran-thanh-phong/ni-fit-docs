---
title: Nhập thực đơn
parent: Dành cho PT
nav_order: 3
---

# Nhập thực đơn từ Excel

Giống như chương trình tập, bạn có thể đưa thực đơn từ file Excel vào NiFit. Quy trình cũng có 3 bước: **1 Nguồn** → **2 Ghép** (đối chiếu tên món với thư viện) → **3 Xem lại & lưu**.

**Bạn cần có:**

- File Excel `.xlsx`, tối đa 5 MB. Dùng thử [file mẫu]({{ '/samples/plan-an-tap-mau.xlsx' | relative_url }}): sheet **Ăn uống** là thực đơn một ngày tập (Sáng, Trưa, Trước tập, Tối và thực phẩm bổ sung).
- Học viên đã được tạo ([xem hướng dẫn]({{ '/pt/tao-hoc-vien/' | relative_url }})).

## Bước 1. Bấm Nhập

Chọn **Thực đơn** ở menu bên trái, bấm nút **Nhập** (①).

{% include shot.html dir="nhap-thuc-don" desktop="01-danh-sach-thuc-don" phone="01-danh-sach-thuc-don-mobile" alt="Danh sách thực đơn và nút Nhập" %}

## Bước 2. Mở màn hình nhập

Kéo thả file `.xlsx` vào khung ① hoặc bấm để chọn file.

{% include shot.html dir="nhap-thuc-don" desktop="02-man-hinh-nhap" phone="02-man-hinh-nhap-mobile" alt="Màn hình nhập thực đơn" %}

## Bước 3. Chọn sheet và gửi hướng dẫn cho AI

- ① Tên file, dung lượng và số sheet.
- ② **Sheet nào là thực đơn?** Chọn **Ăn uống** (nhãn **Thực đơn?**).
- ③ **Hướng dẫn cho AI** (không bắt buộc): dặn thêm, ví dụ "Sheet này là thực đơn một ngày tập".

Bấm ④ **Tạo bản nháp →**.

{% include shot.html dir="nhap-thuc-don" desktop="03-chon-tep-va-sheet,03-chon-tep-va-sheet-2" phone="03-chon-tep-va-sheet-mobile,03-chon-tep-va-sheet-mobile-2" alt="Chọn sheet thực đơn" %}

## Bước 4. Chờ tạo bản nháp

NiFit đọc sheet, dựng các bữa ăn và ghép tên món với thư viện (①). Thường mất dưới một phút. **Hãy giữ tab này mở** và đừng bấm Tạo liên tục, vì mỗi lần Tạo được tính phí một lần.

{% include shot.html dir="nhap-thuc-don" desktop="04-dang-tao-ban-nhap" phone="04-dang-tao-ban-nhap-mobile" alt="Đang tạo bản nháp thực đơn" %}

## Bước 5. Ghép tên món với thư viện

Mỗi thực phẩm hoặc thực phẩm bổ sung trong file cần khớp với **Thực phẩm & bổ sung** trong thư viện.

- ① Dòng tóm tắt, ví dụ "14 tên · 13 đã ghép · 1 cần xử lý".
- ② Với mục còn lại, ví dụ "Creatine" được gợi ý ghép với "Creatine Monohydrate". Bấm **Áp dụng tất cả** để nhận gợi ý, hoặc **Ghép mục khác** để chọn món khác trong thư viện.

Nếu tên món chưa có trong thư viện, bạn tạo mới ngay tại đây và chọn **đơn vị** (g, ml, quả, hộp...). Xong thì bấm **Tiếp tục xem lại →**.

{% include shot.html dir="nhap-thuc-don" desktop="05-buoc-ghep-ten-mon" phone="05-buoc-ghep-ten-mon-mobile" alt="Bước ghép tên món" %}

## Bước 6. Xem lại trước khi lưu

Thực đơn **chưa được lưu** cho đến khi bạn bấm **Lưu thực đơn**.

- ① Thông báo **Đã nhập - xem lại trước khi lưu**.
- ② **Thiết lập chương trình**: tên thực đơn, học viên, ngày áp dụng, hướng dẫn.
- ③ Danh sách bữa: Bữa 1 Sáng, Bữa 2 Trưa, Bữa 3 Trước tập, Bữa 4 Tối, Bữa 5 Thực phẩm bổ sung. Bấm vào một bữa để mở các món.
- ④ Nút **Lưu thực đơn**.

{% include shot.html dir="nhap-thuc-don" desktop="06-xem-lai-truoc-khi-luu" phone="06-xem-lai-truoc-khi-luu-mobile,06-xem-lai-truoc-khi-luu-mobile-2" alt="Xem lại thực đơn trước khi lưu" %}

## Bước 7. Kiểm tra từng bữa ăn

Mở một bữa để xem và sửa: ① từng món (ví dụ **Cơm**), ② cột **Số lượng · Đơn vị** (ví dụ 100 g). Bạn có thể đổi số lượng, thêm ghi chú, thêm hàng hoặc xóa hàng.

{% include shot.html dir="nhap-thuc-don" desktop="07-kiem-tra-bua-an" phone="07-kiem-tra-bua-an-mobile" alt="Kiểm tra từng bữa ăn" %}

## Bước 8. Đặt tên thực đơn

Bấm **Sửa** ở **Thiết lập chương trình**. Ở thẻ **Chi tiết**, kiểm tra ① **Tên thực đơn**.

{% include shot.html dir="nhap-thuc-don" desktop="08-ten-thuc-don" phone="08-ten-thuc-don-mobile" alt="Đặt tên thực đơn" %}

## Bước 9. Chọn học viên

Chuyển sang thẻ **Lịch**, mở ô **Học viên** và chọn học viên (①), ví dụ "Minh Anh Nguyễn".

{% include shot.html dir="nhap-thuc-don" desktop="09-chon-hoc-vien" phone="09-chon-hoc-vien-mobile" alt="Chọn học viên cho thực đơn" %}

## Bước 10. Đặt ngày bắt đầu và lưu

Nhập ① **Ngày bắt đầu** (dạng `dd-MM-yyyy`), rồi bấm ② **Lưu thực đơn**. Thực đơn được lưu và giao cho học viên cùng lúc.

{% include shot.html dir="nhap-thuc-don" desktop="10-ngay-bat-dau" phone="10-ngay-bat-dau-mobile,10-ngay-bat-dau-mobile-2" alt="Đặt ngày bắt đầu và lưu thực đơn" %}

## Bước 11. Kiểm tra kết quả

Hệ thống báo **Đã cập nhật và giao ...**. Thực đơn mới ở dòng ① có trạng thái **Đang áp dụng**, hiện tên học viên và ngày bắt đầu.

{: .note }
Danh sách thực đơn mặc định ẩn các mục đã lưu trữ (nhãn **Đang ẩn mục đã lưu trữ**). Bấm **Xóa bộ lọc** nếu muốn xem tất cả.

{% include shot.html dir="nhap-thuc-don" desktop="11-thuc-don-da-luu" phone="11-thuc-don-da-luu-mobile" alt="Thực đơn đã lưu và giao" %}

## Tiếp theo

- [Dùng ứng dụng học viên thay học viên]({{ '/pt/pt-dung-app-hoc-vien/' | relative_url }}) để xem thực đơn học viên nhìn thấy.
