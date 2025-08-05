# 🧠 Neurocore Menu Page

## 📖 Overview

**Neurocore Menu Page** is a modern web application built with React, providing an interactive user interface with 3D features, multi-language support, and real-time connection with Python backend. This is a main dashboard for the Neurocore system with 7 core modules.

## 🎯 Project Purpose

This project creates a main menu interface for the Neurocore system, including:
- **7 main function buttons**: Neurobase, Neuropacks, Neurolab, Neurostat, Neurotools, Neurocontrol, Neuroalert
- **Interactive 3D interface**: 3D logo with click and rotate functionality
- **Dynamic 3D cursor**: Size changes based on progress bar
- **Theme system**: Light, Dark, Balance
- **Multi-language**: Support for multiple languages with fallback
- **Backend connection**: WebChannel for Python communication

## 🏗️ Project Architecture

```
neurocore-menupage/
├── src/
│   ├── components/          # React components
│   │   ├── Neurocore.jsx       # Main component
│   │   ├── Logo3DModel.jsx     # 3D logo with animation
│   │   ├── Cursor3D.jsx        # Dynamic 3D cursor
│   │   ├── GoldenButton.jsx    # Golden button with effects
│   │   ├── MenuButton.jsx      # Menu button
│   │   ├── ModeButton.jsx      # Theme switch button
│   │   ├── ProgressBar.jsx     # Progress bar
│   │   ├── NotificationSystem.jsx # Notification system
│   │   └── ...
│   ├── contexts/            # Global state management
│   │   ├── ThemeContext.js     # Theme management
│   │   └── LanguageContext.js  # Language management
│   ├── services/            # Business logic
│   │   ├── WebChannelService.js # Backend connection
│   │   └── ErrorBoundary.jsx   # Error handling
│   ├── pages/              # Pages
│   │   ├── ButtonPositionTest.jsx # Button position testing
│   │   └── LogoTestPage.jsx      # 3D logo testing
│   ├── assets/             # Static resources
│   │   ├── *.svg              # SVG icons
│   │   ├── background_menu.png  # Background
│   │   └── logo_neuro.png      # Logo
│   ├── constants/           # Constants
│   ├── hooks/              # Custom hooks
│   └── utils/              # Utilities
├── public/                 # Public resources
│   └── Logo_2_v1.glb         # 3D model
└── dist/                   # Build output
```

## ✨ Main Features

### 🎨 3D Interface
- **Interactive 3D logo**: Click to rotate with smooth animation
- **Dynamic 3D cursor**: Size changes based on progress bar (250-1000px)
- **Responsive background**: Automatically adjusts to screen size
- **Hover effects**: Buttons have effects when hovering

### 🌐 Multi-language
- **Multiple language support**: English, French, Spanish, etc.
- **Dynamic switching**: Real-time language changes
- **Fallback system**: Automatically uses English when errors occur
- **Localization**: Text with parameter substitution

### 🎨 Theme System
- **3 modes**: Light, Dark, Balance
- **Smooth transitions**: Animation when switching themes
- **Responsive**: Automatically adjusts to theme
- **Consistent**: All components support themes

### 🔧 Backend Connection
- **WebChannel**: Real-time communication with Python
- **Error handling**: Graceful connection error handling
- **Auto-reconnect**: Automatically reconnects when connection is lost
- **Slot calling**: Call functions from backend

### 📱 Responsive Design
- **Mobile-first**: Optimized for mobile
- **Tablet support**: Adaptive interface for tablets
- **Desktop optimized**: Good experience on desktop
- **Touch support**: Touch gesture support

## 🚀 Installation and Setup

### System Requirements
- **Node.js**: Version 18 or higher
- **npm or yarn**: Package manager
- **Modern browser**: WebGL and ES6+ support

### Step 1: Clone project
```bash
git clone <repository-url>
cd neurocore-menupage
```

### Step 2: Install dependencies
```bash
npm install
# or
yarn install
```

### Step 3: Run development server
```bash
npm run dev
# or
yarn dev
```

### Step 4: Open browser
Visit: `http://localhost:5173`

## 📁 Detailed File Structure

### 🎯 Main Components

#### `Neurocore.jsx` - Main Component
```javascript
// Main application component
export default function Neurocore({ progressValue, onProgressChange }) {
  // Manage state and main logic
  // Render all buttons and interface
}
```

**Functions:**
- Render 7 main function buttons
- Manage WebChannel connection
- Handle click events
- Display notifications
- Manage theme and language

#### `Logo3DModel.jsx` - 3D Logo
```javascript
const Logo3DModel = ({ 
  position, scale, rotation,
  autoRotate, rotationSpeed,
  onClick, enableAnimations 
}) => {
  // Load and render 3D model
  // Handle animation and interaction
}
```

**Functions:**
- Load 3D model from GLB file
- Handle rotation animation
- Click interaction with smooth animation
- Hover effects
- Theme-based rendering

#### `Cursor3D.jsx` - Dynamic 3D Cursor
```javascript
const Cursor3D = ({ size = 150 }) => {
  // Render 3D cursor based on size
  // Track mouse movement
  // Animation effects
}
```

