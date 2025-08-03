import { THEME_CONFIG } from '../constants/buttons';

export const getThemeStyles = (currentMode) => {
  return THEME_CONFIG[currentMode] || THEME_CONFIG.light;
};

export const getResponsiveTextStyle = (baseSize = 23) => ({
  fontFamily: 'Open Sans',
  fontWeight: '700',
  fontStyle: 'normal',
  fontSize: `clamp(${Math.max(10, baseSize * 0.6)}px, ${Math.max(1.5, baseSize * 0.1)}vw, ${baseSize}px)`,
  lineHeight: '100%',
  letterSpacing: '0%',
  textAlign: 'center',
  color: '#4E3117',
  textTransform: 'none'
});

export const getThemeFromMode = (currentMode) => {
  switch (currentMode) {
    case 'dark':
      return 'dark';
    case 'light':
      return 'light';
    case 'balance':
      return 'gold';
    default:
      return 'gold';
  }
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}; 