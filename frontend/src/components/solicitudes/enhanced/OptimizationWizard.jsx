import React, { useState, useEffect } from 'react'
import { 
  Zap,
  Target,
  Clock,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Lightbulb,
  ArrowRight,
  BarChart3,
  Settings,
  RefreshCw
} from 'lucide-react'
import Button from '../../ui/Button'
import Card from '../../ui/Card'
import { cn } from '../../../utils/cn'

/**
 * OptimizationWizard - Asistente inteligente para optimizar configuraciones
 */
const OptimizationWizard = ({
  solicitud,
  performanceData,
  onApplyOptimization,
  className = ''
}) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [analysis, setAnalysis] = useState(null)
  const [selectedOptimizations, setSelectedOptimizations] = useState([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showResults, setShowResults] = useState(false)

  // Realizar análisis automático al cargar
  useEffect(() => {
    performAnalysis()
  }, [solicitud, performanceData])

  // Simular análisis de optimización
  const performAnalysis = async () => {
    setIsAnalyzing(true)
    
    // Simular tiempo de análisis
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const mockAnalysis = generateAnalysis()
    setAnalysis(mockAnalysis)
    setIsAnalyzing(false)
  }

  // Generar análisis mock basado en datos
  const generateAnalysis = () => {
    const issues = []
    const opportunities = []
    const suggestions = []

    // Analizar rendimiento
    const avgDuration = performanceData?.avgDuration || Math.random() * 5 + 1
    if (avgDuration > 3) {
      issues.push({
        id: 'timeout',
        type: 'performance',
        title: 'Optimizar tiempo de respuesta',
        description: 'Incrementar timeout y añadir reintentos automáticos',
        impact: 'high',
        effort: 'medium',
        estimatedImprovement: '40% menos fallos',
        priority: 1
      })
    }

    // Analizar tasa de éxito
    const successRate = performanceData?.successRate || Math.random() * 20 + 75
    if (successRate < 85) {
      issues.push({
        id: 'reliability',
        type: 'reliability',
        title: 'Mejorar confiabilidad',
        description: 'Implementar estrategia de reintentos inteligentes',
        impact: 'high',
        effort: 'medium',
        estimatedImprovement: `+${Math.round((90 - successRate))}% tasa de éxito`,
        priority: 1
      })
    }

    // Analizar horario de ejecución
    const currentHour = new Date().getHours()
    if (currentHour >= 22 || currentHour <= 6) {
      suggestions.push({
        id: 'schedule_info',
        type: 'efficiency',
        title: 'Información del horario de ejecución',
        description: 'Las consultas se ejecutan automáticamente a las 7:00 PM para optimizar la disponibilidad del servidor judicial',
        impact: 'medium',
        effort: 'none',
        estimatedImprovement: 'Horario optimizado',
        priority: 3
      })
    }

    // Sugerencias de optimización general
    suggestions.push({
      id: 'caching',
      type: 'performance',
      title: 'Implementar caché inteligente',
      description: 'Cachear resultados durante 1 hora para reducir carga en servidor judicial',
      impact: 'medium',
      effort: 'low',
      estimatedImprovement: '30% menos carga servidor',
      priority: 3
    })

    // Optimización de notificaciones
    opportunities.push({
      id: 'notifications',
      type: 'efficiency', 
      title: 'Optimizar notificaciones',
      description: 'Mejorar el formato y contenido de las notificaciones diarias enviadas a las 7:00 PM',
      impact: 'medium',
      effort: 'low',
      estimatedImprovement: '25% mejor experiencia de notificación',
      priority: 2
    })

    // Monitoreo avanzado
    opportunities.push({
      id: 'monitoring',
      type: 'reliability',
      title: 'Monitoreo avanzado',
      description: 'Implementar alertas proactivas para detectar problemas antes de la ejecución diaria',
      impact: 'high',
      effort: 'medium',
      estimatedImprovement: '50% reducción en fallos',
      priority: 1
    })

    return {
      score: Math.floor(Math.random() * 30 + 70), // 70-100
      issues: issues.slice(0, 3),
      opportunities: opportunities.slice(0, 2),
      suggestions: suggestions.slice(0, 4),
      totalRecommendations: issues.length + opportunities.length + suggestions.length
    }
  }

  // Pasos del wizard
  const steps = [
    { id: 'analysis', title: 'Análisis', description: 'Evaluando rendimiento actual' },
    { id: 'recommendations', title: 'Recomendaciones', description: 'Revisando oportunidades de mejora' },
    { id: 'selection', title: 'Selección', description: 'Eligiendo optimizaciones a aplicar' },
    { id: 'implementation', title: 'Implementación', description: 'Aplicando cambios seleccionados' }
  ]

  // Obtener configuración de color por tipo
  const getTypeConfig = (type) => {
    const configs = {
      performance: { color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200' },
      reliability: { color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200' },
      efficiency: { color: 'text-green-700', bg: 'bg-green-50', border: 'border-green-200' },
      cost: { color: 'text-purple-700', bg: 'bg-purple-50', border: 'border-purple-200' }
    }
    return configs[type] || configs.performance
  }

  // Obtener icono por impacto
  const getImpactIcon = (impact) => {
    switch (impact) {
      case 'high': return <TrendingUp className="w-4 h-4 text-red-600" />
      case 'medium': return <BarChart3 className="w-4 h-4 text-yellow-600" />
      case 'low': return <Target className="w-4 h-4 text-green-600" />
      default: return <Target className="w-4 h-4 text-gray-600" />
    }
  }

  // Toggle selección de optimización
  const toggleOptimization = (id) => {
    setSelectedOptimizations(prev => 
      prev.includes(id) 
        ? prev.filter(opt => opt !== id)
        : [...prev, id]
    )
  }

  if (isAnalyzing) {
    return (
      <div className={cn('space-y-6', className)}>
        <Card className="border-blue-200 bg-blue-50">
          <Card.Content className="p-8 text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <h3 className="text-lg font-medium text-blue-900 mb-2">
              Analizando configuración actual
            </h3>
            <p className="text-blue-700">
              Evaluando rendimiento, eficiencia y oportunidades de mejora...
            </p>
          </Card.Content>
        </Card>
      </div>
    )
  }

  if (!analysis) return null

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header con puntuación */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Asistente de Optimización
          </h3>
          <p className="text-sm text-gray-600">
            Mejora automática del rendimiento de tu solicitud
          </p>
        </div>
        
        <div className="text-right">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-gray-900">{analysis.score}</span>
            <span className="text-sm text-gray-600">/100</span>
          </div>
          <p className="text-xs text-gray-500">Puntuación actual</p>
        </div>
      </div>

      {/* Progreso del wizard */}
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className={cn(
              'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
              index <= currentStep 
                ? 'bg-yellow-400 text-gray-900' 
                : 'bg-gray-200 text-gray-600'
            )}>
              {index + 1}
            </div>
            <div className="ml-3 hidden sm:block">
              <p className="text-sm font-medium text-gray-900">{step.title}</p>
              <p className="text-xs text-gray-500">{step.description}</p>
            </div>
            
            {index < steps.length - 1 && (
              <ArrowRight className="w-4 h-4 text-gray-400 mx-4" />
            )}
          </div>
        ))}
      </div>

      {/* Contenido principal */}
      <div className="space-y-6">
        {/* Paso 1: Resumen del análisis */}
        {currentStep === 0 && (
          <div className="space-y-6">
            <Card>
              <Card.Header>
                <h4 className="text-base font-medium text-gray-900">
                  Resumen del Análisis
                </h4>
              </Card.Header>
              <Card.Content>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-red-100 flex items-center justify-center">
                      <AlertTriangle className="w-8 h-8 text-red-600" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{analysis.issues.length}</p>
                    <p className="text-sm text-gray-600">Problemas detectados</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-yellow-100 flex items-center justify-center">
                      <TrendingUp className="w-8 h-8 text-yellow-600" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{analysis.opportunities.length}</p>
                    <p className="text-sm text-gray-600">Oportunidades de mejora</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-blue-100 flex items-center justify-center">
                      <Lightbulb className="w-8 h-8 text-blue-600" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{analysis.suggestions.length}</p>
                    <p className="text-sm text-gray-600">Sugerencias</p>
                  </div>
                </div>
              </Card.Content>
            </Card>

            <div className="flex justify-end">
              <Button
                variant="primary"
                onClick={() => setCurrentStep(1)}
                icon={<ArrowRight size={16} />}
              >
                Ver Recomendaciones
              </Button>
            </div>
          </div>
        )}

        {/* Paso 2: Lista de recomendaciones */}
        {currentStep === 1 && (
          <div className="space-y-6">
            {/* Problemas críticos */}
            {analysis.issues.length > 0 && (
              <Card className="border-red-200">
                <Card.Header>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    <h4 className="text-base font-medium text-red-900">
                      Problemas Críticos ({analysis.issues.length})
                    </h4>
                  </div>
                </Card.Header>
                <Card.Content>
                  <div className="space-y-4">
                    {analysis.issues.map((issue) => {
                      const typeConfig = getTypeConfig(issue.type)
                      return (
                        <div key={issue.id} className={cn(
                          'p-4 rounded-lg border-l-4',
                          typeConfig.bg, typeConfig.border
                        )}>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                {getImpactIcon(issue.impact)}
                                <h5 className="font-medium text-gray-900">{issue.title}</h5>
                                <span className={cn(
                                  'px-2 py-1 rounded text-xs font-medium',
                                  issue.impact === 'high' && 'bg-red-100 text-red-700',
                                  issue.impact === 'medium' && 'bg-yellow-100 text-yellow-700',
                                  issue.impact === 'low' && 'bg-green-100 text-green-700'
                                )}>
                                  {issue.impact === 'high' ? 'Alto impacto' : issue.impact === 'medium' ? 'Impacto medio' : 'Bajo impacto'}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">{issue.description}</p>
                              <p className="text-sm font-medium text-green-600">
                                💡 Mejora estimada: {issue.estimatedImprovement}
                              </p>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </Card.Content>
              </Card>
            )}

            <div className="flex justify-between">
              <Button
                variant="secondary"
                onClick={() => setCurrentStep(0)}
              >
                Atrás
              </Button>
              <Button
                variant="primary"
                onClick={() => setCurrentStep(2)}
                icon={<ArrowRight size={16} />}
              >
                Seleccionar Optimizaciones
              </Button>
            </div>
          </div>
        )}

        {/* Paso 3: Selección de optimizaciones */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <Card>
              <Card.Header>
                <h4 className="text-base font-medium text-gray-900">
                  Seleccionar Optimizaciones a Aplicar
                </h4>
                <p className="text-sm text-gray-600">
                  Elige las mejoras que deseas implementar
                </p>
              </Card.Header>
              <Card.Content>
                <div className="space-y-4">
                  {[...analysis.issues, ...analysis.opportunities, ...analysis.suggestions].map((item) => {
                    const isSelected = selectedOptimizations.includes(item.id)
                    const typeConfig = getTypeConfig(item.type)
                    
                    return (
                      <div
                        key={item.id}
                        onClick={() => toggleOptimization(item.id)}
                        className={cn(
                          'p-4 border-2 rounded-lg cursor-pointer transition-all duration-200',
                          'hover:shadow-md',
                          isSelected
                            ? 'border-yellow-400 bg-yellow-50'
                            : 'border-gray-200 hover:border-gray-300'
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 mt-1">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleOptimization(item.id)}
                              className="w-4 h-4 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
                            />
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              {getImpactIcon(item.impact)}
                              <h5 className="font-medium text-gray-900">{item.title}</h5>
                              <span className={cn(
                                'px-2 py-1 rounded text-xs font-medium',
                                typeConfig.bg, typeConfig.color
                              )}>
                                {item.type}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                            
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span>Impacto: {item.impact}</span>
                              <span>Esfuerzo: {item.effort}</span>
                              <span className="text-green-600 font-medium">{item.estimatedImprovement}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </Card.Content>
            </Card>

            <div className="flex justify-between">
              <Button
                variant="secondary"
                onClick={() => setCurrentStep(1)}
              >
                Atrás
              </Button>
              <Button
                variant="primary"
                onClick={() => setCurrentStep(3)}
                disabled={selectedOptimizations.length === 0}
                icon={<Settings size={16} />}
              >
                Aplicar Optimizaciones ({selectedOptimizations.length})
              </Button>
            </div>
          </div>
        )}

        {/* Paso 4: Implementación */}
        {currentStep === 3 && (
          <div className="space-y-6">
            {!showResults ? (
              <Card className="border-blue-200 bg-blue-50">
                <Card.Content className="p-8 text-center">
                  <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-blue-900 mb-2">
                    Aplicando optimizaciones...
                  </h3>
                  <p className="text-blue-700 mb-4">
                    Implementando {selectedOptimizations.length} mejoras seleccionadas
                  </p>
                  
                  <Button
                    variant="secondary"
                    onClick={async () => {
                      await new Promise(resolve => setTimeout(resolve, 2000))
                      setShowResults(true)
                    }}
                    className="mt-4"
                  >
                    Simular Finalización
                  </Button>
                </Card.Content>
              </Card>
            ) : (
              <Card className="border-green-200 bg-green-50">
                <Card.Content className="p-8 text-center">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-medium text-green-900 mb-2">
                    ¡Optimizaciones aplicadas exitosamente!
                  </h3>
                  <p className="text-green-700 mb-6">
                    Se implementaron {selectedOptimizations.length} mejoras. 
                    Los cambios entrarán en efecto en la próxima ejecución.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-900">+15%</p>
                      <p className="text-sm text-green-700">Mejora estimada en rendimiento</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-900">-30%</p>
                      <p className="text-sm text-green-700">Reducción en errores</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-900">+25%</p>
                      <p className="text-sm text-green-700">Aumento en confiabilidad</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 justify-center">
                    <Button
                      variant="secondary"
                      onClick={() => {
                        setCurrentStep(0)
                        setSelectedOptimizations([])
                        setShowResults(false)
                        performAnalysis()
                      }}
                      icon={<RefreshCw size={16} />}
                    >
                      Nuevo Análisis
                    </Button>
                    <Button
                      variant="primary"
                      onClick={() => window.location.reload()}
                    >
                      Ver Resultados
                    </Button>
                  </div>
                </Card.Content>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default OptimizationWizard