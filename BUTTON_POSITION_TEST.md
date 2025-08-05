# 🎯 Button Position Testing System

## 📖 Overview

The Button Position Test System allows you to freely adjust the position of buttons in the Neurocore interface visually and in real-time. This tool is essential for fine-tuning the layout to match your design requirements.

**Related Documentation:**
- **[Main Documentation](README.md)** - Complete project overview
- **[Quick Start Guide](QUICK_START.md)** - Get up and running quickly
- **[Cursor Improvements](CURSOR_IMPROVEMENTS.md)** - 3D cursor system details

## 🚀 How to Use

### 1. Access the Test Page
Open your browser and visit:
```
http://localhost:5173/button-test
```

### 2. Test Interface
- **Background**: Uses the actual application background
- **Buttons**: Displays all 7 circular buttons with current positions
- **Control Panel**: Modern control panel in the right corner of the screen

### 3. Adjust Positions

#### Select a Button
- Click on any circular button to select it (button will turn red with gradient)
- Or use the "Selected Button" dropdown in the control panel

#### Drag and Drop Button
- Drag (drag) the button to move it to the desired position
- The button will follow the mouse during dragging
- Drop to place the button at the new position

#### Adjust Parameters
- **Top**: Adjust vertical position (0-100%)
- **Left**: Adjust horizontal position (0-100%)
- **Width**: Adjust button width (100-500px)
- **Height**: Adjust button height (100-500px)

#### Display Coordinates
- Toggle "Show Coordinates" to show/hide coordinates on each button
- Coordinates are displayed as: `top%, left%`

### 4. Undo/Redo
- **Undo (↩️)**: Undo the previous change
- **Redo (↪️)**: Redo the undone change
- Supports up to 20 steps in history

### 5. Save/Load Layout
- **Save Layout**: Enter a name and save the current layout
- **Load Layout**: Load a saved layout
- **Delete Layout**: Delete unnecessary layouts
- Layouts are saved with timestamps

### 6. Copy CSS
- After adjusting, click "Copy CSS to Clipboard"
- CSS will be copied to clipboard with standard format
- Paste into `src/components/Neurocore.css` to apply

## 🎮 Available Buttons

1. **neurobase** - Main button (300x300px)
2. **neuropacks** - Packages button (300x300px)
3. **neurolab** - Lab button (200x200px)
4. **neurostat** - Statistics button (200x200px)
5. **neurotools** - Tools button (200x200px)
6. **neuroalert** - Alerts button (200x200px)
7. **neurocontrol** - Control button (200x200px)

## ✨ Special Features

### Real-time Preview
- Position changes are displayed immediately
- No need to refresh the page
- Intuitive drag and drop with visual feedback

### History Management
- Undo/Redo with up to 20 steps
- Automatically saves history when positions change
- Undo/Redo buttons are disabled when no operations are available

### Layout Management
- Save multiple different layouts
- Load layouts with one click
- Delete unnecessary layouts
- Timestamp for each layout

### Visual Feedback
- Selected button will have red color with gradient and bright border
- Coordinates are clearly displayed on each button
- Buttons have gradient effects and 3D shadows

### Responsive Design
- Control panel can scroll if screen is small
- Interface adapts to different screen sizes

## ⚠️ Important Notes

1. **Transform**: All buttons use `transform: translate(-50%, -50%)` for centering
2. **Z-index**: Selected button has higher z-index for better visibility
3. **Background**: Uses actual background for accurate position evaluation
4. **Performance**: Changes are optimized for smooth operation

## 🐛 Troubleshooting

### If buttons don't display
- Check console for errors
- Ensure CSS files are imported correctly

### If control panel is covered
- Reduce browser window size
- Control panel will automatically scroll

### If coordinates are inaccurate
- Refresh page to reset to default positions
- Check if other CSS is affecting the layout

## 📋 Example Generated CSS

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

## 🎯 Best Practices

### Layout Guidelines
1. **Balance**: Distribute buttons evenly across the screen
2. **Hierarchy**: Place main buttons (neurobase, neuropacks) prominently
3. **Accessibility**: Ensure buttons are easily clickable
4. **Aesthetics**: Consider the background image when positioning

### Testing Tips
1. **Test on different screen sizes** to ensure responsiveness
2. **Save multiple layouts** for different use cases
3. **Use the undo feature** to experiment safely
4. **Copy CSS frequently** to preserve your work

## 🔧 Advanced Features

### Keyboard Shortcuts
- **Ctrl+Z**: Undo
- **Ctrl+Y**: Redo
- **Ctrl+S**: Save current layout
- **Ctrl+L**: Load last saved layout

### Export Options
- **CSS Export**: Copy CSS for direct application
- **JSON Export**: Export layout data for backup
- **Image Export**: Save layout as image (planned feature)

---

This system helps you find the optimal positions for buttons that fit the background and overall layout of the application.

**Back to [Main Documentation](README.md)** 