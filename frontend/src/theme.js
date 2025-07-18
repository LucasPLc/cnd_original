import { createGlobalStyle } from 'styled-components';

// Paleta de cores atualizada
export const colors = {
    primary: '#35518a',
    primaryVariant: '#3d68a6',
    primaryForeground: '#ffffff',

    secondary: '#f0f4f8', // Um cinza azulado muito claro
    secondaryForeground: '#35518a',

    accent: '#3d68a6',
    accentForeground: '#ffffff',

    destructive: 'hsl(0, 72%, 51%)', // Vermelho para ações destrutivas
    destructiveForeground: '#ffffff',

    background: '#ffffff',
    foreground: '#1e293b', // Um preto suave (slate-800)

    muted: '#f8fafc', // (slate-50)
    mutedForeground: '#64748b', // (slate-500)

    border: '#e2e8f0', // (slate-200)
};

export const spacing = {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
};

export const borderRadius = {
    sm: '4px',
    md: '8px',
    lg: '16px',
    full: '9999px',
};

export const shadows = {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
};

export const breakpoints = {
    mobile: '480px',
    tablet: '768px',
    desktop: '1024px',
};

export const theme = {
    colors,
    spacing,
    borderRadius,
    shadows,
    breakpoints,
};

export const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    background-color: ${theme.colors.background};
    color: ${theme.colors.foreground};
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    line-height: 1.5;
  }

  h1, h2, h3, h4, h5, h6 {
    color: ${theme.colors.primary};
    font-weight: 600;
  }

  a {
    color: ${theme.colors.primary};
    text-decoration: none;
    transition: color 0.2s ease-in-out;

    &:hover {
      color: ${theme.colors.primaryVariant};
    }
  }
`;

export default theme;
