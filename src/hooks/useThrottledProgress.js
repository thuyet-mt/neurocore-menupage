import { useState, useCallback, useRef } from 'react';

export const useThrottledProgress = (initialValue = 35, throttleMs = 16) => {
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

    // Only update if the change is significant
    const change = Math.abs(newValue - lastUpdateRef.current);
    if (change < 2) {
      console.log(`⏱️ Skipping insignificant change: ${change.toFixed(1)} < 2`);
      return;
    }

    // Check if this is a significant change from the last intentional update
    const intentionalChange = Math.abs(newValue - lastIntentionalUpdateRef.current);
    if (intentionalChange > 5) { // Significant intentional change
      console.log(`⏱️ Significant intentional change detected: ${intentionalChange.toFixed(1)} > 5`);
      lastIntentionalUpdateRef.current = newValue;
    }

    console.log(`⏱️ Scheduling throttled update: ${newValue} (${throttleMs}ms delay)`);
    // Throttle the update
    timeoutRef.current = setTimeout(() => {
      console.log(`⏱️ Executing throttled update: ${progressValue} → ${newValue}`);
      setProgressValue(newValue);
      lastUpdateRef.current = newValue;
    }, throttleMs);
  }, [throttleMs, progressValue]);

  return [progressValue, updateProgress];
}; 