import React from 'react';
import { ThemeProvider } from 'styled-components';
import CNDMonitoramento from './pages/CNDMonitoramento';
import Header from './components/Header';
import theme, { GlobalStyle } from './theme';
import styled from 'styled-components';

const AppContainer = styled.div`
  background: linear-gradient(180deg, ${props => props.theme.colors.background}, ${props => props.theme.colors.secondary});
  min-height: 100vh;
`;

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <AppContainer>
        <Header />
        <main>
          <CNDMonitoramento />
        </main>
      </AppContainer>
    </ThemeProvider>
  );
}

export default App;
