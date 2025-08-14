// Performance Optimization Utilities for Neurocore-Menupage
// Based on Neurobase-Frontend optimizations

class PerformanceOptimizer {
  constructor() {
    this.metrics = {
      renderTime: [],
      memoryUsage: [],
      fps: [],
      componentMountTime: [],
      interactionTime: [],
      errors: []
    };
    
    this.isMonitoring = false;
    this.monitorInterval = null;
    this.lastFrameTime = 0;
    this.frameCount = 0;
    this.lastFPSUpdate = 0;
  }

  // Start performance monitoring
  startMonitoring() {
    if (this.isMonitoring) return;
    
    this.isMonitoring = true;
    this.lastFrameTime = performance.now();
    this.frameCount = 0;
    this.lastFPSUpdate = performance.now();
    
    this.monitorInterval = setInterval(() => {
      this.measurePerformance();
    }, 100); // 10 FPS monitoring
    
    console.log('🚀 Performance monitoring started');
  }

  // Stop performance monitoring
  stopMonitoring() {
    if (!this.isMonitoring) return;
    
    this.isMonitoring = false;
    
    if (this.monitorInterval) {
      clearInterval(this.monitorInterval);
      this.monitorInterval = null;
    }
    
    console.log('⏹️ Performance monitoring stopped');
  }

  // Measure current performance metrics
  measurePerformance() {
    const now = performance.now();
    
    // Measure FPS
    this.frameCount++;
    if (now - this.lastFPSUpdate >= 1000) {
      const fps = (this.frameCount * 1000) / (now - this.lastFPSUpdate);
      this.metrics.fps.push({
        timestamp: now,
        fps: Math.min(fps, 60)
      });
      
      this.frameCount = 0;
      this.lastFPSUpdate = now;
    }
    
    // Measure memory usage
    if (performance.memory) {
      this.metrics.memoryUsage.push({
        timestamp: now,
        used: performance.memory.usedJSHeapSize / 1024 / 1024,
        total: performance.memory.totalJSHeapSize / 1024 / 1024,
        limit: performance.memory.jsHeapSizeLimit / 1024 / 1024
      });
    }
    
    // Measure render time
    const renderTime = now - this.lastFrameTime;
    this.metrics.renderTime.push({
      timestamp: now,
      duration: renderTime
    });
    
    this.lastFrameTime = now;
  }

  // Measure component mount time
  measureComponentMount(componentName, startTime) {
    const mountTime = performance.now() - startTime;
    this.metrics.componentMountTime.push({
      component: componentName,
      duration: mountTime,
      timestamp: performance.now()
    });
    
    console.log(`⚡ ${componentName} mounted in ${mountTime.toFixed(2)}ms`);
  }

  // Measure interaction time
  measureInteraction(type, startTime) {
    const interactionTime = performance.now() - startTime;
    this.metrics.interactionTime.push({
      type,
      duration: interactionTime,
      timestamp: performance.now()
    });
    
    console.log(`🎯 ${type} interaction took ${interactionTime.toFixed(2)}ms`);
  }

  // Get performance summary
  getPerformanceSummary() {
    const avgFPS = this.metrics.fps.length > 0 
      ? this.metrics.fps.reduce((sum, entry) => sum + entry.fps, 0) / this.metrics.fps.length
      : 0;
    
    const avgMemory = this.metrics.memoryUsage.length > 0
      ? this.metrics.memoryUsage.reduce((sum, entry) => sum + entry.used, 0) / this.metrics.memoryUsage.length
      : 0;
    
    const avgRenderTime = this.metrics.renderTime.length > 0
      ? this.metrics.renderTime.reduce((sum, entry) => sum + entry.duration, 0) / this.metrics.renderTime.length
      : 0;
    
    const avgComponentMount = this.metrics.componentMountTime.length > 0
      ? this.metrics.componentMountTime.reduce((sum, entry) => sum + entry.duration, 0) / this.metrics.componentMountTime.length
      : 0;
    
    const avgInteraction = this.metrics.interactionTime.length > 0
      ? this.metrics.interactionTime.reduce((sum, entry) => sum + entry.duration, 0) / this.metrics.interactionTime.length
      : 0;

    return {
      avgFPS: Math.round(avgFPS * 100) / 100,
      avgMemory: Math.round(avgMemory * 100) / 100,
      avgRenderTime: Math.round(avgRenderTime * 100) / 100,
      avgComponentMount: Math.round(avgComponentMount * 100) / 100,
      avgInteraction: Math.round(avgInteraction * 100) / 100,
      errorCount: this.metrics.errors.length,
      sampleCount: this.metrics.fps.length
    };
  }

