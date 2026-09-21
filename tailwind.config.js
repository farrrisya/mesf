import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';
import colors from 'tailwindcss/colors';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            colors: {
                // Override all amber classes to a custom Kopmedia yellow-orange
                amber: {
                    50: '#fff8eb',
                    100: '#ffefc6',
                    200: '#ffdc88',
                    300: '#ffc34a',
                    400: '#ffaa18',
                    500: '#f58d00', // Yellow-orange primary
                    600: '#d96c00',
                    700: '#b45004',
                    800: '#923f0b',
                    900: '#78340f',
                    950: '#451a03',
                },
            },
            fontFamily: {
                sans: ['Inter', 'Figtree', ...defaultTheme.fontFamily.sans],
                serif: ['"Normatica Display"', '"Montserrat"', 'sans-serif'],
            },
            keyframes: {
                'fade-in-up': {
                    '0%': { opacity: '0', transform: 'translateY(30px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                'fade-in-left': {
                    '0%': { opacity: '0', transform: 'translateX(-30px)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' },
                },
                'fade-in-right': {
                    '0%': { opacity: '0', transform: 'translateX(30px)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' },
                },
                'float': {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
            },
            animation: {
                'fade-in-up': 'fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                'fade-in-left': 'fade-in-left 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                'fade-in-right': 'fade-in-right 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                'float': 'float 6s ease-in-out infinite',
                'float-delayed': 'float 8s ease-in-out 3s infinite',
            },
        },
    },

    plugins: [forms],
};
