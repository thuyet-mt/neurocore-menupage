// Three.js optimization utilities
import * as THREE from 'three';

// Lazy load Three.js modules to reduce initial bundle size
export const lazyLoadThreeModules = () => {
  return {
    GLTFLoader: () => import('three/examples/jsm/loaders/GLTFLoader.js'),
    OrbitControls: () => import('three/examples/jsm/controls/OrbitControls.js'),
    Environment: () => import('@react-three/drei').then(module => ({ default: module.Environment })),
  };
};

// Optimize Three.js renderer settings with better GPU handling
export const createOptimizedRenderer = (container, size) => {
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: false, // Disable antialiasing for better performance
    powerPreference: "high-performance",
    preserveDrawingBuffer: false,
    stencil: false,
    depth: true, // Enable depth buffer
    // Additional optimizations for GPU stability
    logarithmicDepthBuffer: false,
    precision: 'mediump',
    failIfMajorPerformanceCaveat: false,
    // Add context attributes for better GPU handling
    contextAttributes: {
      alpha: true,
      depth: true,
      stencil: false,
      antialias: false,
      premultipliedAlpha: false,
      preserveDrawingBuffer: false,
      powerPreference: "high-performance",
      failIfMajorPerformanceCaveat: false,
    }
  });
  
  renderer.setSize(size, size);
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  
  // Optimize for performance and stability
  renderer.shadowMap.enabled = false;
  renderer.shadowMap.type = THREE.BasicShadowMap;
  
  // Add error handling for GPU context lost
  renderer.domElement.addEventListener('webglcontextlost', (event) => {
    console.warn('WebGL context lost, attempting to restore...');
    event.preventDefault();
  }, false);
  
  renderer.domElement.addEventListener('webglcontextrestored', () => {
    console.log('WebGL context restored');
  }, false);
  
  container.appendChild(renderer.domElement);
  return renderer;
};

// Optimize scene settings
export const createOptimizedScene = () => {
  const scene = new THREE.Scene();
  
  // Disable fog for better performance
  scene.fog = null;
  
  return scene;
};

// Optimize camera settings
export const createOptimizedCamera = (fov = 70, aspect = 1, near = 0.1, far = 1000) => {
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(0, 0, 3);
  
  return camera;
};

// Enhanced memory management utilities
export const disposeObject = (object) => {
  if (!object) return;
  
  if (object.geometry) {
    object.geometry.dispose();
  }
  
  if (object.material) {
    if (Array.isArray(object.material)) {
      object.material.forEach(material => {
        if (material && material.dispose) {
          material.dispose();
        }
      });
    } else if (object.material.dispose) {
      object.material.dispose();
    }
  }
  
  if (object.texture) {
    object.texture.dispose();
  }
  
  // Dispose of any custom properties
  if (object.userData) {
    object.userData = null;
  }
};

export const disposeScene = (scene) => {
  if (!scene) return;
  
  scene.traverse((object) => {
    disposeObject(object);
  });
  
  scene.clear();
};

// Enhanced performance monitoring with GPU context handling
export const createPerformanceMonitor = () => {
  let frameCount = 0;
  let lastTime = performance.now();
  let fps = 0;
  let contextLostCount = 0;
  
  return {
    update: () => {
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime - lastTime >= 1000) {
        fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        frameCount = 0;
        lastTime = currentTime;
        
        if (fps < 30) {
          console.warn(`Low FPS detected: ${fps}`);
        }
      }
      
      return fps;
    },
    getFPS: () => fps,
    onContextLost: () => {
      contextLostCount++;
      console.warn(`GPU Context Lost (${contextLostCount} times)`);
    },
    getContextLostCount: () => contextLostCount
  };
};

// GPU memory management
export const cleanupGPUMemory = (renderer, scene) => {
  if (renderer) {
    renderer.dispose();
  }
  
  if (scene) {
    disposeScene(scene);
  }
  
  // Force garbage collection if available
  if (window.gc) {
    window.gc();
  }
};

// Optimize render loop
export const createOptimizedRenderLoop = (renderer, scene, camera) => {
  let animationId = null;
  let isRendering = true;
  
  const render = () => {
    if (isRendering) {
      renderer.render(scene, camera);
      animationId = requestAnimationFrame(render);
    }
  };
  
  return {
    start: () => {
      isRendering = true;
      render();
    },
    stop: () => {
      isRendering = false;
      if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
      }
    },
    dispose: () => {
      isRendering = false;
      if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
      }
      cleanupGPUMemory(renderer, scene);
    }
  };
};
