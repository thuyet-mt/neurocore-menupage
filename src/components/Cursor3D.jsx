import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { useTheme } from '../contexts/ThemeContext';

const Cursor3D = ({ size = 150 }) => {
  const mountRef = useRef(null);
  const { currentMode } = useTheme();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // Scene, camera, renderer refs
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const modelRef = useRef(null);
  const mixerRef = useRef(null);
  const clockRef = useRef(new THREE.Clock());

  // Get model path based on theme
  const getModelPath = (theme) => {
    switch (theme) {
      case 'dark':
        return '/neuro_core/config/models_3d/hand_robot_dark_v2.glb';
      case 'balance':
        return '/neuro_core/config/models_3d/hand_robot_balance_v2.glb';
      case 'light':
      case 'gold':
        return '/neuro_core/config/models_3d/hand_robot_gold_v2.glb';
      default:
        return '/neuro_core/config/models_3d/hand_robot_balance_v2.glb';
    }
  };

  // Calculate base scale based on size (5x larger range)
  const getBaseScale = () => {
    // Map size from 250-1000 to scale 0.4-1.2
    const minSize = 250;
    const maxSize = 1000;
    const minScale = 0.4;
    const maxScale = 1.2;
    
    const normalizedSize = Math.max(minSize, Math.min(maxSize, size));
    const scale = minScale + ((normalizedSize - minSize) / (maxSize - minSize)) * (maxScale - minScale);
    return scale;
  };

  // Initialize Three.js scene
  useEffect(() => {
    if (!mountRef.current) return;

    console.log('🎯 Initializing 3D cursor with size:', size);

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera setup (orthographic for 2D-like cursor)
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 1000);
    camera.position.set(0, 0, 5);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(size, size); // Use dynamic size
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;

    mountRef.current.appendChild(renderer.domElement);

    // Load model
    const loader = new GLTFLoader();
    const modelPath = getModelPath(currentMode);
    
    console.log('🎯 Loading cursor model from:', modelPath);

    loader.load(
      modelPath,
      (gltf) => {
        console.log('✅ Cursor model loaded successfully');
        const model = gltf.scene;
        
        // Scale and position the model based on size
        const baseScale = getBaseScale();
        model.scale.set(baseScale, baseScale, baseScale);
        model.position.set(0, 0, 0);
        
        // Add to scene
        scene.add(model);
        modelRef.current = model;

        // Setup animations if available (but don't auto-play)
        if (gltf.animations && gltf.animations.length > 0) {
          const mixer = new THREE.AnimationMixer(model);
          const action = mixer.clipAction(gltf.animations[0]);
          // Store the action for later use
          mixerRef.current = mixer;
          mixerRef.current._action = action;
        }

        setIsLoaded(true);
      },
      (progress) => {
        const percent = (progress.loaded / progress.total * 100);
        console.log('🎯 Loading cursor model:', percent + '%');
      },
      (error) => {
        console.error('❌ Error loading cursor model:', error);
      }
    );

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      // Update animations
      if (mixerRef.current) {
        const delta = clockRef.current.getDelta();
        mixerRef.current.update(delta);
      }

      // Render
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [currentMode, size]);

  // Update renderer size when size prop changes
  useEffect(() => {
    if (rendererRef.current) {
      rendererRef.current.setSize(size, size);
    }
  }, [size]);

  // Handle mouse movement
  useEffect(() => {

    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseEnter = () => {
      setIsHovering(true);
      if (modelRef.current) {
        const baseScale = getBaseScale();
        modelRef.current.scale.set(baseScale * 1.25, baseScale * 1.25, baseScale * 1.25);
      }
    };

    const handleMouseLeave = () => {
      setIsHovering(false);
      if (modelRef.current) {
        const baseScale = getBaseScale();
        modelRef.current.scale.set(baseScale, baseScale, baseScale);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isLoaded, size]);

  // Handle click animation
  useEffect(() => {

    const handleClick = () => {
      console.log('🎯 Click detected!');
      if (modelRef.current && mixerRef.current && mixerRef.current._action) {
        console.log('🎯 Starting animation...');
        // Start animation on click
        const action = mixerRef.current._action;
        
        // Set animation to play once and stop
        action.setLoop(THREE.LoopOnce);
        action.clampWhenFinished = true;
        action.reset();
        action.play();
        
        // Quick scale animation for click feedback
        const baseScale = getBaseScale();
        const originalScale = modelRef.current.scale.clone();
        modelRef.current.scale.set(baseScale * 0.75, baseScale * 0.75, baseScale * 0.75);
        
        setTimeout(() => {
          if (modelRef.current) {
            modelRef.current.scale.copy(originalScale);
          }
        }, 100);
      } else {
        console.log('🎯 Animation not available:', {
          model: !!modelRef.current,
          mixer: !!mixerRef.current,
          action: !!(mixerRef.current && mixerRef.current._action)
        });
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [isLoaded, size]);

  return (
    <>
      <div
        ref={mountRef}
        style={{
          position: 'fixed',
          top: mousePosition.y,
          left: mousePosition.x,
          width: `${size}px`,
          height: `${size}px`,
          pointerEvents: 'none',
          zIndex: 9999,
          transform: 'translate(-50%, -50%)',
          transition: 'none'
        }}
      />
    </>
  );
};

export default Cursor3D; 