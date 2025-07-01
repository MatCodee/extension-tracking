import React, { useState, useEffect } from 'react';
import AnalyticsApp from './AnalyticsApp';


const Analytics: React.FC = () => {
    const [stats, setStats] = useState<{ [key: string]: { time: number; visits: number } }>({});
    const [loading, setLoading] = useState(true);

    const loadStats = () => {
        setLoading(true);

        // Obtener datos de tiempo y visitas en paralelo
        Promise.all([
            new Promise<Record<string, number>>((resolve) => {
                chrome.runtime.sendMessage({ action: 'getTimeData' }, (timeData) => {
                    if (chrome.runtime.lastError) {
                        console.error('Error al obtener datos de tiempo:', chrome.runtime.lastError);
                        resolve({});
                    } else {
                        resolve(timeData || {});
                    }
                });
            }),
            new Promise<Record<string, number>>((resolve) => {
                chrome.runtime.sendMessage({ action: 'getVisitCounts' }, (visitCounts) => {
                    if (chrome.runtime.lastError) {
                        console.error('Error al obtener datos de visitas:', chrome.runtime.lastError);
                        resolve({});
                    } else {
                        resolve(visitCounts || {});
                    }
                });
            })
        ]).then(([timeData, visitCounts]) => {
            // Combinar los datos
            const combinedStats: { [key: string]: { time: number; visits: number } } = {};

            // Obtener todas las categorías únicas
            const allCategories = new Set([...Object.keys(timeData), ...Object.keys(visitCounts)]);

            allCategories.forEach(category => {
                combinedStats[category] = {
                    time: timeData[category] || 0,
                    visits: visitCounts[category] || 0
                };
            });

            setStats(combinedStats);
            setLoading(false);
        }).catch(() => {
            setStats({});
            setLoading(false);
        });
    };

    useEffect(() => {
        loadStats();
    }, []);

    const formatTime = (milliseconds: number) => {
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
    };

    const getCategoryColor = (category: string) => {
        const colors: { [key: string]: string } = {
            'Entretenimiento': '#FF6B6B',
            'Aprender': '#4ECDC4',
            'Trabajo': '#45B7D1',
            'Social': '#96CEB4',
            'Otros': '#FFEAA7'
        };
        return colors[category] || '#FFEAA7';
    };

    // Contenido original (sin modificar)
    const originalContent = (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {loading ? (
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    fontSize: '16px',
                    color: 'rgba(255, 255, 255, 0.8)'
                }}>
                    Cargando estadísticas...
                </div>
            ) : Object.keys(stats).length === 0 ? (
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    fontSize: '16px',
                    color: 'rgba(255, 255, 255, 0.8)',
                    textAlign: 'center'
                }}>
                    No hay datos disponibles.<br />
                    Navega por algunos sitios web para comenzar a rastrear.
                </div>
            ) : (
                <div style={{
                    flex: 1,
                    overflowY: 'auto',
                    paddingRight: '8px'
                }}>
                    {Object.entries(stats)
                        .sort(([, a], [, b]) => b.time - a.time)
                        .map(([category, data]) => (
                            <div
                                key={category}
                                style={{
                                    background: 'rgba(255, 255, 255, 0.1)',
                                    borderRadius: '12px',
                                    padding: '16px',
                                    marginBottom: '12px',
                                    border: `2px solid ${getCategoryColor(category)}`,
                                    backdropFilter: 'blur(10px)',
                                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)'
                                }}
                            >
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: '8px'
                                }}>
                                    <h3 style={{
                                        margin: 0,
                                        fontSize: '18px',
                                        fontWeight: 600,
                                        color: getCategoryColor(category)
                                    }}>
                                        {category}
                                    </h3>
                                    <div style={{
                                        background: getCategoryColor(category),
                                        borderRadius: '50%',
                                        width: '12px',
                                        height: '12px'
                                    }} />
                                </div>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    fontSize: '14px',
                                    color: 'rgba(255, 255, 255, 0.9)'
                                }}>
                                    <span>⏱️ {formatTime(data.time)}</span>
                                    <span>👁️ {data.visits} visitas</span>
                                </div>
                            </div>
                        ))}
                </div>
            )}
        </div>
    );

    return (
        <AnalyticsApp>
            {originalContent}
        </AnalyticsApp>
    );
};

export default Analytics; 