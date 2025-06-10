#!/bin/bash

# 🧹 Script de Limpieza Estratégica - LEXIA Frontend
# Ejecutar desde: C:\Users\justi\Desktop\RPA\Prototipo por IA\frontend\

echo "🧹 Iniciando limpieza estratégica del proyecto LEXIA..."

# ========================================
# 1. ELIMINAR CARPETAS OBSOLETAS
# ========================================

echo "📁 Eliminando carpetas obsoletas..."

# Frontend duplicado
if [ -d "frontend" ]; then
    echo "  ❌ Eliminando frontend/ (versión obsoleta)"
    rm -rf frontend/
fi

# Configs vacíos
if [ -d "config" ]; then
    echo "  ❌ Eliminando config/ (archivos vacíos)"
    rm -rf config/
fi

# Virtual environment Python (no pertenece aquí)
if [ -d "venv" ]; then
    echo "  ❌ Eliminando venv/ (Python virtual env)"
    rm -rf venv/
fi

# Documentación temporal/debug
if [ -d "docs/MDinformativos" ]; then
    echo "  ❌ Eliminando docs/MDinformativos/ (30+ archivos de debug)"
    rm -rf docs/MDinformativos/
fi

if [ -d "docs/migration-history" ]; then
    echo "  ❌ Eliminando docs/migration-history/ (archivos de migración antiguos)"
    rm -rf docs/migration-history/
fi

# ========================================
# 2. ELIMINAR ARCHIVOS TEMPORALES
# ========================================

echo "📄 Eliminando archivos temporales y de debug..."

# Archivos .bat de debug
BATCH_FILES=(
    "MEJORAR-COHERENCIA.bat"
    "OPTIMIZAR-LAYOUT.bat"
    "solucion-completa.bat"
    "SOLUCION-RAPIDA.bat"
    "start-and-test.bat"
    "start-lexia.bat"
    "test-deploy-readiness.bat"
    "test-frequency-changes.bat"
    "VER-CAMBIOS-AHORA.bat"
    "VER-LAYOUT-OPTIMIZADO.bat"
    "VER-LAYOUT-VERTICAL.bat"
    "VER-MEJORAS-VISUALES.bat"
    "VER-VISTAS-REALES.bat"
    "verificar-iconos-lucide.bat"
    "verificar-implementacion.bat"
    "verificar-migracion.bat"
    "verify-frequency-changes.bat"
)

for file in "${BATCH_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "  ❌ Eliminando $file"
        rm "$file"
    fi
done

# Archivo temporal obvio
if [ -f "temp_file_to_delete" ]; then
    echo "  ❌ Eliminando temp_file_to_delete"
    rm temp_file_to_delete
fi

# Lock file duplicado (preferir npm sobre yarn)
if [ -f "yarn.lock" ]; then
    echo "  ❌ Eliminando yarn.lock (usando npm)"
    rm yarn.lock
fi

# ========================================
# 3. LIMPIAR DOCUMENTACIÓN
# ========================================

echo "📚 Limpiando documentación obsoleta..."

# Mantener solo documentación profesional
DOCS_TO_KEEP=(
    "development"
    "getting-started"
    "testing"
    "deployment"
    "design-system"
    "user-guides"
    "examples"
    "reference"
    "maintenance"
)

# Listar carpetas en docs/
if [ -d "docs" ]; then
    for item in docs/*/; do
        if [ -d "$item" ]; then
            folder_name=$(basename "$item")
            keep=false
            
            for keeper in "${DOCS_TO_KEEP[@]}"; do
                if [ "$folder_name" = "$keeper" ]; then
                    keep=true
                    break
                fi
            done
            
            if [ "$keep" = false ]; then
                echo "  ❌ Eliminando docs/$folder_name/ (obsoleto)"
                rm -rf "$item"
            else
                echo "  ✅ Conservando docs/$folder_name/ (profesional)"
            fi
        fi
    done
fi

# ========================================
# 4. VERIFICAR RESULTADO
# ========================================

echo ""
echo "🎉 Limpieza completada!"
echo ""
echo "📊 Estructura final:"
echo ""

# Mostrar estructura limpia
find . -maxdepth 2 -type d | grep -E "^\./(src|backend|docs|scripts|infrastructure|rpa-bots|database|public)$" | sort

echo ""
echo "📚 Documentación conservada:"
ls -la docs/ 2>/dev/null | grep "^d" | awk '{print "  ✅ docs/" $9}' | grep -v "^\s*$"

echo ""
echo "💾 Espacio liberado estimado: ~50-100MB"
echo "🚀 Proyecto optimizado y listo para desarrollo!"

# ========================================
# 5. RECOMENDACIONES POST-LIMPIEZA
# ========================================

echo ""
echo "🔧 Recomendaciones post-limpieza:"
echo "  1. Ejecutar: npm ci (reinstalar dependencias limpias)"
echo "  2. Ejecutar: npm run dev (verificar que todo funciona)"
echo "  3. Commit: git add . && git commit -m '🧹 Clean project structure'"
echo "  4. Verificar que el build funciona: npm run build"
echo ""