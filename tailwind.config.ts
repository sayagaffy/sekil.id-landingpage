import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/**/*.{ts,tsx,js,jsx,mdx}',
    './content/**/*.{md,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: '1rem', sm: '1.5rem', lg: '2rem' },
      screens: { '2xl': '1280px' },
    },
    extend: {
      colors: {
        /* shadcn semantic tokens */
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: { DEFAULT: 'hsl(var(--card))', foreground: 'hsl(var(--card-foreground))' },
        popover: { DEFAULT: 'hsl(var(--popover))', foreground: 'hsl(var(--popover-foreground))' },
        primary: { DEFAULT: 'hsl(var(--primary))', foreground: 'hsl(var(--primary-foreground))' },
        secondary: { DEFAULT: 'hsl(var(--secondary))', foreground: 'hsl(var(--secondary-foreground))' },
        muted: { DEFAULT: 'hsl(var(--muted))', foreground: 'hsl(var(--muted-foreground))' },
        accent: { DEFAULT: 'hsl(var(--accent))', foreground: 'hsl(var(--accent-foreground))' },
        destructive: { DEFAULT: 'hsl(var(--destructive))', foreground: 'hsl(var(--destructive-foreground))' },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },

        /* Raw design tokens — directly usable as Tailwind utilities */
        ink:   'var(--ink)',    /* #0a1230 */
        paper: 'var(--paper)', /* #f6f6f1 */

        navy: {
          950: '#050a1a',
          900: '#0a1230',
          800: '#111a44',
          700: '#18225a',
          600: '#1f2c70',
        },
        blue: {
          700: '#1647d6',
          600: '#1f5cf5',
          500: '#2966ff',
          400: '#5a8cff',
          300: '#8fb0ff',
          200: '#c9dafe',
          100: '#e2ecff',
          50:  '#f0f5ff',
        },
        peach: {
          600: '#ff7a5c',
          500: '#ff9b80',
          400: '#ffbfa8',
          300: '#ffd6c5',
          200: '#ffe4d6',
        },
        ash: {
          900: '#1a1f2e',
          700: '#4a5168',
          500: '#8a91a3',
          300: '#c9ccd6',
          200: '#e3e5ec',
          100: '#f0f1f4',
        },
        sky: {
          200: '#c9dafe',
          100: '#e2ecff',
          50:  '#f0f5ff',
        },
      },
      fontFamily: {
        sans:    ['var(--font-body)',    'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        mono:    ['var(--font-mono)',    'ui-monospace', 'monospace'],
      },
      /* Sharp edges — 0px everywhere, 9999px for pills only */
      borderRadius: {
        none:    '0px',
        sm:      '0px',
        DEFAULT: '0px',
        md:      '0px',
        lg:      '0px',
        xl:      '0px',
        '2xl':   '0px',
        '3xl':   '0px',
        full:    '9999px',
      },
      /* Hard offset shadows — zero blur, Swiss brutalist signature */
      boxShadow: {
        sm:      '4px 4px 0 0 var(--ink)',
        DEFAULT: '6px 6px 0 0 var(--ink)',
        md:      '6px 6px 0 0 var(--ink)',
        lg:      '10px 10px 0 0 var(--ink)',
        brand:   '6px 6px 0 0 var(--blue-500)',
        peach:   '6px 6px 0 0 var(--peach-500)',
        none:    'none',
        inner:   'none',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.18s cubic-bezier(0.7,0,0.3,1)',
        'accordion-up':   'accordion-up 0.18s cubic-bezier(0.7,0,0.3,1)',
      },
      transitionDuration: {
        '120': '120ms',
      },
      transitionTimingFunction: {
        snap: 'cubic-bezier(0.7, 0, 0.3, 1)',
      },
    },
  },
  plugins: [require('tailwindcss-animate'), require('@tailwindcss/typography')],
};

export default config;
