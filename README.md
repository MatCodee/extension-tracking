# Web Time Tracker - Extensión de Chrome

Una extensión de Chrome que rastrea el tiempo que pasas en diferentes categorías de sitios web.

## Características

- 📊 **Tracking de tiempo**: Mide el tiempo real que pasas en cada categoría de sitio web
- 🎯 **Categorización automática**: Clasifica automáticamente los sitios en categorías predefinidas
- 👤 **Detección de actividad**: Solo cuenta el tiempo cuando estás activo en la página
- 💾 **Persistencia de datos**: Guarda tus estadísticas localmente
- 🎨 **Interfaz moderna**: Popup con diseño atractivo y fácil de usar

## Categorías

- **🎬 Entretenimiento**: YouTube, Netflix, Twitch, Kick
- **📚 Aprender**: Stack Overflow
- **💼 Trabajo**: GitHub
- **👥 Social**: LinkedIn, Facebook, Twitter, Instagram, Reddit, Discord, WhatsApp, Telegram
- **🌐 Otros**: Todos los demás sitios

## Instalación

### Desarrollo

1. Clona el repositorio:
```bash
git clone <repository-url>
cd extension-tracking
```

2. Instala las dependencias:
```bash
npm install
```

3. Construye la extensión:
```bash
npm run build:extension
```

4. Carga la extensión en Chrome:
   - Abre Chrome y ve a `chrome://extensions/`
   - Activa el "Modo desarrollador"
   - Haz clic en "Cargar descomprimida"
   - Selecciona la carpeta `public` del proyecto

### Uso

1. Una vez instalada, verás el icono de la extensión en la barra de herramientas
2. Haz clic en el icono para abrir el popup con tus estadísticas
3. La extensión comenzará a rastrear automáticamente el tiempo que pasas en cada categoría
4. Usa el botón "Actualizar" para refrescar las estadísticas
5. Usa el botón "Resetear" para borrar todos los datos (con confirmación)

## Funcionamiento

- **Background Script**: Maneja el tracking de tiempo y la comunicación entre componentes
- **Content Script**: Detecta actividad del usuario en cada página
- **Popup**: Muestra las estadísticas y permite interacción

### Detección de actividad

La extensión considera que estás "activo" cuando:
- Mueves el mouse
- Presionas teclas
- Haces clic
- Haces scroll

Se considera "inactivo" después de 5 minutos sin actividad.

## Estructura del proyecto

```
extension-tracking/
├── public/
│   ├── manifest.json      # Configuración de la extensión
│   ├── index.html         # Popup principal
│   ├── popup.js           # Lógica del popup
│   ├── background.js      # Service worker (copiado desde src)
│   └── content.js         # Content script (copiado desde src)
├── src/
│   ├── background/
│   │   └── background.js  # Lógica del background script
│   ├── content.js         # Content script
│   └── vite-env.d.ts      # Tipos de Vite
├── package.json
├── vite.config.ts
└── README.md
```

## Tecnologías utilizadas

- **Chrome Extensions API**: Para la funcionalidad de la extensión
- **JavaScript**: Para la lógica de tracking
- **HTML/CSS**: Para la interfaz del popup
- **Vite**: Para el build y desarrollo

## Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.
