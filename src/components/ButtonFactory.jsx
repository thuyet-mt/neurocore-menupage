import React from 'react';
import GoldenButton from './GoldenButton';
import { BUTTON_CONFIG } from '../constants/buttons';
import { useTheme } from '../contexts/ThemeContext';

// Import all icons dynamically
const importIcon = (iconName) => {
  try {
    return require(`../assets/${iconName}`).default;
  } catch (error) {
    console.warn(`Icon ${iconName} not found`);
    return null;
  }
};

const ButtonFactory = ({ 
  buttonType, 
  onClick, 
  className = '', 
  size = '100%',
  tooltipPosition = 'top'
}) => {
  const { currentMode } = useTheme();
  const config = BUTTON_CONFIG[buttonType];
  
  if (!config) {
    console.error(`Button type ${buttonType} not found`);
    return null;
  }

  const IconComponent = importIcon(config.icon);
  
  const getResponsiveTextStyle = (baseSize = 23) => ({
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

  const icon = (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px'
    }}>
      {IconComponent && <img src={IconComponent} alt={config.title} />}
      <div style={getResponsiveTextStyle(23)}>
        {config.title}
      </div>
      {config.subtitle && (
        <div style={getResponsiveTextStyle(16)}>
          {config.subtitle}
        </div>
      )}
    </div>
  );

  return (
    <div className={`button-${config.id} ${className}`}>
      <GoldenButton
        theme={currentMode === 'dark' ? 'dark' : currentMode === 'light' ? 'light' : 'balance'}
        onClick={onClick}
        tooltip={`${config.title} Button - Click me!`}
        tooltipPosition={tooltipPosition}
        size={size}
        icon={icon}
      />
    </div>
  );
};

export default ButtonFactory; 