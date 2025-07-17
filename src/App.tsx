import React from 'react';
import { Provider } from 'react-redux';
import { store } from './app/store';
import { CssBaseline, Container, ThemeProvider, createTheme } from '@mui/material';
import RepositoriesFeature from './features/repositories'

/**
 * Основная тема приложения
 */
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

/**
 * Главный компонент приложения
 */
const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <RepositoriesFeature />
        </Container>
      </ThemeProvider>
    </Provider>
  );
};

export default App;