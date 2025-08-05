import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { useTheme } from '../contexts/ThemeContext';

const Cursor3D = ({ size = 150, onOffsetChange }) => {
  // Add render counter for tracking re-renders
  const renderCountRef = useRef(0);
  renderCountRef.current += 1;
  
  console.log(`🔄 Cursor3D re-render #${renderCountRef.current} - Size: ${size}, Theme: ${useTheme().currentMode}`);
  
  const mountRef = useRef(null);
  const { currentMode } = useTheme();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isClicking, setIsClicking] = useState(false);
  
  // Scene, camera, renderer refs
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const modelRef = useRef(null);
  const mixerRef = useRef(null);
  const clockRef = useRef(new THREE.Clock());
  const animationFrameRef = useRef(null);
  const loaderRef = useRef(null);
  const isInitializedRef = useRef(false);

  // Load cursor offset from localStorage or use defaults
  const [cursorOffset, setCursorOffset] = useState(() => {
    const saved = localStorage.getItem('cursorOffset');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.warn('Failed to parse saved cursor offset, using defaults');
      }
    }
    return { x: 0.5, y: 0.5 };
  });

  // Memoized values to prevent unnecessary recalculations
  const baseScale = useMemo(() => {
    const minSize = 250;
    const maxSize = 1000;
    const minScale = 0.4;
    const maxScale = 1.2;
    
    const normalizedSize = Math.max(minSize, Math.min(maxSize, size));
    const scale = minScale + ((normalizedSize - minSize) / (maxSize - minSize)) * (maxScale - minScale);
    console.log(`📏 Base scale calculated: ${scale} (size: ${size})`);
    return scale;
  }, [size]);

  // Get model path based on theme
  const getModelPath = useCallback((theme) => {
    const path = (() => {
      switch (theme) {
        case 'dark':
          return '/neuro_core/config/models_3d/hand_robot_dark_v2.glb';
        case 'balance':
          return '/neuro_core/config/models_3d/hand_robot_gold_v2.glb';
        case 'light':
          return '/neuro_core/config/models_3d/hand_robot_light_v2.glb';
      }
    })();
    console.log(`🎨 Model path for theme ${theme}: ${path}`);
    return path;
  }, []);

  // Calculate cursor offset to align fingertip with mouse position
  const getCursorOffset = useCallback(() => {
    // Offset to position the fingertip at the mouse cursor
    // These values are calibrated for the robot hand models
    const offsetX = size * cursorOffset.x;
    const offsetY = size * cursorOffset.y;
    return { x: offsetX, y: offsetY };
  }, [size, cursorOffset]);

  // Handle offset changes from calibration
  const handleOffsetChange = useCallback((newOffset) => {
    console.log(`🎯 Cursor offset changed:`, newOffset);
    setCursorOffset(newOffset);
    localStorage.setItem('cursorOffset', JSON.stringify(newOffset));
    if (onOffsetChange) {
      onOffsetChange(newOffset);
    }
  }, [onOffsetChange]);

  // Initialize Three.js scene
  useEffect(() => {
    if (!mountRef.current || isInitializedRef.current) {
      console.log(`🚫 Scene initialization skipped - mountRef: ${!!mountRef.current}, isInitialized: ${isInitializedRef.current}`);
      return;
    }
    
    isInitializedRef.current = true;
    console.log('🎯 Initializing 3D cursor scene with size:', size);

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera setup (orthographic for 2D-like cursor)
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 1000);
    camera.position.set(0, 0, 5);
    cameraRef.current = camera;

    // Renderer setup with better performance settings
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true,
      powerPreference: "high-performance",
      preserveDrawingBuffer: false,
      stencil: false,
      depth: false
    });
    renderer.setSize(size, size);
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;

    mountRef.current.appendChild(renderer.domElement);

    // Create loader instance
    loaderRef.current = new GLTFLoader();

    // Animation loop with better performance
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);

      // Update animations
      if (mixerRef.current) {
        const delta = clockRef.current.getDelta();
        mixerRef.current.update(delta);
      }

      // Render
      renderer.render(scene, camera);
    };
    animate();

    console.log('✅ Scene initialization complete');

    // Cleanup function
    return () => {
      console.log('🧹 Cleaning up scene');
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []); // Only run once on mount

  // Load model when theme changes - OPTIMIZED
  useEffect(() => {
    if (!sceneRef.current || !loaderRef.current) {
      console.log(`🚫 Model loading skipped - sceneRef: ${!!sceneRef.current}, loaderRef: ${!!loaderRef.current}`);
      return;
    }

    console.log('🎯 Loading cursor model for theme:', currentMode);
    
    // Clear existing model
    if (modelRef.current) {
      console.log('🗑️ Removing existing model');
      sceneRef.current.remove(modelRef.current);
      modelRef.current = null;
    }
    if (mixerRef.current) {
      mixerRef.current = null;
    }

    const modelPath = getModelPath(currentMode);
    
    loaderRef.current.load(
      modelPath,
      (gltf) => {
        console.log('✅ Cursor model loaded successfully');
        const model = gltf.scene;
        
        // Scale and position the model
        model.scale.set(baseScale, baseScale, baseScale);
        model.position.set(0, 0, 0);
        
        // Add to scene
        sceneRef.current.add(model);
        modelRef.current = model;

        // Setup animations if available
        if (gltf.animations && gltf.animations.length > 0) {
          const mixer = new THREE.AnimationMixer(model);
          const action = mixer.clipAction(gltf.animations[0]);
          mixerRef.current = mixer;
          mixerRef.current._action = action;
          console.log('🎬 Animation setup complete:', gltf.animations.length, 'animations');
          
          // Ensure all meshes in the model are visible during animation
          model.traverse((child) => {
            if (child.isMesh) {
              child.visible = true;
            }
          });
          
          // Add animation completion callback
          action.clampWhenFinished = true;
          action.loop = THREE.LoopOnce;
        }

        setIsLoaded(true);
      },
      (progress) => {
        const percent = (progress.loaded / progress.total * 100);
        console.log('🎯 Loading cursor model:', percent.toFixed(1) + '%');
      },
      (error) => {
        console.error('❌ Error loading cursor model:', error);
        // Create a simple fallback cursor
        const geometry = new THREE.SphereGeometry(0.1, 8, 6);
        const material = new THREE.MeshBasicMaterial({ 
          color: currentMode === 'dark' ? 0xffffff : 0x000000,
          transparent: true,
          opacity: 0.8
        });
        const fallbackModel = new THREE.Mesh(geometry, material);
        sceneRef.current.add(fallbackModel);
        modelRef.current = fallbackModel;
        setIsLoaded(true);
      }
    );
  }, [currentMode, getModelPath]); // Removed baseScale dependency

  // Update model scale when baseScale changes - OPTIMIZED
  useEffect(() => {
    if (modelRef.current && isLoaded) {
      const targetScale = isHovering ? baseScale * 1.1 : baseScale;
      console.log(`📏 Updating model scale: ${targetScale} (base: ${baseScale}, hover: ${isHovering})`);
      modelRef.current.scale.set(targetScale, targetScale, targetScale);
    } else {
      console.log(`🚫 Scale update skipped - modelRef: ${!!modelRef.current}, isLoaded: ${isLoaded}`);
    }
  }, [baseScale, isLoaded, isHovering]);

  // Update renderer size efficiently - THROTTLED
  useEffect(() => {
    if (!rendererRef.current) {
      console.log(`🚫 Renderer size update skipped - rendererRef: ${!!rendererRef.current}`);
      return;
    }

    console.log(`📐 Updating renderer size to: ${size}x${size}`);
    // Throttle size updates to prevent excessive resizing
    const timeoutId = setTimeout(() => {
      rendererRef.current.setSize(size, size);
      console.log(`✅ Renderer size updated to: ${size}x${size}`);
    }, 16); // ~60fps

    return () => clearTimeout(timeoutId);
  }, [size]);

  // Handle mouse movement with throttling
  useEffect(() => {
    let rafId = null;
    
    const handleMouseMove = (e) => {
      if (rafId) return; // Throttle updates
      
      rafId = requestAnimationFrame(() => {
        setMousePosition({ x: e.clientX, y: e.clientY });
        rafId = null;
      });
    };

    const handleMouseEnter = () => {
      console.log('🖱️ Mouse entered cursor area');
      setIsHovering(true);
      if (modelRef.current && !isClicking) {
        modelRef.current.scale.set(baseScale * 1.1, baseScale * 1.1, baseScale * 1.1);
      }
    };

    const handleMouseLeave = () => {
      console.log('🖱️ Mouse left cursor area');
      setIsHovering(false);
      if (modelRef.current && !isClicking) {
        modelRef.current.scale.set(baseScale, baseScale, baseScale);
      }
    };

    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isLoaded, baseScale, isClicking]);

  // Handle click animation with better state management
  useEffect(() => {
    const handleMouseDown = () => {
      console.log('🖱️ Mouse down detected');
      setIsClicking(true);
      // Remove scale down effect - cursor stays the same size
      if (modelRef.current) {
        // Keep current scale without shrinking
        const currentScale = isHovering ? baseScale * 1.1 : baseScale;
        modelRef.current.scale.set(currentScale, currentScale, currentScale);
      }
    };

    const handleMouseUp = () => {
      console.log('🖱️ Mouse up detected');
      setIsClicking(false);
      if (modelRef.current) {
        // Restore scale based on hover state
        const targetScale = isHovering ? baseScale * 1.1 : baseScale;
        modelRef.current.scale.set(targetScale, targetScale, targetScale);
      }
      
      // Trigger animation if available
      if (mixerRef.current && mixerRef.current._action) {
        const action = mixerRef.current._action;
        action.setLoop(THREE.LoopOnce);
        action.clampWhenFinished = true;
        action.reset();
        action.play();
        console.log('🎬 Animation triggered on click');
        
        // Ensure model is visible during animation and hide static meshes
        if (modelRef.current) {
          modelRef.current.traverse((child) => {
            if (child.isMesh) {
              // Hide static meshes during animation to avoid showing original model
              if (child.name.toLowerCase().includes('static') || 
                  child.name.toLowerCase().includes('base') ||
                  child.name.toLowerCase().includes('default')) {
                child.visible = false;
              } else {
                child.visible = true;
              }
            }
          });
        }
        
        // Add completion callback to restore model after animation
        action.getClip().duration = action.getClip().duration || 1;
        setTimeout(() => {
          if (modelRef.current) {
            modelRef.current.traverse((child) => {
              if (child.isMesh) {
                child.visible = true; // Restore all meshes after animation
              }
            });
          }
        }, action.getClip().duration * 1000);
      } else {
        console.log('⚠️ No animation available for click');
      }
    };

    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isLoaded, baseScale, isHovering]);

  // Calculate cursor position with proper offset
  const offset = getCursorOffset();
  const cursorStyle = {
    position: 'fixed',
    top: mousePosition.y - offset.y,
    left: mousePosition.x - offset.x,
    width: `${size}px`,
    height: `${size}px`,
    pointerEvents: 'none',
    zIndex: 9999,
    transition: 'none'
  };

  return (
    <div
      ref={mountRef}
      style={cursorStyle}
    />
  );
};

export default Cursor3D; 