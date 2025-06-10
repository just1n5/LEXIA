#!/bin/bash

echo "🚀 Validando migración a LEXIA..."
echo ""

# Verificar que los archivos principales se hayan actualizado
echo "📁 Verificando archivos principales..."

# 1. package.json
if grep -q "lexia-frontend" package.json; then
    echo "✅ package.json actualizado correctamente"
else
    echo "❌ package.json no se actualizó"
fi

# 2. index.html
if grep -q "LEXIA" index.html; then
    echo "✅ index.html actualizado correctamente"
else
    echo "❌ index.html no se actualizó"
fi

# 3. README.md
if grep -q "LEXIA" README.md; then
    echo "✅ README.md actualizado correctamente"
else
    echo "❌ README.md no se actualizó"
fi

# 4. App.jsx
if grep -q "⚖️ LEXIA" src/App.jsx; then
    echo "✅ App.jsx actualizado correctamente"
else
    echo "❌ App.jsx no se actualizó"
fi

echo ""
echo "📂 Verificando estructura de componentes..."

# 5. Componentes LEXIA
if [ -f "src/components/brand/LexiaLogo.jsx" ]; then
    echo "✅ LexiaLogo.jsx creado correctamente"
else
    echo "❌ LexiaLogo.jsx no encontrado"
fi

if [ -f "src/components/sections/HeroSection.jsx" ]; then
    echo "✅ HeroSection.jsx creado correctamente"
else
    echo "❌ HeroSection.jsx no encontrado"
fi

# 6. Favicon
if [ -f "public/lexia-favicon.svg" ]; then
    echo "✅ Favicon LEXIA creado correctamente"
else
    echo "❌ Favicon LEXIA no encontrado"
fi

# 7. Tailwind config
if grep -q "lexia-gradient" tailwind.config.js; then
    echo "✅ tailwind.config.js actualizado correctamente"
else
    echo "❌ tailwind.config.js no se actualizó"
fi

echo ""
echo "🔧 Verificando dependencias..."

# 8. clsx
if grep -q "clsx" package.json; then
    echo "✅ clsx disponible"
else
    echo "❌ clsx no encontrado - ejecutar: npm install clsx"
fi

echo ""
echo "🎯 Resumen de la migración:"
echo "   ⚖️  Nombre: ConsultaJudicial RPA → LEXIA"
echo "   🎨 Design: Nuevos colores y gradientes"
echo "   🧩 Componentes: LexiaLogo + HeroSection"
echo "   📱 Favicon: Actualizado"
echo "   📝 Docs: README renovado"
echo ""
echo "▶️  Para probar: npm run dev"
echo "🌐 URL: http://localhost:3000"