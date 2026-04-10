import React, { useState } from 'react';
import theme from '../../theme';

const InteractiveButton = ({ onClick, children, style, variant = 'primary', disabled = false, size = 'md', title = '' }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isActive, setIsActive] = useState(false);

    const baseStyle = {
        padding: size === 'sm' ? `${theme.spacing.xs} ${theme.spacing.sm}` : `${theme.spacing.sm} ${theme.spacing.md}`,
        borderRadius: theme.borderRadius.md,
        border: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing.sm,
        fontWeight: 'bold',
        transition: 'all 0.1s ease',
        opacity: disabled ? 0.6 : 1,
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

    const hoverStyles = !disabled ? {
        transform: 'translateY(-2px)',
        boxShadow: theme.shadows.md,
    } : {};

    const activeStyles = !disabled ? {
        transform: 'translateY(-1px)',
        boxShadow: theme.shadows.sm,
    } : {};

    let currentStyle = { ...baseStyle, ...variantStyles[variant] };
    if (isHovered && !disabled) {
        currentStyle = { ...currentStyle, ...hoverStyles };
    }
    if (isActive && !disabled) {
        currentStyle = { ...currentStyle, ...activeStyles };
    }

    return (
        <button
            style={currentStyle}
            onClick={!disabled ? onClick : undefined}
            onMouseEnter={() => !disabled && setIsHovered(true)}
            onMouseLeave={() => {
                setIsHovered(false);
                setIsActive(false);
            }}
            onMouseDown={() => !disabled && setIsActive(true)}
            onMouseUp={() => setIsActive(false)}
            disabled={disabled}
            title={title}
        >
            {children}
        </button>
    );
};

export default InteractiveButton;
