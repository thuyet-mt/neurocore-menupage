import React, { useState, useEffect } from 'react';
import menuPerformanceMonitor from '../utils/menuPerformanceMonitor';

const MenuPerformancePanel = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [metrics, setMetrics] = useState({});
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    // Toggle panel with Ctrl+Shift+M (Menu)
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'M') {
        e.preventDefault();
        setIsVisible(!isVisible);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    const updateMetrics = () => {
      const currentMetrics = menuPerformanceMonitor.getMetrics();
      const report = menuPerformanceMonitor.getPerformanceReport();
      setMetrics({ ...currentMetrics, ...report });
    };

    // Update metrics every 500ms when visible
    const interval = setInterval(updateMetrics, 500);
    updateMetrics(); // Initial update

    return () => clearInterval(interval);
  }, [isVisible]);

  const getFpsColor = (fps) => {
    if (fps >= 55) return '#4CAF50'; // Green
    if (fps >= 45) return '#FF9800'; // Orange
    return '#F44336'; // Red
  };

  const getMemoryColor = (memory) => {
    if (memory < 50) return '#4CAF50'; // Green
    if (memory < 100) return '#FF9800'; // Orange
    return '#F44336'; // Red
  };

  const getNavigationColor = (time) => {
    if (time < 200) return '#4CAF50'; // Green
    if (time < 500) return '#FF9800'; // Orange
    return '#F44336'; // Red
  };

  const handleOptimize = () => {
    menuPerformanceMonitor.reset();
    console.log('🔄 Menu performance metrics reset');
  };

  const handleCleanup = () => {
    // Trigger memory cleanup
    if (window.gc) {
      window.gc();
    }
    console.log('🧹 Menu memory cleanup triggered');
  };

  if (!isVisible) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      left: '20px',
      background: 'rgba(0, 0, 0, 0.95)',
      color: 'white',
      padding: '20px',
      borderRadius: '10px',
      zIndex: 10001,
      fontFamily: 'monospace',
      fontSize: '12px',
      minWidth: '380px',
      maxWidth: '480px',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.1)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <h3 style={{ margin: 0, color: '#ffd700', fontSize: '14px' }}>
          🎯 Menu Performance Monitor
        </h3>
        <button
          onClick={() => setIsVisible(false)}
          style={{
            background: 'none',
            border: 'none',
            color: '#fff',
            fontSize: '16px',
            cursor: 'pointer',
            padding: '0',
            width: '20px',
            height: '20px'
          }}
        >
          ×
        </button>
      </div>

      <div style={{ marginBottom: '10px', fontSize: '10px', opacity: 0.7 }}>
        Press Ctrl+Shift+M to toggle • Press Ctrl+Shift+C for cursor calibration
      </div>

      {/* Real-time Metrics */}
      <div style={{ marginBottom: '15px' }}>
        <h4 style={{ margin: '0 0 10px 0', color: '#ffd700', fontSize: '12px' }}>Real-time Metrics</h4>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div>
            <div style={{ fontSize: '10px', opacity: 0.7 }}>FPS</div>
            <div style={{ 
              fontSize: '16px', 
              fontWeight: 'bold',
              color: getFpsColor(metrics.fps || 0)
            }}>
              {metrics.fps || 0}
            </div>
          </div>
          
          <div>
            <div style={{ fontSize: '10px', opacity: 0.7 }}>Frame Time</div>
            <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
              {(metrics.frameTime || 0).toFixed(1)}ms
            </div>
          </div>
          
          <div>
            <div style={{ fontSize: '10px', opacity: 0.7 }}>Memory</div>
            <div style={{ 
              fontSize: '16px', 
              fontWeight: 'bold',
              color: getMemoryColor(metrics.memoryUsage || 0)
            }}>
              {(metrics.memoryUsage || 0).toFixed(1)}MB
            </div>
          </div>
          
          <div>
            <div style={{ fontSize: '10px', opacity: 0.7 }}>Navigation</div>
            <div style={{ 
              fontSize: '16px', 
              fontWeight: 'bold',
              color: getNavigationColor(metrics.navigationTime || 0)
            }}>
              {(metrics.navigationTime || 0).toFixed(0)}ms
            </div>
          </div>
        </div>
      </div>

      {/* Menu-specific Metrics */}
      <div style={{ marginBottom: '15px' }}>
        <h4 style={{ margin: '0 0 10px 0', color: '#ffd700', fontSize: '12px' }}>Menu Metrics</h4>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div>
            <div style={{ fontSize: '10px', opacity: 0.7 }}>Button Clicks</div>
            <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
              {metrics.buttonInteractions || 0}
            </div>
          </div>
          
          <div>
            <div style={{ fontSize: '10px', opacity: 0.7 }}>Render Count</div>
            <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
              {metrics.renderCount || 0}
            </div>
          </div>
        </div>
      </div>

      {/* Performance Status */}
      <div style={{ marginBottom: '15px' }}>
        <h4 style={{ margin: '0 0 10px 0', color: '#ffd700', fontSize: '12px' }}>Performance Status</h4>
        
        <div style={{ 
          padding: '8px', 
          borderRadius: '5px', 
          background: metrics.fps >= 45 ? 'rgba(76, 175, 80, 0.2)' : 
                      metrics.fps >= 30 ? 'rgba(255, 152, 0, 0.2)' : 'rgba(244, 67, 54, 0.2)',
          border: `1px solid ${metrics.fps >= 45 ? '#4CAF50' : metrics.fps >= 30 ? '#FF9800' : '#F44336'}`
        }}>
          <div style={{ fontSize: '11px', fontWeight: 'bold' }}>
            {metrics.fps >= 45 ? '🟢 Excellent' : 
             metrics.fps >= 30 ? '🟡 Good' : '🔴 Poor'} Menu Performance
          </div>
          <div style={{ fontSize: '10px', opacity: 0.8, marginTop: '2px' }}>
            {metrics.fps >= 45 ? 'Menu running smoothly' :
             metrics.fps >= 30 ? 'Minor performance issues detected' :
             'Significant performance issues - consider optimizations'}
          </div>
        </div>
      </div>

      {/* Advanced Metrics */}
      {showAdvanced && (
        <div style={{ marginBottom: '15px' }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#ffd700', fontSize: '12px' }}>Advanced Metrics</h4>
          
          <div style={{ fontSize: '10px', lineHeight: '1.4' }}>
            <div>Average FPS: {metrics.average?.fps || 0}</div>
            <div>Average Frame Time: {(metrics.average?.frameTime || 0).toFixed(1)}ms</div>
            <div>Average Navigation Time: {(metrics.average?.navigationTime || 0).toFixed(1)}ms</div>
            <div>Load Time: {(metrics.loadTime || 0).toFixed(1)}ms</div>
            <div>Errors: {metrics.errors || 0}</div>
          </div>
        </div>
      )}

      {/* Recommendations */}
      {metrics.recommendations && metrics.recommendations.length > 0 && (
        <div style={{ marginBottom: '15px' }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#ffd700', fontSize: '12px' }}>Recommendations</h4>
          <ul style={{ 
            margin: 0, 
            paddingLeft: '15px', 
            fontSize: '10px', 
            lineHeight: '1.3',
            opacity: 0.8
          }}>
            {metrics.recommendations.map((rec, index) => (
              <li key={index}>{rec}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
        <button
          onClick={handleOptimize}
          style={{
            background: '#ffd700',
            color: '#000',
            border: 'none',
            padding: '6px 10px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '10px',
            fontWeight: 'bold'
          }}
        >
          Reset Metrics
        </button>
        
        <button
          onClick={handleCleanup}
          style={{
            background: '#2196F3',
            color: '#fff',
            border: 'none',
            padding: '6px 10px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '10px',
            fontWeight: 'bold'
          }}
        >
          Memory Cleanup
        </button>
        
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          style={{
            background: '#666',
            color: '#fff',
            border: 'none',
            padding: '6px 10px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '10px',
            fontWeight: 'bold'
          }}
        >
          {showAdvanced ? 'Hide' : 'Show'} Advanced
        </button>
      </div>

      {/* Menu Performance Graph Placeholder */}
      <div style={{ 
        height: '60px', 
        background: 'rgba(255, 255, 255, 0.05)', 
        borderRadius: '4px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '10px',
        opacity: 0.6
      }}>
        Menu Performance Graph (Coming Soon)
      </div>
    </div>
  );
};

export default MenuPerformancePanel;
