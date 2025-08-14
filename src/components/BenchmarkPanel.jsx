import React, { useState, useEffect } from 'react';
import neurocoreBenchmark, { benchmarkUtils } from '../utils/benchmark';

const BenchmarkPanel = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [currentMetrics, setCurrentMetrics] = useState({});
  const [benchmarkResults, setBenchmarkResults] = useState(null);
  const [comparisonResults, setComparisonResults] = useState(null);

  useEffect(() => {
    // Toggle panel with Ctrl+Shift+B
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'B') {
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
      const memory = benchmarkUtils.getMemoryUsage();
      setCurrentMetrics({
        memory: memory ? memory.used.toFixed(1) : 'N/A',
        timestamp: new Date().toLocaleTimeString()
      });
    };

    const interval = setInterval(updateMetrics, 1000);
    updateMetrics();

    return () => clearInterval(interval);
  }, [isVisible]);

  const startBenchmark = async () => {
    setIsRunning(true);
    setBenchmarkResults(null);
    setComparisonResults(null);

    try {
      await neurocoreBenchmark.startBenchmark(30000); // 30 seconds
      const report = neurocoreBenchmark.generateReport();
      setBenchmarkResults(report);
      
      // Compare with stored neurobase results if available
      const neurobaseReport = localStorage.getItem('neurobase_benchmark_report');
      if (neurobaseReport) {
        const comparison = neurocoreBenchmark.compareWith(JSON.parse(neurobaseReport));
        setComparisonResults(comparison);
      }
    } catch (error) {
      console.error('Benchmark failed:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const quickTest = () => {
    benchmarkUtils.measureFPS((fps) => {
      console.log(`Quick FPS test: ${fps.toFixed(1)} FPS`);
      alert(`Quick FPS Test: ${fps.toFixed(1)} FPS`);
    }, 2000);
  };

  const exportResults = () => {
    if (!benchmarkResults) return;
    
    const dataStr = JSON.stringify(benchmarkResults, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `neurocore-benchmark-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!isVisible) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      background: 'rgba(0, 0, 0, 0.95)',
      color: 'white',
      padding: '20px',
      borderRadius: '10px',
      zIndex: 10002,
      fontFamily: 'monospace',
      fontSize: '12px',
      minWidth: '400px',
      maxWidth: '500px',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.1)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <h3 style={{ margin: 0, color: '#ffd700', fontSize: '14px' }}>
          🚀 Neurocore Benchmark Panel
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
        Press Ctrl+Shift+B to toggle • Press Ctrl+Shift+M for performance panel
      </div>

      {/* Current Metrics */}
      <div style={{ marginBottom: '15px' }}>
        <h4 style={{ margin: '0 0 10px 0', color: '#ffd700', fontSize: '12px' }}>Current Metrics</h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div>
            <div style={{ fontSize: '10px', opacity: 0.7 }}>Memory Usage</div>
            <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
              {currentMetrics.memory || 'N/A'} MB
            </div>
          </div>
          <div>
            <div style={{ fontSize: '10px', opacity: 0.7 }}>Last Update</div>
            <div style={{ fontSize: '12px' }}>
              {currentMetrics.timestamp || 'N/A'}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '15px', flexWrap: 'wrap' }}>
        <button
          onClick={startBenchmark}
          disabled={isRunning}
          style={{
            background: isRunning ? '#666' : '#ffd700',
            color: isRunning ? '#ccc' : '#000',
            border: 'none',
            padding: '8px 12px',
            borderRadius: '4px',
            cursor: isRunning ? 'not-allowed' : 'pointer',
            fontSize: '11px',
            fontWeight: 'bold'
          }}
        >
          {isRunning ? 'Running...' : 'Start Benchmark'}
        </button>
        
        <button
          onClick={quickTest}
          style={{
            background: '#2196F3',
            color: '#fff',
            border: 'none',
            padding: '8px 12px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '11px',
            fontWeight: 'bold'
          }}
        >
          Quick FPS Test
        </button>
        
        <button
          onClick={exportResults}
          disabled={!benchmarkResults}
          style={{
            background: benchmarkResults ? '#4CAF50' : '#666',
            color: '#fff',
            border: 'none',
            padding: '8px 12px',
            borderRadius: '4px',
            cursor: benchmarkResults ? 'pointer' : 'not-allowed',
            fontSize: '11px',
            fontWeight: 'bold'
          }}
        >
          Export Results
        </button>
      </div>

      {/* Benchmark Results */}
      {benchmarkResults && (
        <div style={{ marginBottom: '15px' }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#ffd700', fontSize: '12px' }}>Benchmark Results</h4>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
            <div>
              <div style={{ fontSize: '10px', opacity: 0.7 }}>Avg FPS</div>
              <div style={{ 
                fontSize: '16px', 
                fontWeight: 'bold',
                color: benchmarkResults.summary.avgFPS >= 45 ? '#4CAF50' : 
                       benchmarkResults.summary.avgFPS >= 30 ? '#FF9800' : '#F44336'
              }}>
                {benchmarkResults.summary.avgFPS}
              </div>
            </div>
            
            <div>
              <div style={{ fontSize: '10px', opacity: 0.7 }}>Avg Memory</div>
              <div style={{ 
                fontSize: '16px', 
                fontWeight: 'bold',
                color: benchmarkResults.summary.avgMemory < 50 ? '#4CAF50' : 
                       benchmarkResults.summary.avgMemory < 100 ? '#FF9800' : '#F44336'
              }}>
                {benchmarkResults.summary.avgMemory} MB
              </div>
            </div>
            
            <div>
              <div style={{ fontSize: '10px', opacity: 0.7 }}>Render Time</div>
              <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
                {benchmarkResults.summary.avgRenderTime}ms
              </div>
            </div>
            
            <div>
              <div style={{ fontSize: '10px', opacity: 0.7 }}>Navigation</div>
              <div style={{ 
                fontSize: '16px', 
                fontWeight: 'bold',
                color: benchmarkResults.summary.avgNavigation < 200 ? '#4CAF50' : 
                       benchmarkResults.summary.avgNavigation < 500 ? '#FF9800' : '#F44336'
              }}>
                {benchmarkResults.summary.avgNavigation}ms
              </div>
            </div>
          </div>

          {/* Recommendations */}
          {benchmarkResults.recommendations && benchmarkResults.recommendations.length > 0 && (
            <div style={{ marginTop: '10px' }}>
              <div style={{ fontSize: '10px', color: '#ffd700', marginBottom: '5px' }}>Recommendations:</div>
              <ul style={{ 
                margin: 0, 
                paddingLeft: '15px', 
                fontSize: '10px', 
                lineHeight: '1.3',
                opacity: 0.8
              }}>
                {benchmarkResults.recommendations.slice(0, 3).map((rec, index) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Comparison Results */}
      {comparisonResults && (
        <div style={{ marginBottom: '15px' }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#ffd700', fontSize: '12px' }}>vs Neurobase</h4>
          
          <div style={{ fontSize: '10px', lineHeight: '1.4' }}>
            <div style={{ 
              color: comparisonResults.fps.percentage > 0 ? '#4CAF50' : '#F44336',
              marginBottom: '5px'
            }}>
              FPS: {comparisonResults.fps.percentage > 0 ? '+' : ''}{comparisonResults.fps.percentage.toFixed(1)}%
            </div>
            <div style={{ 
              color: comparisonResults.memory.percentage < 0 ? '#4CAF50' : '#F44336',
              marginBottom: '5px'
            }}>
              Memory: {comparisonResults.memory.percentage > 0 ? '+' : ''}{comparisonResults.memory.percentage.toFixed(1)}%
            </div>
            <div style={{ 
              color: comparisonResults.renderTime.percentage < 0 ? '#4CAF50' : '#F44336',
              marginBottom: '5px'
            }}>
              Render: {comparisonResults.renderTime.percentage > 0 ? '+' : ''}{comparisonResults.renderTime.percentage.toFixed(1)}%
            </div>
            {comparisonResults.navigation && (
              <div style={{ 
                color: comparisonResults.navigation.percentage < 0 ? '#4CAF50' : '#F44336'
              }}>
                Navigation: {comparisonResults.navigation.percentage > 0 ? '+' : ''}{comparisonResults.navigation.percentage.toFixed(1)}%
              </div>
            )}
          </div>
        </div>
      )}

      {/* Status */}
      <div style={{ 
        padding: '8px', 
        borderRadius: '5px', 
        background: 'rgba(255, 255, 255, 0.05)',
        fontSize: '10px',
        textAlign: 'center'
      }}>
        {isRunning ? '🔄 Benchmark in progress...' : '✅ Ready for testing'}
      </div>
    </div>
  );
};

export default BenchmarkPanel;
