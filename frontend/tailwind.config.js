/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-primary': 'hsl(215 46% 38%)', // #35518a
        'brand-primary-variant': 'hsl(218 45% 44%)', // #3d68a6
        'brand-secondary': 'hsl(210 40% 96.1%)',
        'brand-destructive': 'hsl(0 84.2% 60.2%)',
        'brand-muted': 'hsl(210 40% 96.1%)',
        'brand-muted-foreground': 'hsl(215.4 16.3% 46.9%)',
      },
      borderRadius: {
        'lg': '0.5rem',
        'md': 'calc(0.5rem - 2px)',
        'sm': 'calc(0.5rem - 4px)',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, hsl(215 46% 38%), hsl(218 45% 44%))',
      }
    },
  },
  plugins: [],
}
