---
title: Tạo học viên mới
parent: Dành cho PT
nav_order: 1
---

# Tạo học viên mới

PT tạo tài khoản cho học viên trên **Cổng quản trị**. Sau khi có học viên, bạn có thể giao chương trình tập và thực đơn cho họ.

**Bạn cần có:** tài khoản PT, và thông tin của học viên (tên, email, số điện thoại nếu có).

## Bước 1. Mở danh sách học viên

Đăng nhập Cổng quản trị, chọn **Học viên** ở menu bên trái. Bấm nút **Thêm học viên** (①) ở góc trên bên phải.

{% include shot.html dir="tao-hoc-vien" desktop="01-danh-sach-hoc-vien" phone="01-danh-sach-hoc-vien-mobile" alt="Danh sách học viên và nút Thêm học viên" %}

## Bước 2. Điền thông tin học viên

Màn hình **Học viên mới** có hai khối thông tin:

**Tài khoản** - thông tin để học viên đăng nhập ứng dụng:

- ① **Tên đăng nhập**: không dấu, ví dụ `minh.anh`.
- ② **Email**: ví dụ `minh.anh@example.com`.
- ③ **Mật khẩu** và **Xác nhận mật khẩu**: ít nhất 8 ký tự. Có thể để trống nếu học viên sẽ đăng nhập bằng Google.

**Cá nhân** - hiển thị trên hồ sơ của học viên:

- ④ **Tên**: ví dụ `Minh Anh`.
- ⑤ **Họ**: ví dụ `Nguyễn`.
- ⑥ **Số điện thoại** (không bắt buộc): ví dụ `+84 901 234 567`.
- ⑦ **Huấn luyện viên**: chọn chính bạn để học viên nằm trong danh sách của bạn.

Cuối trang bấm ⑧ **Tạo học viên**.

{% include shot.html dir="tao-hoc-vien" desktop="02-dien-form,02-dien-form-2,02-dien-form-3" phone="02-dien-form-mobile,02-dien-form-mobile-2,02-dien-form-mobile-3" alt="Form điền thông tin học viên mới" %}

{: .note }
Tên hiển thị theo thứ tự **Tên rồi đến Họ**. Với Tên = `Minh Anh` và Họ = `Nguyễn`, học viên hiện là "Minh Anh Nguyễn" trong mọi danh sách.

## Bước 3. Kiểm tra học viên trong danh sách

Sau khi tạo, hệ thống quay về danh sách học viên. Gõ tên đăng nhập vào ô **Tìm kiếm** để tìm nhanh. Học viên mới hiện ở dòng ① với trạng thái **Đang hoạt động**.

{% include shot.html dir="tao-hoc-vien" desktop="03-hoc-vien-moi-trong-danh-sach" phone="03-hoc-vien-moi-trong-danh-sach-mobile" alt="Học viên mới trong danh sách" %}

## Bước 4. Mở hồ sơ học viên

Bấm nút **...** ở cuối dòng của học viên, chọn **Xem**. Trang hồ sơ có:

- Thông tin cá nhân và huấn luyện viên phụ trách.
- **Chương trình đã giao**: các chương trình tập đang giao cho học viên.
- **Thực đơn**: thực đơn đã giao, và nút **Giao thực đơn**.
- **Tổng quan hoạt động**: số buổi tập, buổi tập gần nhất.

Học viên mới chưa có chương trình hay thực đơn nào, nên các khối này còn trống.

{% include shot.html dir="tao-hoc-vien" desktop="04-ho-so-hoc-vien" phone="04-ho-so-hoc-vien-mobile" alt="Hồ sơ học viên" %}

## Tiếp theo

- [Nhập chương trình tập từ Excel]({{ '/pt/nhap-chuong-trinh-tap/' | relative_url }})
- [Nhập thực đơn từ Excel]({{ '/pt/nhap-thuc-don/' | relative_url }})
