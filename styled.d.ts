import 'styled-components'

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      background: string
      text: string
      primary: string
      secondary: string
    }
    fonts: {
      main: string
    }
    // Add more theme properties as needed
  }
}
