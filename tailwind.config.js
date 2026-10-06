import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.tsx',
        './resources/js/**/*.ts',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Nunito', ...defaultTheme.fontFamily.sans],
                mono: ['Nunito', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                duo: {
                    green: '#58CC02',
                    'green-dark': '#46A302',
                    'green-light': '#E5F9D2',
                    blue: '#1CB0F6',
                    'blue-dark': '#1899D6',
                    'blue-light': '#DDF4FF',
                    yellow: '#FFC800',
                    'yellow-dark': '#E59B00',
                    'yellow-light': '#FFF5D1',
                    orange: '#FF9600',
                    'orange-dark': '#E07700',
                    'orange-light': '#FFEACC',
                    red: '#FF4B4B',
                    'red-dark': '#EA2B2B',
                    'red-light': '#FFE5E5',
                    gray: '#E5E7EB',
                    'gray-dark': '#9CA3AF',
                    border: '#E5E7EB',
                    bg: '#F7F9FA',
                    text: '#4B4B4B',
                    dark: '#111827',
                }
            },
            boxShadow: {
                'duo-green': '0 4px 0 #46A302',
                'duo-blue': '0 4px 0 #1899D6',
                'duo-yellow': '0 4px 0 #E59B00',
                'duo-orange': '0 4px 0 #E07700',
                'duo-red': '0 4px 0 #EA2B2B',
                'duo-gray': '0 4px 0 #D1D5DB',
                'duo-card': '0 4px 0 #E5E7EB',
            }
        },
    },

    plugins: [forms],
};
