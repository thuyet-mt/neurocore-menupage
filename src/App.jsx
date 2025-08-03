import Neurobase from "./components/Neurocore";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import ErrorBoundary from "./services/ErrorBoundary";
import NotificationSystem from "./components/NotificationSystem";
import { POSITION_CONFIG } from "./constants/buttons";
import ButtonPositionTest from "./pages/ButtonPositionTest";
import LogoTestPage from "./pages/LogoTestPage";

function App() {
  // Check if we're on test page
  const isTestPage = window.location.pathname === '/test';
  const isButtonTestPage = window.location.pathname === '/button-test';
  
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

  if (isButtonTestPage) {
    return (
      <ErrorBoundary>
        <LanguageProvider>
          <ThemeProvider>
            <ButtonPositionTest />
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