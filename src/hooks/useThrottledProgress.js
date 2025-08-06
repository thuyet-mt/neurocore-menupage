import { useState, useCallback, useRef, useEffect } from 'react';

export const useThrottledProgress = (initialValue = 35, throttleMs = 32) => {
  const [progressValue, setProgressValue] = useState(initialValue);
  const timeoutRef = useRef(null);
  const lastUpdateRef = useRef(initialValue);
  const lastIntentionalUpdateRef = useRef(initialValue);

  const updateProgress = useCallback((newValue) => {
    console.log(`⏱️ useThrottledProgress update requested: ${progressValue} → ${newValue}`);
    
    // Clear existing timeout
    if (timeoutRef.current) {
      console.log(`⏱️ Clearing existing timeout`);
      clearTimeout(timeoutRef.current);
    }

    // Only update if the change is significant (increased threshold)
    const change = Math.abs(newValue - lastUpdateRef.current);
    if (change < 5) { // Increased from 2 to 5 for better performance
      console.log(`⏱️ Skipping insignificant change: ${change.toFixed(1)} < 5`);
      return;
    }

    // Check if this is a significant change from the last intentional update
    const intentionalChange = Math.abs(newValue - lastIntentionalUpdateRef.current);
    if (intentionalChange > 10) { // Increased from 5 to 10 for better performance
      console.log(`⏱️ Significant intentional change detected: ${intentionalChange.toFixed(1)} > 10`);
      lastIntentionalUpdateRef.current = newValue;
    }

    console.log(`⏱️ Scheduling throttled update: ${newValue} (${throttleMs}ms delay)`);
    // Throttle the update with increased delay
    timeoutRef.current = setTimeout(() => {
      console.log(`⏱️ Executing throttled update: ${progressValue} → ${newValue}`);
      setProgressValue(newValue);
      lastUpdateRef.current = newValue;
    }, throttleMs);
  }, [throttleMs, progressValue]);

  // Improved cleanup
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, []);

  return [progressValue, updateProgress];
}; 