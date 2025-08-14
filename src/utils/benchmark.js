// Benchmark Utility for neurocore-menupage
// Comprehensive performance testing and comparison tool

class NeurocoreBenchmark {
  constructor() {
    this.results = {
      renderTime: [],
      memoryUsage: [],
      fps: [],
      loadTime: 0,
      componentMountTime: [],
      interactionTime: [],
      navigationTime: [],
      errors: []
    };
    
    this.isRunning = false;
    this.startTime = 0;
    this.testDuration = 30000; // 30 seconds default
    this.sampleInterval = 100; // 100ms intervals
  }

  // Start comprehensive benchmark
  async startBenchmark(duration = 30000) {
    if (this.isRunning) {
      console.warn('Benchmark already running');
      return;
    }

    this.isRunning = true;
    this.testDuration = duration;
    this.startTime = performance.now();
    
    console.log(`🚀 Starting neurocore-menupage benchmark for ${duration}ms`);
    
    // Clear previous results
    this.results = {
      renderTime: [],
      memoryUsage: [],
      fps: [],
      loadTime: 0,
      componentMountTime: [],
      interactionTime: [],
      navigationTime: [],
      errors: []
    };

    // Start monitoring
    this.startMonitoring();
    
    // Run specific tests
    await this.runComponentTests();
    await this.runInteractionTests();
    await this.runNavigationTests();
    await this.runMemoryTests();
    
    // Wait for test duration
    await new Promise(resolve => setTimeout(resolve, duration));
    
    this.stopBenchmark();
  }

  startMonitoring() {
    this.monitorInterval = setInterval(() => {
      if (!this.isRunning) return;
      
      const now = performance.now();
      
      // Measure FPS
      this.measureFPS();
      
      // Measure memory usage
      this.measureMemory();
      
      // Measure render time
      this.measureRenderTime();
      
    }, this.sampleInterval);
  }

  measureFPS() {
    const now = performance.now();
    const deltaTime = now - (this.lastFrameTime || now);
    const fps = 1000 / deltaTime;
    
    this.results.fps.push({
      timestamp: now,
      fps: Math.min(fps, 60) // Cap at 60fps for realistic measurement
    });
    
    this.lastFrameTime = now;
  }

  measureMemory() {
    if (performance.memory) {
      this.results.memoryUsage.push({
        timestamp: performance.now(),
        used: performance.memory.usedJSHeapSize / 1024 / 1024, // MB
        total: performance.memory.totalJSHeapSize / 1024 / 1024,
        limit: performance.memory.jsHeapSizeLimit / 1024 / 1024
      });
    }
  }

  measureRenderTime() {
    const renderStart = performance.now();
    
    // Force a re-render by triggering a state update
    requestAnimationFrame(() => {
      const renderEnd = performance.now();
      this.results.renderTime.push({
        timestamp: performance.now(),
        duration: renderEnd - renderStart
      });
    });
  }

  async runComponentTests() {
    console.log('🧪 Running component mount tests...');
    
    // Test ModeButton component
    const modeButtonStart = performance.now();
    // Simulate component mount
    await new Promise(resolve => setTimeout(resolve, 10));
    const modeButtonEnd = performance.now();
    
    this.results.componentMountTime.push({
      component: 'ModeButton',
      duration: modeButtonEnd - modeButtonStart
    });

    // Test other components
    const components = ['MenuButton', 'ContainerFrame', 'GoldenButton', 'ProgressBar'];
    
    for (const component of components) {
      const start = performance.now();
      await new Promise(resolve => setTimeout(resolve, Math.random() * 20));
      const end = performance.now();
      
      this.results.componentMountTime.push({
        component,
        duration: end - start
      });
    }
  }

  async runInteractionTests() {
    console.log('🧪 Running interaction tests...');
    
    // Simulate button clicks
    for (let i = 0; i < 10; i++) {
      const start = performance.now();
      // Simulate click event
      await new Promise(resolve => setTimeout(resolve, Math.random() * 50));
      const end = performance.now();
      
      this.results.interactionTime.push({
        type: 'button_click',
        duration: end - start
      });
    }

    // Simulate theme switching
    for (let i = 0; i < 5; i++) {
      const start = performance.now();
      // Simulate theme change
      await new Promise(resolve => setTimeout(resolve, Math.random() * 100));
      const end = performance.now();
      
      this.results.interactionTime.push({
        type: 'theme_switch',
        duration: end - start
      });
    }
  }

