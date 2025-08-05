import React, { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import webChannelService from '../services/WebChannelService';
import './Neurocore.css';
import backgroundImg from "../assets/background_menu.png";
// import logoImg from "../assets/logo_neuro.png"; // Replaced with 3D logo
import MenuButton from "./MenuButton";
import ModeButton from "./ModeButton";
// Components ContainerFrame for ProgressBar
import ContainerFramePB from "./ContainerFrame";
// Components ContainerFrame for Menu
import ContainerFrameMenu from "./ContainerFrame";
import GoldenButton from "./GoldenButton";
import ProgressBar from "./ProgressBar";
// 3D Logo Components
import { Canvas } from '@react-three/fiber';
import Logo3DModel from "./Logo3DModel";


import NeurostatIcon from "../assets/neurostat_icon.svg"
import NeurolabIcon from "../assets/neurolab_icon.svg"
import NeurotoolsIcon from "../assets/neurotools_icon.svg"
import NeurobaseIcon from "../assets/neurobase_icon.svg"
import NeuropacksIcon from "../assets/neuropacks_icon.svg"
import NeurocontrolIcon from "../assets/neurocontrol_icon.svg"
import NeuroalertIcon from "../assets/neuroalert_icon.svg"
import BackButton from "./BackButton";
import BackIcon from "../assets/back_icon.svg";



// Debounce utility
const debounce = (func, wait) => {
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

export default function Neurocore({ progressValue = 35, onProgressChange = () => {} }) {
  const { currentMode } = useTheme();
  const { getText, getTextWithParams, loading, error } = useLanguage();
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [isWebChannelReady, setIsWebChannelReady] = useState(false);
  const [backgroundScale, setBackgroundScale] = useState(0.7);
  const [isZooming, setIsZooming] = useState(false);

  // Khởi tạo WebChannel khi component mount
  useEffect(() => {
    const initializeWebChannel = async () => {
      try {
        await webChannelService.initialize();
        setIsWebChannelReady(true);
        console.log('✅ WebChannel ready for use');
      } catch (error) {
        console.error('❌ Failed to initialize WebChannel:', error);
        setIsWebChannelReady(false);
      }
    };

    initializeWebChannel();
  }, []);

  // Helper function để hiển thị notification
  const showNotificationWithMessage = (message) => {
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  // Helper function để gọi slot với error handling
  const callSlotWithNotification = async (slotMethod, successMessage, errorMessage) => {
    try {
      // Kiểm tra WebChannel connection trước khi gọi
      if (!isWebChannelReady) {
        throw new Error('WebChannel not ready');
      }
      
      await slotMethod();
      showNotificationWithMessage(successMessage);
    } catch (error) {
      console.error('Slot call failed:', error);
      
      // Nếu lỗi liên quan đến WebChannel, thử reconnect
      if (error.message.includes('WebChannel') || error.message.includes('execCallbacks')) {
        console.log('🔄 Attempting to reconnect WebChannel...');
        try {
          await webChannelService.reset();
          await webChannelService.initialize();
          setIsWebChannelReady(true);
          // Thử lại một lần nữa
          await slotMethod();
          showNotificationWithMessage(successMessage);
          return;
        } catch (retryError) {
          console.error('Retry failed:', retryError);
        }
      }
      
      showNotificationWithMessage(errorMessage || 'Action failed');
    }
  };

  // Theme-based styling for main container
  const getThemeStyles = () => {
    switch (currentMode) {
      case 'light':
        return {
          background: '#E4DAC2',
          filter: 'none'
        };
      case 'dark':
        return {
          background: '#030303',
          filter: 'none'
        };
      case 'balance':
        return {
          background: '#615637',
          filter: 'none'
        };
      default:
        return {};
    }
  };

  // === Handler functions với WebChannel integration ===

  const handleNeurocontrolButtonClick = useCallback(
    debounce(() => {
      callSlotWithNotification(
        () => webChannelService.openNeurocontrol(),
        getText("neurocontrol_opened"),
        getText("neurocontrol_failed")
      );
    }, 100),
    [getText]
  );



  const handleNeurolabButtonClick = useCallback(
    debounce(() => {
      callSlotWithNotification(
        () => webChannelService.openNeurolab(),
        getText("neurolab_opened"),
        getText("neurolab_failed")
      );
    }, 100),
    [getText]
  );

  const handleNeurostatButtonClick = useCallback(
    debounce(() => {
      callSlotWithNotification(
        () => webChannelService.openNeurostat(),
        getText("neurostat_opened"),
        getText("neurostat_failed")
      );
    }, 100),
    [getText]
  );

  const handleCommandesButtonClick = useCallback(
    debounce(() => {
      callSlotWithNotification(
        () => webChannelService.openCommandes(),
        getText("commandes_opened"),
        getText("commandes_failed")
      );
    }, 100),
    [getText]
  );

  const handleNeurobaseButtonClick = () => {
    callSlotWithNotification(
      () => webChannelService.on_open_neurobase(),
      getText("neurobase_opened"),
      getText("neurobase_failed")
    );
  };

  const handleNeuroalertButtonClick = () => {
    callSlotWithNotification(
      () => webChannelService.openNeuroalert(),
      getText("neuroalert_opened"),
      getText("neuroalert_failed")
    );
  };

  const handleNeuropacksButtonClick = () => {
    callSlotWithNotification(
      () => webChannelService.openNeuropacks(),
      getText("neuropacks_opened"),
      getText("neuropacks_failed")
    );
  };

  const handleBackButtonClick = () => {
    callSlotWithNotification(
      () => webChannelService.goBack(),
      getText("navigating_back"),
      getText("back_failed")
    );
  };

  const handleProgressChange = (newValue) => {
    onProgressChange(newValue);
    
    // Gọi slot để cập nhật progress
    callSlotWithNotification(
      () => webChannelService.updateProgress(newValue),
      getTextWithParams("progress_updated", { value: Math.round(newValue) }),
      getText("progress_failed")
    );
  };

  // === Additional handlers cho Menu và Mode buttons ===
  
  const handleMenuButtonClick = () => {
    callSlotWithNotification(
      () => webChannelService.shutdown(),
      getText("menu_opened"),
      getText("menu_failed")
    );
  };

  const handleModeButtonClick = (mode) => {
    callSlotWithNotification(
      () => webChannelService.changeMode(mode),
      getTextWithParams("mode_changed", { mode }),
      getText("mode_failed")
    );
  };

  // === Test Handlers ===
  
  const handleTestClose = () => {
    callSlotWithNotification(
      () => webChannelService.testCloseWindow(),
      getText("testing_close"),
      getText("test_failed")
    );
  };

  // Handle background zoom with mouse wheel
  const handleWheel = useCallback((e) => {
    e.preventDefault();
    
    if (isZooming) return; // Prevent rapid zooming
    
    setIsZooming(true);
    
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    const newScale = Math.max(0.3, Math.min(2.5, backgroundScale + delta));
    
    setBackgroundScale(newScale);
    
    // Reset zooming flag after a short delay
    setTimeout(() => setIsZooming(false), 100);
  }, [backgroundScale, isZooming]);

  // Responsive text styles helper
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

  // Show loading state if language data is still loading
  if (loading) {
    return (
      <div className="neurocore-root" style={getThemeStyles()}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          color: '#4E3117',
          fontSize: '18px'
        }}>
          Loading language data...
        </div>
      </div>
    );
  }

  // Show error state if language loading failed
  if (error) {
    return (
      <div className="neurocore-root" style={getThemeStyles()}>
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
      style={getThemeStyles()} 
      data-theme={currentMode}
      onWheel={handleWheel}
    >
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
      <div className="neurocore-logo">
        <div style={{
          width: '100%',
          height: '100%',
          // borderRadius: '12px',  // Commented out to allow full border
          // overflow: 'hidden',  // Commented out to allow overflow
          // border: '2px solid #DFAA2E'  // Commented out border
        }}>
          <Canvas
            camera={{ 
              position: [0, 0, 3], 
              fov: 70 
            }}
            style={{ 
              background: 'transparent',
              // borderRadius: '10px'  // Commented out to allow full border
            }}
          >
            <ambientLight intensity={0.8} />
            <directionalLight position={[10, 10, 5]} intensity={1.2} />
            
            <Logo3DModel
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
          </Canvas>
        </div>
      </div>
      <h1 className="neurocore-title">{getText("title")}</h1>
      {/* Menu Button ở góc trên bên phải */}
      <MenuButton onClick={handleMenuButtonClick} />
      {/* Back Button */}
      {/* <BackButton tooltip="Quay lại" onClick={handleBackButtonClick} /> */}
      <BackButton 
        theme={currentMode === 'dark' ? 'dark' : currentMode === 'light' ? 'light' : 'balance'}
        onClick={handleBackButtonClick}
        tooltip={getText("back")}
        icon={
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}>
            <img src={BackIcon} alt="logo"/>
            <div style={{
              ...getResponsiveTextStyle(23),
              lineHeight: '1',
              display: 'flex',
              alignItems: 'center'
            }}>
              {getText("back")}
            </div>          
          </div>
        }
      />
      
      {/* Neurocontrol Button với vị trí tương đối so với Menu Container Frame */}
      <div className="button-neurocontrol">
        <GoldenButton 
          theme={currentMode === 'dark' ? 'dark' : currentMode === 'light' ? 'light' : 'balance'}
          onClick={handleNeurocontrolButtonClick}
          tooltip="Neurocontrol Button - Click me! ✨"
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
              <img src={NeurocontrolIcon} alt="logo"/>
              <div style={getResponsiveTextStyle(23)}>
                {getText("neurocontrol")}
              </div>
            </div>
          }
        />
      </div>


      {/* Neurolab Button */}
      <div className="button-neurolab">
        <GoldenButton
          theme={currentMode === 'dark' ? 'dark' : currentMode === 'light' ? 'light' : 'balance'}
          onClick={handleNeurolabButtonClick}
          tooltip="Neurolab Button - Click me! 👥"
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
              <img src={NeurolabIcon} alt="logo"/>
              <div style={getResponsiveTextStyle(23)}>
                {getText("neurolab")}
              </div>
            </div>
          }
        />
      </div>

      {/* Neurostat Button */}
      <div className="button-neurostat">
        <GoldenButton
          theme={currentMode === 'dark' ? 'dark' : currentMode === 'light' ? 'light' : 'balance'}
          onClick={handleNeurostatButtonClick}
          tooltip="Neurostat Button - Click me! 🏠"
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
              <img src={NeurostatIcon} alt="logo"/>
              <div style={getResponsiveTextStyle(23)}>
                {getText("neurostat")}
              </div>
            </div>
          }
        />
      </div>

      {/* Commandes Button */}
      <div className="button-neurotools">
        <GoldenButton
          theme={currentMode === 'dark' ? 'dark' : currentMode === 'light' ? 'light' : 'balance'}
          onClick={handleCommandesButtonClick}
          tooltip="Neurotools Button - Click me! 📋"
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
              <img src={NeurotoolsIcon} alt="logo"/>
              <div style={{
                width: '124px',
                height: '25px',
                fontFamily: 'Open Sans',
                fontStyle: 'normal',
                fontWeight: '700',
                fontSize: '18px',
                lineHeight: '25px',
                display: 'flex',
                alignItems: 'center',
                textAlign: 'center',
                color: '#4E3117',
                flex: 'none',
                order: 1,
                flexGrow: 0
              }}>
                {getText("neurotools")}
              </div>
            </div>
          }
        />
      </div>

      {/* Neurobase Button */}
      <div className="button-neurobase">
        <GoldenButton
          theme={currentMode === 'dark' ? 'dark' : currentMode === 'light' ? 'light' : 'balance'}
          onClick={handleNeurobaseButtonClick}
          tooltip="Neurobase Button - Click me! 📧"
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
              <img src={NeurobaseIcon} alt="logo"/>
              <div style={getResponsiveTextStyle(23)}>
                {getText("neurobase")}
              </div>
            </div>
          }
        />
      </div>

      {/* Neuroalert Button */}
      <div className="button-neuroalert">
        <GoldenButton
          theme={currentMode === 'dark' ? 'dark' : currentMode === 'light' ? 'light' : 'balance'}
          onClick={handleNeuroalertButtonClick}
          tooltip="Neuroalert Button - Click me! 📅"
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
              <img src={NeuroalertIcon} alt="logo"/>
              <div style={getResponsiveTextStyle(23)}>
                {getText("neuroalert")}
              </div>
            </div>
          }
        />
      </div>

      {/* Neuropacks Button */}
      <div className="button-neuropacks">
        <GoldenButton
          theme={currentMode === 'dark' ? 'dark' : currentMode === 'light' ? 'light' : 'balance'}
          onClick={handleNeuropacksButtonClick}
          tooltip="Neuropacks Button - Click me! 📦"
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
              <img src={NeuropacksIcon} alt="logo"/>
              <div style={getResponsiveTextStyle(23)}>
                {getText("neuropacks")}
              </div>
            </div>
          }
        />
      </div>
      
      {/* Container Frame để chứa các component */}
      <div className="button-mode">
        <ModeButton
          size={80}
          tooltip="Switch Theme Mode"
          tooltipPosition="top"
          onModeChange={handleModeButtonClick}
        />
      </div>
      <ContainerFramePB>
        {/* Text indicator để xác nhận ContainerFrame */}
        {/* <div style={{ color: 'black', fontSize: '12px' }}>ContainerFrame Active</div> */}
        
        {/* ProgressBar Component */}
        <div style={{ 
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center'
        }}>
          <ProgressBar 
            value={progressValue}
            onChange={handleProgressChange}
            min={0}
            max={100}
            text={getText("adjust_cursor_size")}
          />
        </div>
        
        {/* ModeButton với vị trí tương đối */}
        {/* FunctionButton */}
        {/* Ví dụ thêm các component khác:
        <SomeOtherComponent />
        <AnotherComponent />
        <ModeButton/>
        */}
      </ContainerFramePB>
      
      {/* Menu Container Frame với kích thước responsive */}
      <ContainerFrameMenu
        style={{
          position: 'absolute',
          width: 'clamp(600px, 60vw, 840px)',
          height: 'clamp(600px, 60vw, 840px)',
          left: 'calc(50% - clamp(600px, 60vw, 840px)/2)',
          top: 'calc(50% - clamp(600px, 60vw, 840px)/2 + clamp(40px, 4vw, 68px))',
          zIndex: 5
        }}
      >
        {/* Text indicator để xác nhận Menu ContainerFrame */}
        {/* <div style={{ 
          color: 'black', 
          fontSize: '16px', 
          fontWeight: 'bold',
          textAlign: 'center',
          width: '100%',
          padding: '20px'
        }}>
          Menu Container Frame (840x840px)
        </div> */}
        {/* Có thể thêm các component menu ở đây */}
      </ContainerFrameMenu>
      
      {/* Thông báo popup */}
      {showNotification && (
        <div className="notification-popup">
          <div className="notification-content">
            <span className="notification-message">{notificationMessage}</span>
            <button 
              className="notification-close"
              onClick={() => setShowNotification(false)}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}