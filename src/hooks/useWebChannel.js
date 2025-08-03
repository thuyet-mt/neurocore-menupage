import { useState, useEffect } from 'react';
import webChannelService from '../services/WebChannelService';

export const useWebChannel = () => {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initialize = async () => {
      try {
        await webChannelService.initialize();
        setIsReady(true);
        setError(null);
      } catch (err) {
        setError(err);
        setIsReady(false);
      }
    };

    initialize();
  }, []);

  const callSlot = async (slotMethod, successMessage, errorMessage) => {
    try {
      await slotMethod();
      return { success: true, message: successMessage };
    } catch (err) {
      console.error('Slot call failed:', err);
      return { success: false, message: errorMessage || 'Action failed' };
    }
  };

  return {
    isReady,
    error,
    callSlot,
    webChannelService
  };
}; 