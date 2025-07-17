import React from 'react';
import CNDMonitoramento from './pages/CNDMonitoramento';
import theme from './theme';

const styles = {
  app: {
    background: `linear-gradient(180deg, ${theme.colors.background}, ${theme.colors.secondary})`,
    minHeight: '100vh',
    fontFamily: 'sans-serif',
  }
};

function App() {
  return (
    <div style={styles.app}>
      <CNDMonitoramento />
    </div>
  );
}

export default App;
