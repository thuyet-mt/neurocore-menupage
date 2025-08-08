import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import UserIcon from "../assets/user_icon.svg";

// Centralized configuration for all theme styles
const themeStyles = {
  light: {
    outerGlow: {
      background: `linear-gradient(180deg, rgba(102, 102, 102, 0.2) 0%, rgba(102, 102, 102, 0) 32.69%), 
                   linear-gradient(180deg, rgba(102, 102, 102, 0) 50%, rgba(102, 102, 102, 0.4) 100%), 
                   linear-gradient(0deg, rgba(29, 29, 29, 0.2), rgba(29, 29, 29, 0.2)), 
                   #1D1D1D`,
      backgroundBlendMode: 'plus-lighter, plus-lighter, color-burn, plus-lighter',
      boxShadow: `inset 60px 60px 33.75px -67.5px #FFFFFF, 
                  inset -45px -45px 22.5px -52.5px #B3B3B3, 
                  inset 7.5px 7.5px 3.75px -7.5px #B3B3B3, 
                  inset 0px 0px 82.5px rgba(242, 242, 242, 0.5)`,
      backdropFilter: 'blur(75px)',
    },
    middleCircle: {
      background: 'linear-gradient(289.25deg, #C7B7A5 9.32%, #AB8E6F 26.97%, #824F3C 76.55%, #3C241B 91.09%)',
    },
    coreCircle: {
      background: 'linear-gradient(209.93deg, #D3C1AD 10.11%, #C0A88F 22.51%, #9B7B5F 78.45%, #7C5F48 93.23%)',
      boxShadow: 'inset 0px 14px 21px rgba(255, 255, 255, 0.6)',
    },
    iconColor: '#4E3117',
    tooltip: {
      background: '#F0F0F0',
      color: '#333333',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    },
  },
  dark: {
    outerGlow: {
      background: `linear-gradient(180deg, rgba(102, 102, 102, 0.2) 0%, rgba(102, 102, 102, 0) 32.69%), 
                   linear-gradient(180deg, rgba(102, 102, 102, 0) 50%, rgba(102, 102, 102, 0.4) 100%), 
                   linear-gradient(0deg, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)), 
                   linear-gradient(0deg, rgba(29, 29, 29, 0.3), rgba(29, 29, 29, 0.3)), 
                   rgba(29, 29, 29, 0.1)`,
      backgroundBlendMode: 'plus-lighter, plus-lighter, normal, color-burn, overlay',
      boxShadow: `inset 3.225px 3.225px 0.5375px -3.7625px rgba(255, 255, 255, 0.5), 
                  inset 2.15px 2.15px 1.075px -2.15px #B3B3B3, 
                  inset -2.15px -2.15px 1.075px -2.15px #B3B3B3, 
                  inset 0px 0px 23.65px rgba(242, 242, 242, 0.5)`,
      backdropFilter: 'blur(21.5px)',
    },
    middleCircle: {
      background: 'linear-gradient(289.25deg, #F5D180 9.32%, #C39E4A 26.97%, #866B2D 76.55%, #3C241B 91.09%)',
    },
    coreCircle: {
      background: 'linear-gradient(209.93deg, #C8AC72 10.11%, #B99752 22.51%, #9A6F14 78.45%, #3F2D08 93.23%)',
      boxShadow: 'inset 0px 14px 21px rgba(255, 255, 255, 0.6)',
    },
    iconColor: '#4E3117',
    tooltip: {
      background: '#2C2C2C',
      color: '#E0E0E0',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
      border: '1px solid #555',
    },
  },
      balance: {
    outerGlow: {
      background: `linear-gradient(180deg, rgba(102, 102, 102, 0.2) 0%, rgba(102, 102, 102, 0) 32.69%), 
                   linear-gradient(180deg, rgba(102, 102, 102, 0) 50%, rgba(102, 102, 102, 0.4) 100%), 
                   linear-gradient(0deg, rgba(29, 29, 29, 0.2), rgba(29, 29, 29, 0.2)), 
                   #1D1D1D`,
      backgroundBlendMode: 'plus-lighter, plus-lighter, color-burn, plus-lighter',
      boxShadow: `inset 60px 60px 33.75px -67.5px #FFFFFF, 
                  inset -45px -45px 22.5px -52.5px #B3B3B3, 
                  inset 7.5px 7.5px 3.75px -7.5px #B3B3B3, 
                  inset 0px 0px 82.5px rgba(242, 242, 242, 0.5)`,
      backdropFilter: 'blur(75px)',
    },
    middleCircle: {
      background: 'linear-gradient(289.25deg, #B8945F 9.32%, #9A7A45 26.97%, #7A5F35 76.55%, #3C241B 91.09%)',
    },
    coreCircle: {
      background: 'linear-gradient(209.93deg, #C8AC72 10.11%, #B99752 22.51%, #9A6F14 78.45%, #8A6413 93.23%)',
      boxShadow: 'inset 0px 14px 21px rgba(255, 255, 255, 0.6)',
    },
    iconColor: '#4E3117',
    tooltip: {
      background: '#1F1F1F',
      color: '#FFFFFF',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
      border: '1px solid #D4AF37',
    },
  },
};

