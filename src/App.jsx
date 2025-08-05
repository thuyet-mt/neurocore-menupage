import React, { useState } from "react";
import Neurocore from "./components/Neurocore";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import ErrorBoundary from "./services/ErrorBoundary";
import NotificationSystem from "./components/NotificationSystem";
import Cursor3D from "./components/Cursor3D";
import CursorCalibration from "./components/CursorCalibration";

function App() {
  const [progressValue, setProgressValue] = useState(35); // Initial value at 35%
  const [cursorOffset, setCursorOffset] = useState({ x: 0.15, y: 0.1 });

  // Calculate cursor size based on progress value (5x larger)
  const cursorSize = 250 + (progressValue / 100) * 750; // Map 0-100 to 250-1000

  const handleProgressChange = (newValue) => {
    setProgressValue(newValue);
  };

  const handleCursorOffsetChange = (newOffset) => {
    setCursorOffset(newOffset);
  };

  return (
    <ErrorBoundary>
      <LanguageProvider>
        <ThemeProvider>
          <Cursor3D 
            size={cursorSize} 
            onOffsetChange={handleCursorOffsetChange}
          />
          <CursorCalibration 
            onOffsetChange={handleCursorOffsetChange}
            currentOffset={cursorOffset}
          />
          <NotificationSystem />
          <Neurocore 
            progressValue={progressValue}
            onProgressChange={handleProgressChange}
          />
        </ThemeProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}

export default App;