import React, { useState } from 'react';

// Centralized configuration for all theme styles
const themeStyles = {
  light: {
    outerGlow: {
      background: `linear-gradient(180deg, rgba(102, 102, 102, 0.2) 0%, rgba(102, 102, 102, 0) 32.69%), 
                   linear-gradient(180deg, rgba(102, 102, 102, 0) 50%, rgba(102, 102, 102, 0.4) 100%), 
                   linear-gradient(0deg, rgba(29, 29, 29, 0.2), rgba(29, 29, 29, 0.2)), 
                   #1D1D1D`,
      backgroundBlendMode: 'plus-lighter, plus-lighter, color-burn, plus-lighter',
      boxShadow: `inset 40px 40px 22.5px -45px #FFFFFF, 
                  inset -30px -30px 15px -35px #B3B3B3, 
                  inset 5px 5px 2.5px -5px #B3B3B3, 
                  inset 0px 0px 55px rgba(242, 242, 242, 0.5)`,
      backdropFilter: 'blur(50px)',
    },
    middleLayer: {
      background: 'linear-gradient(289.25deg, #C7B7A5 9.32%, #AB8E6F 26.97%, #824F3C 76.55%, #3C241B 91.09%)',
    },
    coreLayer: {
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
    middleLayer: {
      background: 'linear-gradient(289.25deg, #F5D180 9.32%, #C39E4A 26.97%, #866B2D 76.55%, #3C241B 91.09%)',
    },
    coreLayer: {
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
      boxShadow: `inset 40px 40px 22.5px -45px #FFFFFF, 
                  inset -30px -30px 15px -35px #B3B3B3, 
                  inset 5px 5px 2.5px -5px #B3B3B3, 
                  inset 0px 0px 55px rgba(242, 242, 242, 0.5)`,
      backdropFilter: 'blur(50px)',
    },
    middleLayer: {
      background: 'linear-gradient(289.25deg, #F5D180 9.32%, #C39E4A 26.97%, #866B2D 76.55%, #3C241B 91.09%)',
    },
    coreLayer: {
      background: 'linear-gradient(209.93deg, #D2B676 10.11%, #B99239 22.51%, #A37817 78.45%, #8A6413 93.23%)',
      boxShadow: 'inset 0px 9.16667px 13.75px rgba(255, 255, 255, 0.6)',
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

const BackButton = ({ 
  theme = 'balance', 
  icon = null, 
  text = '',
  size = { width: 300, height: 120 },
  onClick = () => {},
  tooltip = '',
  tooltipPosition = 'top', // 'top', 'bottom', 'left', 'right'
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const styles = themeStyles[theme] || themeStyles.balance;

  // Button dimensions according to the original design
  // Group 3: 183px x 76px
  // Rectangle 40 (middle): 175px x 68px
  // Rectangle 39 (core): 161px x 56px
  // All layers maintain responsive positioning with fixed dimensions

  const tooltipContainerStyle = {
    position: 'absolute',
    zIndex: 20,
    display: 'flex',
    alignItems: 'center',
    opacity: isHovered && tooltip ? 1 : 0,
    visibility: isHovered && tooltip ? 'visible' : 'hidden',
    transition: 'opacity 0.2s ease-in-out, visibility 0.2s ease-in-out',
    pointerEvents: 'none',
    top: '100%',
    left: '50%',
    transform: 'translateX(-50%)',
    marginTop: '12px',
    flexDirection: 'column',
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
  
  // Arrow is now simplified and fixed

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'absolute',
        left: '36px',
        top: 'calc(50% - 76px/2)',
        cursor: 'pointer',
        transform: isHovered ? 'scale(1.05)' : 'scale(1)',
        transition: 'transform 0.3s ease-in-out',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        boxSizing: 'border-box',
        gap: '20px',
        borderRadius: '120px',
        zIndex: 10,
        width: '183px',
        height: '76px',
      }}
    >
      {/* Outer glow layer */}
      <div style={{ 
        position: 'absolute', 
        inset: 0, 
        borderRadius: '120px',
        zIndex: 1,
        pointerEvents: 'none',
        ...(styles.outerGlow || {}) 
      }} />
      
      {/* Middle layer - Rectangle 40 */}
      <div style={{ 
        position: 'absolute',
        width: '175px',
        height: '68px',
        left: '4px',
        top: '4px',
        borderRadius: '184px',
        zIndex: 2,
        pointerEvents: 'none',
        ...(styles.middleLayer || {}) 
      }} />
      
      {/* Core layer - Rectangle 39 */}
      <div
        style={{
          position: 'absolute',
          width: '161px',
          height: '56px',
          left: '11px',
          top: '10px',
          borderRadius: '183.333px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          zIndex: 3,
          ...(styles.coreLayer || {}),
        }}
      >
        {/* Shine effect overlay */}
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
            borderRadius: '183.333px',
          }}
        />
        
        {/* Content container */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '20px',
            color: styles.iconColor, 
            zIndex: 1,
            width: '100%',
            height: '100%',
          }}
        >
          {icon && (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {icon}
            </div>
          )}
          {text && (
            <span style={{ 
              fontSize: '20px', 
              fontWeight: '700',
              lineHeight: '27px',
              color: styles.iconColor 
            }}>
              {text}
            </span>
          )}
        </div>
      </div>

      {/* --- Tooltip and Arrow with Dynamic Rendering --- */}
      <div style={tooltipContainerStyle}>
        {/* Arrow pointing up */}
        <div style={{ 
          width: 0,
          height: 0,
          borderLeft: '7px solid transparent',
          borderRight: '7px solid transparent',
          borderBottom: '7px solid #1F1F1F',
          marginBottom: '2px'
        }} />
        
        <div style={tooltipBoxStyle}>
          <span style={{ position: 'relative', zIndex: 1 }}>
            {Array.isArray(tooltip)
              ? tooltip.map((line, index) => (
                  <React.Fragment key={index}>
                    {line}
                    {index < tooltip.length - 1 && <br />}
                  </React.Fragment>
                ))
              : tooltip
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
      </div>
    </div>
  );
};

export default BackButton; 