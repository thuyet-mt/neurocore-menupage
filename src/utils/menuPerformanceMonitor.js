// Menu Performance Monitor
// Utility for monitoring and optimizing Neurocore menupage performance

class MenuPerformanceMonitor {
  constructor() {
    this.metrics = {
      fps: 0,
      frameTime: 0,
      memoryUsage: 0,
      renderCount: 0,
      loadTime: 0,
      errors: 0,
      buttonInteractions: 0,
      navigationTime: 0
    };
    
    this.history = [];
    this.maxHistorySize = 100;
    this.isMonitoring = false;
    this.monitorInterval = null;
    this.lastFrameTime = performance.now();
    this.frameCount = 0;
    this.interactionStartTime = 0;
  }

  start() {
    if (this.isMonitoring) return;
    
    this.isMonitoring = true;
    this.lastFrameTime = performance.now();
    this.frameCount = 0;
    
    this.monitorInterval = setInterval(() => {
      this.updateMetrics();
      this.checkPerformance();
    }, 1000); // Check every second
    
    console.log('🎯 Menu Performance Monitor started');
  }

  stop() {
    if (!this.isMonitoring) return;
    
    this.isMonitoring = false;
    if (this.monitorInterval) {
      clearInterval(this.monitorInterval);
      this.monitorInterval = null;
    }
    
    console.log('🎯 Menu Performance Monitor stopped');
  }

  updateMetrics() {
    const now = performance.now();
    const deltaTime = now - this.lastFrameTime;
    
    // Calculate FPS
    this.metrics.fps = Math.round((this.frameCount * 1000) / deltaTime);
    this.metrics.frameTime = deltaTime / this.frameCount || 0;
    
    // Reset counters
    this.frameCount = 0;
    this.lastFrameTime = now;
    
    // Memory usage (if available)
    if (performance.memory) {
      this.metrics.memoryUsage = performance.memory.usedJSHeapSize / 1024 / 1024; // MB
    }
    
    // Store in history
    this.history.push({
      timestamp: now,
      ...this.metrics
    });
    
    // Keep history size manageable
    if (this.history.length > this.maxHistorySize) {
      this.history.shift();
    }
  }

  recordFrame() {
    this.frameCount++;
    this.metrics.renderCount++;
  }

  recordLoadTime(loadTime) {
    this.metrics.loadTime = loadTime;
  }

  recordError() {
    this.metrics.errors++;
  }

  recordButtonInteraction() {
    this.metrics.buttonInteractions++;
  }

  startNavigation() {
    this.interactionStartTime = performance.now();
  }

  endNavigation() {
    if (this.interactionStartTime > 0) {
      this.metrics.navigationTime = performance.now() - this.interactionStartTime;
      this.interactionStartTime = 0;
    }
  }

  checkPerformance() {
    const { fps, frameTime, memoryUsage, errors, navigationTime } = this.metrics;
    
    // Performance warnings
    if (fps < 30) {
      console.warn(`⚠️ Low FPS detected: ${fps} - Consider reducing menu complexity`);
    }
    
    if (frameTime > 33) { // More than 30fps equivalent
      console.warn(`⚠️ High frame time: ${frameTime.toFixed(2)}ms`);
    }
    
    if (memoryUsage > 100) { // More than 100MB
      console.warn(`⚠️ High memory usage: ${memoryUsage.toFixed(2)}MB`);
    }
    
    if (errors > 5) {
      console.warn(`⚠️ Multiple errors detected: ${errors}`);
    }

    if (navigationTime > 500) { // More than 500ms for navigation
      console.warn(`⚠️ Slow navigation detected: ${navigationTime.toFixed(2)}ms`);
    }
  }

  getMetrics() {
    return { ...this.metrics };
  }

  getHistory() {
    return [...this.history];
  }

  getAverageFPS() {
    if (this.history.length === 0) return 0;
    
    const totalFPS = this.history.reduce((sum, entry) => sum + entry.fps, 0);
    return Math.round(totalFPS / this.history.length);
  }

  getPerformanceReport() {
    const avgFPS = this.getAverageFPS();
    const recentMetrics = this.history.slice(-10);
    const avgFrameTime = recentMetrics.length > 0 
      ? recentMetrics.reduce((sum, entry) => sum + entry.frameTime, 0) / recentMetrics.length
      : 0;
    
    return {
      current: this.metrics,
      average: {
        fps: avgFPS,
        frameTime: avgFrameTime,
        memoryUsage: this.metrics.memoryUsage,
        navigationTime: this.metrics.navigationTime
      },
      recommendations: this.getRecommendations()
    };
  }

