#!/bin/bash

# 🎯 SCRIPT COMPLETO DE LIMPIEZA FINAL - LEXIA
# Este script mueve TODOS los archivos restantes y completa la limpieza

echo "🧹 FINALIZANDO LIMPIEZA COMPLETA DEL PROYECTO LEXIA"
echo "=================================================="
echo ""

# Verificar directorio
if [ ! -f "package.json" ]; then
    echo "❌ Error: Ejecuta desde la carpeta frontend/"
    exit 1
fi

echo "📋 Moviendo archivos .bat restantes a TEMP_DELETE_THESE_FILES..."

# Mover TODOS los archivos .bat restantes
mv MEJORAR-COHERENCIA.bat TEMP_DELETE_THESE_FILES/ 2>/dev/null
mv OPTIMIZAR-LAYOUT.bat TEMP_DELETE_THESE_FILES/ 2>/dev/null
mv solucion-completa.bat TEMP_DELETE_THESE_FILES/ 2>/dev/null
mv SOLUCION-RAPIDA.bat TEMP_DELETE_THESE_FILES/ 2>/dev/null
mv start-and-test.bat TEMP_DELETE_THESE_FILES/ 2>/dev/null
mv start-lexia.bat TEMP_DELETE_THESE_FILES/ 2>/dev/null
mv test-deploy-readiness.bat TEMP_DELETE_THESE_FILES/ 2>/dev/null
mv test-frequency-changes.bat TEMP_DELETE_THESE_FILES/ 2>/dev/null
mv VER-CAMBIOS-AHORA.bat TEMP_DELETE_THESE_FILES/ 2>/dev/null
mv VER-LAYOUT-OPTIMIZADO.bat TEMP_DELETE_THESE_FILES/ 2>/dev/null
mv VER-LAYOUT-VERTICAL.bat TEMP_DELETE_THESE_FILES/ 2>/dev/null
mv VER-MEJORAS-VISUALES.bat TEMP_DELETE_THESE_FILES/ 2>/dev/null
mv VER-VISTAS-REALES.bat TEMP_DELETE_THESE_FILES/ 2>/dev/null
mv verificar-iconos-lucide.bat TEMP_DELETE_THESE_FILES/ 2>/dev/null
mv verificar-implementacion.bat TEMP_DELETE_THESE_FILES/ 2>/dev/null
mv verificar-migracion.bat TEMP_DELETE_THESE_FILES/ 2>/dev/null
mv verify-frequency-changes.bat TEMP_DELETE_THESE_FILES/ 2>/dev/null

# Limpiar archivo temporal de prueba
mv temp_file_to_delete TEMP_DELETE_THESE_FILES/ 2>/dev/null

echo "✅ Archivos movidos a carpeta temporal"
echo ""

# Mostrar contenido final a eliminar
echo "📋 CONTENIDO FINAL A ELIMINAR:"
echo "=============================="
ls -la TEMP_DELETE_THESE_FILES/
echo ""

# Contar archivos
file_count=$(ls TEMP_DELETE_THESE_FILES/ | wc -l)
echo "📊 Total de archivos a eliminar: $file_count"
echo ""

# Confirmación final
echo "⚠️  CONFIRMACIÓN FINAL"
echo "Este comando eliminará permanentemente:"
echo "  • $file_count archivos temporales y obsoletos"
echo "  • Scripts de troubleshooting resueltos"
echo "  • Componentes obsoletos"
echo "  • Archivos de debugging"
echo ""

read -p "¿CONFIRMAS la eliminación permanente? (escribe 'CONFIRMO'): " confirmation

if [ "$confirmation" = "CONFIRMO" ]; then
    echo ""
    echo "🗑️  ELIMINANDO ARCHIVOS..."
    rm -rf TEMP_DELETE_THESE_FILES
    
    if [ ! -d "TEMP_DELETE_THESE_FILES" ]; then
        echo ""
        echo "🎉 ¡LIMPIEZA COMPLETADA AL 100%!"
        echo "================================"
        echo ""
        echo "✅ Archivos eliminados: $file_count"
        echo "✅ Documentación organizada en docs/"
        echo "✅ Scripts organizados en scripts/"
        echo "✅ Solo App.jsx principal en src/"
        echo "✅ .gitignore actualizado"
        echo "✅ Estructura profesional lista"
        echo ""
        echo "📁 NUEVA ESTRUCTURA LIMPIA:"
        echo "   frontend/"
        echo "   ├── docs/           # Documentación organizada"
        echo "   ├── scripts/        # Scripts de desarrollo/deploy"
        echo "   ├── src/            # Código fuente limpio"
        echo "   ├── package.json    # Dependencias"
        echo "   └── README.md       # Documentación principal"
        echo ""
        echo "🚀 PRÓXIMOS PASOS:"
        echo "  1. npm run dev      # Verificar funcionamiento"
        echo "  2. git add .        # Añadir cambios"
        echo "  3. git commit -m '🧹 Complete project cleanup and organization'"
        echo ""
        echo "🎯 TU PROYECTO LEXIA ESTÁ AHORA COMPLETAMENTE PROFESIONAL Y ESCALABLE!"
        
    else
        echo "❌ Error en eliminación. Ejecuta manualmente:"
        echo "rm -rf TEMP_DELETE_THESE_FILES"
    fi
else
    echo ""
    echo "❌ Limpieza cancelada."
    echo "💡 Para completar después: ./scripts/development/final-cleanup.sh"
    echo ""
fi

echo ""
echo "📊 Reporte completo disponible en: docs/CLEANUP_REPORT.md"
