import React from 'react';
import { useCursor3D } from '../hooks/useCursor3D';

const Cursor3DController = () => {
  const { isEnabled, toggleCursor, error } = useCursor3D();

  if (error) {
    return (
      <div style={{
        position: 'fixed',
        top: '10px',
        right: '10px',
        background: '#ff4444',
        color: 'white',
        padding: '8px 12px',
        borderRadius: '4px',
        fontSize: '12px',
        zIndex: 10000
      }}>
        Cursor 3D Error: {error}
      </div>
    );
  }

  return (
    <button
      onClick={toggleCursor}
      style={{
        position: 'fixed',
        top: '10px',
        right: '10px',
        background: isEnabled ? '#4CAF50' : '#f44336',
        color: 'white',
        border: 'none',
        padding: '8px 12px',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '12px',
        zIndex: 10000,
        transition: 'background-color 0.3s'
      }}
      title={isEnabled ? 'Disable 3D Cursor' : 'Enable 3D Cursor'}
    >
      {isEnabled ? '🖱️ 3D ON' : '🖱️ 3D OFF'}
    </button>
  );
};

export default Cursor3DController; 