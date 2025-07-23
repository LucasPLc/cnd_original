import React, { useEffect } from 'react';
import CNDMonitoramento from './pages/CNDMonitoramento';
import Header from './components/Header';
import theme from './theme';

const styles = {
  app: {
    background: `linear-gradient(180deg, ${theme.colors.background}, ${theme.colors.secondary})`,
    minHeight: '100vh',
    fontFamily: 'sans-serif',
  }
};

function App() {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (token) {
      localStorage.setItem('authToken', token);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  return (
    <div style={styles.app}>
      <Header />
      <CNDMonitoramento />
    </div>
  );
}

export default App;
