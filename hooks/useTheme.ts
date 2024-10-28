import { useContext } from 'react'
import { BrandingContext } from '@/components/branding'
import { themeConfig } from '@/styles/theme/config'

export const useTheme = () => {
  const context = useContext(BrandingContext)
  
  const getThemeVariables = () => {
    switch (context.theme) {
      case 'forest':
        return {
          buttonGradient: themeConfig.gradients.accent,
          buttonBorderGradient: themeConfig.gradients.accent,
          progressBarGradient: themeConfig.gradients.accent,
        }
      case 'space':
      default:
        return {
          buttonGradient: themeConfig.gradients.primary,
          buttonBorderGradient: themeConfig.gradients.primary,
          progressBarGradient: themeConfig.gradients.primary,
        }
    }
  }

  return {
    ...context,
    themeVariables: getThemeVariables(),
  }
}
