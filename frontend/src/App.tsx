import MainShell from './app/MainShell';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { theme } from './app/theme';

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <MainShell />
    </ThemeProvider>
  );
}
