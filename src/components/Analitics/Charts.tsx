import React from 'react';
import ReactECharts from 'echarts-for-react';

interface ChartsProps {
    timeData: Record<string, number>;
    visitCounts: Record<string, number>;
}

const Charts: React.FC<ChartsProps> = ({ timeData, visitCounts: _visitCounts }) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    // Configuración del gráfico de tiempo (pastel)
    const getTimeChartOption = () => {
        const chartData = Object.entries(timeData).map(([category, time]) => ({
            name: category,
            value: Math.round(Number(time) / 1000 / 60) // Convertir de ms a minutos
        })).filter(item => item.value > 0);

        return {
            title: {
                text: 'Tiempo por Categoría',
                left: 'center',
                textStyle: {
                    color: '#FFFFFF',
                    fontSize: 16,
                    fontWeight: 'bold'
                }
            },
            tooltip: {
                trigger: 'item',
                formatter: function (params: any) {
                    const minutes = params.value;
                    const hours = Math.floor(minutes / 60);
                    const remainingMinutes = minutes % 60;

                    if (hours > 0) {
                        return `${params.name}: ${hours}h ${remainingMinutes}m`;
                    } else {
                        return `${params.name}: ${minutes}m`;
                    }
                }
            },
            legend: {
                orient: 'horizontal',
                top: '15%',
                textStyle: {
                    color: '#FFFFFF'
                }
            },
            series: [
                {
                    name: 'Tiempo',
                    type: 'pie',
                    radius: '60%',
                    center: ['50%', '65%'],
                    data: chartData,
                    label: {
                        color: '#FFFFFF',
                        formatter: function (params: any) {
                            const minutes = params.value;
                            const hours = Math.floor(minutes / 60);
                            const remainingMinutes = minutes % 60;

                            if (hours > 0) {
                                return `${params.name}\n${hours}h ${remainingMinutes}m`;
                            } else {
                                return `${params.name}\n${minutes}m`;
                            }
                        }
                    },
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ],
            color: [
                '#FF6B6B', // Rojo - Entretenimiento
                '#4ECDC4', // Turquesa - Aprender
                '#45B7D1', // Azul - Trabajo
                '#96CEB4', // Verde - Social
                '#FFEAA7'  // Amarillo - Otros
            ]
        };
    };

    return (
        <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '20px',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            height: '100%'
        }}>
            <div style={{
                flex: 1,
                minHeight: '200px',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                padding: '10px'
            }}>
                <ReactECharts
                    option={getTimeChartOption()}
                    style={{ height: '100%', width: '100%' }}
                />
            </div>
        </div>
    );
};

export default Charts; 