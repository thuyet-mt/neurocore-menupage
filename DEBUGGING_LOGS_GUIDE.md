# Debugging Logs Guide - Neurocore Menu Page

## Overview
This guide explains all the logging that has been added to help diagnose performance issues, flickering, and high RAM usage in the 3D cursor application for the Neurocore menu page.

## Log Categories

### 🔄 Component Re-renders
**Purpose**: Track how often components are re-rendering
- `🔄 App re-render #X` - App component re-renders
- `🔄 Cursor3D re-render #X` - Cursor3D component re-renders  
- `🔄 ProgressBar re-render #X` - ProgressBar component re-renders

**What to look for**: 
- High re-render counts indicate excessive updates
- Re-renders happening too frequently during cursor size changes

### 📏 Size and Scale Calculations
**Purpose**: Track cursor size changes and scaling
- `📏 Cursor size calculated: Xpx (progress: Y%)` - App.jsx cursor size calculation
- `📏 Base scale calculated: X (size: Y)` - Cursor3D scale calculation
- `📏 Updating model scale: X (base: Y, hover: Z)` - Model scaling updates

**What to look for**:
- Size calculations happening too frequently
- Scale updates causing performance issues

### 🎯 Three.js Scene Management
**Purpose**: Track Three.js initialization and model loading
- `🎯 Initializing 3D cursor scene with size: X` - Scene initialization
- `✅ Scene initialization complete` - Successful initialization
- `🚫 Scene initialization skipped` - Skipped initialization (good)
- `🎯 Loading cursor model for theme: X` - Model loading start
- `✅ Cursor model loaded successfully` - Successful model load
- `🗑️ Removing existing model` - Model cleanup

**What to look for**:
- Scene re-initialization (should only happen once)
- Model loading happening repeatedly
- Failed model loads

### 🔍 Memo Optimization
**Purpose**: Track React.memo optimization decisions
- `🔍 OptimizedCursor3D memo comparison:` - Shows size differences and render decisions
- `🎯 OptimizedCursor3D rendering with size: X` - When memo allows re-render

**What to look for**:
- Memo skipping renders when it should (good)
- Memo allowing renders when size changes are minimal (good)

### ⏱️ Throttling and Performance
**Purpose**: Track throttling decisions and performance optimizations
- `⏱️ useThrottledProgress update requested: X → Y` - Progress update requests
- `⏱️ Skipping insignificant change: X < 2` - Throttled insignificant changes
- `⏱️ Scheduling throttled update: X (Yms delay)` - Throttled updates
- `📊 ProgressBar intentional dragging - Value: X → Y (delta: Z)` - Intentional progress bar updates
- `⏱️ ProgressBar intentional drag started after Xms` - When user holds long enough
- `⏱️ ProgressBar drag too short (Xms < 500ms) - ignoring update` - Short drags ignored
- `✅ ProgressBar intentional drag completed successfully` - Successful intentional drag
- `⏱️ Significant intentional change detected: X > 5` - Major intentional changes

**What to look for**:
- Too many throttled updates
- Insignificant changes being processed anyway
- Short drags being ignored (good)
- Intentional drags being processed (good)

### 🖱️ Mouse Interactions
**Purpose**: Track mouse events and interactions
- `🖱️ ProgressBar mouse down - Starting drag at value: X` - Drag start
- `🖱️ ProgressBar intentional dragging - Value: X → Y` - During intentional drag
- `🖱️ ProgressBar mouse up - Finished dragging at value: X, total hold time: Yms` - Drag end with timing
- `🖱️ Mouse entered cursor area` - Cursor hover start
- `🖱️ Mouse left cursor area` - Cursor hover end
- `🖱️ Mouse down detected` - Click start
- `🖱️ Mouse up detected` - Click end

**What to look for**:
- Excessive mouse event handling
- Events happening when they shouldn't
- Proper timing of intentional drags

### 📊 Performance Monitoring
**Purpose**: Track overall performance metrics
- `📊 Performance: FPS: X, Memory: YMB` - Real-time performance
- `💾 Memory Usage: XMB / YMB (Limit: ZMB)` - Memory usage
- `⚠️ High memory usage: XMB (Y% of limit)` - Memory warnings
- `📈 Performance Stats:` - Periodic performance summary

**What to look for**:
- Low FPS (should be 60)
- High memory usage
- Memory leaks (increasing usage over time)

