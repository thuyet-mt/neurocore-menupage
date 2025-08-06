import React, { memo, useRef } from 'react';
import Cursor3D from './Cursor3D';

// Optimized memoized wrapper for Cursor3D
const OptimizedCursor3D = memo(({ size, onOffsetChange }) => {
  const renderCountRef = useRef(0);
  renderCountRef.current += 1;
  
  console.log(`🎯 OptimizedCursor3D rendering #${renderCountRef.current} with size: ${size}`);

  return (
    <Cursor3D 
      size={size} 
      onOffsetChange={onOffsetChange}
    />
  );
}, (prevProps, nextProps) => {
  const sizeDiff = Math.abs(prevProps.size - nextProps.size);
  const onOffsetChangeChanged = prevProps.onOffsetChange !== nextProps.onOffsetChange;
  
  // Increased threshold for better performance - only skip if size change is very small
  const shouldSkip = sizeDiff < 20 && !onOffsetChangeChanged; // Increased from 10 to 20
  
  console.log(`🔍 OptimizedCursor3D memo comparison:`, {
    prevSize: prevProps.size,
    nextSize: nextProps.size,
    sizeDiff: sizeDiff.toFixed(1),
    onOffsetChangeChanged,
    shouldSkip
  });
  
  return shouldSkip;
});

OptimizedCursor3D.displayName = 'OptimizedCursor3D';

export default OptimizedCursor3D; 