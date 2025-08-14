// Advanced Performance Optimizer for Neurocore-Menupage
// Comprehensive performance optimization and monitoring system

class AdvancedPerformanceOptimizer {
  constructor() {
    this.metrics = {
      renderTime: [],
      memoryUsage: [],
      fps: [],
      componentMountTime: [],
      interactionTime: [],
      navigationTime: [],
      errors: [],
      performanceWarnings: []
    };
    
    this.isMonitoring = false;
    this.monitorInterval = null;
    this.lastFrameTime = 0;
    this.frameCount = 0;
    this.lastFPSUpdate = 0;
    this.performanceThresholds = {
      targetFPS: 30,
      maxRenderTime: 10,
      maxMemoryUsage: 50,
      maxInteractionTime: 20,
      maxNavigationTime: 50
    };
    
    // Performance optimization features
    this.features = {
      autoThrottling: true,
      memoryCleanup: true,
      renderOptimization: true,
      lazyLoading: true,
      navigationOptimization: true
    };
  }

  // Start advanced performance monitoring
  startMonitoring() {
    if (this.isMonitoring) return;
    
    this.isMonitoring = true;
    this.lastFrameTime = performance.now();
    this.frameCount = 0;
    this.lastFPSUpdate = performance.now();
    
    console.log('🚀 Starting advanced performance monitoring for Neurocore...');
    
    this.monitorInterval = setInterval(() => {
      this.measurePerformance();
      this.checkPerformanceThresholds();
      this.applyOptimizations();
    }, 50); // 20 FPS monitoring for better accuracy
    
    // Memory cleanup interval
    setInterval(() => {
      this.performMemoryCleanup();
    }, 30000); // Every 30 seconds
  }

  // Stop monitoring
  stopMonitoring() {
    if (this.monitorInterval) {
      clearInterval(this.monitorInterval);
      this.monitorInterval = null;
    }
    this.isMonitoring = false;
    console.log('🛑 Advanced performance monitoring stopped');
  }

  // Measure comprehensive performance metrics
  measurePerformance() {
    const now = performance.now();
    
    // FPS calculation
    this.frameCount++;
    if (now - this.lastFPSUpdate >= 1000) {
      const fps = this.frameCount * 1000 / (now - this.lastFPSUpdate);
      this.metrics.fps.push({
        timestamp: now,
        fps: fps
      });
      
      this.frameCount = 0;
      this.lastFPSUpdate = now;
    }
    
    // Memory usage
    if (performance.memory) {
      this.metrics.memoryUsage.push({
        timestamp: now,
        used: performance.memory.usedJSHeapSize / 1024 / 1024,
        total: performance.memory.totalJSHeapSize / 1024 / 1024,
        limit: performance.memory.jsHeapSizeLimit / 1024 / 1024
      });
    }
    
    // Render time measurement
    const renderStart = performance.now();
    requestAnimationFrame(() => {
      const renderEnd = performance.now();
      this.metrics.renderTime.push({
        timestamp: renderStart,
        duration: renderEnd - renderStart
      });
    });
  }

  // Check performance thresholds and apply optimizations
  checkPerformanceThresholds() {
    const currentFPS = this.getCurrentFPS();
    const currentMemory = this.getCurrentMemoryUsage();
    const currentRenderTime = this.getCurrentRenderTime();
    
    // Performance warnings
    if (currentFPS < this.performanceThresholds.targetFPS) {
      this.metrics.performanceWarnings.push({
        type: 'low_fps',
        value: currentFPS,
        threshold: this.performanceThresholds.targetFPS,
        timestamp: performance.now()
      });
      console.warn(`⚠️ Low FPS detected: ${currentFPS} FPS`);
    }
    
    if (currentRenderTime > this.performanceThresholds.maxRenderTime) {
      this.metrics.performanceWarnings.push({
        type: 'high_render_time',
        value: currentRenderTime,
        threshold: this.performanceThresholds.maxRenderTime,
        timestamp: performance.now()
      });
      console.warn(`⚠️ High render time detected: ${currentRenderTime}ms`);
    }
    
    if (currentMemory > this.performanceThresholds.maxMemoryUsage) {
      this.metrics.performanceWarnings.push({
        type: 'high_memory_usage',
        value: currentMemory,
        threshold: this.performanceThresholds.maxMemoryUsage,
        timestamp: performance.now()
      });
      console.warn(`⚠️ High memory usage detected: ${currentMemory}MB`);
    }
  }

