// src/theme.js

// Usando as cores HSL fornecidas, convertidas para um formato que o React pode usar.
// O React não suporta HSL diretamente em objetos de estilo, então usamos a notação `hsl(h, s, l)`.
const colors = {
    primary: 'hsl(215, 46%, 38%)',
    primaryVariant: 'hsl(218, 45%, 44%)',
    primaryForeground: 'hsl(0, 0%, 100%)',

    secondary: 'hsl(210, 40%, 96.1%)',
    secondaryForeground: 'hsl(215, 46%, 38%)',

    accent: 'hsl(218, 45%, 44%)',
    accentForeground: 'hsl(0, 0%, 100%)',

    destructive: 'hsl(0, 84.2%, 60.2%)',
    destructiveForeground: 'hsl(0, 0%, 100%)',

    background: 'hsl(0, 0%, 100%)',
    foreground: 'hsl(222.2, 84%, 4.9%)',

    muted: 'hsl(210, 40%, 96.1%)',
    mutedForeground: 'hsl(215.4, 16.3%, 46.9%)',

    border: 'hsl(214.3, 31.8%, 91.4%)',
};

const spacing = {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
};

const borderRadius = {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    full: '9999px',
};

const shadows = {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
};

const theme = {
    colors,
    spacing,
    borderRadius,
    shadows,
};

export default theme;
