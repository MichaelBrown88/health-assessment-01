// Define the structure of your theme
export interface ThemeColors {
  primary: string;
  secondary?: string;
}

export interface ThemeGradients {
  primary: string;
  secondary: string;
  accent: string;
}

export interface ThemeFonts {
  primary: string;
}

export interface ThemeConfig {
  colors: ThemeColors;
  gradients?: ThemeGradients;
  fonts?: ThemeFonts;
}

// Define available theme names
export type ThemeName = 'default' | 'dark' | 'light'; // add your theme names

// The complete theme configuration type
export type ThemeConfigurations = Record<ThemeName, ThemeConfig>;

// Your actual theme configuration
export const themeConfig: ThemeConfigurations = {
  default: {
    colors: {
      primary: '#000000',
      secondary: '#ffffff'
    },
    gradients: {
      primary: 'linear-gradient(90deg, #0a192f 0%, #3a6073 100%)',
      secondary: 'linear-gradient(90deg, #4b6cb7 0%, #182848 100%)',
      accent: 'linear-gradient(90deg, #1f4037 0%, #99f2c8 100%)'
    },
    fonts: {
      primary: 'Montserrat, sans-serif'
    }
  },
  dark: {
    colors: {
      primary: '#ffffff',
      secondary: '#000000'
    },
    gradients: {
      primary: 'linear-gradient(90deg, #0a192f 0%, #3a6073 100%)',
      secondary: 'linear-gradient(90deg, #4b6cb7 0%, #182848 100%)',
      accent: 'linear-gradient(90deg, #1f4037 0%, #99f2c8 100%)'
    },
    fonts: {
      primary: 'Montserrat, sans-serif'
    }
  },
  light: {
    colors: {
      primary: '#000000',
      secondary: '#ffffff'
    },
    gradients: {
      primary: 'linear-gradient(90deg, #0a192f 0%, #3a6073 100%)',
      secondary: 'linear-gradient(90deg, #4b6cb7 0%, #182848 100%)',
      accent: 'linear-gradient(90deg, #1f4037 0%, #99f2c8 100%)'
    },
    fonts: {
      primary: 'Montserrat, sans-serif'
    }
  }
};

export type ThemeVariant = 'space' | 'forest' | 'custom';
