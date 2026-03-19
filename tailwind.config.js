/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Space Grotesk"', 'ui-sans-serif', 'system-ui'],
        body: ['"Space Grotesk"', 'ui-sans-serif', 'system-ui'],
      },
      colors: {
        ink: '#0f172a',
        panel: '#1e293b',
        neon: '#38bdf8',
        ember: '#f43f5e',
        aurora: '#22c55e',
        amber: '#fbbf24',
      },
      boxShadow: {
        glass: '0 20px 80px rgba(0,0,0,0.35)',
      },
    },
  },
  plugins: [],
}
