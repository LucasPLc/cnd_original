import React, { useState } from 'react';
import theme from '../../theme';

const InteractiveButton = ({ onClick, children, style, variant = 'primary' }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isActive, setIsActive] = useState(false);

    const baseStyle = {
        padding: `${theme.spacing.sm} ${theme.spacing.md}`,
        borderRadius: theme.borderRadius.md,
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing.sm,
        fontWeight: 'bold',
        transition: 'transform 0.1s ease, box-shadow 0.2s ease',
        ...style,
    };

    const variantStyles = {
        primary: {
            background: theme.colors.primary,
            color: theme.colors.primaryForeground,
        },
        destructive: {
            background: theme.colors.destructive,
            color: theme.colors.destructiveForeground,
        },
        secondary: {
            background: theme.colors.muted,
            color: theme.colors.foreground,
        }
    };

    const hoverStyles = {
        transform: 'translateY(-2px)',
        boxShadow: theme.shadows.md,
    };

    const activeStyles = {
        transform: 'translateY(-1px)',
        boxShadow: theme.shadows.sm,
    };

    let currentStyle = { ...baseStyle, ...variantStyles[variant] };
    if (isHovered) {
        currentStyle = { ...currentStyle, ...hoverStyles };
    }
    if (isActive) {
        currentStyle = { ...currentStyle, ...activeStyles };
    }

    return (
        <button
            style={currentStyle}
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => {
                setIsHovered(false);
                setIsActive(false);
            }}
            onMouseDown={() => setIsActive(true)}
            onMouseUp={() => setIsActive(false)}
        >
            {children}
        </button>
    );
};

export default InteractiveButton;
