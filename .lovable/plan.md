# Hoàn thiện luồng mua hàng Northline

## Mục tiêu
Giữ nguyên design system ecommerce hiện tại, đồng thời chuẩn hóa luồng từ trang chủ đến đơn hàng và hồ sơ theo cấu trúc URL người dùng yêu cầu.

## Trang và điều hướng
- Dùng TanStack Router theo cấu trúc dự án hiện tại thay cho thư mục `src/pages` kiểu React Router.
- Chuẩn hóa các URL công khai: `/home`, `/products`, `/product/:id`, `/login`, `/register`.
- Chuẩn hóa các URL cần đăng nhập: `/cart`, `/checkout`, `/orders`, `/orders/:id`, `/profile`.
- Tạo trang riêng `/checkout/success` sau khi đặt hàng thành công.
- Giữ `/` hoạt động và chuyển hợp lý sang `/home`; giữ tương thích các URL sản phẩm cũ nếu cần.

## Layout và header
- MainLayout gồm Header, nội dung, Footer và thanh điều hướng mobile cho các trang mua sắm.
- AuthLayout chỉ hiển thị form đăng nhập/đăng ký ở giữa màn hình, không dùng Header/Footer.
- Header có logo, tìm kiếm, Nam/Nữ/Trẻ em/Sale, giỏ hàng, và menu tài khoản thay đổi theo trạng thái đăng nhập.
- Tìm kiếm đưa từ khóa vào `/products?q=...`; đăng xuất xóa dữ liệu phiên và đưa về `/login`.

## Đăng nhập và dữ liệu người dùng
- Dùng Lovable Cloud cho email/mật khẩu và Google, với xác thực phiên thật thay cho token demo.
- Đăng ký gồm họ tên, email, số điện thoại, mật khẩu, xác nhận; thành công báo kiểm tra email rồi chuyển về đăng nhập.
- Lưu hồ sơ và sổ địa chỉ trong các bảng riêng, chỉ chủ tài khoản được xem và chỉnh sửa.
- Thêm route guard tập trung; truy cập trang riêng khi chưa đăng nhập chuyển đến `/login?redirect=...`.

## Trải nghiệm mua sắm
- Home: banner, 4 danh mục, 8 sản phẩm mới, 8 sản phẩm bán chạy.
- Product list: tìm kiếm, danh mục radio, size checkbox, khoảng giá, sort, skeleton, empty state và pagination.
- Product detail: breadcrumb, gallery, màu, size, số lượng, kiểm tra biến thể/tồn kho, tabs mô tả/thông số, sản phẩm liên quan.
- Nếu chưa chọn màu hoặc size, nút thêm giỏ/mua ngay mở hộp nhắc chọn; Mua ngay thêm hàng rồi đi `/checkout`.
- Cart: chọn từng dòng/chọn tất cả, hiển thị biến thể, chỉnh số lượng/xóa, phí vận chuyển và tổng tiền.
- Checkout: ba bước địa chỉ → vận chuyển → COD/thanh toán, kiểm tra form, tạo đơn và chuyển trang thành công.
- Orders: bộ lọc trạng thái, card đơn hàng, trang chi tiết, hủy khi đang chờ xác nhận, liên hệ shop.
- Profile: cập nhật ảnh/thông tin, thêm/sửa/xóa/đặt mặc định địa chỉ bằng modal.

## Quản trị và chất lượng
- Giữ luồng quản trị hiện có; sửa lỗi biên dịch và không làm thay đổi yêu cầu quản trị đã có.
- Sửa cấu hình URL API đang ghép sai khiến trang hiện tại trả lỗi.
- Bổ sung metadata riêng cho mọi trang nội dung.
- Kiểm tra build, luồng chính bằng trình duyệt và bố cục desktop/mobile.

## Chi tiết kỹ thuật
- Bảng `profiles`: họ tên, số điện thoại, ảnh đại diện, liên kết người dùng.
- Bảng `addresses`: nhãn, người nhận, số điện thoại, địa chỉ, thành phố, mã bưu chính, mặc định.
- Bảng đơn hàng/chi tiết đơn và dữ liệu giỏ được bảo vệ theo chủ sở hữu; trạng thái chỉ đi theo luồng chờ → đang giao → đã giao hoặc hủy khi chờ.
- Mọi dữ liệu nhập được kiểm tra ở giao diện và phía máy chủ; các bảng bật chính sách truy cập theo tài khoản.
