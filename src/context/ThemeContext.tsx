import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useState, useEffect } from 'react';

type ThemeContextType = {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  isAdmin: boolean;
  setIsAdmin: (value: boolean) => void;
};

const ThemeContext = createContext<ThemeContextType>({
  darkMode: false,
  setDarkMode: () => {},
  isAdmin: false,
  setIsAdmin: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [darkMode, setDarkModeState] = useState(false);
  const [isAdmin, setIsAdminState] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('darkMode').then((value) => {
      if (value === 'true') setDarkModeState(true);
    });
    AsyncStorage.getItem('isAdmin').then((value) => {
      if (value === 'true') setIsAdminState(true);
    });
  }, []);

  const setDarkMode = (value: boolean) => {
    setDarkModeState(value);
    AsyncStorage.setItem('darkMode', String(value));
  };

  const setIsAdmin = (value: boolean) => {
    setIsAdminState(value);
    AsyncStorage.setItem('isAdmin', String(value));
  };

  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode, isAdmin, setIsAdmin }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}