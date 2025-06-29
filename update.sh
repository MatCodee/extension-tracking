#!/bin/bash

echo "🔄 Actualizando Web Time Tracker Extension..."

# Copiar archivos actualizados
echo "📋 Copiando archivos actualizados..."
cp src/background/background.js public/
cp src/content.js public/

echo "✅ Archivos actualizados!"
echo ""
echo "📝 Ahora recarga la extensión en Chrome:"
echo "1. Ve a chrome://extensions/"
echo "2. Encuentra 'Web Time Tracker'"
echo "3. Haz clic en el botón de recarga (🔄)"
echo ""
echo "🎉 ¡La extensión estará actualizada!" 