// Menu icon SVG component
const MenuIcon = ({ color = '#4E3117', size = 48 }) => (
  <img src={UserIcon} alt="Menu" width={size} height={size} style={{ color: color }} />
);

const MenuButton = ({ 
  theme = 'balance', 
  size = 80,
  onClick = () => {},
  tooltip = 'Menu',
  tooltipPosition = 'left', // 'top', 'bottom', 'left', 'right'
  position = { right: '64px', top: '64px' }
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const { currentMode } = useTheme();
  const { getText } = useLanguage();
  
  const currentTheme = theme === 'auto' ? currentMode : theme;
  const styles = themeStyles[currentTheme] || themeStyles.balance;

  const outerSize = size;
  const innerSize = size * 0.92;
  const coreSize = size * 0.83;

  // --- DYNAMIC TOOLTIP POSITION LOGIC ---
  const getPositionStyles = () => {
    const gap = '12px';
    switch (tooltipPosition) {
      case 'bottom':
        return { top: '100%', left: '50%', transform: 'translateX(-50%)', marginTop: gap, flexDirection: 'column' };
      case 'left':
        return { right: '100%', top: '50%', transform: 'translateY(-50%)', marginRight: gap, flexDirection: 'row' };
      case 'right':
        return { left: '100%', top: '50%', transform: 'translateY(-50%)', marginLeft: gap, flexDirection: 'row' };
      case 'top':
      default:
        return { bottom: '100%', left: '50%', transform: 'translateX(-50%)', marginBottom: gap, flexDirection: 'column' };
    }
  };

  const tooltipContainerStyle = {
    position: 'absolute',
    zIndex: 10,
    display: 'flex',
    alignItems: 'center',
    opacity: isHovered && tooltip ? 1 : 0,
    visibility: isHovered && tooltip ? 'visible' : 'hidden',
    transition: 'opacity 0.2s ease-in-out, visibility 0.2s ease-in-out',
    pointerEvents: 'none',
    ...getPositionStyles(),
  };

  const tooltipBoxStyle = {
    padding: '8px 12px',
    borderRadius: '6px',
    fontSize: '14px',
    whiteSpace: 'nowrap',
    ...styles.tooltip, 
    position: 'relative',
    overflow: 'hidden',
  };
  
  // --- DYNAMIC ARROW LOGIC FOR ALL DIRECTIONS ---
  const getArrowStyles = (isFill = false) => {
    const arrowSize = '7px';
    const borderColor = styles.tooltip.border ? styles.tooltip.border : styles.tooltip.background;
    const fillColor = styles.tooltip.background || '#000';
    const color = isFill ? fillColor : borderColor;

    // For bordered tooltips, the fill is placed 1px inside
    // For non-bordered tooltips, the fill is placed at 0px (overlapping)
    const fillOffset = styles.tooltip.border ? '1px' : '0px';

    const baseStyles = {
      width: 0,
      height: 0,
    };

    switch (tooltipPosition) {
      case 'bottom': // Arrow points up
        return {
          ...baseStyles,
          borderLeft: `${arrowSize} solid transparent`,
          borderRight: `${arrowSize} solid transparent`,
          borderBottom: `${arrowSize} solid ${color}`,
          ...(isFill && { position: 'absolute', top: `-${parseInt(arrowSize)-1}px`, left: `-${arrowSize}` }),
        };
      case 'left': // Arrow points right
        return {
          ...baseStyles,
          borderTop: `${arrowSize} solid transparent`,
          borderBottom: `${arrowSize} solid transparent`,
          borderLeft: `${arrowSize} solid ${color}`,
          ...(isFill && { position: 'absolute', left: fillOffset, top: `-${arrowSize}` }),
        };
      case 'right': // Arrow points left
        return {
          ...baseStyles,
          borderTop: `${arrowSize} solid transparent`,
          borderBottom: `${arrowSize} solid transparent`,
          borderRight: `${arrowSize} solid ${color}`,
          ...(isFill && { position: 'absolute', right: fillOffset, top: `-${arrowSize}` }),
        };
      case 'top': // Arrow points down
      default:
        return {
          ...baseStyles,
          borderLeft: `${arrowSize} solid transparent`,
          borderRight: `${arrowSize} solid transparent`,
          borderTop: `${arrowSize} solid ${color}`,
          ...(isFill && { position: 'absolute', bottom: `-${parseInt(arrowSize)-1}px`, left: `-${arrowSize}` }),
        };
    }
  };

  const Arrow = () => (
    <div style={{ position: 'relative', ...getArrowStyles(false) }}>
      {styles.tooltip.border && <div style={getArrowStyles(true)} />}
    </div>
  );

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'absolute',
        width: outerSize,
        height: outerSize,
        borderRadius: '50%',
        cursor: 'pointer',
        transform: isHovered ? 'scale(1.05)' : 'scale(1)',
        transition: 'transform 0.3s ease-in-out',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
        ...position,
      }}
    >
      {/* Button layers */}
      <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', ...(styles.outerGlow || {}) }} />
      <div style={{ position: 'absolute', width: innerSize, height: innerSize, borderRadius: '50%', ...(styles.middleCircle || {}) }} />
      <div
        style={{
          position: 'relative',
          width: coreSize,
          height: coreSize,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          ...(styles.coreCircle || {}),
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '-50%',
            width: '200%',
            height: '100%',
            background: 'linear-gradient(to right, transparent, rgba(255, 255, 255, 0.4), transparent)',
            transform: isHovered ? 'translateX(25%)' : 'translateX(-125%)',
            transition: 'transform 0.7s ease-in-out',
            pointerEvents: 'none',
          }}
        />
        <MenuIcon color={styles.iconColor} size={coreSize * 0.77} />
      </div>

      {/* Tooltip and Arrow with Dynamic Rendering */}
      <div style={tooltipContainerStyle}>
        {/* Render arrow before the box for 'right' and 'bottom' positions */}
        {['right', 'bottom'].includes(tooltipPosition) && <Arrow />}
        
        <div style={tooltipBoxStyle}>
          <span style={{ position: 'relative', zIndex: 1 }}>
            {Array.isArray(tooltip)
              ? tooltip.map((line, index) => (
                  <React.Fragment key={index}>
                    {typeof line === 'string' && line.startsWith('tooltip_') ? getText(line) : line}
                    {index < tooltip.length - 1 && <br />}
                  </React.Fragment>
                ))
              : typeof tooltip === 'string' && tooltip.startsWith('tooltip_') ? getText(tooltip) : tooltip
            }
          </span>
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '50%',
              height: '100%',
              background: 'linear-gradient(to right, transparent 0%, rgba(255, 255, 255, 0.3) 50%, transparent 100%)',
              transform: isHovered ? 'translateX(250%)' : 'translateX(-100%)',
              transition: isHovered ? 'transform 0.6s ease-out' : 'none',
              zIndex: 0,
            }}
          />
        </div>

        {/* Render arrow after the box for 'left' and 'top' positions */}
        {['left', 'top'].includes(tooltipPosition) && <Arrow />}
      </div>
    </div>
  );
};

export default MenuButton; 