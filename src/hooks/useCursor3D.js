import { useState, useEffect } from 'react';

export const useCursor3D = () => {
  const [isEnabled, setIsEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Toggle cursor 3D
  const toggleCursor = () => {
    setIsEnabled(!isEnabled);
    
    // Update body cursor style
    if (!isEnabled) {
      document.body.style.cursor = 'none';
    } else {
      document.body.style.cursor = 'auto';
    }
  };

  // Enable cursor 3D
  const enableCursor = () => {
    setIsEnabled(true);
    document.body.style.cursor = 'none';
  };

  // Disable cursor 3D
  const disableCursor = () => {
    setIsEnabled(false);
    document.body.style.cursor = 'auto';
  };

  // Check if device supports 3D cursor
  const checkSupport = () => {
    const supportsWebGL = () => {
      try {
        const canvas = document.createElement('canvas');
        return !!(window.WebGLRenderingContext && 
          (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
      } catch (e) {
        return false;
      }
    };

    return supportsWebGL();
  };

  // Initialize cursor 3D
  useEffect(() => {
    const supports3D = checkSupport();
    
    if (!supports3D) {
      setError('WebGL not supported');
      setIsEnabled(false);
      return;
    }

    // Set initial cursor state
    if (isEnabled) {
      document.body.style.cursor = 'none';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.cursor = 'auto';
    };
  }, [isEnabled]);

  return {
    isEnabled,
    isLoading,
    error,
    toggleCursor,
    enableCursor,
    disableCursor,
    checkSupport
  };
}; 