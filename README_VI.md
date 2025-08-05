# 🧠 Neurocore Menu Page

## 📖 Tổng quan

**Neurocore Menu Page** là một ứng dụng web hiện đại được xây dựng bằng React, cung cấp giao diện người dùng tương tác với các tính năng 3D, đa ngôn ngữ và kết nối thời gian thực với backend Python. Đây là một dashboard chính cho hệ thống Neurocore với 7 module chính.

## 📚 Mục lục Tài liệu

- **[🚀 Hướng dẫn Nhanh](QUICK_START.md)** - Khởi động nhanh trong vài phút
- **[🎯 Test Vị trí Button](BUTTON_POSITION_TEST.md)** - Test và điều chỉnh vị trí button
- **[🎮 Cải tiến Cursor](CURSOR_IMPROVEMENTS.md)** - Tài liệu hệ thống cursor 3D
- **[🇺🇸 English Documentation](README.md)** - English documentation

## 🎯 Mục đích của Project

Project này tạo ra một giao diện menu chính cho hệ thống Neurocore, bao gồm:
- **7 nút chức năng chính**: Neurobase, Neuropacks, Neurolab, Neurostat, Neurotools, Neurocontrol, Neuroalert
- **Giao diện 3D tương tác**: Logo 3D có thể click và xoay
- **Cursor 3D động**: Thay đổi kích thước theo thanh progress
- **Hệ thống theme**: Light, Dark, Gold
- **Đa ngôn ngữ**: Hỗ trợ nhiều ngôn ngữ với fallback
- **Kết nối backend**: WebChannel để giao tiếp với Python

## 🏗️ Kiến trúc Project

```
neurocore-menupage/
├── src/
│   ├── components/          # Các component React
│   │   ├── Neurocore.jsx       # Component chính
│   │   ├── Logo3DModel.jsx     # Logo 3D với animation
│   │   ├── Cursor3D.jsx        # Cursor 3D động
│   │   ├── CursorCalibration.jsx # Hệ thống calibration cursor
│   │   ├── GoldenButton.jsx    # Nút vàng với hiệu ứng
│   │   ├── MenuButton.jsx      # Nút menu
│   │   ├── ModeButton.jsx      # Nút chuyển theme
│   │   ├── ProgressBar.jsx     # Thanh tiến trình
│   │   ├── NotificationSystem.jsx # Hệ thống thông báo
│   │   └── ...
│   ├── contexts/            # Quản lý state toàn cục
│   │   ├── ThemeContext.js     # Quản lý theme
│   │   └── LanguageContext.js  # Quản lý ngôn ngữ
│   ├── services/            # Logic nghiệp vụ
│   │   ├── WebChannelService.js # Kết nối backend
│   │   └── ErrorBoundary.jsx   # Xử lý lỗi
│   ├── pages/              # Các trang
│   │   ├── ButtonPositionTest.jsx # Test vị trí button
│   │   └── LogoTestPage.jsx      # Test logo 3D
│   ├── assets/             # Tài nguyên tĩnh
│   │   ├── *.svg              # Icons SVG
│   │   ├── background_menu.png  # Background
│   │   └── logo_neuro.png      # Logo
│   ├── constants/           # Hằng số
│   ├── hooks/              # Custom hooks
│   └── utils/              # Tiện ích
├── public/                 # Tài nguyên công khai
│   └── Logo_2_v1.glb         # Model 3D
└── dist/                   # Kết quả build
```

## ✨ Tính năng chính

### 🎨 Giao diện 3D
- **Logo 3D tương tác**: Click để xoay với animation mượt mà
- **Cursor 3D động**: Thay đổi kích thước theo thanh progress (250-1000px)
- **Calibration cursor**: Điều chỉnh vị trí cursor với `Ctrl+Shift+C`
- **Background responsive**: Tự động điều chỉnh theo màn hình
- **Hiệu ứng hover**: Các nút có hiệu ứng khi di chuột

### 🌐 Đa ngôn ngữ
- **Hỗ trợ nhiều ngôn ngữ**: English, French, Spanish, v.v.
- **Chuyển đổi động**: Thay đổi ngôn ngữ real-time
- **Fallback system**: Tự động dùng tiếng Anh khi lỗi
- **Localization**: Text có thể thay thế tham số