  // Generate performance recommendations
  generateRecommendations() {
    const summary = this.getPerformanceSummary();
    const recommendations = [];

    if (summary.avgFPS < 45) {
      recommendations.push('Consider reducing component complexity');
      recommendations.push('Optimize render loops');
      recommendations.push('Use React.memo for expensive components');
      recommendations.push('Implement lazy loading for heavy components');
    }

    if (summary.avgMemory > 100) {
      recommendations.push('Implement memory cleanup strategies');
      recommendations.push('Use lazy loading for components');
      recommendations.push('Optimize image and asset loading');
      recommendations.push('Reduce object creation in render loops');
    }

    if (summary.avgRenderTime > 16) {
      recommendations.push('Optimize component rendering');
      recommendations.push('Reduce DOM manipulation');
      recommendations.push('Use CSS transforms instead of layout changes');
      recommendations.push('Implement virtual scrolling for large lists');
    }

    if (summary.avgComponentMount > 50) {
      recommendations.push('Optimize component initialization');
      recommendations.push('Use code splitting');
      recommendations.push('Reduce bundle size');
      recommendations.push('Preload critical components');
    }

    return recommendations;
  }

  // Clear metrics
  clearMetrics() {
    this.metrics = {
      renderTime: [],
      memoryUsage: [],
      fps: [],
      componentMountTime: [],
      interactionTime: [],
      errors: []
    };
  }

  // Export metrics for comparison
  exportMetrics() {
    return {
      summary: this.getPerformanceSummary(),
      details: this.metrics,
      recommendations: this.generateRecommendations(),
      timestamp: new Date().toISOString()
    };
  }
}

// React Performance Hooks

// Hook for measuring component mount time
export const useComponentMountTime = (componentName) => {
  const startTime = useRef(performance.now());
  
  useEffect(() => {
    const mountTime = performance.now() - startTime.current;
    console.log(`⚡ ${componentName} mounted in ${mountTime.toFixed(2)}ms`);
    
    // Store in performance optimizer if available
    if (window.performanceOptimizer) {
      window.performanceOptimizer.measureComponentMount(componentName, startTime.current);
    }
  }, [componentName]);
};

// Hook for measuring interaction time
export const useInteractionTime = () => {
  const measureInteraction = useCallback((type, callback) => {
    const startTime = performance.now();
    
    return (...args) => {
      const result = callback(...args);
      
      const interactionTime = performance.now() - startTime;
      console.log(`🎯 ${type} interaction took ${interactionTime.toFixed(2)}ms`);
      
      // Store in performance optimizer if available
      if (window.performanceOptimizer) {
        window.performanceOptimizer.measureInteraction(type, startTime);
      }
      
      return result;
    };
  }, []);
  
  return measureInteraction;
};

// Hook for measuring render time
export const useRenderTime = (componentName) => {
  const renderStartTime = useRef(performance.now());
  
  useEffect(() => {
    const renderTime = performance.now() - renderStartTime.current;
    
    if (renderTime > 16) { // Warning threshold
      console.warn(`⚠️ ${componentName} render took ${renderTime.toFixed(2)}ms (target: <16ms)`);
    }
    
    renderStartTime.current = performance.now();
  });
};

// Performance optimization utilities

// Debounce function with performance monitoring
export const useDebounce = (func, wait) => {
  const timeoutRef = useRef();
  
  return useCallback((...args) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => func(...args), wait);
  }, [func, wait]);
};

// Throttle function with performance monitoring
export const useThrottle = (func, limit) => {
  const inThrottle = useRef(false);
  
  return useCallback((...args) => {
    if (!inThrottle.current) {
      func(...args);
      inThrottle.current = true;
      setTimeout(() => inThrottle.current = false, limit);
    }
  }, [func, limit]);
};

// Memoization helper with performance tracking
export const useMemoizedValue = (value, deps) => {
  const memoizedValue = useMemo(() => value, deps);
  
  useEffect(() => {
    console.log('🔄 Memoized value updated');
  }, [memoizedValue]);
  
  return memoizedValue;
};

// Initialize global performance optimizer
const performanceOptimizer = new PerformanceOptimizer();
window.performanceOptimizer = performanceOptimizer;

export default performanceOptimizer;
