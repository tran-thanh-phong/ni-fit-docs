---
title: Nhập chương trình tập
parent: Dành cho PT
nav_order: 2
---

# Nhập chương trình tập từ Excel

Nếu bạn đã có lịch tập trong file Excel, không cần gõ lại từng bài. NiFit đọc file, dựng thành chương trình tập, rồi bạn kiểm tra và giao cho học viên.

Quy trình có 3 bước: **1 Nguồn** (chọn file) → **2 Ghép** (đối chiếu tên bài tập với thư viện) → **3 Xem lại & lưu**.

**Bạn cần có:**

- File Excel `.xlsx`, tối đa 5 MB. Bạn có thể dùng thử [file mẫu]({{ '/samples/plan-an-tap-mau.xlsx' | relative_url }}) (sheet **Lịch tập** là chương trình tập, sheet **Ăn uống** là thực đơn).
- Học viên đã được tạo ([xem hướng dẫn]({{ '/pt/tao-hoc-vien/' | relative_url }})).

## Bước 1. Bấm Nhập

Chọn **Chương trình tập** ở menu bên trái, bấm nút **Nhập** (①).

{% include shot.html dir="nhap-chuong-trinh-tap" desktop="01-danh-sach-chuong-trinh" phone="01-danh-sach-chuong-trinh-mobile" alt="Danh sách chương trình tập và nút Nhập" %}

## Bước 2. Mở màn hình nhập

Màn hình **Nhập chương trình tập** có hai cách đưa dữ liệu vào: **Tải lên Excel** hoặc **Dán văn bản**. Ở hướng dẫn này ta dùng Excel: kéo thả file vào khung ① hoặc bấm để chọn file.

{% include shot.html dir="nhap-chuong-trinh-tap" desktop="02-man-hinh-nhap" phone="02-man-hinh-nhap-mobile" alt="Màn hình nhập chương trình tập" %}

## Bước 3. Chọn sheet và cài đặt

Sau khi chọn file:

- ① Tên file, dung lượng và số sheet.
- ② **Sheet nào là chương trình tập?** Hệ thống gợi ý sheet phù hợp (nhãn **Phù hợp nhất**). Ở file mẫu, chọn **Lịch tập**.
- ③ **Kiểu lịch tập**: **Theo tuần** (các ngày cố định trong tuần, ví dụ T2-T3-T5-T6) hoặc **Theo chu kỳ** (chu kỳ lặp lại, không gắn với thứ trong tuần). Ở file mẫu, chọn **Theo tuần**.
- ④ **Ngày tập**: bấm vào từng thứ để bật/tắt (cần ít nhất một ngày). File mẫu có 4 ngày tập nên bật T2, T3, T5, T6.
- ⑤ **Hướng dẫn cho AI** (không bắt buộc, tối đa 4.000 ký tự): dặn thêm, ví dụ "Giữ nguyên ghi chú của HLV".

Bấm ⑥ **Tạo bản nháp →** ở góc dưới bên phải.

{% include shot.html dir="nhap-chuong-trinh-tap" desktop="03-chon-tep-va-cai-dat,03-chon-tep-va-cai-dat-2,03-chon-tep-va-cai-dat-3" phone="03-chon-tep-va-cai-dat-mobile,03-chon-tep-va-cai-dat-mobile-2,03-chon-tep-va-cai-dat-mobile-3" alt="Chọn sheet và cài đặt chương trình" %}

## Bước 4. Chờ tạo bản nháp

NiFit đọc sheet, dựng ngày, bài tập và set, rồi ghép tên bài tập với thư viện (①). Thường mất dưới một phút, tối đa 3 phút. **Hãy giữ tab này mở.**

{: .note }
Nút **Ngừng chờ** chỉ dừng việc chờ trên trang này. Hệ thống vẫn có thể hoàn tất lần tạo đó, và mỗi lần **Tạo** được tính phí một lần, nên đừng bấm Tạo liên tục.

{% include shot.html dir="nhap-chuong-trinh-tap" desktop="04-dang-tao-ban-nhap" phone="04-dang-tao-ban-nhap-mobile" alt="Đang tạo bản nháp" %}

## Bước 5. Ghép tên bài tập với thư viện

