# 🧠 Neurocore Menu Page

## 📖 Tổng quan

**Neurocore Menu Page** là một ứng dụng web hiện đại được xây dựng bằng React, cung cấp giao diện người dùng tương tác với các tính năng 3D, đa ngôn ngữ và kết nối thời gian thực với backend Python. Đây là một dashboard chính cho hệ thống Neurocore với 7 module chính.

## 🎯 Mục đích của Project

Project này tạo ra một giao diện menu chính cho hệ thống Neurocore, bao gồm:
- **7 nút chức năng chính**: Neurobase, Neuropacks, Neurolab, Neurostat, Neurotools, Neurocontrol, Neuroalert
- **Giao diện 3D tương tác**: Logo 3D có thể click và xoay
- **Cursor 3D động**: Thay đổi kích thước theo thanh progress
- **Hệ thống theme**: Light, Dark, Balance
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
- **Background responsive**: Tự động điều chỉnh theo màn hình
- **Hiệu ứng hover**: Các nút có hiệu ứng khi di chuột

### 🌐 Đa ngôn ngữ
- **Hỗ trợ nhiều ngôn ngữ**: English, French, Spanish, v.v.
- **Chuyển đổi động**: Thay đổi ngôn ngữ real-time
- **Fallback system**: Tự động dùng tiếng Anh khi lỗi
- **Localization**: Text có thể thay thế tham số

### 🎨 Hệ thống Theme
- **3 chế độ**: Light, Dark, Balance
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

## 🚀 Cài đặt và Chạy

### Yêu cầu hệ thống
- **Node.js**: Phiên bản 18 trở lên
- **npm hoặc yarn**: Package manager
- **Browser hiện đại**: Hỗ trợ WebGL và ES6+

### Bước 1: Clone project
```bash
git clone <repository-url>
cd neurocore-menupage
```

### Bước 2: Cài đặt dependencies
```bash
npm install
# hoặc
yarn install
```

### Bước 3: Chạy development server
```bash
npm run dev
# hoặc
yarn dev
```

### Bước 4: Mở trình duyệt
Truy cập: `http://localhost:5173`

## 📁 Cấu trúc File Chi tiết

### 🎯 Components chính

#### `Neurocore.jsx` - Component chính
```javascript
// Component chính của ứng dụng
export default function Neurocore({ progressValue, onProgressChange }) {
  // Quản lý state và logic chính
  // Render tất cả các nút và giao diện
}
```

**Chức năng:**
- Render 7 nút chức năng chính
- Quản lý WebChannel connection
- Xử lý click events
- Hiển thị notifications
- Quản lý theme và language

#### `Logo3DModel.jsx` - Logo 3D
```javascript
const Logo3DModel = ({ 
  position, scale, rotation,
  autoRotate, rotationSpeed,
  onClick, enableAnimations 
}) => {
  // Load và render model 3D
  // Xử lý animation và interaction
}
```

**Chức năng:**
- Load model 3D từ file GLB
- Xử lý animation xoay
- Click interaction với smooth animation
- Hover effects
- Theme-based rendering

#### `Cursor3D.jsx` - Cursor 3D động
```javascript
const Cursor3D = ({ size = 150 }) => {
  // Render cursor 3D theo kích thước
  // Theo dõi mouse movement
  // Animation effects
}
```

**Chức năng:**
- Render cursor 3D theo size prop
- Theo dõi vị trí chuột
- Animation khi hover
- Theme-based model loading

### 🌐 Context Providers

#### `ThemeContext.js` - Quản lý Theme
```javascript
export const ThemeProvider = ({ children }) => {
  const [currentMode, setCurrentMode] = useState('light');
  
  const toggleMode = () => {
    // Chuyển đổi giữa light, dark, balance
  };
  
  return (
    <ThemeContext.Provider value={{ currentMode, toggleMode, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
};
```

**Chức năng:**
- Quản lý 3 chế độ theme: light, dark, balance
- Cung cấp function chuyển đổi theme
- Context cho toàn bộ app

#### `LanguageContext.js` - Quản lý Ngôn ngữ
```javascript
export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');
  const [languageData, setLanguageData] = useState(null);
  
  // Load language data từ server hoặc fallback
  // Cung cấp function getText()
}
```

**Chức năng:**
- Load language data từ server
- Fallback về English khi lỗi
- Cung cấp function `getText()` và `getTextWithParams()`
- Real-time language switching

### 🔧 Services