  getRecommendations() {
    const recommendations = [];
    const { fps, frameTime, memoryUsage, navigationTime } = this.metrics;
    
    if (fps < 45) {
      recommendations.push('Reduce menu complexity or animations');
      recommendations.push('Optimize button rendering');
      recommendations.push('Check for background processes');
    }
    
    if (frameTime > 25) {
      recommendations.push('Optimize render loop');
      recommendations.push('Reduce 3D model complexity');
      recommendations.push('Use lazy loading for components');
    }
    
    if (memoryUsage > 80) {
      recommendations.push('Clear component cache');
      recommendations.push('Reduce texture quality');
      recommendations.push('Implement virtual scrolling if needed');
    }

    if (navigationTime > 300) {
      recommendations.push('Optimize navigation transitions');
      recommendations.push('Reduce animation complexity');
      recommendations.push('Use preloading for common routes');
    }
    
    return recommendations;
  }

  reset() {
    this.metrics = {
      fps: 0,
      frameTime: 0,
      memoryUsage: 0,
      renderCount: 0,
      loadTime: 0,
      errors: 0,
      buttonInteractions: 0,
      navigationTime: 0
    };
    this.history = [];
    this.frameCount = 0;
    this.interactionStartTime = 0;
  }
}

// Global instance
const menuPerformanceMonitor = new MenuPerformanceMonitor();

// Performance optimization utilities for menu
export const optimizeMenuPerformance = {
  // Throttle function for button interactions
  throttle: (func, limit) => {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  // Debounce function for menu updates
  debounce: (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  // Frame rate limiter for menu animations
  limitFrameRate: (callback, targetFPS = 60) => {
    let lastTime = 0;
    const frameInterval = 1000 / targetFPS;
    
    return function(currentTime) {
      if (currentTime - lastTime >= frameInterval) {
        callback(currentTime);
        lastTime = currentTime;
      }
    };
  },

  // Memory cleanup utility for menu
  cleanupMemory: () => {
    // Clear Three.js caches
    if (window.THREE) {
      // Clear texture cache
      if (window.THREE.Cache) {
        window.THREE.Cache.clear();
      }
      
      // Clear geometry cache
      if (window.THREE.GeometryCache) {
        window.THREE.GeometryCache.clear();
      }
    }
    
    // Force garbage collection if available
    if (window.gc) {
      window.gc();
    }
  },

  // Menu-specific optimizations
  optimizeMenuComponent: (component) => {
    if (!component) return;
    
    // Optimize for menu-specific rendering
    if (component.style) {
      component.style.willChange = 'transform';
    }
    
    // Add performance attributes
    if (component.setAttribute) {
      component.setAttribute('data-optimized', 'true');
    }
  },

  // Button interaction optimization
  optimizeButtonInteraction: (button) => {
    if (!button) return;
    
    // Add interaction tracking
    button.addEventListener('click', () => {
      menuPerformanceMonitor.recordButtonInteraction();
    }, { passive: true });
    
    // Optimize button rendering
    if (button.style) {
      button.style.willChange = 'transform, opacity';
    }
  },

  // Navigation optimization
  optimizeNavigation: (navigationFunction) => {
    return (...args) => {
      menuPerformanceMonitor.startNavigation();
      
      const result = navigationFunction(...args);
      
      // If it's a promise, wait for it to complete
      if (result && typeof result.then === 'function') {
        result.finally(() => {
          menuPerformanceMonitor.endNavigation();
        });
      } else {
        menuPerformanceMonitor.endNavigation();
      }
      
      return result;
    };
  },

  // Menu rendering optimization
  optimizeMenuRenderer: (renderer) => {
    if (!renderer) return;
    
    // Performance settings for menu
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.shadowMap.enabled = false;
    renderer.autoClear = false;
    renderer.sortObjects = false;
    
    // Disable features for better performance
    renderer.info.autoReset = false;
  },

  // Lazy loading for menu items
  lazyLoadMenuItems: (items, batchSize = 5) => {
    return new Promise((resolve) => {
      let loadedCount = 0;
      
      const loadBatch = () => {
        const batch = items.slice(loadedCount, loadedCount + batchSize);
        
        batch.forEach(item => {
          // Simulate loading
          setTimeout(() => {
            item.loaded = true;
          }, Math.random() * 100);
        });
        
        loadedCount += batchSize;
        
        if (loadedCount < items.length) {
          requestAnimationFrame(loadBatch);
        } else {
          resolve(items);
        }
      };
      
      loadBatch();
    });
  }
};

export default menuPerformanceMonitor;
