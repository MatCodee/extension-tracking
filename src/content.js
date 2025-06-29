// Content script para detectar actividad del usuario
let lastActivity = Date.now();
let isUserActive = true;

// Detectar actividad del usuario
function updateActivity() {
  lastActivity = Date.now();
  if (!isUserActive) {
    isUserActive = true;
    chrome.runtime.sendMessage({ action: 'userActive', active: true });
  }
}

// Eventos para detectar actividad
document.addEventListener('mousemove', updateActivity);
document.addEventListener('keypress', updateActivity);
document.addEventListener('click', updateActivity);
document.addEventListener('scroll', updateActivity);

// Detectar cuando el usuario está inactivo
setInterval(() => {
  const now = Date.now();
  const timeSinceLastActivity = now - lastActivity;
  
  // Considerar inactivo después de 5 minutos sin actividad
  if (timeSinceLastActivity > 5 * 60 * 1000 && isUserActive) {
    isUserActive = false;
    chrome.runtime.sendMessage({ action: 'userActive', active: false });
  }
}, 30000); // Verificar cada 30 segundos

// Detectar cuando la página pierde el foco
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    chrome.runtime.sendMessage({ action: 'pageHidden' });
  } else {
    chrome.runtime.sendMessage({ action: 'pageVisible' });
  }
});

// Enviar información de la página actual
chrome.runtime.sendMessage({ 
  action: 'pageInfo', 
  url: window.location.href,
  title: document.title 
});

chrome.runtime.onMessage.addListener((message) => {
    if (message.type === 'URL_UPDATED') {
      window.postMessage({ type: 'URL_UPDATED', data: message.data }, '*');
    }
});