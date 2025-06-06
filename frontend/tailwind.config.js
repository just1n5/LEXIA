/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      // =================== COLORES ACTUALIZADOS PARA LEXIA ===================
      colors: {
        // Colores principales (mantener)
        interactive: {
          default: '#FACC15',
          hover: '#DBB613', 
          active: '#C6A411'
        },
        
        // ✅ NUEVOS: Gradientes de marca LEXIA
        'lexia-gradient': {
          'start': '#FACC15',
          'end': '#F59E0B'
        },
        
        // ✅ NUEVO: Acento tecnológico
        'tech-accent': {
          DEFAULT: '#3B82F6',
          light: '#DBEAFE',
          dark: '#1E40AF'
        },
        
        // ✅ NUEVO: Premium dark para elementos avanzados
        'premium': {
          dark: '#1E293B',
          medium: '#334155',
          light: '#64748B'
        },
        
        // Colores de texto (mantener)
        text: {
          primary: '#1F2937',
          base: '#374151', 
          secondary: '#6B7280',
          // ✅ NUEVOS para modo oscuro
          'dark-primary': '#F9FAFB',
          'dark-secondary': '#D1D5DB',
          'dark-tertiary': '#9CA3AF'
        },
        
        // Colores de fondo (mantener)
        bg: {
          canvas: '#FFFFFF',
          light: '#F9FAFB',
          // ✅ NUEVOS para modo oscuro
          'dark-primary': '#1F2937',
          'dark-surface': '#374151',
          'dark-elevated': '#4B5563'
        },
        
        // Colores de borde (mantener)
        border: {
          default: '#D1D5DB',
          disabled: '#E5E7EB'
        },
        
        // Colores de feedback (mantener)
        feedback: {
          success: '#10B981',
          'success-light': '#D1FAE5',
          warning: '#FBBF24', 
          'warning-light': '#FEF3C7',
          error: '#EF4444',
          'error-light': '#FEE2E2',
          info: '#3B82F6',
          'info-light': '#DBEAFE'
        }
      },
      
      // =================== GRADIENTES PARA LEXIA ===================
      backgroundImage: {
        'lexia-gradient': 'linear-gradient(135deg, #FACC15 0%, #F59E0B 100%)',
        'lexia-subtle': 'linear-gradient(135deg, #FACC15 0%, #FEF3C7 100%)',
        'lexia-dark': 'linear-gradient(135deg, #1E293B 0%, #334155 100%)',
        'tech-gradient': 'linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%)'
      },
      
      // =================== TIPOGRAFÍA PARA LEXIA ===================
      fontSize: {
        // Tamaños base (mantener)
        'heading-h1': ['2rem', { lineHeight: '1.25', fontWeight: '700' }],
        'heading-h2': ['1.5rem', { lineHeight: '1.33', fontWeight: '600' }], 
        'heading-h3': ['1.25rem', { lineHeight: '1.4', fontWeight: '600' }],
        'heading-h4': ['1.125rem', { lineHeight: '1.5', fontWeight: '500' }],
        'body-paragraph': ['1rem', { lineHeight: '1.6', fontWeight: '400' }],
        'body-auxiliary': ['0.875rem', { lineHeight: '1.5', fontWeight: '400' }],
        'link': ['1rem', { lineHeight: '1.6', fontWeight: '500' }],
        
        // ✅ NUEVOS: Tamaños para LEXIA
        'lexia-hero': ['3rem', { lineHeight: '1.1', fontWeight: '800', letterSpacing: '-0.02em' }],
        'lexia-brand': ['2.25rem', { lineHeight: '1.2', fontWeight: '700', letterSpacing: '-0.01em' }],
        'lexia-subtitle': ['1.125rem', { lineHeight: '1.5', fontWeight: '500' }]
      },
      
      // =================== ESPACIADO (mantener) ===================
      spacing: {
        'xs': '0.25rem',   // 4px
        'sm': '0.5rem',    // 8px  
        'md': '1rem',      // 16px
        'lg': '1.5rem',    // 24px
        'xl': '2rem',      // 32px
        '2xl': '3rem',     // 48px
        '3xl': '4rem'      // 64px
      },
      
      // =================== FAMILIAS TIPOGRÁFICAS ===================
      fontFamily: {
        'heading': ['Poppins', 'system-ui', 'sans-serif'],
        'sans': ['Inter', 'system-ui', 'sans-serif']
      },
      
      // =================== ANIMACIONES PARA LEXIA ===================
      animation: {
        'lexia-pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'lexia-float': 'float 3s ease-in-out infinite',
        'lexia-glow': 'glow 2s ease-in-out infinite alternate'
      },
      
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        glow: {
          'from': { boxShadow: '0 0 10px #FACC15' },
          'to': { boxShadow: '0 0 20px #FACC15' }
        }
      },
      
      // =================== SOMBRAS PARA LEXIA ===================
      boxShadow: {
        'lexia': '0 4px 14px 0 rgba(250, 204, 21, 0.25)',
        'lexia-lg': '0 10px 25px 0 rgba(250, 204, 21, 0.3)',
        'tech': '0 4px 14px 0 rgba(59, 130, 246, 0.25)'
      }
    },
  },
  plugins: [],
}