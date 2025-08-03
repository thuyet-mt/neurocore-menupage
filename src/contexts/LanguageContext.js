import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Fallback English language data built-in
const fallbackEnglishData = {
  "neurobase_window": {
    "title": "Neurobase",
    "telephone": "Telephone",
    "reunions": "Reunions",
    "archives": "Archives",
    "emails": "Emails",
    "agenda": "Agenda",
    "colis": "Packages",
    "commandes": "Orders",
    "accueil": "Home",
    "menu": "Menu",
    "home": "Home",
    "back": "Back",
    "adjust_cursor_size": "Adjust cursor size",
    "archives_opened": "Archives opened successfully! 📁",
    "archives_failed": "Could not open Archives",
    "telephone_opened": "Telephone system opened! 📞",
    "telephone_failed": "Could not open telephone system",
    "reunions_opened": "Reunions & Meetings opened! 👥",
    "reunions_failed": "Could not open Reunions & Meetings",
    "accueil_opened": "Home opened! 🏠",
    "accueil_failed": "Could not open Home",
    "commandes_opened": "Orders opened! 📋",
    "commandes_failed": "Could not open Orders",
    "emails_opened": "Emails opened! 📧",
    "emails_failed": "Could not open Emails",
    "agenda_opened": "Agenda opened! 📅",
    "agenda_failed": "Could not open Agenda",
    "colis_opened": "Packages opened! 📦",
    "colis_failed": "Could not open Packages",
    "navigating_back": "Navigating back... ⬅️",
    "back_failed": "Could not go back",
    "progress_updated": "Progress updated: {value}% 📊",
    "progress_failed": "Could not update progress",
    "menu_opened": "Menu opened! 📋",
    "menu_failed": "Could not open menu",
    "mode_changed": "Mode changed to: {mode} 🎨",
    "mode_failed": "Could not change mode",
    "testing_close": "Testing window close... 🧪",
    "test_failed": "Could not test close"
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');
  const [languageData, setLanguageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load language data from localStorage and fetch JSON
  useEffect(() => {
    const loadLanguageData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get language from localStorage (set by Python)
        const savedLanguage = localStorage.getItem('language') || 'en';
        setLanguage(savedLanguage);
        
        console.log('🌐 React: Loading language from localStorage...');
        console.log('🌐 React: savedLanguage =', savedLanguage);
        
        // Try to fetch language data from server
        try {
          const response = await fetch(`/langs/${savedLanguage}.json`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          const data = await response.json();
          setLanguageData(data);
          
          console.log('✅ Language data loaded from server:', savedLanguage);
          console.log('📄 Language data:', data);
        } catch (serverError) {
          console.warn('⚠️ Server not available, using fallback English data:', serverError.message);
          
          // Use built-in English fallback data
          setLanguageData(fallbackEnglishData);
          setLanguage('en'); // Force English
          console.log('🔄 Using built-in English fallback data');
        }
        
      } catch (err) {
        console.error('❌ Failed to load language data:', err);
        setError(err.message);
        
        // Use built-in English data as last resort
        setLanguageData(fallbackEnglishData);
        setLanguage('en');
        console.log('🔄 Using built-in English data as last resort');
      } finally {
        setLoading(false);
      }
    };

    loadLanguageData();
  }, []);

  // Listen for language change events from Python
  useEffect(() => {
    const handleLanguageChange = (event) => {
      const { language: newLanguage, data } = event.detail;
      console.log('🔄 Language changed via event:', newLanguage);
      setLanguage(newLanguage);
      setLanguageData(data);
    };

    window.addEventListener('languageChanged', handleLanguageChange);
    
    return () => {
      window.removeEventListener('languageChanged', handleLanguageChange);
    };
  }, []);

  // Helper function to get text from language data
  const getText = (key, section = 'neurobase_window') => {
    if (!languageData || !languageData[section]) {
      console.warn(`⚠️ Language data not available for section: ${section}`);
      return key; // Return key as fallback
    }
    
    const sectionData = languageData[section];
    const text = sectionData[key];
    
    if (!text) {
      console.warn(`⚠️ Text not found for key: ${key} in section: ${section}`);
      return key; // Return key as fallback
    }
    
    return text;
  };

  // Helper function to get text with parameters
  const getTextWithParams = (key, params = {}, section = 'neurobase_window') => {
    let text = getText(key, section);
    
    // Replace parameters in text
    Object.keys(params).forEach(param => {
      const placeholder = `{${param}}`;
      text = text.replace(placeholder, params[param]);
    });
    
    return text;
  };

  const value = {
    language,
    languageData,
    loading,
    error,
    getText,
    getTextWithParams,
    setLanguage: (newLanguage) => {
      setLanguage(newLanguage);
      localStorage.setItem('language', newLanguage);
    }
  };

  return React.createElement(LanguageContext.Provider, { value }, children);
}; 