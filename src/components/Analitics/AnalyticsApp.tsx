import React, { useState, useEffect } from 'react';
import Charts from './Charts';

interface AnalyticsAppProps {
    children: React.ReactNode;
}

const AnalyticsApp: React.FC<AnalyticsAppProps> = ({ children }) => {
    const [activeTab, setActiveTab] = useState<'main' | 'stats'>('main');
    const [timeData, setTimeData] = useState<Record<string, number>>({});
    const [visitCounts, setVisitCounts] = useState<Record<string, number>>({});

    // Función para cargar datos (sin modificar la funcionalidad existente)
    const loadData = () => {
        // Obtener datos de tiempo
        chrome.runtime.sendMessage({ action: 'getTimeData' }, (timeData) => {
            if (chrome.runtime.lastError) {
                console.error('Error al obtener datos de tiempo:', chrome.runtime.lastError);
                return;
            }
            setTimeData(timeData || {});
        });

        // Obtener datos de visitas
        chrome.runtime.sendMessage({ action: 'getVisitCounts' }, (visitCounts) => {
            if (chrome.runtime.lastError) {
                console.error('Error al obtener datos de visitas:', chrome.runtime.lastError);
                return;
            }
            setVisitCounts(visitCounts || {});
        });
    };

    useEffect(() => {
        loadData();

        // Actualizar datos cada 30 segundos
        const interval = setInterval(loadData, 30000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div style={{
            width: '400px',
            height: '500px',
            margin: 0,
            padding: 0,
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
        }}>
            <div style={{
                padding: '20px',
                height: '100%',
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: '16px'
            }}>
                {/* Header */}
                <div style={{
                    textAlign: 'center',
                    marginBottom: '20px'
                }}>
                    <h1 style={{
                        margin: 0,
                        fontSize: '24px',
                        fontWeight: 600,
                        textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
                    }}>
                        📊 TrackerApp
                    </h1>
                </div>

                {/* Tabs */}
                <div style={{
                    display: 'flex',
                    marginBottom: '20px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: '4px'
                }}>
                    <button
                        onClick={() => setActiveTab('main')}
                        style={{
                            flex: 1,
                            padding: '10px',
                            textAlign: 'center',
                            cursor: 'pointer',
                            borderRadius: '8px',
                            transition: 'all 0.3s ease',
                            fontWeight: 500,
                            fontSize: '14px',
                            border: 'none',
                            background: activeTab === 'main' ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                            color: 'white',
                            boxShadow: activeTab === 'main' ? '0 2px 8px rgba(0, 0, 0, 0.1)' : 'none'
                        }}
                    >
                        📈 Principal
                    </button>
                    <button
                        onClick={() => setActiveTab('stats')}
                        style={{
                            flex: 1,
                            padding: '10px',
                            textAlign: 'center',
                            cursor: 'pointer',
                            borderRadius: '8px',
                            transition: 'all 0.3s ease',
                            fontWeight: 500,
                            fontSize: '14px',
                            border: 'none',
                            background: activeTab === 'stats' ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                            color: 'white',
                            boxShadow: activeTab === 'stats' ? '0 2px 8px rgba(0, 0, 0, 0.1)' : 'none'
                        }}
                    >
                        📊 Estadísticas
                    </button>
                </div>

                {/* Content */}
                <div style={{ flex: 1, overflow: 'hidden' }}>
                    {activeTab === 'main' ? (
                        // Contenido original (sin modificar)
                        <div style={{ height: '100%' }}>
                            {children}
                        </div>
                    ) : (
                        // Nueva pestaña de gráficos
                        <Charts timeData={timeData} visitCounts={visitCounts} />
                    )}
                </div>

                {/* Controls - solo mostrar en la pestaña principal */}
                {activeTab === 'main' && (
                    <div style={{
                        display: 'flex',
                        gap: '12px',
                        marginTop: '20px'
                    }}>
                        <button
                            onClick={() => loadData()}
                            style={{
                                flex: 1,
                                padding: '14px',
                                borderRadius: '12px',
                                background: 'rgba(255, 255, 255, 0.2)',
                                color: 'white',
                                fontWeight: 500,
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                            }}
                        >
                            🔄 Actualizar
                        </button>
                        <button
                            onClick={() => {
                                if (confirm('¿Estás seguro de que quieres resetear todos los datos? Esta acción no se puede deshacer.')) {
                                    chrome.runtime.sendMessage({ action: 'resetData' }, (response) => {
                                        if (response && response.success) {
                                            loadData();
                                            alert('Datos reseteados correctamente');
                                        }
                                    });
                                }
                            }}
                            style={{
                                flex: 1,
                                padding: '14px',
                                borderRadius: '12px',
                                background: 'rgba(255, 107, 107, 0.8)',
                                color: 'white',
                                fontWeight: 500,
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                            }}
                        >
                            🗑️ Resetear
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AnalyticsApp; 