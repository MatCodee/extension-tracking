if ! command -v npm &> /dev/null; then
    echo "❌ Error: npm no está instalado. Por favor instala Node.js primero."
    exit 1
fi

echo "📦 Instalando dependencias...extension"
if ! command -v npm run build:extension &> /dev/null; then
    echo "❌ Error: generado"
    exit 1
fi
npm run build:extension
