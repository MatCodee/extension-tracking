const categories = {
  "youtube.com": "Entretenimiento",
  "netflix.com": "Entretenimiento",
  "kick.com": "Entretenimiento",
  "twitch.com": "Entretenimiento",
  "stackoverflow.com": "Aprender",
  "github.com": "Trabajo",
  "linkedin.com": "Social",
  "facebook.com": "Social",
  "twitter.com": "Social",
  "instagram.com": "Social",
  "reddit.com": "Social",
  "discord.com": "Social",
  "whatsapp.com": "Social",
  "telegram.org": "Social"
};

let visitCounts = {};
let timeData = {};
let currentTab = null;
let startTime = null;
let isActive = true;
let lastVisitedUrl = null; // Para evitar contar la misma URL múltiples veces

// Inicializar datos
chrome.storage.local.get(['visitCounts', 'timeData'], (result) => {
  console.log("Inicializando datos del storage");
  visitCounts = result.visitCounts || {
    "Entretenimiento": 0,
    "Aprender": 0,
    "Trabajo": 0,
    "Social": 0,
    "Otros": 0
  };

  timeData = result.timeData || {
    "Entretenimiento": 0,
    "Aprender": 0,
    "Trabajo": 0,
    "Social": 0,
    "Otros": 0
  };
});

// Función para clasificar URL
function classifyUrl(url) {
  let category = "Otros";

  for (const site in categories) {
    if (url.includes(site)) {
      category = categories[site];
      break;
    }
  }

  return category;
}

// Función para actualizar tiempo (sin contar visitas)
function updateTime(category) {
  if (startTime && isActive) {
    const currentTime = Date.now();
    const timeSpent = currentTime - startTime;

    timeData[category] += timeSpent;

    // Guardar en storage
    chrome.storage.local.set({
      visitCounts: visitCounts,
      timeData: timeData
    });

    console.log(`Tiempo actualizado para ${category}: ${timeSpent}ms`);
  }

  startTime = Date.now();
}

// Función para contar una visita (solo una vez por URL)
function countVisit(url) {
  if (url && url !== lastVisitedUrl) {
    const category = classifyUrl(url);
    visitCounts[category] += 1;
    lastVisitedUrl = url;

    // Guardar en storage
    chrome.storage.local.set({
      visitCounts: visitCounts,
      timeData: timeData
    });

    console.log(`Nueva visita contada para ${category}: ${url}`);
  }
}

// Escuchar cambios de pestaña
chrome.tabs.onActivated.addListener((activeInfo) => {
  if (currentTab && startTime) {
    const category = classifyUrl(currentTab.url);
    updateTime(category);
  }

  // Obtener la nueva pestaña activa
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    if (tab.url) {
      currentTab = tab;
      const category = classifyUrl(tab.url);
      startTime = Date.now();
      countVisit(tab.url); // Contar visita al cambiar de pestaña
      console.log(`Pestaña activa cambiada a: ${category}`);
    }
  });
});

// Escuchar actualizaciones de pestañas
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    // Si es la pestaña activa, actualizar
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0] && tabs[0].id === tabId) {
        if (currentTab && startTime) {
          const oldCategory = classifyUrl(currentTab.url);
          updateTime(oldCategory);
        }

        currentTab = tab;
        const category = classifyUrl(tab.url);
        startTime = Date.now();
        countVisit(tab.url); // Contar visita cuando se completa la carga
        console.log(`Página cargada: ${category}`);
      }
    });
  }
});

// Escuchar cuando se cierra una pestaña
chrome.tabs.onRemoved.addListener((tabId) => {
  if (currentTab && currentTab.id === tabId && startTime) {
    const category = classifyUrl(currentTab.url);
    updateTime(category);
    currentTab = null;
    startTime = null;
  }
});

// Detectar cuando la ventana pierde el foco
chrome.windows.onFocusChanged.addListener((windowId) => {
  if (windowId === chrome.windows.WINDOW_ID_NONE) {
    // Ventana perdió el foco
    if (currentTab && startTime && isActive) {
      const category = classifyUrl(currentTab.url);
      updateTime(category);
      isActive = false;
    }
  } else {
    // Ventana ganó el foco
    isActive = true;
    if (currentTab) {
      startTime = Date.now();
    }
  }
});

// Escuchar mensajes del popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getVisitCounts') {
    chrome.storage.local.get(['visitCounts'], (result) => {
      sendResponse(result.visitCounts || {});
    });
    return true;
  }

  if (request.action === 'getTimeData') {
    chrome.storage.local.get(['timeData'], (result) => {
      sendResponse(result.timeData || {});
    });
    return true;
  }

  if (request.action === 'resetData') {
    visitCounts = {
      "Entretenimiento": 0,
      "Aprender": 0,
      "Trabajo": 0,
      "Social": 0,
      "Otros": 0
    };
    timeData = {
      "Entretenimiento": 0,
      "Aprender": 0,
      "Trabajo": 0,
      "Social": 0,
      "Otros": 0
    };
    lastVisitedUrl = null; // Resetear también la URL visitada
    chrome.storage.local.set({ visitCounts, timeData });
    sendResponse({ success: true });
    return true;
  }

  // Manejar mensajes del content script
  if (request.action === 'userActive') {
    isActive = request.active;
    if (isActive && currentTab) {
      startTime = Date.now();
    }
    return true;
  }

  if (request.action === 'pageHidden') {
    if (currentTab && startTime && isActive) {
      const category = classifyUrl(currentTab.url);
      updateTime(category);
    }
    return true;
  }

  if (request.action === 'pageVisible') {
    if (currentTab) {
      startTime = Date.now();
    }
    return true;
  }

  if (request.action === 'pageInfo') {
    // Actualizar información de la página actual si es la pestaña activa
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0] && tabs[0].url === request.url) {
        if (currentTab && startTime) {
          const oldCategory = classifyUrl(currentTab.url);
          updateTime(oldCategory);
        }

        currentTab = { url: request.url, title: request.title };
        const category = classifyUrl(request.url);
        startTime = Date.now();
        countVisit(request.url); // Contar visita desde content script
        console.log(`Página actualizada: ${category}`);
      }
    });
    return true;
  }
});

// Inicializar cuando se instala la extensión
chrome.runtime.onInstalled.addListener(() => {
  console.log("Extensión instalada");
  // Obtener la pestaña activa inicial
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0] && tabs[0].url) {
      currentTab = tabs[0];
      const category = classifyUrl(tabs[0].url);
      startTime = Date.now();
      countVisit(tabs[0].url); // Contar visita inicial
      console.log(`Pestaña inicial: ${category}`);
    }
  });
});



