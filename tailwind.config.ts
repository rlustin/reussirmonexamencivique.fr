import type { Config } from 'tailwindcss'

export default {
  content: [
    './app/components/**/*.{js,vue,ts}',
    './app/layouts/**/*.vue',
    './app/pages/**/*.vue',
    './app/plugins/**/*.{js,ts}',
    './app/app.vue',
    './app/error.vue',
  ],
  theme: {
    extend: {
      colors: {
        // Warm coral - friendly and inviting
        primary: {
          DEFAULT: '#F97066',
          50: '#FFF5F4',
          100: '#FFE8E6',
          200: '#FFCFC9',
          300: '#FFADA3',
          400: '#FB8A7D',
          500: '#F97066',
          600: '#E9554A',
          700: '#C4372D',
          800: '#A32E25',
          900: '#872B24',
        },
        // Soft teal - calming success
        success: {
          DEFAULT: '#14B8A6',
          50: '#F0FDFA',
          100: '#CCFBF1',
          200: '#99F6E4',
          500: '#14B8A6',
          600: '#0D9488',
          700: '#0F766E',
        },
        // Soft rose for errors - less alarming
        error: {
          DEFAULT: '#E11D48',
          50: '#FFF1F3',
          100: '#FFE4E8',
          500: '#E11D48',
          600: '#BE123C',
          700: '#9F1239',
        },
        // Warm amber accent
        accent: {
          DEFAULT: '#F59E0B',
          50: '#FFFBEB',
          100: '#FEF3C7',
          500: '#F59E0B',
          600: '#D97706',
        },
        // Soft purple - secondary warm tone
        secondary: {
          DEFAULT: '#A78BFA',
          50: '#F5F3FF',
          100: '#EDE9FE',
          200: '#DDD6FE',
          500: '#A78BFA',
          600: '#8B5CF6',
          700: '#7C3AED',
        },
        warning: {
          DEFAULT: '#F59E0B',
          50: '#FFFBEB',
          100: '#FEF3C7',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
        },
        // Warm blue for info
        info: {
          DEFAULT: '#60A5FA',
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          500: '#60A5FA',
          600: '#3B82F6',
          700: '#2563EB',
          800: '#1E40AF',
        },
        // Warm cream background
        background: '#FFFAF5',
        foreground: '#3D3532',
        // Warm neutrals
        warm: {
          50: '#FDFCFB',
          100: '#FBF8F6',
          200: '#F5F0EB',
          300: '#E8E0D9',
          400: '#C9BFB4',
          500: '#A69A8C',
          600: '#857667',
          700: '#6B5D4F',
          800: '#4A4039',
          900: '#3D3532',
        },
      },
      fontFamily: {
        sans: ['Nunito', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(61, 53, 50, 0.08), 0 4px 6px -4px rgba(61, 53, 50, 0.05)',
        'soft-lg': '0 10px 40px -10px rgba(61, 53, 50, 0.12), 0 4px 15px -6px rgba(61, 53, 50, 0.08)',
      },
    },
  },
  plugins: [],
} satisfies Config
