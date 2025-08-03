import React, { useState, useRef, useEffect } from 'react';
import './ProgressBar.css';

const ProgressBar = ({ 
  value = 0, 
  min = 0, 
  max = 100, 
  onChange = () => {},
  disabled = false,
  text = "Progress" // Thêm prop text
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragStartValue, setDragStartValue] = useState(0);
  const progressBarRef = useRef(null);

  // Calculate percentage
  const percentage = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));
  
  // Calculate thumb position (82px is the initial position, 239px is total width)
  const thumbPosition = (percentage / 100) * (239 - 40); // 239px width - 40px thumb width

  const handleMouseDown = (e) => {
    if (disabled) return;
    
    setIsDragging(true);
    setDragStartX(e.clientX);
    setDragStartValue(value);
    
    // Prevent text selection
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (!isDragging || disabled) return;

    const deltaX = e.clientX - dragStartX;
    const progressBarWidth = 239 - 40; // Total width minus thumb width
    const deltaValue = (deltaX / progressBarWidth) * (max - min);
    const newValue = Math.max(min, Math.min(max, dragStartValue + deltaValue));
    
    onChange(newValue);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleClick = (e) => {
    if (disabled) return;
    
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const progressBarWidth = 239 - 40;
    const newPercentage = Math.max(0, Math.min(1, clickX / progressBarWidth));
    const newValue = min + (newPercentage * (max - min));
    
    onChange(newValue);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragStartX, dragStartValue, max, min, onChange, disabled]);

  return (
    <div className="progress-bar-container">
      {/* Text bên trên Progress Bar */}
      <div className="progress-text">
        {text}
      </div>
      
      <div 
        className="progress-bar"
        ref={progressBarRef}
        onClick={handleClick}
      >
        <div 
          className="progress-fill"
          style={{ width: `${percentage}%` }}
        />
        <div 
          className="progress-thumb"
          style={{ left: `${thumbPosition}px` }}
          onMouseDown={handleMouseDown}
        >
          <div className="thumb-outer-glow">
            <div className="thumb-middle-circle">
              <div className="thumb-core-circle" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar; 