import React, { useState, useEffect } from 'react';
import './App.css';
import { LanguageProvider } from './contexts/LanguageContext';
import { ThemeProvider } from './contexts/ThemeContext';
import advancedPerformanceOptimizer from './utils/advancedPerformanceOptimizer';

// Import ultra-optimized component
import UltraOptimizedNeurocore from './components/UltraOptimizedNeurocore';

// Import other components as fallback
import OptimizedNeurocore from './components/OptimizedNeurocore';
import Neurocore from './components/Neurocore';

function App() {
  const [progressValue, setProgressValue] = useState(35);
  const [useUltraOptimizedVersion, setUseUltraOptimizedVersion] = useState(true);
  const [useOptimizedVersion, setUseOptimizedVersion] = useState(false);
  const [performanceData, setPerformanceData] = useState(null);

  // Start performance monitoring on mount
  useEffect(() => {
    console.log('🚀 Starting advanced performance monitoring for Neurocore...');
    advancedPerformanceOptimizer.startMonitoring();
    
    // Stop monitoring on unmount
    return () => {
      advancedPerformanceOptimizer.stopMonitoring();
    };
  }, []);

  // Performance monitoring effect
  useEffect(() => {
    const interval = setInterval(() => {
      const summary = advancedPerformanceOptimizer.getPerformanceSummary();
      setPerformanceData(summary);
      
      // Log performance warnings
      if (summary.avgFPS < 30) {
        console.warn(`⚠️ Low FPS detected: ${summary.avgFPS} FPS`);
      }
      
      if (summary.avgRenderTime > 10) {
        console.warn(`⚠️ High render time detected: ${summary.avgRenderTime}ms`);
      }
    }, 5000); // Update every 5 seconds
    
    return () => clearInterval(interval);
  }, []);

  const handleProgressChange = (newValue) => {
    setProgressValue(newValue);
  };

  const toggleUltraOptimizedVersion = () => {
    setUseUltraOptimizedVersion(!useUltraOptimizedVersion);
    console.log(`🔄 Switched to ${useUltraOptimizedVersion ? 'optimized' : 'ultra-optimized'} version`);
  };

  const toggleOptimizedVersion = () => {
    setUseOptimizedVersion(!useOptimizedVersion);
    console.log(`🔄 Switched to ${useOptimizedVersion ? 'original' : 'optimized'} version`);
  };

  const exportPerformanceData = () => {
    const data = advancedPerformanceOptimizer.exportMetrics();
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `neurocore-ultra-optimized-benchmark-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Determine which component to render
  const getComponentToRender = () => {
    if (useUltraOptimizedVersion) {
      return (
        <UltraOptimizedNeurocore 
          progressValue={progressValue} 
          onProgressChange={handleProgressChange} 
        />
      );
    } else if (useOptimizedVersion) {
      return (
        <OptimizedNeurocore 
          progressValue={progressValue} 
          onProgressChange={handleProgressChange} 
        />
      );
    } else {
      return (
        <Neurocore 
          progressValue={progressValue} 
          onProgressChange={handleProgressChange} 
        />
      );
    }
  };

  return (
    <LanguageProvider>
      <ThemeProvider>
        <div className="App">
          {/* Advanced Performance Control Panel */}
          <div style={{
            position: 'fixed',
            top: '10px',
            left: '10px',
            background: 'rgba(0, 0, 0, 0.9)',
            color: 'white',
            padding: '15px',
            borderRadius: '8px',
            fontSize: '12px',
            zIndex: 10000,
            fontFamily: 'monospace',
            minWidth: '200px'
          }}>
            <div style={{ marginBottom: '10px' }}>
              <strong>🚀 Ultra Performance Monitor</strong>
            </div>
            {performanceData && (
              <div style={{ fontSize: '10px', lineHeight: '1.3', marginBottom: '10px' }}>
                <div>FPS: {performanceData.avgFPS} ⚡</div>
                <div>Memory: {performanceData.avgMemory}MB 💾</div>
                <div>Render: {performanceData.avgRenderTime}ms 🎨</div>
                <div>Mount: {performanceData.avgComponentMount}ms 🔧</div>
                <div>Interaction: {performanceData.avgInteraction}ms 👆</div>
                <div>Navigation: {performanceData.avgNavigation}ms 🧭</div>
                <div>Warnings: {performanceData.warningCount} ⚠️</div>
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <button 
                onClick={toggleUltraOptimizedVersion}
                style={{
                  background: useUltraOptimizedVersion ? '#4CAF50' : '#f44336',
                  color: 'white',
                  border: 'none',
                  padding: '5px 8px',
                  borderRadius: '4px',
                  fontSize: '10px',
                  cursor: 'pointer'
                }}
              >
                {useUltraOptimizedVersion ? 'Ultra Optimized' : 'Use Ultra Optimized'}
              </button>
              <button 
                onClick={toggleOptimizedVersion}
                style={{
                  background: useOptimizedVersion ? '#2196F3' : '#ff9800',
                  color: 'white',
                  border: 'none',
                  padding: '5px 8px',
                  borderRadius: '4px',
                  fontSize: '10px',
                  cursor: 'pointer'
                }}
              >
                {useOptimizedVersion ? 'Optimized' : 'Use Optimized'}
              </button>
              <button 
                onClick={exportPerformanceData}
                style={{
                  background: '#9C27B0',
                  color: 'white',
                  border: 'none',
                  padding: '5px 8px',
                  borderRadius: '4px',
                  fontSize: '10px',
                  cursor: 'pointer'
                }}
              >
                📊 Export Data
              </button>
            </div>
          </div>

          {/* Render appropriate component */}
          {getComponentToRender()}
        </div>
      </ThemeProvider>
    </LanguageProvider>
  );
}

export default App;