### 🎨 Hệ thống Theme
- **3 chế độ**: Light, Dark, Gold
- **Chuyển đổi mượt mà**: Animation khi đổi theme
- **Responsive**: Tự động điều chỉnh theo theme
- **Consistent**: Tất cả component đều hỗ trợ theme

### 🔧 Kết nối Backend
- **WebChannel**: Giao tiếp real-time với Python
- **Error handling**: Xử lý lỗi kết nối gracefully
- **Auto-reconnect**: Tự động kết nối lại khi mất kết nối
- **Slot calling**: Gọi các function từ backend

### 📱 Responsive Design
- **Mobile-first**: Tối ưu cho mobile
- **Tablet support**: Giao diện thích ứng tablet
- **Desktop optimized**: Trải nghiệm tốt trên desktop
- **Touch support**: Hỗ trợ touch gestures

## 🚀 Khởi động Nhanh

Để hướng dẫn cài đặt và thiết lập chi tiết, xem **[🚀 Hướng dẫn Nhanh](QUICK_START.md)**.

### Thiết lập Cơ bản
```bash
# Clone và cài đặt
git clone <repository-url>
cd neurocore-menupage
npm install

# Khởi động development server
npm run dev

# Mở trình duyệt
# Truy cập: http://localhost:5173
```

## 🧪 Testing & Development

### Trang Testing
- **[🎯 Test Vị trí Button](BUTTON_POSITION_TEST.md)**: `http://localhost:5173/button-test`
- **Trang Test Logo**: `http://localhost:5173/logo-test`

### Scripts Development
```bash
npm run dev      # Development server
npm run build    # Build production
npm run preview  # Preview build
```

## 🎮 Hướng dẫn Sử dụng Tính năng Chính

### Calibration Cursor 3D
Nhấn `Ctrl+Shift+C` để mở panel calibration cursor. Để thông tin chi tiết, xem **[🎮 Cải tiến Cursor](CURSOR_IMPROVEMENTS.md)**.

### Chuyển đổi Theme
Click vào **Mode Button** (góc trên bên phải) để chuyển qua Light → Dark → Gold themes.

### Thanh Progress
Sử dụng thanh progress ở dưới để điều chỉnh kích thước cursor 3D (250px - 1000px).

### Các nút chức năng
- **Neurobase**: Module chính
- **Neuropacks**: Quản lý packages
- **Neurolab**: Phòng thí nghiệm
- **Neurostat**: Thống kê
- **Neurotools**: Công cụ
- **Neurocontrol**: Điều khiển
- **Neuroalert**: Cảnh báo

## 📦 Build & Deploy

### Build Production
```bash
npm run build
```

### Deploy
- Copy thư mục `dist/` lên web server
- Hoặc deploy lên Vercel, Netlify, v.v.

## 🐛 Troubleshooting

### Lỗi thường gặp
1. **WebChannel không kết nối**: Kiểm tra backend đang chạy
2. **Model 3D không load**: Kiểm tra browser hỗ trợ WebGL
3. **Vấn đề performance**: Giảm kích thước cursor hoặc đóng app khác
4. **Language không load**: Kiểm tra kết nối mạng

Để troubleshooting chi tiết, xem **[🎮 Cải tiến Cursor](CURSOR_IMPROVEMENTS.md)**.

## 📚 Dependencies

### Core Dependencies
- **React 19**: Framework chính
- **React DOM**: DOM rendering
- **Three.js**: 3D graphics
- **@react-three/fiber**: React renderer cho Three.js
- **@react-three/drei**: Three.js helpers

### Dev Dependencies
- **Vite**: Build tool
- **ESLint**: Code linting

## 🤝 Contributing

### Quy tắc Code
- Follow ESLint rules
- Follow React best practices
- Comment code phức tạp
- Test trước khi commit

### Workflow
1. Fork repository
2. Tạo feature branch
3. Code và test
4. Commit với message rõ ràng
5. Push và tạo Pull Request

## 📄 License

Project này được phát triển cho hệ thống Neurocore.

## 📞 Support

Nếu có vấn đề hoặc câu hỏi:
- Tạo issue trên GitHub
- Liên hệ team development
- Kiểm tra documentation

---

**Lưu ý**: Project này được thiết kế để hoạt động với backend Python thông qua WebChannel. Đảm bảo backend đã được cấu hình đúng trước khi test các tính năng kết nối.

Để tài liệu tiếng Anh, xem **[🇺🇸 English Documentation](README.md)**.
