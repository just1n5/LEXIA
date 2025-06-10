#!/bin/bash

# 🎯 COMANDO FINAL DE LIMPIEZA LEXIA
# Ejecuta este comando para completar la limpieza automática

echo "🧹 Completando limpieza del proyecto LEXIA..."
echo ""

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo "❌ Error: Ejecuta este comando desde la carpeta frontend/"
    exit 1
fi

# Verificar que existe la carpeta temporal
if [ ! -d "TEMP_DELETE_THESE_FILES" ]; then
    echo "❌ Error: No se encontró la carpeta TEMP_DELETE_THESE_FILES"
    echo "La limpieza ya fue completada o hubo un error."
    exit 1
fi

# Mostrar qué se va a eliminar
echo "📋 Archivos que serán eliminados permanentemente:"
echo "-----------------------------------------------"
ls -la TEMP_DELETE_THESE_FILES/
echo ""

# Confirmar eliminación
read -p "¿Estás seguro de eliminar estos archivos? (y/N): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    # Eliminar archivos temporales
    echo "🗑️  Eliminando archivos temporales..."
    rm -rf TEMP_DELETE_THESE_FILES
    
    # Verificar eliminación exitosa
    if [ ! -d "TEMP_DELETE_THESE_FILES" ]; then
        echo "✅ ¡Limpieza completada exitosamente!"
        echo ""
        echo "📊 Resumen final:"
        echo "  ✅ Archivos temporales eliminados"
        echo "  ✅ Scripts obsoletos removidos"  
        echo "  ✅ Componentes obsoletos eliminados"
        echo "  ✅ Documentación organizada"
        echo "  ✅ Estructura profesional lista"
        echo ""
        echo "🚀 Tu proyecto LEXIA está ahora completamente limpio!"
        echo ""
        echo "📝 Próximos pasos recomendados:"
        echo "  1. npm run dev    # Verificar que todo funciona"
        echo "  2. git add .      # Añadir cambios al git"
        echo "  3. git commit -m '🧹 Clean project structure'"
        echo ""
    else
        echo "❌ Error al eliminar archivos. Intenta manualmente:"
        echo "rm -rf TEMP_DELETE_THESE_FILES"
    fi
else
    echo "❌ Limpieza cancelada."
    echo "💡 Para eliminar manualmente: rm -rf TEMP_DELETE_THESE_FILES"
fi