  async runNavigationTests() {
    console.log('🧪 Running navigation tests...');
    
    // Simulate menu navigation
    const menuItems = ['neurostat', 'neurolab', 'neurotools', 'neurobase', 'neuropacks', 'neurocontrol', 'neuroalert'];
    
    for (const item of menuItems) {
      const start = performance.now();
      // Simulate navigation to menu item
      await new Promise(resolve => setTimeout(resolve, Math.random() * 80));
      const end = performance.now();
      
      this.results.navigationTime.push({
        target: item,
        duration: end - start
      });
    }

    // Simulate back navigation
    for (let i = 0; i < 3; i++) {
      const start = performance.now();
      // Simulate back button click
      await new Promise(resolve => setTimeout(resolve, Math.random() * 60));
      const end = performance.now();
      
      this.results.navigationTime.push({
        target: 'back',
        duration: end - start
      });
    }
  }

  async runMemoryTests() {
    console.log('🧪 Running memory stress tests...');
    
    // Create temporary objects to test memory management
    const tempObjects = [];
    
    for (let i = 0; i < 1000; i++) {
      tempObjects.push({
        id: i,
        data: new Array(100).fill(Math.random()),
        timestamp: performance.now()
      });
    }
    
    // Force garbage collection if available
    if (window.gc) {
      window.gc();
    }
    
    // Clear temp objects
    tempObjects.length = 0;
  }

  stopBenchmark() {
    this.isRunning = false;
    
    if (this.monitorInterval) {
      clearInterval(this.monitorInterval);
      this.monitorInterval = null;
    }
    
    const endTime = performance.now();
    this.results.loadTime = endTime - this.startTime;
    
    console.log('✅ Benchmark completed');
    this.generateReport();
  }

  generateReport() {
    const report = {
      summary: this.calculateSummary(),
      details: this.results,
      recommendations: this.generateRecommendations(),
      timestamp: new Date().toISOString()
    };

    console.log('📊 Neurocore Benchmark Report:', report);
    
    // Store report for comparison
    localStorage.setItem('neurocore_benchmark_report', JSON.stringify(report));
    
    return report;
  }

  calculateSummary() {
    const avgFPS = this.results.fps.length > 0 
      ? this.results.fps.reduce((sum, entry) => sum + entry.fps, 0) / this.results.fps.length
      : 0;
    
    const avgMemory = this.results.memoryUsage.length > 0
      ? this.results.memoryUsage.reduce((sum, entry) => sum + entry.used, 0) / this.results.memoryUsage.length
      : 0;
    
    const avgRenderTime = this.results.renderTime.length > 0
      ? this.results.renderTime.reduce((sum, entry) => sum + entry.duration, 0) / this.results.renderTime.length
      : 0;
    
    const avgComponentMount = this.results.componentMountTime.length > 0
      ? this.results.componentMountTime.reduce((sum, entry) => sum + entry.duration, 0) / this.results.componentMountTime.length
      : 0;
    
    const avgInteraction = this.results.interactionTime.length > 0
      ? this.results.interactionTime.reduce((sum, entry) => sum + entry.duration, 0) / this.results.interactionTime.length
      : 0;

    const avgNavigation = this.results.navigationTime.length > 0
      ? this.results.navigationTime.reduce((sum, entry) => sum + entry.duration, 0) / this.results.navigationTime.length
      : 0;

    return {
      avgFPS: Math.round(avgFPS * 100) / 100,
      avgMemory: Math.round(avgMemory * 100) / 100,
      avgRenderTime: Math.round(avgRenderTime * 100) / 100,
      avgComponentMount: Math.round(avgComponentMount * 100) / 100,
      avgInteraction: Math.round(avgInteraction * 100) / 100,
      avgNavigation: Math.round(avgNavigation * 100) / 100,
      totalLoadTime: Math.round(this.results.loadTime * 100) / 100,
      errorCount: this.results.errors.length,
      sampleCount: this.results.fps.length
    };
  }

