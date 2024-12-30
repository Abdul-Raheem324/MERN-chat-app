/** @type {import('tailwindcss').Config} */
import tailwindcssAnimate from 'tailwindcss-animate';
import tailwindScrollbar from 'tailwind-scrollbar';

export default {
    darkMode: ["class"],
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            borderRadius: {
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)'
            },
            colors: {
                background: 'hsl(var(--background))',
                foreground: 'hsl(var(--foreground))',
                card: {
                    DEFAULT: 'hsl(var(--card))',
                    foreground: 'hsl(var(--card-foreground))'
                },
                popover: {
                    DEFAULT: 'hsl(var(--popover))',
                    foreground: 'hsl(var(--popover-foreground))'
                },
                primary: {
                    DEFAULT: 'hsl(var(--primary))',
                    foreground: 'hsl(var(--primary-foreground))'
                },
                secondary: {
                    DEFAULT: 'hsl(var(--secondary))',
                    foreground: 'hsl(var(--secondary-foreground))'
                },
                muted: {
                    DEFAULT: 'hsl(var(--muted))',
                    foreground: 'hsl(var(--muted-foreground))'
                },
                accent: {
                    DEFAULT: 'hsl(var(--accent))',
                    foreground: 'hsl(var(--accent-foreground))'
                },
                destructive: {
                    DEFAULT: 'hsl(var(--destructive))',
                    foreground: 'hsl(var(--destructive-foreground))'
                },
                border: 'hsl(var(--border))',
                input: 'hsl(var(--input))',
                ring: 'hsl(var(--ring))',
                chart: {
                    '1': 'hsl(var(--chart-1))',
                    '2': 'hsl(var(--chart-2))',
                    '3': 'hsl(var(--chart-3))',
                    '4': 'hsl(var(--chart-4))',
                    '5': 'hsl(var(--chart-5))'
                },
                'scroll-thumb': '#888',
                'scroll-thumb-hover': '#555',
                'scroll-track': '#222',
            },
            spacing: {
                '1/3': '33.3333%',
            },
            animation: {
                'shiny-text': 'shiny-text 8s infinite',
                gradient: 'gradient 8s linear infinite',
                'border-beam': 'border-beam calc(var(--duration)*1s) infinite linear'
            },
            keyframes: {
                'shiny-text': {
                    '0%, 90%, 100%': {
                        'background-position': 'calc(-100% - var(--shiny-width)) 0'
                    },
                    '30%, 60%': {
                        'background-position': 'calc(100% + var(--shiny-width)) 0'
                    }
                },
                gradient: {
                    to: {
                        backgroundPosition: 'var(--bg-size) 0'
                    }
                },
                'border-beam': {
                    '100%': {
                        'offset-distance': '100%'
                    }
                }
            }
        }
    },
    plugins: [
        tailwindcssAnimate,
        tailwindScrollbar,
    ],
};
