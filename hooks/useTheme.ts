import { useContext } from 'react'
import { BrandingContext } from '@/components/BrandingContext'
import { themeConfig, ThemeName, ThemeConfig } from '@/styles/theme/config'

export const useTheme = () => {
  const { theme, setTheme } = useContext(BrandingContext);
  
  // Ensure theme is a valid theme name
  const themeName = (theme as ThemeName) || 'default';
  const currentTheme = themeConfig[themeName] as ThemeConfig;

  return {
    theme: themeName,
    setTheme,
    currentTheme,
  };
};
