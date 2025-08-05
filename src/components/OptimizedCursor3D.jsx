import React, { memo } from 'react';
import Cursor3D from './Cursor3D';

// Memoized wrapper to prevent unnecessary re-renders
const OptimizedCursor3D = memo(({ size, onOffsetChange }) => {
  console.log(`🎯 OptimizedCursor3D rendering with size: ${size}`);
  
  return (
    <Cursor3D 
      size={size} 
      onOffsetChange={onOffsetChange}
    />
  );
}, (prevProps, nextProps) => {
  // Custom comparison to prevent re-renders when size changes are minimal
  const sizeDiff = Math.abs(prevProps.size - nextProps.size);
  const shouldSkipRender = sizeDiff < 10 && prevProps.onOffsetChange === nextProps.onOffsetChange;
  
  console.log(`🔍 OptimizedCursor3D memo comparison:`, {
    prevSize: prevProps.size,
    nextSize: nextProps.size,
    sizeDiff: sizeDiff.toFixed(1),
    onOffsetChangeChanged: prevProps.onOffsetChange !== nextProps.onOffsetChange,
    shouldSkipRender: shouldSkipRender
  });
  
  return shouldSkipRender;
});

OptimizedCursor3D.displayName = 'OptimizedCursor3D';

export default OptimizedCursor3D; 