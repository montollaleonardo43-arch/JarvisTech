/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Accent - corporate green (neon to dark)
        primary: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          200: '#BBF7D0',
          300: '#4ADE80',
          400: '#22C55E',
          500: '#16A34A',
          600: '#15803D',
          700: '#166534',
          800: '#14532D',
          900: '#052E16',
        },
        // Glass surfaces (translucent white overlays)
        surface: {
          DEFAULT: 'rgba(255, 255, 255, 0.06)',
          secondary: 'rgba(255, 255, 255, 0.10)',
        },
        border: {
          DEFAULT: 'rgba(255, 255, 255, 0.16)',
        },
        background: 'rgba(255, 255, 255, 0.02)',
        text: {
          primary: '#FFFFFF',
          secondary: 'rgba(226, 232, 240, 0.85)',
          tertiary: 'rgba(148, 163, 184, 0.75)',
          disabled: 'rgba(100, 116, 139, 0.55)',
        },
        success: '#34D399',
        warning: '#FBBF24',
        error: '#F87171',
        info: '#38BDF8',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display': ['3rem', { lineHeight: '1.1', fontWeight: '800' }],
        'h1': ['2.5rem', { lineHeight: '1.15', fontWeight: '700' }],
        'h2': ['2rem', { lineHeight: '1.2', fontWeight: '700' }],
        'h3': ['1.5rem', { lineHeight: '1.3', fontWeight: '700' }],
        'h4': ['1.25rem', { lineHeight: '1.3', fontWeight: '600' }],
        'h5': ['1.125rem', { lineHeight: '1.35', fontWeight: '600' }],
        'body-lg': ['1.125rem', { lineHeight: '1.6', fontWeight: '400' }],
        'body': ['1rem', { lineHeight: '1.6', fontWeight: '400' }],
        'small': ['0.875rem', { lineHeight: '1.5', fontWeight: '400' }],
        'caption': ['0.75rem', { lineHeight: '1.4', fontWeight: '400' }],
      },
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '16px',
        'lg': '24px',
        'xl': '32px',
        '2xl': '48px',
        '3xl': '64px',
        '4xl': '96px',
      },
      borderRadius: {
        'xs': '6px',
        'sm': '10px',
        'md': '14px',
        'lg': '18px',
        'xl': '26px',
      },
      boxShadow: {
        'level-1': '0 4px 14px -6px rgba(0, 0, 0, 0.35)',
        'level-2': '0 12px 32px -10px rgba(0, 0, 0, 0.45)',
        'level-3': '0 20px 44px -14px rgba(0, 0, 0, 0.5)',
        'level-4': '0 30px 64px -18px rgba(0, 0, 0, 0.6)',
      },
      maxWidth: {
        'container': '1280px',
      },
      screens: {
        'mobile': '0px',
        'sm': '640px',
        'tablet': '768px',
        'laptop': '1024px',
        'desktop': '1280px',
        'lg-desktop': '1536px',
      },
    },
  },
  plugins: [],
}
