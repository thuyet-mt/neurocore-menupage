import React, { useState, useEffect, useCallback, useMemo, Suspense, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import webChannelService from '../services/WebChannelService';
import './Neurocore.css';
import backgroundImg from "../assets/background_menu.png";

// Lazy load components để cải thiện performance
const MenuButton = React.lazy(() => import("./MenuButton"));
const ModeButton = React.lazy(() => import("./ModeButton"));
const ContainerFramePB = React.lazy(() => import("./ContainerFrame"));
const ContainerFrameMenu = React.lazy(() => import("./ContainerFrame"));
const GoldenButton = React.lazy(() => import("./GoldenButton"));
const ProgressBar = React.lazy(() => import("./ProgressBar"));

// Optimized 3D Logo with performance improvements
const OptimizedLogo3D = React.lazy(() => import("./OptimizedLogo3D"));

// Icons - preload để tránh re-render
import NeurostatIcon from "../assets/neurostat_icon.svg";
import NeurolabIcon from "../assets/neurolab_icon.svg";
import NeurotoolsIcon from "../assets/neurotools_icon.svg";
import NeurobaseIcon from "../assets/neurobase_icon.svg";
import NeuropacksIcon from "../assets/neuropacks_icon.svg";
import NeurocontrolIcon from "../assets/neurocontrol_icon.svg";
import NeuroalertIcon from "../assets/neuroalert_icon.svg";

// Performance optimized debounce
const useDebounce = (func, wait) => {
  const timeoutRef = useRef();
  
  return useCallback((...args) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => func(...args), wait);
  }, [func, wait]);
};

// Memoized button component để tránh re-render không cần thiết
const MemoizedGoldenButton = React.memo(({ 
  theme, 
  onClick, 
  tooltip, 
  tooltipPosition, 
  size, 
  icon, 
  className 
}) => (
  <GoldenButton
    theme={theme}
    onClick={onClick}
    tooltip={tooltip}
    tooltipPosition={tooltipPosition}
    size={size}
    icon={icon}
    className={className}
  />
));

// Performance optimized loading component
const LoadingSpinner = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    color: '#4E3117',
    fontSize: '18px'
  }}>
    <div style={{
      width: '40px',
      height: '40px',
      border: '4px solid #f3f3f3',
      borderTop: '4px solid #4E3117',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    }} />
  </div>
);

