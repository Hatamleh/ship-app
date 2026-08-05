import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        // Nord/Coding Theme Colors
        nord: {
          // Polar Night (Backgrounds)
          polar: {
            0: '#2E3440',  // Darkest - muted/secondary background
            1: '#323846',  // Main background
            2: '#3B4252',  // Lighter background
            3: '#4C566A',  // Border color
          },
          // Snow Storm (Text)
          snow: {
            0: '#D8DEE9',  // Main foreground text
            1: '#E5E9F0',  // Lighter text
            2: '#ECEFF4',  // Lightest text
          },
          // Frost (Blues - Primary/Secondary)
          frost: {
            0: '#8FBCBB',  // Teal frost
            1: '#88C0D0',  // Primary - main brand color
            2: '#81A1C1',  // Secondary/muted foreground
            3: '#5E81AC',  // Darker frost
          },
          // Aurora (Accent Colors)
          aurora: {
            red: '#BF616A',      // Destructive
            orange: '#D08770',   // Accent orange
            yellow: '#EBCB8B',   // Warning
            green: '#A3BE8C',    // Success/Premium
            purple: '#B48EAD',   // Accent purple
          },
        },
        // Semantic color mapping
        background: '#323846',
        foreground: '#D8DEE9',
        muted: '#2E3440',
        'muted-foreground': '#81A1C1',
        border: '#4C566A',
        primary: '#88C0D0',
        secondary: '#81A1C1',
        destructive: '#BF616A',
        premium: '#A3BE8C',
        accent: {
          orange: '#D08770',
          purple: '#B48EAD',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Courier New', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '0.25rem',
      },
    },
  },
  plugins: [],
}
export default config