  // Apply automatic optimizations
  applyOptimizations() {
    const currentFPS = this.getCurrentFPS();
    
    // Auto-throttling based on FPS
    if (this.features.autoThrottling && currentFPS < 20) {
      this.enableLowPerformanceMode();
    } else if (this.features.autoThrottling && currentFPS > 45) {
      this.enableHighPerformanceMode();
    }
    
    // Memory optimization
    if (this.features.memoryCleanup && this.getCurrentMemoryUsage() > 45) {
      this.performMemoryCleanup();
    }
  }

  // Enable low performance mode
  enableLowPerformanceMode() {
    console.log('🔧 Enabling low performance mode for Neurocore...');
    
    // Reduce animation complexity
    document.documentElement.style.setProperty('--animation-duration', '0.1s');
    document.documentElement.style.setProperty('--transition-duration', '0.1s');
    
    // Disable heavy effects
    document.documentElement.style.setProperty('--enable-shadows', 'false');
    document.documentElement.style.setProperty('--enable-blur', 'false');
    
    // Reduce 3D complexity
    this.update3DSettings({
      enableShadows: false,
      enablePostProcessing: false,
      reducePolygons: true,
      lowerTextureQuality: true
    });
    
    // Optimize navigation
    this.updateNavigationSettings({
      enableSmoothTransitions: false,
      reduceAnimationComplexity: true,
      optimizeMenuRendering: true
    });
  }

  // Enable high performance mode
  enableHighPerformanceMode() {
    console.log('🚀 Enabling high performance mode for Neurocore...');
    
    // Restore normal animation settings
    document.documentElement.style.setProperty('--animation-duration', '0.3s');
    document.documentElement.style.setProperty('--transition-duration', '0.3s');
    
    // Enable effects
    document.documentElement.style.setProperty('--enable-shadows', 'true');
    document.documentElement.style.setProperty('--enable-blur', 'true');
    
    // Restore 3D quality
    this.update3DSettings({
      enableShadows: true,
      enablePostProcessing: true,
      reducePolygons: false,
      lowerTextureQuality: false
    });
    
    // Restore navigation quality
    this.updateNavigationSettings({
      enableSmoothTransitions: true,
      reduceAnimationComplexity: false,
      optimizeMenuRendering: false
    });
  }

  // Update 3D rendering settings
  update3DSettings(settings) {
    // Dispatch custom event for 3D components to listen
    window.dispatchEvent(new CustomEvent('update3DSettings', {
      detail: settings
    }));
  }

  // Update navigation settings
  updateNavigationSettings(settings) {
    // Dispatch custom event for navigation components to listen
    window.dispatchEvent(new CustomEvent('updateNavigationSettings', {
      detail: settings
    }));
  }

  // Perform memory cleanup
  performMemoryCleanup() {
    console.log('🧹 Performing memory cleanup for Neurocore...');
    
    // Force garbage collection if available
    if (window.gc) {
      window.gc();
    }
    
    // Clear unused image caches
    if ('caches' in window) {
      caches.keys().then(cacheNames => {
        cacheNames.forEach(cacheName => {
          caches.delete(cacheName);
        });
      });
    }
    
    // Clear unused WebGL contexts
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (gl) {
        gl.getExtension('WEBGL_lose_context')?.loseContext();
      }
    }
    
