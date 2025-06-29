// Función para formatear tiempo en formato legible
function formatTime(milliseconds) {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  } else {
    return `${seconds}s`;
  }
}

// Función para cargar y mostrar las estadísticas
function loadStats() {
  const statsContainer = document.getElementById('statsContainer');
  statsContainer.innerHTML = '<div class="loading">Cargando estadísticas...</div>';
  
  // Obtener datos de tiempo
  chrome.runtime.sendMessage({ action: 'getTimeData' }, (timeData) => {
    if (chrome.runtime.lastError) {
      console.error('Error al obtener datos de tiempo:', chrome.runtime.lastError);
      return;
    }
    
    // Obtener datos de visitas
    chrome.runtime.sendMessage({ action: 'getVisitCounts' }, (visitCounts) => {
      if (chrome.runtime.lastError) {
        console.error('Error al obtener datos de visitas:', chrome.runtime.lastError);
        return;
      }
      
      displayStats(timeData, visitCounts);
    });
  });
}

// Función para mostrar las estadísticas
function displayStats(timeData, visitCounts) {
  const statsContainer = document.getElementById('statsContainer');
  
  const categories = [
    { name: 'Entretenimiento', emoji: '🎬' },
    { name: 'Aprender', emoji: '📚' },
    { name: 'Trabajo', emoji: '💼' },
    { name: 'Social', emoji: '👥' },
    { name: 'Otros', emoji: '🌐' }
  ];
  
  let html = '';
  
  categories.forEach(category => {
    const time = timeData[category.name] || 0;
    const visits = visitCounts[category.name] || 0;
    
    html += `
      <div class="stat-item">
        <div class="stat-label">
          ${category.emoji} ${category.name}
        </div>
        <div class="stat-value">
          <div class="time-value">${formatTime(time)}</div>
          <div style="font-size: 12px; opacity: 0.8;">${visits} visitas</div>
        </div>
      </div>
    `;
  });
  
  // Agregar total
  const totalTime = Object.values(timeData).reduce((sum, time) => sum + time, 0);
  const totalVisits = Object.values(visitCounts).reduce((sum, visits) => sum + visits, 0);
  
  html += `
    <div class="stat-item" style="background: rgba(255, 215, 0, 0.2); border: 1px solid rgba(255, 215, 0, 0.3);">
      <div class="stat-label">
        🏆 Total
      </div>
      <div class="stat-value">
        <div class="time-value">${formatTime(totalTime)}</div>
        <div style="font-size: 12px; opacity: 0.8;">${totalVisits} visitas</div>
      </div>
    </div>
  `;
  
  statsContainer.innerHTML = html;
}

// Función para resetear datos
function resetData() {
  if (confirm('¿Estás seguro de que quieres resetear todos los datos? Esta acción no se puede deshacer.')) {
    chrome.runtime.sendMessage({ action: 'resetData' }, (response) => {
      if (chrome.runtime.lastError) {
        console.error('Error al resetear datos:', chrome.runtime.lastError);
        return;
      }
      
      if (response && response.success) {
        loadStats(); // Recargar estadísticas
        alert('Datos reseteados correctamente');
      }
    });
  }
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
  // Cargar estadísticas al abrir el popup
  loadStats();
  
  // Botón de actualizar
  document.getElementById('refreshBtn').addEventListener('click', loadStats);
  
  // Botón de resetear
  document.getElementById('resetBtn').addEventListener('click', resetData);
});

// Actualizar estadísticas cada 30 segundos si el popup está abierto
setInterval(() => {
  if (document.visibilityState === 'visible') {
    loadStats();
  }
}, 30000); 