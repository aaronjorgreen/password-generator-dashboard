/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        nordic: {
          bg: 'var(--bg-primary)',
          surface: 'var(--bg-surface)',
          border: 'var(--border)',
          text: 'var(--text-primary)',
          muted: 'var(--text-muted)',
          accent: 'var(--accent)',
          'accent-hover': 'var(--accent-hover)',
          success: 'var(--success)',
          warning: 'var(--warning)',
          danger: 'var(--danger)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      boxShadow: {
        card: '0 18px 45px rgba(30, 41, 59, 0.06)',
      },
    },
  },
  plugins: [],
}
