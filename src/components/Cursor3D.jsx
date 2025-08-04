import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { useTheme } from '../contexts/ThemeContext';
import { useCursor3D } from '../hooks/useCursor3D';

const Cursor3D = () => {
  const mountRef = useRef(null);
  const { currentMode } = useTheme();
  const { isEnabled, error } = useCursor3D();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [debugInfo, setDebugInfo] = useState('');
  
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

  // Don't render if cursor 3D is disabled or has error
  if (!isEnabled || error) {
    return null;
  }

  // Initialize Three.js scene
  useEffect(() => {
    if (!mountRef.current || !isEnabled) return;

    console.log('🎯 Initializing 3D cursor...');

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
    renderer.setSize(150, 150); // Increased size for better visibility
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
        
        // Scale and position the model
        model.scale.set(0.8, 0.8, 0.8); // Increased scale
        model.position.set(0, 0, 0);
        
        // Add to scene
        scene.add(model);
        modelRef.current = model;

        // Setup animations if available
        if (gltf.animations && gltf.animations.length > 0) {
          const mixer = new THREE.AnimationMixer(model);
          const action = mixer.clipAction(gltf.animations[0]);
          action.play();
          mixerRef.current = mixer;
        }

        setIsLoaded(true);
        setDebugInfo('Model loaded');
      },
      (progress) => {
        const percent = (progress.loaded / progress.total * 100);
        console.log('🎯 Loading cursor model:', percent + '%');
        setDebugInfo(`Loading: ${percent.toFixed(1)}%`);
      },
      (error) => {
        console.error('❌ Error loading cursor model:', error);
        setDebugInfo('Load error');
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
  }, [currentMode, isEnabled]);

  // Handle mouse movement
  useEffect(() => {
    if (!isEnabled) return;

    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseEnter = () => {
      setIsHovering(true);
      if (modelRef.current) {
        modelRef.current.scale.set(1.0, 1.0, 1.0);
      }
    };

    const handleMouseLeave = () => {
      setIsHovering(false);
      if (modelRef.current) {
        modelRef.current.scale.set(0.8, 0.8, 0.8);
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
  }, [isLoaded, isEnabled]);

  // Handle click animation
  useEffect(() => {
    if (!isEnabled) return;

    const handleClick = () => {
      if (modelRef.current) {
        // Quick scale animation for click feedback
        const originalScale = modelRef.current.scale.clone();
        modelRef.current.scale.set(0.6, 0.6, 0.6);
        
        setTimeout(() => {
          if (modelRef.current) {
            modelRef.current.scale.copy(originalScale);
          }
        }, 100);
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [isLoaded, isEnabled]);

  return (
    <>
      <div
        ref={mountRef}
        style={{
          position: 'fixed',
          top: mousePosition.y,
          left: mousePosition.x,
          width: '150px',
          height: '150px',
          pointerEvents: 'none',
          zIndex: 9999,
          transform: 'translate(-50%, -50%)',
          transition: 'none'
        }}
      />
      {/* Debug info */}
      {debugInfo && (
        <div style={{
          position: 'fixed',
          top: '50px',
          right: '10px',
          background: '#333',
          color: 'white',
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '10px',
          zIndex: 10001
        }}>
          {debugInfo}
        </div>
      )}
    </>
  );
};

export default Cursor3D; 