    // Clear navigation caches
    this.clearNavigationCaches();
  }

  // Clear navigation caches
  clearNavigationCaches() {
    // Clear any stored navigation states
    if (sessionStorage.getItem('neurocore_navigation_cache')) {
      sessionStorage.removeItem('neurocore_navigation_cache');
    }
    
    // Clear any stored menu states
    if (sessionStorage.getItem('neurocore_menu_cache')) {
      sessionStorage.removeItem('neurocore_menu_cache');
    }
  }

  // Component mount time tracking
  trackComponentMount(componentName, duration) {
    this.metrics.componentMountTime.push({
      component: componentName,
      duration: duration,
      timestamp: performance.now()
    });
  }

  // Interaction time tracking
  trackInteraction(type, duration) {
    this.metrics.interactionTime.push({
      type: type,
      duration: duration,
      timestamp: performance.now()
    });
  }

  // Navigation time tracking
  trackNavigation(target, duration) {
    this.metrics.navigationTime.push({
      target: target,
      duration: duration,
      timestamp: performance.now()
    });
  }

  // Error tracking
  trackError(error) {
    this.metrics.errors.push({
      message: error.message,
      stack: error.stack,
      timestamp: performance.now()
    });
  }

  // Get current performance metrics
  getCurrentFPS() {
    if (this.metrics.fps.length === 0) return 0;
    const recentFPS = this.metrics.fps.slice(-10);
    return recentFPS.reduce((sum, item) => sum + item.fps, 0) / recentFPS.length;
  }

  getCurrentMemoryUsage() {
    if (this.metrics.memoryUsage.length === 0) return 0;
    const recentMemory = this.metrics.memoryUsage.slice(-5);
    return recentMemory.reduce((sum, item) => sum + item.used, 0) / recentMemory.length;
  }

  getCurrentRenderTime() {
    if (this.metrics.renderTime.length === 0) return 0;
    const recentRender = this.metrics.renderTime.slice(-10);
    return recentRender.reduce((sum, item) => sum + item.duration, 0) / recentRender.length;
  }

  // Get performance summary
  getPerformanceSummary() {
    const avgFPS = this.getCurrentFPS();
    const avgMemory = this.getCurrentMemoryUsage();
    const avgRenderTime = this.getCurrentRenderTime();
    
    const avgComponentMount = this.metrics.componentMountTime.length > 0
      ? this.metrics.componentMountTime.reduce((sum, item) => sum + item.duration, 0) / this.metrics.componentMountTime.length
      : 0;
    
    const avgInteraction = this.metrics.interactionTime.length > 0
      ? this.metrics.interactionTime.reduce((sum, item) => sum + item.duration, 0) / this.metrics.interactionTime.length
      : 0;

    const avgNavigation = this.metrics.navigationTime.length > 0
      ? this.metrics.navigationTime.reduce((sum, item) => sum + item.duration, 0) / this.metrics.navigationTime.length
      : 0;

    return {
      avgFPS: Math.round(avgFPS * 100) / 100,
      avgMemory: Math.round(avgMemory * 100) / 100,
      avgRenderTime: Math.round(avgRenderTime * 100) / 100,
      avgComponentMount: Math.round(avgComponentMount * 100) / 100,
      avgInteraction: Math.round(avgInteraction * 100) / 100,
      avgNavigation: Math.round(avgNavigation * 100) / 100,
      errorCount: this.metrics.errors.length,
      warningCount: this.metrics.performanceWarnings.length,
      sampleCount: this.metrics.fps.length
    };
  }

  // Export metrics for analysis
  exportMetrics() {
    return {
      summary: this.getPerformanceSummary(),
      details: this.metrics,
      recommendations: this.generateRecommendations(),
      timestamp: new Date().toISOString()
    };
  }

  // Generate performance recommendations
  generateRecommendations() {
    const summary = this.getPerformanceSummary();
    const recommendations = [];
    
    if (summary.avgFPS < 30) {
      recommendations.push('Consider reducing menu complexity');
      recommendations.push('Optimize render loops and animations');
      recommendations.push('Use React.memo for expensive components');
      recommendations.push('Implement virtual scrolling for large lists');
    }
    
    if (summary.avgRenderTime > 10) {
      recommendations.push('Optimize component rendering');
      recommendations.push('Reduce DOM manipulation');
      recommendations.push('Use CSS transforms instead of layout changes');
    }
    
    if (summary.avgMemory > 50) {
      recommendations.push('Implement memory cleanup routines');
      recommendations.push('Optimize image loading and caching');
      recommendations.push('Reduce object creation in render loops');
    }
    
    if (summary.avgNavigation > 50) {
      recommendations.push('Optimize navigation transitions');
      recommendations.push('Implement route preloading');
      recommendations.push('Reduce navigation animation complexity');
    }
    
    return recommendations;
  }

  // Set performance thresholds
  setThresholds(thresholds) {
    this.performanceThresholds = { ...this.performanceThresholds, ...thresholds };
  }

  // Enable/disable optimization features
  setFeatures(features) {
    this.features = { ...this.features, ...features };
  }
}

// Create singleton instance
const advancedPerformanceOptimizer = new AdvancedPerformanceOptimizer();

export default advancedPerformanceOptimizer;
