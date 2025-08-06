import React, { useRef, useEffect, useState } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three';
import { useTheme } from '../contexts/ThemeContext';

const Logo3DModel = ({ 
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
  // Props for smooth rotation animation
  enableSmoothRotation = true,
  initialRotationSpeed = 6.0, // Reduced from 12.0
  rotationDuration = 4.0, // Increased from 3.0
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
  
  // Simplified rotation animation state
  const [rotationAnimationState, setRotationAnimationState] = useState({
    isAnimating: false,
    startTime: 0,
    startRotation: 0,
    targetRotation: 0,
    totalRotations: totalRotations, // Number of full rotations
    currentRotation: 0
  });

  // Update rotationAnimationState when totalRotations prop changes
  useEffect(() => {
    setRotationAnimationState(prev => ({
      ...prev,
      totalRotations: totalRotations
    }));
  }, [totalRotations]);

  // Function to start smooth rotation animation
  const startSmoothRotation = () => {
    if (enableSmoothRotation && !autoRotate && meshRef.current) {
      const currentRotation = meshRef.current.rotation.y;
      const targetRotation = currentRotation + (totalRotations * 2 * Math.PI);
      
      // Reset scale to original size when starting animation
      meshRef.current.scale.setScalar(scale);
      
      setRotationAnimationState({
        isAnimating: true,
        startTime: Date.now(),
        startRotation: currentRotation,
        targetRotation: targetRotation,
        totalRotations: totalRotations,
        currentRotation: currentRotation
      });
      
      console.log('🔄 Starting smooth rotation animation');
      console.log('📍 Start rotation:', currentRotation);
      console.log('🎯 Target rotation:', targetRotation);
      console.log('🔄 Total rotations:', totalRotations);
      console.log('📏 Scale reset to:', scale);
    }
  };

  // Load 3D model
  useEffect(() => {
    const loadModel = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Load GLB model
        const gltf = await new Promise((resolve, reject) => {
          const loader = new GLTFLoader();
          loader.load(
            '/Logo_2_v1.glb',
            (gltf) => resolve(gltf),
            (progress) => {
              console.log('Loading progress:', (progress.loaded / progress.total * 100) + '%');
            },
            (error) => reject(error)
          );
        });
        
        setModel(gltf);
        
        // Setup animations if available
        if (enableAnimations && gltf.animations && gltf.animations.length > 0) {
          const mixer = new THREE.AnimationMixer(gltf.scene);
          mixerRef.current = mixer;
          
          const animationClips = gltf.animations.map((clip, index) => {
            const action = mixer.clipAction(clip);
            action.setLoop(loopAnimations ? THREE.LoopRepeat : THREE.LoopOnce);
            action.timeScale = animationSpeed;
            return { action, clip, index };
          });
          
          setAnimations(animationClips);
          
          // Play first animation by default
          if (animationClips.length > 0) {
            animationClips[0].action.play();
            console.log(`🎬 Playing animation: ${animationClips[0].clip.name}`);
          }
          
          console.log(`✅ Loaded ${animationClips.length} animations`);
        }
        
        setLoading(false);
        console.log('✅ 3D Model loaded successfully');
      } catch (err) {
        console.error('❌ Failed to load 3D model:', err);
        setError(err);
        setLoading(false);
      }
    };

    loadModel();
    // Cleanup function
    return () => {
      // Dispose animation mixer
      if (mixerRef.current) {
        mixerRef.current.stopAllAction();
        if (mixerRef.current.uncacheRoot) {
          mixerRef.current.uncacheRoot(mixerRef.current.getRoot && mixerRef.current.getRoot());
        }
      }
      // Dispose model resources
      if (model && model.scene) {
        model.scene.traverse((child) => {
          if (child.geometry) child.geometry.dispose();
          if (child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach((mat) => mat && mat.dispose());
            } else {
              child.material.dispose && child.material.dispose();
            }
          }
        });
      }
    };
  }, [enableAnimations, animationSpeed, loopAnimations]);

  // Animation loop
  useFrame((state, delta) => {
    // Update animation mixer
    if (mixerRef.current) {
      mixerRef.current.update(delta);
    }
    
    // Handle smooth rotation animation
    if (meshRef.current && rotationAnimationState.isAnimating) {
      const currentTime = Date.now();
      const elapsedTime = (currentTime - rotationAnimationState.startTime) / 1000; // Convert to seconds
        const progress = Math.min(elapsedTime / rotationDuration, 1);
        
        // Use ease-out function for smooth deceleration
        const easeOutProgress = 1 - Math.pow(1 - progress, 3);
        
      // Calculate current rotation
      const rotationRange = rotationAnimationState.targetRotation - rotationAnimationState.startRotation;
      const currentRotation = rotationAnimationState.startRotation + (rotationRange * easeOutProgress);
      
      // Apply rotation ONLY - keep scale constant during animation
      meshRef.current.rotation.y = currentRotation;
      
      // Ensure scale stays constant during animation (no hover effects during rotation)
      meshRef.current.scale.setScalar(scale);
      
      // Check if animation is complete
      if (progress >= 1) {
        // Ensure we're exactly at the target position
        meshRef.current.rotation.y = rotationAnimationState.targetRotation;
        
          setRotationAnimationState(prev => ({
            ...prev,
          isAnimating: false
        }));
        
        console.log('🎯 Rotation animation completed');
        console.log('📍 Final rotation:', meshRef.current.rotation.y);
      }
    }
     
     // Handle regular rotation and hover effects - ONLY if autoRotate is true
    if (meshRef.current && autoRotate && !rotationAnimationState.isAnimating) {
      // Smooth rotation
      meshRef.current.rotation.y += rotationSpeed * delta;
      
      // Add hover effect
      if (hoverEffect && isHovered) {
        meshRef.current.scale.setScalar(scale * 1.1);
        meshRef.current.rotation.z += delta * 2;
      } else {
        meshRef.current.scale.setScalar(scale);
      }
    } else if (meshRef.current && !autoRotate && !rotationAnimationState.isAnimating) {
      // Only handle hover effect, no rotation
      if (hoverEffect && isHovered) {
        meshRef.current.scale.setScalar(scale * 1.1);
      } else {
        meshRef.current.scale.setScalar(scale);
      }
    }
    
    // Handle hover effects for smooth rotation mode - ONLY when not animating
    if (meshRef.current && !autoRotate && enableSmoothRotation && !rotationAnimationState.isAnimating) {
      if (hoverEffect && isHovered) {
        meshRef.current.scale.setScalar(scale * 1.1);
      } else {
        meshRef.current.scale.setScalar(scale);
      }
    }
  });

  // Handle click
  const handleClick = (event) => {
    event.stopPropagation();
    
    console.log('🎯 Logo clicked!');
    
    // Start smooth rotation animation on click
    if (enableSmoothRotation && !autoRotate) {
      console.log('✅ Starting smooth rotation animation');
      startSmoothRotation();
    } else {
      console.log('❌ Cannot start smooth rotation');
    }
    
    // Cycle through animations on click
    if (animations.length > 1) {
      const nextAnimation = (currentAnimation + 1) % animations.length;
      setCurrentAnimation(nextAnimation);
      
      // Stop current animation
      animations[currentAnimation].action.stop();
      
      // Play next animation
      animations[nextAnimation].action.play();
      console.log(`🎬 Switched to animation: ${animations[nextAnimation].clip.name}`);
    }
    
    if (onClick) {
      onClick();
    }
  };

  // Handle hover
  const handlePointerOver = () => {
    setIsHovered(true);
    document.body.style.cursor = 'pointer';
    
    // Speed up animation on hover
    if (mixerRef.current && animations.length > 0) {
      animations[currentAnimation].action.timeScale = animationSpeed * 2;
    }
  };

  const handlePointerOut = () => {
    setIsHovered(false);
    document.body.style.cursor = 'default';
    
    // Reset animation speed
    if (mixerRef.current && animations.length > 0) {
      animations[currentAnimation].action.timeScale = animationSpeed;
    }
  };

  // Get theme color for fallback
  const getThemeColor = () => {
    switch (currentMode) {
      case 'dark':
        return '#F5D180';
      case 'light':
        return '#C7B7A5';
      case 'balance':
      default:
        return '#DFAA2E';
    }
  };

  // Show loading state
  if (loading) {
    return (
      <group position={position} scale={scale} rotation={rotation}>
        <mesh>
          <boxGeometry args={[0.5, 0.5, 0.5]} />
          <meshStandardMaterial color={getThemeColor()} />
        </mesh>
      </group>
    );
  }

  // Show error state
  if (error) {
    return (
      <group position={position} scale={scale} rotation={rotation}>
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#ff0000" />
        </mesh>
      </group>
    );
  }

  // Render GLB model
  if (model) {
    // Auto-scale model to fit container
    const autoScale = () => {
      const box = new THREE.Box3().setFromObject(model.scene);
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      return maxDim > 0 ? 2 / maxDim : 1; // Scale to fit in 2x2x2 box
    };

    const modelScale = autoScale() * scale;

    return (
      <group
        ref={meshRef}
        position={position}
        scale={modelScale}
        rotation={rotation}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <primitive object={model.scene} />
        
        {/* Add lighting for better visibility */}
        <ambientLight intensity={0.6} />
        <directionalLight 
          position={[10, 10, 5]} 
          intensity={1} 
          castShadow 
        />
        <pointLight 
          position={[-10, -10, -5]} 
          intensity={0.5} 
        />
      </group>
    );
  }

  // Fallback geometric shape
  return (
    <group
      ref={meshRef}
      position={position}
      scale={scale}
      rotation={rotation}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      {/* Fallback 3D Logo - Simple geometric shape */}
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={getThemeColor()} />
      </mesh>
      
      {/* Add some decorative elements */}
      <mesh position={[0, 0, 0.6]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial color={getThemeColor()} />
      </mesh>
      
      {/* Add lighting for better visibility */}
      <ambientLight intensity={0.6} />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={1} 
        castShadow 
      />
      <pointLight 
        position={[-10, -10, -5]} 
        intensity={0.5} 
      />
    </group>
  );
};

export default Logo3DModel; 