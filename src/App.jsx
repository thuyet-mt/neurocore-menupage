import Neurobase from "./components/Neurobase";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import ErrorBoundary from "./services/ErrorBoundary";
import NotificationSystem from "./components/NotificationSystem";
import { POSITION_CONFIG } from "./constants/buttons";

function App() {
  // Check if we're on test page
  const isTestPage = window.location.pathname === '/test';
  
  if (isTestPage) {
    return (
      <ErrorBoundary>
        <LanguageProvider>
          <ThemeProvider>
            <LogoTestPage />
          </ThemeProvider>
        </LanguageProvider>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <LanguageProvider>
        <ThemeProvider>
          <NotificationSystem />
          <Neurobase 
            {...POSITION_CONFIG}
            showMenuButton={true}
            showBackButton={true} 
            showModeButton={true}
          />
        </ThemeProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}

export default App;