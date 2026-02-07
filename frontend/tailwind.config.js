/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#F9FAFB',
        surface: '#FFFFFF',
        foreground: '#111827',
        primary: '#312E81',
        'primary-foreground': '#FFFFFF',
        secondary: '#F3F4F6',
        'secondary-foreground': '#1F2937',
        accent: '#0EA5E9',
        danger: '#EF4444',
        border: '#E5E7EB',
        muted: '#9CA3AF',
      },
      fontFamily: {
        heading: ['Manrope', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        floating: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      borderRadius: {
        default: '6px',
        button: '4px',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};