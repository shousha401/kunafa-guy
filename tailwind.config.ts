import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        kunafa: {
          50: '#FDF3E7',
          100: '#FAE3C8',
          200: '#F4C48F',
          300: '#ECA258',
          400: '#E28A3C',
          500: '#D97A2B',
          600: '#B8631D',
          700: '#934E18',
          800: '#6E3A13',
          900: '#4A2710',
        },
        pistachio: {
          50: '#F4F6EC',
          100: '#E6EBD3',
          200: '#CBD6A6',
          300: '#AABD74',
          400: '#8CA353',
          500: '#6F8439',
          600: '#586A2D',
          700: '#455324',
          800: '#333D1B',
          900: '#222813',
        },
        syrup: {
          400: '#DDAF45',
          500: '#C9922E',
          600: '#A97622',
        },
        griddle: {
          700: '#37312B',
          800: '#26221E',
          900: '#1B1815',
          950: '#12100E',
        },
        cream: {
          50: '#FBF6EC',
          100: '#F6EDDC',
          200: '#EDDFC4',
        },
        flag: {
          red: '#CE1126',
          green: '#007A3D',
          black: '#000000',
          white: '#FFFFFF',
        },
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        arabic: ['"Aref Ruqaa"', '"Amiri"', 'serif'],
      },
      fontSize: {
        deal: ['clamp(3.5rem, 14vw, 8rem)', { lineHeight: '0.9', letterSpacing: '-0.03em' }],
      },
      spacing: {
        'section-y': 'clamp(4rem, 10vw, 7rem)',
        gutter: 'clamp(1.25rem, 5vw, 3rem)',
      },
      borderRadius: {
        card: '1rem',
        chip: '999px',
      },
      boxShadow: {
        griddle: '0 8px 0 0 #12100E',
        'griddle-sm': '0 4px 0 0 #12100E',
        lift: '0 12px 32px -8px rgba(27, 24, 21, 0.35)',
      },
      transitionTimingFunction: {
        griddle: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
} satisfies Config;
