import React, { useState, useEffect, useRef } from 'react';
import '../components/Neurocore.css';

const ButtonPositionTest = () => {
  const [buttonPositions, setButtonPositions] = useState({
    neurobase: { top: 25, left: 27.5, width: 300, height: 300 },
    neuropacks: { top: 25, left: 51.875, width: 300, height: 300 },
    neurolab: { top: 36.523, left: 75.486, width: 200, height: 200 },
    neurostat: { top: 36.523, left: 10.833, width: 200, height: 200 },
    neurotools: { top: 58.203, left: 23.333, width: 200, height: 200 },
    neuroalert: { top: 58.203, left: 62.569, width: 200, height: 200 },
    neurocontrol: { top: 60.742, left: 43.056, width: 200, height: 200 }
  });

  const [selectedButton, setSelectedButton] = useState('neurobase');
  const [showCoordinates, setShowCoordinates] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  // Undo/Redo functionality
  const [history, setHistory] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [savedLayouts, setSavedLayouts] = useState([]);
  const [layoutName, setLayoutName] = useState('');

  const updateButtonPosition = (buttonName, property, value) => {
    setButtonPositions(prev => {
      const newPositions = {
        ...prev,
        [buttonName]: {
          ...prev[buttonName],
          [property]: parseFloat(value)
        }
      };
      
      // Add to history
      addToHistory(newPositions);
      return newPositions;
    });
  };

  // Undo/Redo functions
  const addToHistory = (newPositions) => {
    setHistory(prev => {
      const newHistory = prev.slice(0, currentIndex + 1);
      newHistory.push(JSON.stringify(newPositions));
      return newHistory.slice(-20); // Keep last 20 states
    });
    setCurrentIndex(prev => prev + 1);
  };

  const undo = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      setButtonPositions(JSON.parse(history[newIndex]));
    }
  };

  const redo = () => {
    if (currentIndex < history.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      setButtonPositions(JSON.parse(history[newIndex]));
    }
  };

  // Save/Load Layout functions
  const saveLayout = () => {
    if (!layoutName.trim()) {
      alert('Vui lòng nhập tên layout!');
      return;
    }

    const newLayout = {
      id: Date.now(),
      name: layoutName,
      positions: buttonPositions,
      timestamp: new Date().toLocaleString()
    };

    setSavedLayouts(prev => [...prev, newLayout]);
    setLayoutName('');
    alert(`Layout "${layoutName}" đã được lưu!`);
  };

  const loadLayout = (layout) => {
    setButtonPositions(layout.positions);
    addToHistory(layout.positions);
    alert(`Layout "${layout.name}" đã được tải!`);
  };

  const deleteLayout = (layoutId) => {
    setSavedLayouts(prev => prev.filter(layout => layout.id !== layoutId));
  };

  // Drag and Drop functions
  const handleMouseDown = (e, buttonName) => {
    e.preventDefault();
    setIsDragging(true);
    setSelectedButton(buttonName);
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setDragStart({ x, y });
    setDragOffset({ x: 0, y: 0 });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const deltaX = x - dragStart.x;
    const deltaY = y - dragStart.y;
    
    setDragOffset({ x: deltaX, y: deltaY });
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    
    setIsDragging(false);
    
    // Convert pixel offset to percentage
    const containerWidth = containerRef.current.offsetWidth;
    const containerHeight = containerRef.current.offsetHeight;
    
    const deltaXPercent = (dragOffset.x / containerWidth) * 100;
    const deltaYPercent = (dragOffset.y / containerHeight) * 100;
    
         // Update button position
     const newPositions = {
       ...buttonPositions,
       [selectedButton]: {
         ...buttonPositions[selectedButton],
         left: Math.max(0, Math.min(100, buttonPositions[selectedButton].left + deltaXPercent)),
         top: Math.max(0, Math.min(100, buttonPositions[selectedButton].top + deltaYPercent))
       }
     };
     
     setButtonPositions(newPositions);
     addToHistory(newPositions);
    
    setDragOffset({ x: 0, y: 0 });
  };

  // Add event listeners for mouse movement outside of buttons
  useEffect(() => {
    const handleGlobalMouseMove = (e) => {
      if (isDragging) {
        handleMouseMove(e);
      }
    };

    const handleGlobalMouseUp = () => {
      if (isDragging) {
        handleMouseUp();
      }
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging, dragStart, dragOffset, selectedButton]);

  const getButtonStyle = (buttonName) => {
    const pos = buttonPositions[buttonName];
    const isSelected = selectedButton === buttonName;
    const isBeingDragged = isDragging && isSelected;
    
    // Calculate drag offset for visual feedback
    const dragX = isBeingDragged ? dragOffset.x : 0;
    const dragY = isBeingDragged ? dragOffset.y : 0;
    
    return {
      position: 'absolute',
      top: `${pos.top}%`,
      left: `${pos.left}%`,
      transform: `translate(calc(-50% + ${dragX}px), calc(-50% + ${dragY}px))`,
      width: `${pos.width}px`,
      height: `${pos.height}px`,
      background: isSelected 
        ? 'linear-gradient(135deg, #ff6b6b 0%, #ff4757 100%)'
        : 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)',
      border: isSelected ? '3px solid #ff4757' : '2px solid #2f3542',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontWeight: 'bold',
      fontSize: '14px',
      cursor: isBeingDragged ? 'grabbing' : 'grab',
      zIndex: isSelected ? 100 : 10,
      boxShadow: isSelected 
        ? '0 0 20px rgba(255, 107, 107, 0.5), inset 0 1px 0 rgba(255,255,255,0.3)'
        : '0 4px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.3)',
      transition: isBeingDragged ? 'none' : 'all 0.3s ease',
      textShadow: '0 1px 2px rgba(0,0,0,0.5)',
      userSelect: 'none'
    };
  };

  const generateCSS = () => {
    let css = '';
    Object.entries(buttonPositions).forEach(([buttonName, pos]) => {
      css += `.button-${buttonName} {\n`;
      css += `  position: absolute;\n`;
      css += `  top: ${pos.top}%;\n`;
      css += `  left: ${pos.left}%;\n`;
      css += `  transform: translate(-50%, -50%);\n`;
      css += `  width: ${pos.width}px;\n`;
      css += `  height: ${pos.height}px;\n`;
      css += `  z-index: 10;\n`;
      css += `  opacity: 1;\n`;
      css += `  will-change: transform;\n`;
      css += `  backface-visibility: hidden;\n`;
      css += `}\n\n`;
    });
    return css;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateCSS());
    alert('CSS đã được copy vào clipboard!');
  };

  return (
    <div 
      ref={containerRef}
      className="neurocore-root" 
      style={{ height: '100vh', overflow: 'hidden' }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {/* Background */}
      <div className="neurocore-image-bg">
        <img src="/src/assets/background_menu.png" alt="background" />
      </div>

      {/* Title */}
      <h1 className="neurocore-title">NEUROCORE BUTTON POSITION TEST</h1>

      {/* Drag Instructions */}
      {!isDragging && (
        <div style={{
          position: 'fixed',
          top: '10px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'rgba(0,0,0,0.8)',
          color: 'white',
          padding: '8px 16px',
          borderRadius: '20px',
          fontSize: '12px',
          zIndex: 1001,
          pointerEvents: 'none'
        }}>
          🖱️ Drag buttons to move them | 📏 Use sliders for precise control
        </div>
      )}

      {/* Test Buttons */}
      {Object.entries(buttonPositions).map(([buttonName, pos]) => (
        <div
          key={buttonName}
          style={getButtonStyle(buttonName)}
          onMouseDown={(e) => handleMouseDown(e, buttonName)}
          onClick={(e) => {
            if (!isDragging) {
              setSelectedButton(buttonName);
            }
          }}
        >
          {buttonName.toUpperCase()}
          {showCoordinates && (
            <div style={{
              position: 'absolute',
              top: '-25px',
              left: '50%',
              transform: 'translateX(-50%)',
              fontSize: '10px',
              backgroundColor: 'rgba(0,0,0,0.8)',
              color: 'white',
              padding: '2px 6px',
              borderRadius: '4px',
              whiteSpace: 'nowrap',
              pointerEvents: 'none'
            }}>
              {pos.top.toFixed(3)}%, {pos.left.toFixed(3)}%
            </div>
          )}
        </div>
      ))}

             {/* Control Panel */}
       <div style={{
         position: 'fixed',
         top: '20px',
         right: '20px',
         backgroundColor: 'rgba(255,255,255,0.95)',
         padding: '20px',
         borderRadius: '15px',
         boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
         maxWidth: '300px',
         maxHeight: '80vh',
         overflowY: 'auto',
         zIndex: 1000,
         border: '1px solid rgba(255,255,255,0.2)',
         backdropFilter: 'blur(10px)'
       }}>
         <h3 style={{ margin: '0 0 15px 0', color: '#2f3542', textAlign: 'center' }}>
           🎯 Button Position Control
         </h3>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Selected Button:
          </label>
          <select
            value={selectedButton}
            onChange={(e) => setSelectedButton(e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '5px',
              border: '1px solid #ddd'
            }}
          >
            {Object.keys(buttonPositions).map(buttonName => (
              <option key={buttonName} value={buttonName}>
                {buttonName.toUpperCase()}
              </option>
            ))}
          </select>
        </div>

                 <div style={{ marginBottom: '15px' }}>
           <label style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
             <input
               type="checkbox"
               checked={showCoordinates}
               onChange={(e) => setShowCoordinates(e.target.checked)}
               style={{ marginRight: '8px' }}
             />
             Show Coordinates
           </label>
         </div>

         {/* Undo/Redo Controls */}
         <div style={{ marginBottom: '15px', display: 'flex', gap: '5px' }}>
           <button
             onClick={undo}
             disabled={currentIndex <= 0}
             style={{
               flex: 1,
               padding: '8px',
               backgroundColor: currentIndex <= 0 ? '#ccc' : '#4ecdc4',
               color: 'white',
               border: 'none',
               borderRadius: '5px',
               cursor: currentIndex <= 0 ? 'not-allowed' : 'pointer',
               fontSize: '12px'
             }}
           >
             ↩️ Undo
           </button>
           <button
             onClick={redo}
             disabled={currentIndex >= history.length - 1}
             style={{
               flex: 1,
               padding: '8px',
               backgroundColor: currentIndex >= history.length - 1 ? '#ccc' : '#4ecdc4',
               color: 'white',
               border: 'none',
               borderRadius: '5px',
               cursor: currentIndex >= history.length - 1 ? 'not-allowed' : 'pointer',
               fontSize: '12px'
             }}
           >
             ↪️ Redo
           </button>
         </div>

        {selectedButton && (
          <div>
            <div style={{ marginBottom: '10px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px' }}>
                Top: {buttonPositions[selectedButton].top.toFixed(3)}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                step="0.1"
                value={buttonPositions[selectedButton].top}
                onChange={(e) => updateButtonPosition(selectedButton, 'top', e.target.value)}
                style={{ width: '100%' }}
              />
            </div>

            <div style={{ marginBottom: '10px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px' }}>
                Left: {buttonPositions[selectedButton].left.toFixed(3)}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                step="0.1"
                value={buttonPositions[selectedButton].left}
                onChange={(e) => updateButtonPosition(selectedButton, 'left', e.target.value)}
                style={{ width: '100%' }}
              />
            </div>

            <div style={{ marginBottom: '10px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px' }}>
                Width: {buttonPositions[selectedButton].width}px
              </label>
              <input
                type="range"
                min="100"
                max="500"
                step="10"
                value={buttonPositions[selectedButton].width}
                onChange={(e) => updateButtonPosition(selectedButton, 'width', e.target.value)}
                style={{ width: '100%' }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px' }}>
                Height: {buttonPositions[selectedButton].height}px
              </label>
              <input
                type="range"
                min="100"
                max="500"
                step="10"
                value={buttonPositions[selectedButton].height}
                onChange={(e) => updateButtonPosition(selectedButton, 'height', e.target.value)}
                style={{ width: '100%' }}
              />
            </div>
          </div>
        )}

                 {/* Save Layout Section */}
         <div style={{ marginTop: '20px', borderTop: '1px solid #ddd', paddingTop: '15px' }}>
           <h4 style={{ margin: '0 0 10px 0', color: '#2f3542', fontSize: '14px' }}>
             💾 Save Layout
           </h4>
           
           <div style={{ marginBottom: '10px' }}>
             <input
               type="text"
               value={layoutName}
               onChange={(e) => setLayoutName(e.target.value)}
               placeholder="Nhập tên layout..."
               style={{
                 width: '100%',
                 padding: '8px',
                 borderRadius: '5px',
                 border: '1px solid #ddd',
                 fontSize: '12px'
               }}
             />
           </div>
           
           <button
             onClick={saveLayout}
             style={{
               width: '100%',
               padding: '8px',
               backgroundColor: '#4ecdc4',
               color: 'white',
               border: 'none',
               borderRadius: '5px',
               cursor: 'pointer',
               fontSize: '12px',
               marginBottom: '10px'
             }}
           >
             💾 Save Layout
           </button>

           {/* Saved Layouts */}
           {savedLayouts.length > 0 && (
             <div style={{ marginTop: '10px' }}>
               <h5 style={{ margin: '0 0 8px 0', color: '#2f3542', fontSize: '12px' }}>
                 📁 Saved Layouts:
               </h5>
               <div style={{ maxHeight: '120px', overflowY: 'auto' }}>
                 {savedLayouts.map(layout => (
                   <div
                     key={layout.id}
                     style={{
                       display: 'flex',
                       justifyContent: 'space-between',
                       alignItems: 'center',
                       padding: '5px',
                       margin: '2px 0',
                       backgroundColor: '#f8f9fa',
                       borderRadius: '3px',
                       fontSize: '11px'
                     }}
                   >
                     <div>
                       <div style={{ fontWeight: 'bold' }}>{layout.name}</div>
                       <div style={{ color: '#666', fontSize: '10px' }}>{layout.timestamp}</div>
                     </div>
                     <div style={{ display: 'flex', gap: '2px' }}>
                       <button
                         onClick={() => loadLayout(layout)}
                         style={{
                           padding: '2px 6px',
                           backgroundColor: '#4ecdc4',
                           color: 'white',
                           border: 'none',
                           borderRadius: '3px',
                           cursor: 'pointer',
                           fontSize: '10px'
                         }}
                       >
                         Load
                       </button>
                       <button
                         onClick={() => deleteLayout(layout.id)}
                         style={{
                           padding: '2px 6px',
                           backgroundColor: '#ff4757',
                           color: 'white',
                           border: 'none',
                           borderRadius: '3px',
                           cursor: 'pointer',
                           fontSize: '10px'
                         }}
                       >
                         Del
                       </button>
                     </div>
                   </div>
                 ))}
               </div>
             </div>
           )}
         </div>

         <div style={{ marginTop: '20px' }}>
           <button
             onClick={copyToClipboard}
             style={{
               width: '100%',
               padding: '10px',
               backgroundColor: '#4ecdc4',
               color: 'white',
               border: 'none',
               borderRadius: '5px',
               cursor: 'pointer',
               fontWeight: 'bold'
             }}
           >
             Copy CSS to Clipboard
           </button>
         </div>

                 <div style={{ marginTop: '10px', fontSize: '11px', color: '#666' }}>
           <strong>🎮 Instructions:</strong>
           <ul style={{ margin: '5px 0', paddingLeft: '15px' }}>
             <li>🖱️ Click on any circular button to select it</li>
             <li>🎯 Drag buttons to move them around</li>
             <li>📏 Use sliders for precise position control</li>
             <li>📍 Toggle coordinates display</li>
             <li>↩️↪️ Use Undo/Redo to navigate history</li>
             <li>💾 Save layouts for later use</li>
             <li>📋 Copy the generated CSS when satisfied</li>
           </ul>
         </div>
      </div>
    </div>
  );
};

export default ButtonPositionTest; 