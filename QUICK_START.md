# 🚀 Quick Start Guide

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: Version 18 or higher
- **npm or yarn**: Package manager
- **Modern browser**: WebGL and ES6+ support
- **Git**: For cloning the repository

## ⚡ Quick Installation

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd neurocore-menupage
```

### Step 2: Install Dependencies
```bash
npm install
# or
yarn install
```

### Step 3: Start Development Server
```bash
npm run dev
# or
yarn dev
```

### Step 4: Open Your Browser
Visit: `http://localhost:5173`

🎉 **Congratulations!** The application should now be running.

## 🎮 First Steps

### 1. Explore the Interface
- **7 Function Buttons**: Click each button to explore different modules
- **3D Logo**: Click the logo to see rotation animation
- **Theme Switch**: Click the mode button (top right) to change themes
- **Progress Bar**: Drag to adjust 3D cursor size

### 2. Test 3D Cursor Calibration
Press `Ctrl+Shift+C` to open the cursor calibration panel:
- Adjust X/Y offset to align cursor with mouse
- Test by clicking on precise targets
- Settings are automatically saved

### 3. Try Testing Pages
- **Button Position Test**: `http://localhost:5173/button-test`
- **Logo Test Page**: `http://localhost:5173/logo-test`

## 🔧 Development Commands

```bash
# Development server (with hot reload)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Check for linting issues
npm run lint
```

## 🐛 Common Issues & Solutions

### Issue: "Module not found" errors
**Solution**: Delete `node_modules` and reinstall
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: Port 5173 already in use
**Solution**: Use a different port
```bash
npm run dev -- --port 3000
```

### Issue: 3D models not loading
**Solution**: Check browser console and ensure WebGL is supported

### Issue: WebChannel connection failed
**Solution**: Ensure Python backend is running and properly configured

## 📚 Next Steps

After getting the application running:

1. **Read the Documentation**:
   - **[Main Documentation](README.md)** - Complete project overview
   - **[Button Position Testing](BUTTON_POSITION_TEST.md)** - Test and adjust button positions
   - **[Cursor Improvements](CURSOR_IMPROVEMENTS.md)** - 3D cursor system details

2. **Explore Features**:
   - Test different themes (Light, Dark, Balanced)
   - Adjust cursor size with progress bar
   - Try the calibration system
   - Test backend connections

3. **Development**:
   - Check out the source code structure
   - Try modifying components
   - Test the build process

## 🎯 Testing Checklist

- [ ] Application loads without errors
- [ ] All 7 function buttons are visible
- [ ] 3D logo rotates when clicked
- [ ] Theme switching works (Light → Dark → Balanced)
- [ ] Progress bar adjusts cursor size
- [ ] Cursor calibration opens with `Ctrl+Shift+C`
- [ ] Testing pages are accessible
- [ ] No console errors

## 📞 Need Help?

If you encounter issues:

1. **Check the console** for error messages
2. **Read the troubleshooting section** in [Cursor Improvements](CURSOR_IMPROVEMENTS.md)
3. **Create an issue** on GitHub
4. **Contact the development team**

---

**Back to [Main Documentation](README.md)** 