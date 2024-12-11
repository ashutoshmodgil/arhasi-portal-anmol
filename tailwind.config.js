/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin');

export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Manrope', 'sans-serif'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      colors: {
        primary: 'hsl(var(--primary))',
        'primary-background': 'hsl(var(--primary-background))',
        secondary: 'hsl(var(--secondary))',
        'secondary-background': 'hsl(var(--secondary-background))',
        border: {
          primary: 'hsl(var(--border-primary))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
      },
      backgroundImage: {
        upgrade: 'url(@/assets/upgradePremium.png)',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    plugin(function ({ addUtilities }) {
      addUtilities({
        '.hide-scrollbar': {
          /* For most modern browsers */
          'scrollbar-width': 'none' /* Firefox */,
          '&::-webkit-scrollbar': {
            display: 'none' /* Safari and Chrome */,
          },
        },
      });
    }),
  ],
};
