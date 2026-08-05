import type { Config } from 'tailwindcss'

/**
 * Evergreen — the QAcart theme.
 *
 * Tokens are copied from projects/qacart/src/app.css (shared with
 * hatemhatamleh.com) so this app reads as part of the same brand: soft
 * pine-green surfaces, warm cream text, green accent shifting to aqua.
 */
const config: Config = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        ever: {
          bg: '#2a372f', // page background
          surface: '#2e3d34', // inset surfaces: inputs, hovers
          card: '#34453a', // raised surfaces: cards, panels
          raised: '#3d5044', // disabled fields, code blocks
          ink: '#23301f', // text sitting on the green accent
        },

        // Semantic tokens used throughout the app
        background: '#2a372f',
        foreground: '#ece3cf',
        muted: '#34453a',
        'muted-foreground': '#aeb6a3',
        subtle: '#79847a',
        border: 'rgba(215, 198, 170, 0.1)',
        'border-hover': 'rgba(167, 192, 128, 0.35)',

        primary: '#a7c080',
        'primary-hover': '#8fae6a',
        secondary: '#83c092',
        premium: '#83c092',
        sand: '#dbbc7f',
        destructive: '#e67e80',
        accent: {
          purple: '#d699b6',
          sand: '#dbbc7f',
        },
      },
      fontFamily: {
        // Space Grotesk headings over Inter body — the qacart.com pairing
        display: ['Space Grotesk', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'SF Mono', 'Menlo', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '0.5rem',
        card: '18px', // the card radius used across the brand
        pill: '100px', // buttons, chips and tags are fully rounded
      },
      boxShadow: {
        // Cards lift into a green glow rather than a grey drop shadow
        glow: '0 16px 38px -20px rgba(167, 192, 128, 0.3)',
        'glow-sm': '0 8px 24px rgba(167, 192, 128, 0.3)',
      },
    },
  },
  plugins: [],
}
export default config