### 🎬 Animation Events
**Purpose**: Track 3D model animations
- `🎬 Animation setup complete: X animations` - Animation initialization
- `🎬 Animation triggered on click` - Click animations
- `⚠️ No animation available for click` - Missing animations

**What to look for**:
- Animation setup issues
- Missing animations causing errors

## How to Use These Logs

### 1. Open Browser Developer Tools
- Press F12 or right-click → Inspect
- Go to Console tab
- Clear the console (Ctrl+L)

### 2. Reproduce the Issue
- Move the progress bar to change cursor size
- Watch for patterns in the logs

### 3. Look for These Patterns

**High Re-render Count**:
```
🔄 Cursor3D re-render #50 - Size: 500, Theme: dark
🔄 Cursor3D re-render #51 - Size: 501, Theme: dark
🔄 Cursor3D re-render #52 - Size: 502, Theme: dark
```
**Solution**: The component is re-rendering too frequently. Check if memo optimization is working.

**Memory Leaks**:
```
💾 Memory Usage: 150MB / 200MB (Limit: 500MB)
💾 Memory Usage: 180MB / 200MB (Limit: 500MB)
💾 Memory Usage: 220MB / 200MB (Limit: 500MB)
```
**Solution**: Memory usage is increasing. Check for proper cleanup in useEffect.

**Scene Re-initialization**:
```
🎯 Initializing 3D cursor scene with size: 500
🎯 Initializing 3D cursor scene with size: 501
🎯 Initializing 3D cursor scene with size: 502
```
**Solution**: Scene is being re-initialized. Should only happen once.

**Model Reloading**:
```
🎯 Loading cursor model for theme: dark
✅ Cursor model loaded successfully
🎯 Loading cursor model for theme: dark
✅ Cursor model loaded successfully
```
**Solution**: Model is being reloaded unnecessarily. Check useEffect dependencies.

**Intentional Drag Logic**:
```
🖱️ ProgressBar mouse down - Starting drag at value: 35
⏱️ ProgressBar intentional drag started after 600ms
📊 ProgressBar intentional dragging - Value: 35 → 40
✅ ProgressBar intentional drag completed successfully
```
**Good**: User held long enough for intentional update.

**Short Drag Ignored**:
```
🖱️ ProgressBar mouse down - Starting drag at value: 35
🖱️ ProgressBar mouse up - Finished dragging at value: 35, total hold time: 300ms
⏱️ ProgressBar drag too short (300ms < 500ms) - ignoring update
```
**Good**: Short drag was properly ignored.

### 4. Performance Metrics to Monitor

**Good Performance**:
- FPS: 60
- Memory: Stable or slowly increasing
- Re-renders: Minimal during size changes
- Scene initialization: Once only
- Model loading: Once per theme
- Intentional drags: Processed correctly
- Short drags: Ignored properly

**Poor Performance**:
- FPS: < 30
- Memory: Rapidly increasing
- Re-renders: Every size change
- Scene initialization: Multiple times
- Model loading: Repeated for same theme
- All drags: Processed regardless of timing

## Quick Commands

**Filter logs by type**:
```javascript
// In console, type these to filter:
// Show only re-renders
console.log = (function(old_function) {
    return function() {
        if (arguments[0] && arguments[0].includes('🔄')) {
            old_function.apply(this, arguments);
        }
    };
})(console.log);

// Show only performance metrics
console.log = (function(old_function) {
    return function() {
        if (arguments[0] && (arguments[0].includes('📊') || arguments[0].includes('💾'))) {
            old_function.apply(this, arguments);
        }
    };
})(console.log);

// Show only timing-related logs
console.log = (function(old_function) {
    return function() {
        if (arguments[0] && arguments[0].includes('⏱️')) {
            old_function.apply(this, arguments);
        }
    };
})(console.log);
```

**Reset console filter**:
```javascript
// Restore original console.log
console.log = console.log.constructor;
```

## Expected Behavior

### During Normal Operation:
1. App re-renders when progress changes
2. OptimizedCursor3D skips renders for small size changes
3. Cursor3D only re-renders when size changes significantly
4. Scene initializes once
5. Model loads once per theme
6. FPS stays at 60
7. Memory usage is stable
8. Short drags (< 500ms) are ignored
9. Intentional drags (≥ 500ms) are processed

### During Issues:
1. Excessive re-renders
2. Scene re-initialization
3. Model reloading
4. Low FPS
5. Increasing memory usage
6. Short drags being processed
7. Intentional drags being ignored

Use these logs to identify which optimization is failing and focus your debugging efforts accordingly. 