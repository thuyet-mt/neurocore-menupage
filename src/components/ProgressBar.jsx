import React, { useState, useRef, useEffect, useCallback } from 'react';
import './ProgressBar.css';

const ProgressBar = ({ 
  value = 0, 
  min = 0, 
  max = 100, 
  onChange = () => {},
  disabled = false,
  text = "Progress"
}) => {
  // Add render counter for tracking re-renders
  const renderCountRef = useRef(0);
  renderCountRef.current += 1;
  
  console.log(`🔄 ProgressBar re-render #${renderCountRef.current} - Value: ${value}, Text: ${text}`);
  
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragStartValue, setDragStartValue] = useState(0);
  const progressBarRef = useRef(null);
  
  // Optimized timing logic for intentional updates
  const [dragStartTime, setDragStartTime] = useState(0);
  const [isIntentionalDrag, setIsIntentionalDrag] = useState(false);
  const MIN_HOLD_TIME = 200; // Reduced from 500ms to 200ms for better responsiveness
  const MIN_CHANGE_THRESHOLD = 2; // Minimum change to trigger update

  // Memoized calculations
  const percentage = React.useMemo(() => {
    return Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));
  }, [value, min, max]);
  
  const thumbPosition = React.useMemo(() => {
    return (percentage / 100) * (239 - 40); // 239px width - 40px thumb width
  }, [percentage]);

  // Optimized event handlers with useCallback
  const handleMouseDown = useCallback((e) => {
    if (disabled) return;
    
    console.log(`🖱️ ProgressBar mouse down - Starting drag at value: ${value}`);
    setIsDragging(true);
    setIsIntentionalDrag(false);
    setDragStartX(e.clientX);
    setDragStartValue(value);
    setDragStartTime(Date.now());
    
    // Prevent text selection
    e.preventDefault();
  }, [disabled, value]);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging || disabled) return;

    const currentTime = Date.now();
    const holdTime = currentTime - dragStartTime;
    
    // Check if user has held long enough to be intentional
    if (holdTime >= MIN_HOLD_TIME && !isIntentionalDrag) {
      console.log(`⏱️ ProgressBar intentional drag started after ${holdTime}ms`);
      setIsIntentionalDrag(true);
    }

    const deltaX = e.clientX - dragStartX;
    const progressBarWidth = 239 - 40; // Total width minus thumb width
    const deltaValue = (deltaX / progressBarWidth) * (max - min);
    const newValue = Math.max(min, Math.min(max, dragStartValue + deltaValue));
    
    // Only update if this is an intentional drag and change is significant
    if (isIntentionalDrag && Math.abs(newValue - value) >= MIN_CHANGE_THRESHOLD) {
      console.log(`📊 ProgressBar intentional dragging - Value: ${value} → ${newValue} (delta: ${Math.abs(newValue - value).toFixed(1)})`);
      onChange(newValue);
    }
  }, [isDragging, disabled, dragStartTime, isIntentionalDrag, dragStartX, dragStartValue, max, min, value, onChange]);

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      const totalHoldTime = Date.now() - dragStartTime;
      console.log(`🖱️ ProgressBar mouse up - Finished dragging at value: ${value}, total hold time: ${totalHoldTime}ms`);
      
      // If the drag was too short, don't consider it an intentional update
      if (totalHoldTime < MIN_HOLD_TIME) {
        console.log(`⏱️ ProgressBar drag too short (${totalHoldTime}ms < ${MIN_HOLD_TIME}ms) - ignoring update`);
      } else {
        console.log(`✅ ProgressBar intentional drag completed successfully`);
      }
    }
    setIsDragging(false);
    setIsIntentionalDrag(false);
  }, [isDragging, dragStartTime, value]);

  // Optimized event listeners with proper cleanup
  useEffect(() => {
    if (isDragging) {
      console.log(`🎯 ProgressBar adding mouse event listeners`);
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        console.log(`🎯 ProgressBar removing mouse event listeners`);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  // Đảm bảo component luôn được render
  if (typeof value !== 'number' || typeof min !== 'number' || typeof max !== 'number') {
    console.error('ProgressBar: Invalid props', { value, min, max });
    return (
      <div className="progress-bar-container" style={{ border: '2px solid red', background: 'rgba(255, 0, 0, 0.2)' }}>
        <div className="progress-text">Error: Invalid props</div>
      </div>
    );
  }

  return (
    <div className="progress-bar-container">
      {/* Text bên trên Progress Bar */}
      <div className="progress-text">
        {text}
      </div>
      
      <div 
        className="progress-bar"
        ref={progressBarRef}
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