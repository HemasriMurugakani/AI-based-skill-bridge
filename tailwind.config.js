/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        parchment: {
          DEFAULT: '#FBF7F0',
          50: '#FFFFFF',
          100: '#FDFBFA',
          200: '#F8F2E6',
          300: '#EFE5D3',
          400: '#E4D5BC',
        },
        maroon: {
          50: '#FDF4F3',
          100: '#FBE8E6',
          200: '#F6CFCC',
          300: '#EEABA5',
          400: '#DC6E64',
          500: '#B83226',
          600: '#8B1E14',
          700: '#7A1A12',
          800: '#5C130D',
          900: '#3D0A07',
          950: '#230403',
        },
        gold: {
          50: '#FDF9EE',
          100: '#FBF0D3',
          200: '#F7DF9E',
          300: '#F2CA63',
          400: '#E8B23A',
          500: '#D49522',
          600: '#B8761A',
          700: '#8F5910',
          800: '#683F09',
          900: '#462A06',
        },
        forest: {
          50: '#F0F8F3',
          100: '#DDF0E4',
          200: '#BCE2CA',
          300: '#94CFA9',
          400: '#5FB47F',
          500: '#2F7D4F',
          600: '#24653E',
          700: '#1B4F30',
          800: '#153C24',
          900: '#0E2717',
        },
        terracotta: {
          50: '#FDF4F2',
          100: '#FCE5E0',
          200: '#F7C9BE',
          300: '#EEA291',
          400: '#DE735C',
          500: '#C8553D',
          600: '#A9422C',
          700: '#8A3320',
          800: '#6C2617',
          900: '#4D1A0F',
        },
        warm: {
          ink: '#231C18',
          muted: '#665B54',
          subtle: '#9A8E85',
          border: '#E8DECE',
          card: '#FFFFFF',
        },
        night: {
          DEFAULT: '#1A1210',
          50: '#2C201C',
          100: '#241A17',
          200: '#1E1513',
          card: '#231815',
          border: '#3D2D27',
          ink: '#F6EFE9',
          muted: '#B7AAA1',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        tamil: ['"Noto Sans Tamil"', '"Plus Jakarta Sans"', 'sans-serif'],
        heritage: ['Cinzel', 'serif'],
      },
      boxShadow: {
        'warm-sm': '0 1px 3px rgba(35, 28, 24, 0.06), 0 1px 2px rgba(35, 28, 24, 0.04)',
        'warm-md': '0 4px 14px rgba(60, 20, 10, 0.08), 0 2px 6px rgba(35, 28, 24, 0.04)',
        'warm-lg': '0 10px 25px -3px rgba(60, 20, 10, 0.12), 0 4px 10px -2px rgba(35, 28, 24, 0.05)',
        'gold-glow': '0 0 20px rgba(232, 178, 58, 0.35)',
        'maroon-glow': '0 0 24px rgba(139, 30, 20, 0.3)',
      },
      borderRadius: {
        'card': '18px',
        'card-lg': '24px',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 4s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s infinite linear',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      }
    },
  },
  plugins: [],
}
