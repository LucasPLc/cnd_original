import React from 'react';
import theme from '../theme';

const Header = () => {
    const styles = {
        header: {
            padding: `${theme.spacing.md} ${theme.spacing.xl}`,
            backgroundColor: theme.colors.background,
            boxShadow: theme.shadows.sm,
        },
        logoPlaceholder: {
            height: '40px',
            width: '120px',
            backgroundColor: theme.colors.muted,
            borderRadius: theme.borderRadius.md,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: theme.colors.mutedForeground,
            fontSize: '0.875rem',
            fontWeight: 600,
        }
    };

    return (
        <header style={styles.header}>
            {/*
              Para usar sua logo:
              1. Crie a pasta `src/assets` e coloque sua imagem (ex: logo.png) lá.
              2. Importe a logo: `import logo from './assets/logo.png';`
              3. Substitua a div abaixo por: `<img src={logo} alt="Logo da Empresa" style={{ height: '40px' }} />`
            */}
            <div style={styles.logoPlaceholder}>
                Sua Logo Aqui
            </div>
        </header>
    );
};

export default Header;
