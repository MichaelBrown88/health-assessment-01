'use client'

import React from 'react'
import { ThemeProvider as StyledThemeProvider } from 'styled-components'
import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Space+Mono&display=swap');

  body {
    font-family: 'Montserrat', sans-serif;
    background-color: #050508;
    color: white;
  }
`

const theme = {
  colors: {
    background: '#050508',
    text: '#ffffff',
    primary: '#f7f7f7',
    secondary: '#121212',
  },
  fonts: {
    main: "'Montserrat', sans-serif",
  },
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <StyledThemeProvider theme={theme}>
      <GlobalStyle />
      {children}
    </StyledThemeProvider>
  )
}
