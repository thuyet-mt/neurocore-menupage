# 🚀 Quick Start - Neurobase Frontend

## Giải quyết lỗi "Unexpected token '<'"

Lỗi này xảy ra vì frontend đang cố gắng fetch language files từ server không tồn tại.

## ✅ Giải pháp đơn giản

### Bước 1: Cài đặt dependencies
```bash
npm install
```

### Bước 2: Chạy development server
```bash
npm run dev
```

App sẽ tự động sử dụng built-in English language data khi không có server.

### Bước 3: Mở browser
Truy cập: http://localhost:5173

## 🎯 Kết quả

- ✅ App load thành công
- ✅ Hệ thống đa ngôn ngữ hoạt động (tiếng Anh)
- ✅ Theme system hoạt động (light, dark, balance)
- ✅ Không còn lỗi JSON parsing
- ✅ Không cần mock server

## 🔄 Cách thay đổi ngôn ngữ

```javascript
// Trong browser console
localStorage.setItem('language', 'en'); // English (fallback)
```

## 🎨 Cách thay đổi theme

```javascript
// Trong browser console
localStorage.setItem('theme', 'dark');
localStorage.setItem('theme', 'light');
localStorage.setItem('theme', 'balance');
```

## 🐛 Nếu vẫn gặp lỗi

1. **Kiểm tra port 5173**: `curl http://localhost:5173`
2. **Restart server**: `Ctrl+C` và chạy lại `npm run dev`
3. **Clear cache**: Hard refresh browser (Ctrl+F5)

## 📝 Notes

- ✅ **Không cần mock server** - App hoàn toàn độc lập
- ✅ **Built-in English language data** - Có sẵn trong code
- ✅ **Graceful fallback** - Tự động chuyển sang fallback data
- ✅ **WebChannel chỉ hoạt động với backend thật**
- ✅ **Setup đơn giản** - Chỉ 2 lệnh: `npm install && npm run dev` 