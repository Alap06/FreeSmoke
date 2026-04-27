import React, { createContext, useContext, useState, useEffect } from 'react';
import { COLORS } from '../constants';
import { getSettings, saveSettings } from '../services/StorageService';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    getSettings().then(s => setIsDark(s?.theme === 'dark'));
  }, []);

  const toggleTheme = async () => {
    const newVal = !isDark;
    setIsDark(newVal);
    const s = await getSettings();
    await saveSettings({ ...s, theme: newVal ? 'dark' : 'light' });
  };

  const theme = {
    isDark,
    background:    isDark ? COLORS.backgroundDark    : COLORS.background,
    card:          isDark ? COLORS.cardDark          : COLORS.card,
    text:          isDark ? COLORS.textDark          : COLORS.text,
    textSecondary: isDark ? COLORS.textSecondaryDark : COLORS.textSecondary,
    border:        isDark ? COLORS.borderDark        : COLORS.border,
    primary:       COLORS.primary,
    primaryLight:  COLORS.primaryLight,
    accent:        COLORS.accent,
  };

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);