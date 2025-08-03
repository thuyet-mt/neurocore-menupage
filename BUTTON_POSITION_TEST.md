# Button Position Test System

## Tổng quan
Hệ thống test này cho phép bạn tự do điều chỉnh vị trí các button trong giao diện Neurocore một cách trực quan và real-time.

## Cách sử dụng

### 1. Truy cập trang test
Mở trình duyệt và truy cập:
```
http://localhost:5173/button-test
```

### 2. Giao diện test
- **Background**: Sử dụng background thật của ứng dụng
- **Buttons**: Hiển thị tất cả 7 buttons hình tròn với vị trí hiện tại
- **Control Panel**: Panel điều khiển ở góc phải màn hình với thiết kế hiện đại

### 3. Điều chỉnh vị trí

#### Chọn button
- Click vào button hình tròn bất kỳ để chọn (button sẽ chuyển màu đỏ với gradient)
- Hoặc sử dụng dropdown "Selected Button" trong control panel

#### Kéo thả button
- Kéo (drag) button để di chuyển đến vị trí mong muốn
- Button sẽ theo chuột trong quá trình kéo
- Thả (drop) để đặt button tại vị trí mới

#### Điều chỉnh thông số
- **Top**: Điều chỉnh vị trí theo chiều dọc (0-100%)
- **Left**: Điều chỉnh vị trí theo chiều ngang (0-100%)
- **Width**: Điều chỉnh chiều rộng button (100-500px)
- **Height**: Điều chỉnh chiều cao button (100-500px)

#### Hiển thị tọa độ
- Toggle "Show Coordinates" để hiển thị/ẩn tọa độ trên mỗi button
- Tọa độ hiển thị dưới dạng: `top%, left%`

### 4. Undo/Redo
- **Undo (↩️)**: Hoàn tác thay đổi trước đó
- **Redo (↪️)**: Làm lại thay đổi đã hoàn tác
- Hỗ trợ tối đa 20 bước trong history

### 5. Save/Load Layout
- **Save Layout**: Nhập tên và lưu layout hiện tại
- **Load Layout**: Tải layout đã lưu
- **Delete Layout**: Xóa layout không cần thiết
- Layout được lưu với timestamp

### 6. Copy CSS
- Sau khi điều chỉnh xong, click "Copy CSS to Clipboard"
- CSS sẽ được copy vào clipboard với format chuẩn
- Paste vào file `src/components/Neurocore.css` để áp dụng

## Các button có sẵn

1. **neurobase** - Button chính (300x300px)
2. **neuropacks** - Button packages (300x300px)
3. **neurolab** - Button lab (200x200px)
4. **neurostat** - Button statistics (200x200px)
5. **neurotools** - Button tools (200x200px)
6. **neuroalert** - Button alerts (200x200px)
7. **neurocontrol** - Button control (200x200px)

## Tính năng đặc biệt

### Real-time Preview
- Thay đổi vị trí được hiển thị ngay lập tức
- Không cần refresh trang
- Drag and drop trực quan với visual feedback

### History Management
- Undo/Redo với tối đa 20 bước
- Tự động lưu history khi thay đổi vị trí
- Nút Undo/Redo được disable khi không có thao tác

### Layout Management
- Lưu nhiều layout khác nhau
- Load layout với một click
- Xóa layout không cần thiết
- Timestamp cho mỗi layout

### Visual Feedback
- Button được chọn sẽ có màu đỏ với gradient và viền sáng
- Tọa độ hiển thị rõ ràng trên mỗi button
- Buttons có hiệu ứng gradient và shadow 3D

### Responsive Design
- Control panel có thể scroll nếu màn hình nhỏ
- Giao diện thích ứng với các kích thước màn hình

## Lưu ý quan trọng

1. **Transform**: Tất cả buttons sử dụng `transform: translate(-50%, -50%)` để căn giữa
2. **Z-index**: Button được chọn có z-index cao hơn để dễ nhìn
3. **Background**: Sử dụng background thật để đánh giá vị trí chính xác
4. **Performance**: Các thay đổi được tối ưu để mượt mà

## Troubleshooting

### Nếu button không hiển thị
- Kiểm tra console để xem lỗi
- Đảm bảo file CSS được import đúng

### Nếu control panel bị che
- Thu nhỏ cửa sổ trình duyệt
- Control panel sẽ tự động scroll

### Nếu tọa độ không chính xác
- Refresh trang để reset về vị trí mặc định
- Kiểm tra xem có CSS nào khác ảnh hưởng không

## Ví dụ CSS được tạo ra

```css
.button-neurobase {
  position: absolute;
  top: 25%;
  left: 27.5%;
  transform: translate(-50%, -50%);
  width: 300px;
  height: 300px;
  z-index: 10;
  opacity: 1;
  will-change: transform;
  backface-visibility: hidden;
}
```

Hệ thống này giúp bạn tìm ra vị trí tối ưu cho các button phù hợp với background và layout tổng thể của ứng dụng. 