import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  foreground: string;
  muted: string;
  border: string;
}

interface ThemeStore {
  colors: ThemeColors;
  setColors: (colors: ThemeColors) => void;
  updateTheme: (colors: ThemeColors) => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      colors: {
        primary: '#6366f1',
        secondary: '#4f46e5',
        accent: '#8b5cf6',
        background: '#000000',
        foreground: '#ffffff',
        muted: '#6b7280',
        border: '#27272a'
      },
      setColors: (colors) => set({ colors }),
      updateTheme: (colors) => {
        const root = document.documentElement;
        Object.entries(colors).forEach(([key, value]) => {
          const hsl = hexToHSL(value);
          root.style.setProperty(`--${key}`, hsl);
          
          // Set foreground colors for primary, secondary, and accent
          if (['primary', 'secondary', 'accent'].includes(key)) {
            root.style.setProperty(
              `--${key}-foreground`,
              isLightColor(value) ? '222.2 47.4% 11.2%' : '210 40% 98%'
            );
          }
        });
        set({ colors });
      }
    }),
    {
      name: 'theme-storage',
      skipHydration: true
    }
  )
);

// Helper function to convert hex to HSL
function hexToHSL(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    
    h *= 60;
  }

  return `${h.toFixed(1)} ${(s * 100).toFixed(1)}% ${(l * 100).toFixed(1)}%`;
}

// Helper function to determine if a color is light
function isLightColor(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  
  // Calculate relative luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5;
}