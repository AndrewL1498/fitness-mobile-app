import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useState, useEffect } from 'react';

type ThemeContextType = {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
};

const ThemeContext = createContext<ThemeContextType>({
  darkMode: false,
  setDarkMode: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [darkMode, setDarkModeState] = useState(false);

  // Load saved dark mode preference on app start
  useEffect(() => {
    AsyncStorage.getItem('darkMode').then((value) => {
      if (value === 'true') setDarkModeState(true);
    });
  }, []);

  // Save dark mode preference whenever it changes
  const setDarkMode = (value: boolean) => {
    setDarkModeState(value);
    AsyncStorage.setItem('darkMode', String(value));
  };

  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}