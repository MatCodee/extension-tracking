#!/bin/bash

echo "🚀 Instalando Web Time Tracker Extension..."

# Verificar si npm está instalado
if ! command -v npm &> /dev/null; then
    echo "❌ Error: npm no está instalado. Por favor instala Node.js primero."
    exit 1
fi

# Instalar dependencias
echo "📦 Instalando dependencias..."
npm install

# Copiar archivos necesarios
echo "📋 Copiando archivos..."
cp src/background/background.js public/
cp src/content.js public/

echo "✅ Instalación completada!"
echo ""
echo "📝 Para cargar la extensión en Chrome:"
echo "1. Abre Chrome y ve a chrome://extensions/"
echo "2. Activa el 'Modo desarrollador'"
echo "3. Haz clic en 'Cargar descomprimida'"
echo "4. Selecciona la carpeta 'public' de este proyecto"
echo ""
echo "🎉 ¡La extensión estará lista para usar!" 