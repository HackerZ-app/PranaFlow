/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'deep-space': '#0A0A1A',
                'deep-violet': '#1A1A2E',
                'inhale-blue': '#87CEEB', // Sky Blue
                'hold-gold': '#FFD700',   // Gold
                'exhale-orange': '#FFA500', // Sunset Orange
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            animation: {
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            }
        },
    },
    plugins: [],
}