**Functions:**
- Render 3D cursor based on size prop
- Track mouse position
- Animation on hover
- Theme-based model loading

### 🌐 Context Providers

#### `ThemeContext.js` - Theme Management
```javascript
export const ThemeProvider = ({ children }) => {
  const [currentMode, setCurrentMode] = useState('light');
  
  const toggleMode = () => {
    // Switch between light, dark, balance
  };
  
  return (
    <ThemeContext.Provider value={{ currentMode, toggleMode, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
};
```

**Functions:**
- Manage 3 theme modes: light, dark, balance
- Provide theme switching function
- Context for entire app

#### `LanguageContext.js` - Language Management
```javascript
export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');
  const [languageData, setLanguageData] = useState(null);
  
  // Load language data from server or fallback
  // Provide getText() function
}
```

**Functions:**
- Load language data from server
- Fallback to English when errors occur
- Provide `getText()` and `getTextWithParams()` functions
- Real-time language switching

### 🔧 Services

#### `WebChannelService.js` - Backend Connection
```javascript
class WebChannelService {
  async initialize() {
    // Initialize QWebChannel connection
  }
  
  async callSlot(slotName, ...args) {
    // Call slot from Python backend
  }
  
  // Methods for each function
  async openNeuroBase() { /* ... */ }
  async openNeuroLab() { /* ... */ }
  // ... other methods
}
```

**Functions:**
- Connect to Python backend via QWebChannel
- Call slots (functions) from backend
- Error handling and auto-reconnect
- Timeout protection

#### `ErrorBoundary.jsx` - Error Handling
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

**Functions:**
- Catch and handle React errors
- Display fallback UI when errors occur
- Log errors for debugging

## 🎮 How to Use

### 1. Switch Themes
- Click the **Mode Button** (top right corner)
- Theme will switch: Light → Dark → Balance → Light
- All components will automatically update

### 2. Adjust Cursor Size
- Use the **Progress Bar** at the bottom of the screen
- Drag the bar to change 3D cursor size
- Range: 250px - 1000px

### 3. Interact with 3D Logo
- **Click**: Logo will rotate with smooth animation
- **Hover**: Scale and glow effects
- **Auto-rotate**: Automatically rotates when not interacting

### 4. Use Function Buttons
- **Neurobase**: Open main module
- **Neuropacks**: Package management
- **Neurolab**: Laboratory
- **Neurostat**: Statistics
- **Neurotools**: Tools
- **Neurocontrol**: Control
- **Neuroalert**: Alerts

### 5. Back Button
- Click to go back to previous screen
- Has responsive icon and text

## 🧪 Testing

### Button Position Test
Visit: `http://localhost:5173/button-test`

**Features:**
- Drag & drop buttons to adjust positions
- Undo/Redo (up to 20 steps)
- Save/Load layout
- Copy CSS to apply

### Logo Test Page
Visit: `http://localhost:5173/logo-test`

**Features:**
- Test 3D animations
- Adjust parameters
- Real-time preview

## 🔧 Development

### Available Scripts
```bash
# Development server
npm run dev

# Build production
npm run build

# Preview build
npm run preview
```

### Development Structure
- **Hot reload**: Code changes automatically reload
- **ESLint**: Automatic code linting
- **Vite**: Fast build tool
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

## 📦 Build and Deploy

### Build Production
```bash
npm run build
```

### Preview Build
```bash
npm run preview
```

### Deploy
- Copy `dist/` folder to web server
- Or deploy to Vercel, Netlify, etc.

## 🐛 Troubleshooting

### Common Issues

#### 1. WebChannel not connecting
```javascript
// Check console
console.log('WebChannel status:', isWebChannelReady);

// Try reconnecting
await webChannelService.reset();
await webChannelService.initialize();
```

#### 2. 3D model not loading
- Check if `public/Logo_2_v1.glb` file exists
- Check if browser supports WebGL
- Check console for debugging

#### 3. Language not loading
- Check if server serves JSON files
- Fallback will automatically use English
- Check network tab in DevTools

#### 4. Performance issues
- Reduce 3D model quality
- Disable some animations
- Check memory usage

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
- **React 19**: Main framework
- **React DOM**: DOM rendering
- **Three.js**: 3D graphics
- **@react-three/fiber**: React renderer for Three.js
- **@react-three/drei**: Three.js helpers

### Dev Dependencies
- **Vite**: Build tool
- **ESLint**: Code linting
- **TypeScript**: Type checking (optional)

## 🤝 Contributing

### Code Rules
- Follow ESLint rules
- Follow React best practices
- Comment complex code
- Test before committing

### Workflow
1. Fork repository
2. Create feature branch
3. Code and test
4. Commit with clear message
5. Push and create Pull Request

## 📄 License

This project is developed for the Neurocore system.

## 📞 Support

If you have issues or questions:
- Create issue on GitHub
- Contact development team
- Check documentation

---

**Note**: This project is designed to work with Python backend via WebChannel. Ensure the backend is properly configured before testing connection features. 