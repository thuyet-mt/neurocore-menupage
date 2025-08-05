import React, { useState, useEffect } from 'react';

const CursorCalibration = ({ onOffsetChange, currentOffset = { x: 0.15, y: 0.1 } }) => {
  const [offsetX, setOffsetX] = useState(currentOffset.x);
  const [offsetY, setOffsetY] = useState(currentOffset.y);
  const [isVisible, setIsVisible] = useState(false);

  // Toggle calibration panel with Ctrl+Shift+C
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'C') {
        setIsVisible(!isVisible);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isVisible]);

  const handleOffsetChange = (axis, value) => {
    const newOffset = axis === 'x' 
      ? { x: parseFloat(value), y: offsetY }
      : { x: offsetX, y: parseFloat(value) };
    
    if (axis === 'x') {
      setOffsetX(parseFloat(value));
    } else {
      setOffsetY(parseFloat(value));
    }
    
    onOffsetChange(newOffset);
  };

  const resetToDefaults = () => {
    const defaultOffset = { x: 0.15, y: 0.1 };
    setOffsetX(defaultOffset.x);
    setOffsetY(defaultOffset.y);
    onOffsetChange(defaultOffset);
  };

  if (!isVisible) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      background: 'rgba(0, 0, 0, 0.9)',
      color: 'white',
      padding: '20px',
      borderRadius: '10px',
      zIndex: 10000,
      fontFamily: 'monospace',
      fontSize: '14px',
      minWidth: '300px'
    }}>
      <h3 style={{ margin: '0 0 15px 0', color: '#ffd700' }}>
        🎯 Cursor Calibration
      </h3>
      
      <div style={{ marginBottom: '15px' }}>
        <p style={{ margin: '5px 0', fontSize: '12px', opacity: 0.8 }}>
          Press Ctrl+Shift+C to toggle this panel
        </p>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>
          X Offset (Horizontal):
        </label>
        <input
          type="range"
          min="-0.5"
          max="0.5"
          step="0.01"
          value={offsetX}
          onChange={(e) => handleOffsetChange('x', e.target.value)}
          style={{ width: '100%', marginBottom: '5px' }}
        />
        <span style={{ fontSize: '12px', opacity: 0.8 }}>
          {offsetX.toFixed(3)}
        </span>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>
          Y Offset (Vertical):
        </label>
        <input
          type="range"
          min="-0.5"
          max="0.5"
          step="0.01"
          value={offsetY}
          onChange={(e) => handleOffsetChange('y', e.target.value)}
          style={{ width: '100%', marginBottom: '5px' }}
        />
        <span style={{ fontSize: '12px', opacity: 0.8 }}>
          {offsetY.toFixed(3)}
        </span>
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          onClick={resetToDefaults}
          style={{
            background: '#ffd700',
            color: '#000',
            border: 'none',
            padding: '8px 12px',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          Reset to Defaults
        </button>
        
        <button
          onClick={() => setIsVisible(false)}
          style={{
            background: '#666',
            color: '#fff',
            border: 'none',
            padding: '8px 12px',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          Close
        </button>
      </div>

      <div style={{ marginTop: '15px', fontSize: '11px', opacity: 0.7 }}>
        <p style={{ margin: '5px 0' }}>
          💡 Tips:
        </p>
        <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
          <li>Move the sliders to align the robot's fingertip with your mouse cursor</li>
          <li>Positive X moves the cursor right, negative moves it left</li>
          <li>Positive Y moves the cursor down, negative moves it up</li>
          <li>Test by clicking on precise targets like buttons or text</li>
        </ul>
      </div>
    </div>
  );
};

export default CursorCalibration; 