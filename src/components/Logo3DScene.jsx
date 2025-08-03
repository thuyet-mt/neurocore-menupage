import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import Logo3DModel from './Logo3DModel';

const Logo3DScene = ({ 
  width = '100%', 
  height = '100%',
  showControls = false,
  enableZoom = false,
  enablePan = false,
  autoRotate = false, // Set to false to enable click-to-rotate
  rotationSpeed = 0.5,
  scale = 1,
  position = [0, 0, 0],
  onClick = null,
  className = '',
  style = {},
  // Props for smooth rotation animation
  enableSmoothRotation = true,
  initialRotationSpeed = 6.0, // Reduced from 8.0
  rotationDuration = 4.0, // Increased from 3.0
  totalRotations = 3 // Number of full rotations when clicked
}) => {
  return (
    <div 
      style={{ 
        width, 
        height, 
        position: 'relative',
        ...style 
      }}
      className={className}
    >
      <Canvas
        camera={{ 
          position: [0, 0, 5], 
          fov: 50,
          near: 0.1,
          far: 1000
        }}
        gl={{ 
          antialias: true,
          alpha: true,
          preserveDrawingBuffer: true
        }}
        style={{ 
          background: 'transparent',
          borderRadius: '8px'
        }}
      >
        {/* Environment for better lighting */}
        <Environment 
          preset="studio" 
          background={false}
        />
        
        {/* 3D Logo Model */}
        <Suspense fallback={
          <mesh>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#DFAA2E" />
          </mesh>
        }>
          <Logo3DModel
            position={position}
            scale={scale}
            autoRotate={autoRotate}
            rotationSpeed={rotationSpeed}
            enableSmoothRotation={enableSmoothRotation}
            initialRotationSpeed={initialRotationSpeed}
            rotationDuration={rotationDuration}
            totalRotations={totalRotations}
            onClick={onClick}
          />
        </Suspense>
        
        {/* Optional Orbit Controls */}
        {showControls && (
          <OrbitControls
            enableZoom={enableZoom}
            enablePan={enablePan}
            autoRotate={autoRotate}
            autoRotateSpeed={rotationSpeed}
            enableDamping={true}
            dampingFactor={0.05}
            maxPolarAngle={Math.PI}
            minPolarAngle={0}
          />
        )}
      </Canvas>
    </div>
  );
};

export default Logo3DScene; 