export default function OptimizedNeurocore({ progressValue = 35, onProgressChange = () => {} }) {
  const { currentMode } = useTheme();
  const { getText, getTextWithParams, loading, error } = useLanguage();
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [isWebChannelReady, setIsWebChannelReady] = useState(false);
  const [backgroundScale, setBackgroundScale] = useState(0.7);
  const [isZooming, setIsZooming] = useState(false);

  // Memoized theme styles để tránh re-calculate
  const themeStyles = useMemo(() => {
    switch (currentMode) {
      case 'light':
        return { background: '#E4DAC2', filter: 'none' };
      case 'dark':
        return { background: '#030303', filter: 'none' };
      case 'balance':
        return { background: '#615637', filter: 'none' };
      default:
        return {};
    }
  }, [currentMode]);

  // Memoized responsive text style
  const getResponsiveTextStyle = useCallback((baseSize = 23) => ({
    fontFamily: 'Open Sans',
    fontWeight: '700',
    fontStyle: 'normal',
    fontSize: `clamp(${Math.max(10, baseSize * 0.6)}px, ${Math.max(1.5, baseSize * 0.1)}vw, ${baseSize}px)`,
    lineHeight: '100%',
    letterSpacing: '0%',
    textAlign: 'center',
    color: '#4E3117',
    textTransform: 'none'
  }), []);

  // Optimized WebChannel initialization
  useEffect(() => {
    let mounted = true;
    
    const initializeWebChannel = async () => {
      try {
        await webChannelService.initialize();
        if (mounted) {
          setIsWebChannelReady(true);
          console.log('✅ WebChannel ready for use');
        }
      } catch (error) {
        if (mounted) {
          console.error('❌ Failed to initialize WebChannel:', error);
          setIsWebChannelReady(false);
        }
      }
    };

    initializeWebChannel();
    
    return () => {
      mounted = false;
    };
  }, []);

  // Optimized notification system
  const showNotificationWithMessage = useCallback((message) => {
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  }, []);

  // Optimized slot calling with better error handling
  const callSlotWithNotification = useCallback(async (slotMethod, successMessage, errorMessage) => {
    try {
      if (!isWebChannelReady) {
        throw new Error('WebChannel not ready');
      }
      
      await slotMethod();
      showNotificationWithMessage(successMessage);
    } catch (error) {
      console.error('Slot call failed:', error);
      
      if (error.message.includes('WebChannel') || error.message.includes('execCallbacks')) {
        console.log('🔄 Attempting to reconnect WebChannel...');
        try {
          await webChannelService.reset();
          await webChannelService.initialize();
          setIsWebChannelReady(true);
          await slotMethod();
          showNotificationWithMessage(successMessage);
          return;
        } catch (retryError) {
          console.error('Retry failed:', retryError);
        }
      }
      
      showNotificationWithMessage(errorMessage || 'Action failed');
    }
  }, [isWebChannelReady, showNotificationWithMessage]);

  // Optimized button handlers với debounce
  const createButtonHandler = useCallback((slotMethod, successKey, errorKey) => {
    return useDebounce(() => {
      callSlotWithNotification(
        slotMethod,
        getText(successKey),
        getText(errorKey)
      );
    }, 100);
  }, [callSlotWithNotification, getText]);

  const handleNeurocontrolButtonClick = createButtonHandler(
    () => webChannelService.openNeurocontrol(),
    "neurocontrol_opened",
    "neurocontrol_failed"
  );

  const handleNeurolabButtonClick = createButtonHandler(
    () => webChannelService.openNeurolab(),
    "neurolab_opened",
    "neurolab_failed"
  );

  const handleNeurostatButtonClick = createButtonHandler(
    () => webChannelService.openNeurostat(),
    "neurostat_opened",
    "neurostat_failed"
  );

  const handleCommandesButtonClick = createButtonHandler(
    () => webChannelService.openCommandes(),
    "commandes_opened",
    "commandes_failed"
  );

  const handleNeurobaseButtonClick = createButtonHandler(
    () => webChannelService.on_open_neurobase(),
    "neurobase_opened",
    "neurobase_failed"
  );

  const handleNeuroalertButtonClick = createButtonHandler(
    () => webChannelService.openNeuroalert(),
    "neuroalert_opened",
    "neuroalert_failed"
  );

  const handleNeuropacksButtonClick = createButtonHandler(
    () => webChannelService.openNeuropacks(),
    "neuropacks_opened",
    "neuropacks_failed"
  );

  // Optimized progress change handler
  const handleProgressChange = useCallback((newValue) => {
    onProgressChange(newValue);
    
    callSlotWithNotification(
      () => webChannelService.updateProgress(newValue),
      getTextWithParams("progress_updated", { value: Math.round(newValue) }),
      getText("progress_failed")
    );
  }, [onProgressChange, callSlotWithNotification, getTextWithParams, getText]);

  // Optimized wheel handler với throttling
  const handleWheel = useCallback((e) => {
    e.preventDefault();
    
    if (isZooming) return;
    
    setIsZooming(true);
    
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    const newScale = Math.max(0.3, Math.min(2.5, backgroundScale + delta));
    
    setBackgroundScale(newScale);
    
    setTimeout(() => setIsZooming(false), 100);
  }, [backgroundScale, isZooming]);

  // Memoized button configurations
  const buttonConfigs = useMemo(() => [
    {
      className: 'button-neurocontrol',
      icon: NeurocontrolIcon,
      text: getText("neurocontrol"),
      onClick: handleNeurocontrolButtonClick,
      tooltip: "tooltip_neurocontrol"
    },
    {
      className: 'button-neurolab',
      icon: NeurolabIcon,
      text: getText("neurolab"),
      onClick: handleNeurolabButtonClick,
      tooltip: "tooltip_neurolab"
    },
    {
      className: 'button-neurostat',
      icon: NeurostatIcon,
      text: getText("neurostat"),
      onClick: handleNeurostatButtonClick,
      tooltip: "tooltip_neurostat"
    },
    {
      className: 'button-neurotools',
      icon: NeurotoolsIcon,
      text: getText("neurotools"),
      onClick: handleCommandesButtonClick,
      tooltip: "tooltip_neurotools"
    },
    {
      className: 'button-neurobase',
      icon: NeurobaseIcon,
      text: getText("neurobase"),
      onClick: handleNeurobaseButtonClick,
      tooltip: "tooltip_neurobase"
    },
    {
      className: 'button-neuropacks',
      icon: NeuropacksIcon,
      text: getText("neuropacks"),
      onClick: handleNeuropacksButtonClick,
      tooltip: "tooltip_neuropacks"
    },
    {
      className: 'button-neuroalert',
      icon: NeuroalertIcon,
      text: getText("neuroalert"),
      onClick: handleNeuroalertButtonClick,
      tooltip: "tooltip_neuroalert"
    }
  ], [getText, handleNeurocontrolButtonClick, handleNeurolabButtonClick, handleNeurostatButtonClick, 
      handleCommandesButtonClick, handleNeurobaseButtonClick, handleNeuropacksButtonClick, handleNeuroalertButtonClick]);

  // Show loading state
  if (loading) {
    return <LoadingSpinner />;
  }

  // Show error state
  if (error) {
    return (
      <div className="neurocore-root" style={themeStyles}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          color: '#ff0000',
          fontSize: '18px'
        }}>
          Error loading language data: {error}
        </div>
      </div>
    );
  }

  return (
    <div 
      className="neurocore-root" 
      style={themeStyles} 
      data-theme={currentMode}
      onWheel={handleWheel}
    >
      {/* Optimized background rendering */}
      <div className="neurocore-bg" />
      <div className="neurocore-image-bg">
        <img 
          src={backgroundImg} 
          alt="background" 
          style={{
            transform: `scale(${backgroundScale})`,
            transformOrigin: 'center center',
            transition: 'transform 0.1s ease-out'
          }}
        />
      </div>

      {/* Optimized 3D Logo with Suspense */}
      <div className="neurocore-logo">
        <Suspense fallback={<div style={{ width: '100%', height: '100%', background: 'transparent' }} />}>
          <OptimizedLogo3D
            position={[0, 0, 0]}
            scale={13.0}
            autoRotate={false}
            rotationSpeed={0.3}
            hoverEffect={true}
            enableAnimations={true}
            animationSpeed={2.0}
            loopAnimations={true}
            enableSmoothRotation={true}
            initialRotationSpeed={12.0}
            rotationDuration={3.0}
            onClick={() => {
              console.log('🎯 3D Logo clicked!');
              showNotificationWithMessage('🎨 Logo 3D được click!');
            }}
          />
        </Suspense>
      </div>

      <h1 className="neurocore-title">{getText("title")}</h1>

      {/* Optimized Menu Button */}
      <Suspense fallback={<div />}>
        <MenuButton onClick={handleMenuButtonClick} tooltip="tooltip_menu_button" />
      </Suspense>

      {/* Optimized buttons rendering */}
      {buttonConfigs.map((config, index) => (
        <div key={config.className} className={config.className}>
          <Suspense fallback={<div style={{ width: '100%', height: '100%', background: 'rgba(255,255,255,0.1)' }} />}>
            <MemoizedGoldenButton
              theme={currentMode === 'dark' ? 'dark' : currentMode === 'light' ? 'light' : 'balance'}
              onClick={config.onClick}
              tooltip={config.tooltip}
              tooltipPosition="top"
              size="100%"
              icon={
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px'
                }}>
                  <img src={config.icon} alt="logo"/>
                  <div style={getResponsiveTextStyle(23)}>
                    {config.text}
                  </div>
                </div>
              }
            />
          </Suspense>
        </div>
      ))}

      {/* Optimized Progress Bar */}
      <Suspense fallback={<div />}>
        <ContainerFramePB>
          <ProgressBar 
            value={progressValue} 
            onChange={handleProgressChange}
            theme={currentMode}
          />
        </ContainerFramePB>
      </Suspense>

      {/* Optimized Mode Button */}
      <Suspense fallback={<div />}>
        <ModeButton 
          currentMode={currentMode}
          onModeChange={handleModeButtonClick}
        />
      </Suspense>

      {/* Notification System */}
      {showNotification && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(0, 0, 0, 0.9)",
            color: "white",
            padding: "15px 20px",
            borderRadius: "8px",
            zIndex: 10000,
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            animation: "slideDown 0.3s ease-out",
          }}
        >
          {notificationMessage}
        </div>
      )}

      {/* Benchmark Panel */}
      <Suspense fallback={<div />}>
        <BenchmarkPanel />
      </Suspense>
    </div>
  );
}
