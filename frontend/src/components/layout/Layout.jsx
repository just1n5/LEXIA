import React from 'react'
import HeaderEnhancedV2 from '../enhanced/HeaderEnhancedV2'
import { ThemeProvider } from '../../contexts/ThemeProvider'

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-bg-light dark:bg-bg-dark-primary transition-default">
      <HeaderEnhancedV2 />
      <main>
        {children}
      </main>
    </div>
  )
}

/**
 * Componente AppLayout que envuelve toda la aplicación
 * Proporciona el ThemeProvider y configuración global
 */
function AppLayout({ 
  children, 
  defaultTheme = 'system',
  ...layoutProps 
}) {
  return (
    <ThemeProvider defaultTheme={defaultTheme}>
      <Layout {...layoutProps}>
        {children}
      </Layout>
    </ThemeProvider>
  )
}

// Exportar también AppLayout como parte del componente principal
Layout.App = AppLayout

export { AppLayout }
export default Layout