#### `WebChannelService.js` - Kết nối Backend
```javascript
class WebChannelService {
  async initialize() {
    // Khởi tạo QWebChannel connection
  }
  
  async callSlot(slotName, ...args) {
    // Gọi slot từ Python backend
  }
  
  // Các method cho từng chức năng
  async openNeuroBase() { /* ... */ }
  async openNeuroLab() { /* ... */ }
  // ... các method khác
}
```

**Chức năng:**
- Kết nối với Python backend qua QWebChannel
- Gọi các slot (function) từ backend
- Error handling và auto-reconnect
- Timeout protection

#### `ErrorBoundary.jsx` - Xử lý Lỗi
```javascript
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }
}
```

**Chức năng:**
- Bắt và xử lý lỗi React
- Hiển thị fallback UI khi có lỗi
- Log lỗi để debug

## 🎮 Cách sử dụng

### 1. Chuyển đổi Theme
- Click vào nút **Mode Button** (góc trên bên phải)
- Theme sẽ chuyển: Light → Dark → Balance → Light
- Tất cả component sẽ tự động cập nhật

### 2. Điều chỉnh Cursor Size
- Sử dụng **Progress Bar** ở dưới màn hình
- Kéo thanh để thay đổi kích thước cursor 3D
- Range: 250px - 1000px

### 3. Tương tác với Logo 3D
- **Click**: Logo sẽ xoay với animation mượt mà
- **Hover**: Hiệu ứng scale và glow
- **Auto-rotate**: Tự động xoay khi không tương tác

### 4. Sử dụng các nút chức năng
- **Neurobase**: Mở module chính
- **Neuropacks**: Quản lý packages
- **Neurolab**: Phòng thí nghiệm
- **Neurostat**: Thống kê
- **Neurotools**: Công cụ
- **Neurocontrol**: Điều khiển
- **Neuroalert**: Cảnh báo

### 5. Back Button
- Click để quay lại màn hình trước
- Có icon và text responsive

## 🧪 Testing

### Button Position Test
Truy cập: `http://localhost:5173/button-test`

**Tính năng:**
- Drag & drop các button để điều chỉnh vị trí
- Undo/Redo (tối đa 20 bước)
- Save/Load layout
- Copy CSS để áp dụng

### Logo Test Page
Truy cập: `http://localhost:5173/logo-test`

**Tính năng:**
- Test animation 3D
- Điều chỉnh các tham số
- Preview real-time

## 🔧 Development

### Scripts có sẵn
```bash
# Development server
npm run dev

# Build production
npm run build

# Preview build
npm run preview
```

### Cấu trúc Development
- **Hot reload**: Thay đổi code sẽ tự động reload
- **ESLint**: Code linting tự động
- **Vite**: Build tool nhanh
- **React DevTools**: Debug React components

### Debugging
```javascript
// Log WebChannel status
console.log('WebChannel ready:', isWebChannelReady);

// Log theme changes
console.log('Current theme:', currentMode);

// Log language data
console.log('Language data:', languageData);
```

## 📦 Build và Deploy

### Build Production
```bash
npm run build
```

### Preview Build
```bash
npm run preview
```

### Deploy
- Copy thư mục `dist/` lên web server
- Hoặc deploy lên Vercel, Netlify, v.v.

## 🐛 Troubleshooting

### Lỗi thường gặp

#### 1. WebChannel không kết nối
```javascript
// Kiểm tra console
console.log('WebChannel status:', isWebChannelReady);

// Thử reconnect
await webChannelService.reset();
await webChannelService.initialize();
```

#### 2. Model 3D không load
- Kiểm tra file `public/Logo_2_v1.glb` có tồn tại
- Kiểm tra browser có hỗ trợ WebGL
- Xem console để debug

#### 3. Language không load
- Kiểm tra server có serve file JSON không
- Fallback sẽ tự động dùng English
- Kiểm tra network tab trong DevTools

#### 4. Performance issues
- Giảm quality của 3D models
- Tắt một số animation
- Kiểm tra memory usage

### Debug Tips
```javascript
// Enable debug mode
localStorage.setItem('debug', 'true');

// Check WebChannel
console.log('Backend object:', webChannelService.backend);

// Check theme
console.log('Current theme:', currentMode);

// Check language
console.log('Current language:', language);
```

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
- **TypeScript**: Type checking (optional)

## 🤝 Contributing

### Quy tắc code
- Sử dụng ESLint rules
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