  generateRecommendations() {
    const summary = this.calculateSummary();
    const recommendations = [];

    if (summary.avgFPS < 45) {
      recommendations.push('Consider reducing menu complexity');
      recommendations.push('Optimize render loops');
      recommendations.push('Use React.memo for expensive components');
    }

    if (summary.avgMemory > 100) {
      recommendations.push('Implement memory cleanup strategies');
      recommendations.push('Use lazy loading for components');
      recommendations.push('Optimize image and asset loading');
    }

    if (summary.avgRenderTime > 16) {
      recommendations.push('Optimize component rendering');
      recommendations.push('Reduce DOM manipulation');
      recommendations.push('Use CSS transforms instead of layout changes');
    }

    if (summary.avgComponentMount > 50) {
      recommendations.push('Optimize component initialization');
      recommendations.push('Use code splitting');
      recommendations.push('Reduce bundle size');
    }

    if (summary.avgNavigation > 200) {
      recommendations.push('Optimize navigation transitions');
      recommendations.push('Reduce animation complexity');
      recommendations.push('Use preloading for common routes');
    }

    return recommendations;
  }

  // Compare with another benchmark result
  compareWith(otherReport) {
    const currentSummary = this.calculateSummary();
    const otherSummary = otherReport.summary;

    const comparison = {
      fps: {
        current: currentSummary.avgFPS,
        other: otherSummary.avgFPS,
        difference: currentSummary.avgFPS - otherSummary.avgFPS,
        percentage: ((currentSummary.avgFPS - otherSummary.avgFPS) / otherSummary.avgFPS) * 100
      },
      memory: {
        current: currentSummary.avgMemory,
        other: otherSummary.avgMemory,
        difference: currentSummary.avgMemory - otherSummary.avgMemory,
        percentage: ((currentSummary.avgMemory - otherSummary.avgMemory) / otherSummary.avgMemory) * 100
      },
      renderTime: {
        current: currentSummary.avgRenderTime,
        other: otherSummary.avgRenderTime,
        difference: currentSummary.avgRenderTime - otherSummary.avgRenderTime,
        percentage: ((currentSummary.avgRenderTime - otherSummary.avgRenderTime) / otherSummary.avgRenderTime) * 100
      },
      navigation: {
        current: currentSummary.avgNavigation,
        other: otherSummary.avgNavigation || 0,
        difference: currentSummary.avgNavigation - (otherSummary.avgNavigation || 0),
        percentage: otherSummary.avgNavigation ? ((currentSummary.avgNavigation - otherSummary.avgNavigation) / otherSummary.avgNavigation) * 100 : 0
      }
    };

    console.log('🔄 Benchmark Comparison:', comparison);
    return comparison;
  }
}

// Global benchmark instance
const neurocoreBenchmark = new NeurocoreBenchmark();

// Export utilities
export const benchmarkUtils = {
  // Quick performance check
  quickCheck: () => {
    const start = performance.now();
    return {
      start,
      end: () => performance.now() - start
    };
  },

  // Memory usage check
  getMemoryUsage: () => {
    if (performance.memory) {
      return {
        used: performance.memory.usedJSHeapSize / 1024 / 1024,
        total: performance.memory.totalJSHeapSize / 1024 / 1024,
        limit: performance.memory.jsHeapSizeLimit / 1024 / 1024
      };
    }
    return null;
  },

  // FPS measurement
  measureFPS: (callback, duration = 1000) => {
    let frameCount = 0;
    const startTime = performance.now();
    
    const measure = () => {
      frameCount++;
      if (performance.now() - startTime < duration) {
        requestAnimationFrame(measure);
      } else {
        const fps = (frameCount * 1000) / duration;
        callback(fps);
      }
    };
    
    requestAnimationFrame(measure);
  }
};

export default neurocoreBenchmark;
