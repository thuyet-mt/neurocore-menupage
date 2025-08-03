import React, { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [currentMode, setCurrentMode] = useState('light');

  const toggleMode = () => {
    setCurrentMode(prev => {
      if (prev === 'light') return 'dark';
      if (prev === 'dark') return 'balance';
      if (prev === 'balance') return 'light';
      return 'light';
    });
  };

  const setMode = (mode) => {
    setCurrentMode(mode);
  };

  const value = {
    currentMode,
    toggleMode,
    setMode,
  };

  return React.createElement(ThemeContext.Provider, { value }, children);
}; 