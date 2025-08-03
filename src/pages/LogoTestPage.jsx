import React from 'react';
import { Canvas } from '@react-three/fiber';
import LogoRotationTest from '../components/LogoRotationTest';

const LogoTestPage = () => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f0f0f0',
      padding: '20px'
    }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto',
        backgroundColor: 'white',
        borderRadius: '10px',
        padding: '20px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ 
          textAlign: 'center', 
          color: '#333',
          marginBottom: '30px'
        }}>
          Logo Rotation Animation Test
        </h1>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '20px',
          alignItems: 'start'
        }}>
          {/* Test Component */}
          <div>
            <LogoRotationTest />
          </div>
          
          {/* Instructions */}
          <div style={{ 
            backgroundColor: '#f8f9fa',
            padding: '20px',
            borderRadius: '8px',
            border: '1px solid #dee2e6'
          }}>
            <h3>Test Instructions:</h3>
            <ol style={{ lineHeight: '1.6' }}>
              <li><strong>Click "Start Animation"</strong> to begin the test</li>
              <li><strong>Watch the logs</strong> to see the rotation process</li>
              <li><strong>Observe the phases:</strong>
                <ul>
                  <li>🚀 <strong>Spinning:</strong> Fast rotation for 3 seconds</li>
                  <li>🐌 <strong>Slowing:</strong> Gradually slow down until reaching original position</li>
                  <li>🎯 <strong>Stopped:</strong> Animation completed at original position</li>
                </ul>
              </li>
              <li><strong>Check the final position</strong> - should be exactly the same as start position</li>
              <li><strong>Use "Reset"</strong> to run the test again</li>
            </ol>
            
            <h4 style={{ marginTop: '20px', color: '#666' }}>Expected Behavior:</h4>
            <ul style={{ lineHeight: '1.6', color: '#666' }}>
              <li>Logo rotates fast for 3 seconds</li>
              <li>Then gradually slows down</li>
              <li>Stops smoothly at the original position</li>
              <li>Total rotation should be multiple full turns</li>
              <li>Final position should match start position exactly</li>
            </ul>
          </div>
        </div>
        
        <div style={{ 
          marginTop: '30px',
          padding: '20px',
          backgroundColor: '#e3f2fd',
          borderRadius: '8px',
          border: '1px solid #2196f3'
        }}>
          <h3>Debug Information:</h3>
          <p>Open browser console (F12) to see detailed logs including:</p>
          <ul>
            <li>Timestamps for each phase</li>
            <li>Current rotation position</li>
            <li>Rotation speed</li>
            <li>Distance from original position</li>
            <li>Total rotation in turns</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LogoTestPage; 