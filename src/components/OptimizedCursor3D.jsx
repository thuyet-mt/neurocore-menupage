import React, { memo, useRef } from 'react';
import Cursor3D from './Cursor3D';

// Simple memoized wrapper for Cursor3D - always enabled
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
  
  // Simple skip logic - only skip if size change is small and onOffsetChange unchanged
  const shouldSkip = sizeDiff < 10 && !onOffsetChangeChanged;
  
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