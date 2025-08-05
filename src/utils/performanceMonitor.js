// Performance monitoring utility
class PerformanceMonitor {
  constructor() {
    this.frameCount = 0;
    this.lastTime = performance.now();
    this.fps = 0;
    this.memoryUsage = 0;
    this.isMonitoring = false;
    this.monitorInterval = null;
  }

  start() {
    if (this.isMonitoring) return;
    
    console.log('📊 Starting performance monitoring...');
    this.isMonitoring = true;
    
    // Monitor FPS
    const measureFPS = () => {
      this.frameCount++;
      const currentTime = performance.now();
      
      if (currentTime - this.lastTime >= 1000) {
        this.fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastTime));
        this.frameCount = 0;
        this.lastTime = currentTime;
        
        // Get memory usage if available
        if (performance.memory) {
          this.memoryUsage = Math.round(performance.memory.usedJSHeapSize / 1024 / 1024);
        }
        
        console.log(`📊 Performance: FPS: ${this.fps}, Memory: ${this.memoryUsage}MB`);
      }
      
      if (this.isMonitoring) {
        requestAnimationFrame(measureFPS);
      }
    };
    
    requestAnimationFrame(measureFPS);
    
    // Monitor memory usage every 5 seconds
    this.monitorInterval = setInterval(() => {
      if (performance.memory) {
        const used = Math.round(performance.memory.usedJSHeapSize / 1024 / 1024);
        const total = Math.round(performance.memory.totalJSHeapSize / 1024 / 1024);
        const limit = Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024);
        
        console.log(`💾 Memory Usage: ${used}MB / ${total}MB (Limit: ${limit}MB)`);
        
        // Warn if memory usage is high
        if (used > limit * 0.8) {
          console.warn(`⚠️ High memory usage: ${used}MB (${Math.round(used/limit*100)}% of limit)`);
        }
      }
    }, 5000);
  }

  stop() {
    console.log('📊 Stopping performance monitoring...');
    this.isMonitoring = false;
    if (this.monitorInterval) {
      clearInterval(this.monitorInterval);
      this.monitorInterval = null;
    }
  }

  getStats() {
    return {
      fps: this.fps,
      memoryUsage: this.memoryUsage,
      isMonitoring: this.isMonitoring
    };
  }
}

// Create global instance
const performanceMonitor = new PerformanceMonitor();

// Auto-start monitoring in development
if (process.env.NODE_ENV === 'development') {
  // Start monitoring after a short delay to let the app load
  setTimeout(() => {
    performanceMonitor.start();
  }, 2000);
}

export default performanceMonitor; 