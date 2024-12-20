'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useThemeStore } from '@/lib/store/theme-store';

const ThemeContext = createContext({});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { colors, updateTheme } = useThemeStore();
  const [isThemeLoaded, setIsThemeLoaded] = useState(false);

  useEffect(() => {
    // Initialize theme on mount
    const initializeTheme = async () => {
      try {
        const response = await fetch('/api/admin/theme');
        if (response.ok) {
          const data = await response.json();
          if (data) {
            updateTheme({
              primary: data.primary || colors.primary,
              secondary: data.secondary || colors.secondary,
              accent: data.accent || colors.accent,
              background: data.background || colors.background,
              foreground: data.foreground || colors.foreground,
              muted: data.muted || colors.muted,
              border: data.border || colors.border
            });
          }
        }
      } catch (error) {
        console.error('Failed to fetch theme:', error);
      } finally {
        setIsThemeLoaded(true);
      }
    };

    initializeTheme();
  }, []);

  // Apply theme when colors change
  useEffect(() => {
    if (isThemeLoaded) {
      updateTheme(colors);
    }
  }, [colors, isThemeLoaded, updateTheme]);

  if (!isThemeLoaded) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{}}>
      {children}
    </ThemeContext.Provider>
  );
}