Mỗi bài trong file Excel cần khớp với một bài trong **Thư viện bài tập** để học viên thấy đúng hướng dẫn và lịch sử.

- ① Dòng tóm tắt cho biết bao nhiêu bài đã khớp, bao nhiêu cần xử lý. Ví dụ "28 bài tập · 27 đã ghép · 1 cần xử lý".
- ② Mục **Cần xử lý** liệt kê các bài chưa khớp kèm gợi ý. Ví dụ bài "Cable fly machine ( ngực dưới )" được gợi ý ghép với "Cable Fly". Nếu gợi ý chưa đúng, bấm **Ghép mục khác** để chọn bài khác.
- ③ Bấm **Áp dụng tất cả** để nhận mọi gợi ý, hoặc **Áp dụng** từng dòng.

Khi không còn mục nào cần xử lý, bấm **Tiếp tục xem lại →**.

{% include shot.html dir="nhap-chuong-trinh-tap" desktop="05-buoc-ghep-ten-bai-tap" phone="05-buoc-ghep-ten-bai-tap-mobile" alt="Bước ghép tên bài tập" %}

## Bước 6. Xem lại trước khi lưu

Chương trình mới **chưa được lưu** cho đến khi bạn bấm **Lưu chương trình**. Hãy kiểm tra kỹ:

- ① Thông báo **Đã nhập - xem lại trước khi lưu** nhắc bạn rà lại những gì lần nhập đã bỏ qua hoặc thay đổi.
- ② **Thiết lập chương trình**: tên, học viên, lịch tập (T2 T3 T5 T6), số tuần, thang đo RIR, đơn vị kg.
- ③ Các thẻ ngày (T2, T3, T5, T6).
- ④ **Chi tiết buổi** và bảng bài tập: số set, số rep (ví dụ 7-12 rep), RIR, thời gian nghỉ. Bạn có thể sửa trực tiếp, thêm bài hoặc xóa bài.

{% include shot.html dir="nhap-chuong-trinh-tap" desktop="06-xem-lai-truoc-khi-luu" phone="06-xem-lai-truoc-khi-luu-mobile" alt="Xem lại chương trình trước khi lưu" %}

## Bước 7. Giao cho học viên

Bấm **Sửa** ở khối **Thiết lập chương trình**, rồi mở ô **Học viên** và chọn học viên (①), ví dụ "Minh Anh Nguyễn". Nếu để **Chưa có học viên - lưu nháp**, chương trình được lưu nhưng chưa giao cho ai.

{% include shot.html dir="nhap-chuong-trinh-tap" desktop="07-chon-hoc-vien" phone="07-chon-hoc-vien-mobile" alt="Chọn học viên để giao chương trình" %}

## Bước 8. Đặt ngày bắt đầu và lưu

Chuyển sang thẻ **Lịch tập**, nhập ① **Ngày bắt đầu** (dạng `dd-MM-yyyy`). Bên dưới ô **Ngày kết thúc** có gợi ý theo số tuần (ví dụ "≈ 8 tuần → 13-12-2026"): bấm **Dùng** để nhận gợi ý, hoặc để trống. Cuối cùng bấm ② **Lưu chương trình**.

{% include shot.html dir="nhap-chuong-trinh-tap" desktop="08-ngay-bat-dau" phone="08-ngay-bat-dau-mobile,08-ngay-bat-dau-mobile-2" alt="Đặt ngày bắt đầu và lưu" %}

## Bước 9. Kiểm tra kết quả

Hệ thống báo **Đã tạo ...** rồi quay về danh sách. Chương trình mới ở dòng ① có trạng thái **Đang áp dụng** và hiện tên học viên.

{% include shot.html dir="nhap-chuong-trinh-tap" desktop="09-chuong-trinh-da-luu" phone="09-chuong-trinh-da-luu-mobile" alt="Chương trình đã lưu và giao" %}

## Tiếp theo

- [Nhập thực đơn từ Excel]({{ '/pt/nhap-thuc-don/' | relative_url }})
- [Dùng ứng dụng học viên thay học viên]({{ '/pt/pt-dung-app-hoc-vien/' | relative_url }}) để xem chương trình vừa giao.
