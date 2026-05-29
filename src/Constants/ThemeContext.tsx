import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { COLORS, DARK_COLORS } from '../Constants/Theme';

type Theme = { colors: typeof COLORS };

type ThemeContextType = {
  theme: Theme;
  darkMode: boolean;
  toggleDarkMode: () => void;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: { colors: COLORS },
  darkMode: false,
  toggleDarkMode: () => {},
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = useCallback(() => {
    setDarkMode(prev => !prev);
  }, []);

  const theme = useMemo(() => ({
    colors: darkMode ? DARK_COLORS : COLORS,
  }), [darkMode]);

  const value = useMemo(() => ({
    theme, darkMode, toggleDarkMode
  }), [theme, darkMode, toggleDarkMode]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);