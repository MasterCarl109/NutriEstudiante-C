import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2e7d32',
    },
    secondary: {
      main: '#ffb300',
    },
    background: {
      default: '#f6faf6',
    },
  },
  typography: {
    fontFamily: [
      'Roboto',
      '"Segoe UI"',
      'sans-serif',
    ].join(','),
    h4: {
      fontWeight: 700,
    },
  },
  shape: {
    borderRadius: 12,
  },
})

export default theme
