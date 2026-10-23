import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{ts,tsx}',
  ],

  theme: {
    extend: {

      // -------------------------------------------------------------------------
      // Colours: mapped to CSS variables in src/styles/global.css
      // Never hardcode a hex value in a component. Use these class names instead.
      // -------------------------------------------------------------------------
      colors: {

        // Teal scale: KamiLimu signature colour
        teal: {
          100: 'var(--color-teal-100)',
          300: 'var(--color-teal-300)',
          500: 'var(--color-teal-500)',  // Brand primary
          700: 'var(--color-teal-700)',
          900: 'var(--color-teal-900)',
        },

        // Primary palette
        primary:    'var(--color-primary)',
        'primary-hover': 'var(--color-primary-hover)',
        'primary-light': 'var(--color-primary-light)',

        // Selected and active states (teal-100 / teal-900 in light mode, flipped in dark)
        'accent-bg':   'var(--color-accent-bg)',
        'accent-text': 'var(--color-accent-text)',
        'accent-icon': 'var(--color-accent-icon)',

        // Text links and active tab labels (teal-700 in light mode)
        link: 'var(--color-link)',

        // Disabled controls
        'disabled-bg':   'var(--color-disabled-bg)',
        'disabled-text': 'var(--color-disabled-text)',

        // Brand secondary colours
        auburn:   'var(--color-auburn)',
        gamboge:  'var(--color-gamboge)',
        calPoly:  'var(--color-calPoly)',
        indigo:   'var(--color-indigo)',

        // Semantic colours
        success:  'var(--color-success)',
        warning:  'var(--color-warning)',
        danger:   'var(--color-danger)',
        info:     'var(--color-info)',

        // Semantic background colours
        'success-bg': 'var(--color-success-bg)',
        'warning-bg': 'var(--color-warning-bg)',
        'danger-bg':  'var(--color-danger-bg)',
        'info-bg':    'var(--color-info-bg)',

        // Semantic text colours (for use on semantic backgrounds)
        'success-text': 'var(--color-success-text)',
        'warning-text': 'var(--color-warning-text)',
        'danger-text':  'var(--color-danger-text)',
        'info-text':    'var(--color-info-text)',

        // Graduation status colours
        'status-on-track':    'var(--color-status-on-track)',
        'status-on-track-bg': 'var(--color-status-on-track-bg)',
        'status-warning':     'var(--color-status-warning)',
        'status-warning-bg':  'var(--color-status-warning-bg)',
        'status-at-risk':     'var(--color-status-at-risk)',
        'status-at-risk-bg':  'var(--color-status-at-risk-bg)',

        // Programme track colours
        track: {
          ict:             'var(--color-track-ict)',
          'ict-bg':        'var(--color-track-ict-bg)',
          innovation:      'var(--color-track-innovation)',
          'innovation-bg': 'var(--color-track-innovation-bg)',
          'personal-dev':     'var(--color-track-personal-dev)',
          'personal-dev-bg':  'var(--color-track-personal-dev-bg)',
          'professional-dev':    'var(--color-track-professional-dev)',
          'professional-dev-bg': 'var(--color-track-professional-dev-bg)',
          scholarship:     'var(--color-track-scholarship)',
          'scholarship-bg':'var(--color-track-scholarship-bg)',
          community:       'var(--color-track-community)',
          'community-bg':  'var(--color-track-community-bg)',
        },

        // Surface colours
        background:      'var(--color-background)',
        surface:         'var(--color-surface)',
        'surface-raised':'var(--color-surface-raised)',
        border:          'var(--color-border)',
        'border-strong': 'var(--color-border-strong)',
        overlay:         'var(--color-overlay)',

        // Text colours
        'text-primary':   'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
        'text-muted':     'var(--color-text-muted)',
        'text-inverse':   'var(--color-text-inverse)',
        'text-on-primary': 'var(--color-text-on-primary)',
      },

      // -------------------------------------------------------------------------
      // Typography: KamiLimu brand fonts
      // font-mono = JetBrains Mono (headings, titles, section headers, captions)
      // font-sans = Hind Guntur (body, subtitles, subheadings, quotes)
      // -------------------------------------------------------------------------
      fontFamily: {
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },

      // Font sizes from the KamiLimu brand kit
      // Nothing in the UI goes below 12px (text-tab).
      fontSize: {
        tab:           'var(--text-tab)',          // 12px: bottom tab labels only
        caption:       'var(--text-caption)',      // 13px: hints, chips, badges, meta
        small:         'var(--text-small)',        // 14px: labels, table text
        body:          'var(--text-body)',         // 15px
        quote:         'var(--text-quote)',        // 16px
        'card-title':  'var(--text-card-title)',   // 17px
        subheading:    'var(--text-subheading)',   // 18px
        section:       'var(--text-section)',      // 20px
        'page-mobile': 'var(--text-page-mobile)',  // 22px: page title below md
        subtitle:      'var(--text-subtitle)',     // 24px: auth card title
        page:          'var(--text-page)',         // 28px: page title md and up
        stat:          'var(--text-stat)',         // 32px: stat numbers
        heading:       'var(--text-heading)',      // 32px
        title:         'var(--text-title)',        // 42px
      },

      // -------------------------------------------------------------------------
      // Spacing: maps to CSS variable scale
      // -------------------------------------------------------------------------
      spacing: {
        '1':  'var(--space-1)',
        '2':  'var(--space-2)',
        '3':  'var(--space-3)',
        '4':  'var(--space-4)',
        '5':  'var(--space-5)',
        '6':  'var(--space-6)',
        '8':  'var(--space-8)',
        '10': 'var(--space-10)',
        '12': 'var(--space-12)',
        '16': 'var(--space-16)',
        '20': 'var(--space-20)',

        // Component sizes (h-control, w-sidebar, size-avatar, ...)
        'control-sm':   'var(--size-control-sm)',    // 36px
        control:        'var(--size-control)',       // 44px, minimum touch target
        'control-lg':   'var(--size-control-lg)',    // 52px
        sidebar:        'var(--size-sidebar)',       // 248px
        avatar:         'var(--size-avatar)',        // 36px
        'brand-mark':   'var(--size-brand-mark)',    // 30px
        'tab-icon':     'var(--size-tab-icon)',      // 22px
      },

      maxWidth: {
        'auth-card': 'var(--size-auth-card-max)',    // 440px
      },

      minHeight: {
        textarea: 'var(--size-textarea-min)',        // 110px
      },

      // -------------------------------------------------------------------------
      // Border Radius
      // -------------------------------------------------------------------------
      borderRadius: {
        sm:   'var(--radius-sm)',
        md:   'var(--radius-md)',
        control: 'var(--radius-control)',
        lg:   'var(--radius-lg)',
        xl:   'var(--radius-xl)',
        '2xl':'var(--radius-2xl)',
        full: 'var(--radius-full)',
      },

      // -------------------------------------------------------------------------
      // Box Shadows
      // -------------------------------------------------------------------------
      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        xl: 'var(--shadow-xl)',
        card: 'var(--shadow-card)',
      },

      // -------------------------------------------------------------------------
      // Transitions
      // -------------------------------------------------------------------------
      transitionDuration: {
        fast:   '150ms',
        normal: '250ms',
        slow:   '400ms',
      },

      // -------------------------------------------------------------------------
      // Z-Index
      // -------------------------------------------------------------------------
      zIndex: {
        base:     '0',
        raised:   '10',
        dropdown: '100',
        sticky:   '150',
        modal:    '200',
        toast:    '300',
        tooltip:  '400',
      },
    },
  },

  plugins: [],
}

export default config