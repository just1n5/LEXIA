/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Habilita modo oscuro basado en clase
  theme: {
    extend: {
      colors: {
        // ===== TOKENS DE COLOR EXACTOS DE LA GUÍA DE ESTILO =====
        text: {
          primary: '#1F2937',       // $color-text-primary
          secondary: '#6B7280',     // $color-text-secondary  
          base: '#374151',          // $color-text-base
          // Modo oscuro
          'dark-primary': '#F9FAFB',    // $color-text-dark-primary
          'dark-secondary': '#D1D5DB',  // $color-text-dark-secondary
          'dark-tertiary': '#9CA3AF',   // $color-text-dark-tertiary
        },
        interactive: {
          default: '#FACC15',       // $color-interactive-default (amarillo característico)
          hover: '#DBB613',         // $color-interactive-hover
          active: '#C6A411',        // $color-interactive-active
          // Modo oscuro (mismos colores, mantienen buena visibilidad)
          'dark-default': '#FACC15',
          'dark-hover': '#DBB613', 
          'dark-active': '#C6A411',
        },
        bg: {
          light: '#F9FAFB',         // $color-bg-light
          dark: '#111827',          // $color-bg-dark
          canvas: '#FFFFFF',        // $color-bg-canvas
          // Modo oscuro
          'dark-primary': '#1F2937',    // $color-bg-dark-primary
          'dark-surface': '#374151',    // $color-bg-dark-surface
          'dark-elevated': '#4B5563',   // $color-bg-dark-elevated
        },
        feedback: {
          success: '#10B981',       // $color-feedback-success
          warning: '#FBBF24',       // $color-feedback-warning
          error: '#EF4444',         // $color-feedback-error
          info: '#3B82F6',          // $color-feedback-info
          // Versiones light para fondos
          'success-light': '#D1FAE5',   // $color-feedback-success-light
          'warning-light': '#FEF3C7',   // $color-feedback-warning-light
          'error-light': '#FEE2E2',     // $color-feedback-error-light
          'info-light': '#DBEAFE',      // $color-feedback-info-light
          // Modo oscuro (mismos colores base, mantienen semántica)
          'dark-success': '#10B981',
          'dark-warning': '#FBBF24',
          'dark-error': '#EF4444',
          'dark-info': '#3B82F6',
        },
        border: {
          default: '#D1D5DB',       // $color-border-default
          disabled: '#E5E7EB',      // $color-border-disabled
          // Modo oscuro
          'dark-default': '#4B5563',    // $color-border-dark-default
          'dark-disabled': '#6B7280',   // $color-border-dark-disabled
        },
      },
      fontFamily: {
        // Fuentes exactas de la guía de estilo
        'sans': ['Inter', 'system-ui', 'sans-serif'],           // Texto de cuerpo
        'heading': ['Poppins', 'system-ui', 'sans-serif'],      // Encabezados
      },
      fontSize: {
        // Jerarquía tipográfica exacta de la guía de estilo
        'heading-h1': ['2rem', { lineHeight: '1.25', fontWeight: '700' }],      // 32px, Bold
        'heading-h2': ['1.5rem', { lineHeight: '1.33', fontWeight: '600' }],    // 24px, Semi-bold
        'heading-h3': ['1.25rem', { lineHeight: '1.4', fontWeight: '600' }],    // 20px, Semi-bold
        'heading-h4': ['1.125rem', { lineHeight: '1.5', fontWeight: '500' }],   // 18px, Medium
        'body-paragraph': ['1rem', { lineHeight: '1.6', fontWeight: '400' }],   // 16px, Regular
        'body-auxiliary': ['0.875rem', { lineHeight: '1.5', fontWeight: '400' }], // 14px, Regular
        'link': ['1rem', { lineHeight: '1.6', fontWeight: '500' }],             // 16px, Medium
        // Modo oscuro (ajustes de peso para mejor legibilidad)
        'dark-heading-h1': ['2rem', { lineHeight: '1.25', fontWeight: '600' }],
        'dark-heading-h2': ['1.5rem', { lineHeight: '1.33', fontWeight: '600' }],
        'dark-heading-h3': ['1.25rem', { lineHeight: '1.4', fontWeight: '500' }],
        'dark-label': ['0.875rem', { lineHeight: '1.5', fontWeight: '500' }],
        'dark-small-text': ['0.75rem', { lineHeight: '1.5', fontWeight: '400' }],
      },
      spacing: {
        // Sistema de espaciado modular exacto de la guía de estilo (múltiplos de 4px)
        'xs': '0.25rem',    // 4px  - $spacing-xs
        'sm': '0.5rem',     // 8px  - $spacing-sm  
        'md': '1rem',       // 16px - $spacing-md
        'lg': '1.5rem',     // 24px - $spacing-lg
        'xl': '2rem',       // 32px - $spacing-xl
        '2xl': '3rem',      // 48px - $spacing-2xl
        '3xl': '4rem',      // 64px - $spacing-3xl
        // Espaciado adicional para casos específicos
        'xxs': '0.25rem',   // 4px
        'xs-plus': '0.75rem', // 12px
      },
      borderRadius: {
        // Border radius exacto de la guía de estilo
        'sm': '4px',        // $border-radius-sm
        'md': '8px',        // $border-radius-md  
        'lg': '12px',       // $border-radius-lg
        'default': '4px',   // Valor por defecto
      },
      borderWidth: {
        '3': '3px',
        'default': '1px',
      },
      boxShadow: {
        // Sombras exactas de la guía de estilo
        'sm': '0 1px 2px rgba(0, 0, 0, 0.05)',        // $shadow-sm
        'md': '0 4px 6px rgba(0, 0, 0, 0.1)',         // $shadow-md
        'lg': '0 10px 15px rgba(0, 0, 0, 0.1)',       // $shadow-lg
        // Sombras adicionales para estados interactivos
        'focus': '0 0 0 2px rgba(250, 204, 21, 0.4)', // Para estados de focus
        'focus-dark': '0 0 0 2px rgba(250, 204, 21, 0.3)', // Focus en modo oscuro
        // Sombras para modales
        'modal': '0 4px 16px rgba(0, 0, 0, 0.2)',
        'modal-dark': '0 4px 16px rgba(0, 0, 0, 0.4)',
      },
      animation: {
        // Animaciones suaves siguiendo la guía de estilo
        'skeleton': 'skeleton-loading 1.5s ease-in-out infinite',
        'slide-in': 'slideIn 0.3s ease-in-out',
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'pulse-ring': 'pulse 2s infinite',
        'slide-down': 'slideDown 0.2s ease-out',    // Para dropdowns
      },
      keyframes: {
        'skeleton-loading': {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        'slideIn': {
          from: { transform: 'translateX(100%)', opacity: '0' },
          to: { transform: 'translateX(0)', opacity: '1' },
        },
        'fadeIn': {
          from: { opacity: '0', transform: 'translateY(-20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'slideDown': {
          from: { opacity: '0', transform: 'translateY(-10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse': {
          '0%': { boxShadow: '0 0 0 0 rgba(250, 204, 21, 0.4)' },
          '70%': { boxShadow: '0 0 0 10px rgba(250, 204, 21, 0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(250, 204, 21, 0)' },
        },
      },
      transitionDuration: {
        // Transiciones siguiendo la guía de estilo
        'default': '200ms',     // 0.2s ease-in-out (estándar)
        'fast': '150ms',
        'slow': '300ms',
      },
      zIndex: {
        '40': '40',
        '50': '50',
        '60': '60',
        'modal': '1000',
        'dropdown': '100',
        'header': '50',
      },
      // Tamaños de iconos estándar
      iconSize: {
        'sm': '16px',
        'md': '24px',        // Predeterminado
        'lg': '32px',
      },
      // Alturas específicas para componentes
      height: {
        'button-sm': '32px',   // Botón pequeño
        'button-md': '40px',   // Botón mediano (predeterminado)
        'button-lg': '48px',   // Botón grande
        'input': '40px',       // Altura estándar de inputs
        'header': '64px',      // Altura del header
      },
      minHeight: {
        'touch-target': '48px', // Tamaño mínimo táctil (accesibilidad)
      },
      minWidth: {
        'touch-target': '48px', // Tamaño mínimo táctil (accesibilidad)
      },
    },
  },
  plugins: [
    // Plugin para agregar utilidades personalizadas
    function({ addUtilities, theme }) {
      const newUtilities = {
        // Utilidades para transiciones estándar
        '.transition-default': {
          transition: 'all 0.2s ease-in-out',
        },
        // Utilidades para focus accesible
        '.focus-ring': {
          '&:focus': {
            outline: 'none',
            boxShadow: theme('boxShadow.focus'),
          },
        },
        '.focus-ring-dark': {
          '&:focus': {
            outline: 'none',
            boxShadow: theme('boxShadow.focus-dark'),
          },
        },
        // Utilidades para elementos táctiles
        '.touch-target': {
          minHeight: theme('minHeight.touch-target'),
          minWidth: theme('minWidth.touch-target'),
        },
      }
      addUtilities(newUtilities)
    }
  ],
}