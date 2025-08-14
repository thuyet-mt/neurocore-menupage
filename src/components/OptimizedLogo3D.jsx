import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three';
import { useTheme } from '../contexts/ThemeContext';

// Performance optimized 3D Logo component
const OptimizedLogo3D = React.memo(({ 
  position = [0, 0, 0], 
  scale = 1, 
  rotation = [0, 0, 0],
  autoRotate = true,
  rotationSpeed = 0.5,
  hoverEffect = true,
  onClick = null,
  enableAnimations = true,
  animationSpeed = 1.0,
  loopAnimations = true,
  enableSmoothRotation = true,
  initialRotationSpeed = 6.0,
  rotationDuration = 4.0,
  targetRotation = 0,
  totalRotations = 3
}) => {
  const meshRef = useRef();
  const mixerRef = useRef();
  const { currentMode } = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  const [model, setModel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [animations, setAnimations] = useState([]);
  const [currentAnimation, setCurrentAnimation] = useState(0);
  
  // Optimized rotation animation state
  const [rotationAnimationState, setRotationAnimationState] = useState({
    isAnimating: false,
    startTime: 0,
    startRotation: 0,
    targetRotation: 0,
    totalRotations: totalRotations,
    currentRotation: 0
  });

  // Memoized theme-based material
  const material = useMemo(() => {
    const baseMaterial = new THREE.MeshStandardMaterial({
      color: currentMode === 'dark' ? '#ffffff' : '#4E3117',
      metalness: 0.1,
      roughness: 0.8,
      transparent: true,
      opacity: 0.9
    });
    
    return baseMaterial;
  }, [currentMode]);

  // Optimized model loading with error handling
  useEffect(() => {
    let mounted = true;
    let abortController = new AbortController();
    
    const loadModel = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Use AbortController for cleanup
        const gltf = await new Promise((resolve, reject) => {
          const loader = new GLTFLoader();
          
          // Add timeout for loading
          const timeout = setTimeout(() => {
            reject(new Error('Model loading timeout'));
          }, 10000);
          
          loader.load(
            '/Logo_2_v1.glb',
            (gltf) => {
              clearTimeout(timeout);
              if (mounted) resolve(gltf);
            },
            (progress) => {
              if (mounted) {
                console.log('Loading progress:', (progress.loaded / progress.total * 100) + '%');
              }
            },
            (error) => {
              clearTimeout(timeout);
              if (mounted) reject(error);
            }
          );
        });
        
        if (mounted) {
          setModel(gltf);
          
          // Optimize animations
          if (gltf.animations && gltf.animations.length > 0) {
            const mixer = new THREE.AnimationMixer(gltf.scene);
            mixerRef.current = mixer;
            
            const optimizedAnimations = gltf.animations.map(anim => {
              const action = mixer.clipAction(anim);
              action.setLoop(THREE.LoopOnce);
              action.clampWhenFinished = true;
              return action;
            });
            
            setAnimations(optimizedAnimations);
            
            if (enableAnimations && optimizedAnimations.length > 0) {
              optimizedAnimations[0].play();
            }
          }
          
          setLoading(false);
        }
      } catch (error) {
        if (mounted) {
          console.error('Failed to load 3D model:', error);
          setError(error.message);
          setLoading(false);
        }
      }
    };

    loadModel();
    
    return () => {
      mounted = false;
      abortController.abort();
      
      // Cleanup mixer
      if (mixerRef.current) {
        mixerRef.current.stopAllAction();
        mixerRef.current.uncacheRoot(mixerRef.current.getRoot());
      }
    };
  }, [enableAnimations]);

  // Optimized smooth rotation function
  const startSmoothRotation = useCallback(() => {
    if (enableSmoothRotation && !autoRotate && meshRef.current) {
      const currentRotation = meshRef.current.rotation.y;
      const targetRotation = currentRotation + (totalRotations * 2 * Math.PI);
      
      meshRef.current.scale.setScalar(scale);
      
      setRotationAnimationState({
        isAnimating: true,
        startTime: Date.now(),
        startRotation: currentRotation,
        targetRotation: targetRotation,
        totalRotations: totalRotations,
        currentRotation: currentRotation
      });
      
      console.log('🔄 Starting optimized smooth rotation animation');
    }
  }, [enableSmoothRotation, autoRotate, totalRotations, scale]);

  // Optimized frame update with performance monitoring
  useFrame((state, delta) => {
    if (!meshRef.current) return;
    
    // Update mixer if exists
    if (mixerRef.current) {
      mixerRef.current.update(delta * animationSpeed);
    }
    
    // Optimized auto rotation
    if (autoRotate && !rotationAnimationState.isAnimating) {
      meshRef.current.rotation.y += rotationSpeed * delta;
    }
    
    // Optimized smooth rotation animation
    if (rotationAnimationState.isAnimating) {
      const elapsed = (Date.now() - rotationAnimationState.startTime) / 1000;
      const progress = Math.min(elapsed / rotationDuration, 1);
      
      // Use easing function for smoother animation
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      
      const newRotation = rotationAnimationState.startRotation + 
        (rotationAnimationState.targetRotation - rotationAnimationState.startRotation) * easedProgress;
      
      meshRef.current.rotation.y = newRotation;
      
      if (progress >= 1) {
        setRotationAnimationState(prev => ({ ...prev, isAnimating: false }));
      }
    }
    
    // Optimized hover effect
    if (hoverEffect && isHovered) {
      const hoverScale = 1.1;
      meshRef.current.scale.setScalar(scale * hoverScale);
    } else if (!rotationAnimationState.isAnimating) {
      meshRef.current.scale.setScalar(scale);
    }
  });

  // Optimized event handlers
  const handlePointerEnter = useCallback(() => {
    if (hoverEffect) {
      setIsHovered(true);
    }
  }, [hoverEffect]);

  const handlePointerLeave = useCallback(() => {
    if (hoverEffect) {
      setIsHovered(false);
    }
  }, [hoverEffect]);

  const handleClick = useCallback(() => {
    if (onClick) {
      onClick();
    }
    if (enableSmoothRotation) {
      startSmoothRotation();
    }
  }, [onClick, enableSmoothRotation, startSmoothRotation]);

  // Show loading state
  if (loading) {
    return (
      <mesh position={position}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#cccccc" />
      </mesh>
    );
  }

  // Show error state
  if (error) {
    return (
      <mesh position={position}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#ff0000" />
      </mesh>
    );
  }

  // Render optimized 3D model
  return (
    <group
      ref={meshRef}
      position={position}
      rotation={rotation}
      scale={scale}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onClick={handleClick}
    >
      {model && (
        <primitive 
          object={model.scene} 
          material={material}
        />
      )}
    </group>
  );
});

OptimizedLogo3D.displayName = 'OptimizedLogo3D';

export default OptimizedLogo3D;
