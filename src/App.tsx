import './App.css'
import options from "./services/charts";
import React, { useState } from 'react';
import ReactECharts from 'echarts-for-react'; 

function App() {
  const [chartOptions, setChartOptions] = useState(options);

  const updatedOptions = {
    ...chartOptions,
    series: [{
      ...chartOptions.series[0],
      data: [
        { value: Math.floor(Math.random() * 1000), name: 'Social' },
        { value: Math.floor(Math.random() * 1000), name: 'Entretenimiento' },
        { value: Math.floor(Math.random() * 1000), name: 'Otros' },
        { value: Math.floor(Math.random() * 1000), name: 'Deportes' },
        { value: Math.floor(Math.random() * 1000), name: 'Noticias' },
        { value: Math.floor(Math.random() * 1000), name: 'Juegos' },
        { value: Math.floor(Math.random() * 1000), name: 'Aprender' },
      ]
    }]
  };
  setChartOptions(updatedOptions);


  return (
    <>
      <h1>Categorias mas visitadas</h1>
      <ReactECharts option={chartOptions} />
      <p className="read-the-docs">
        Cuanto tiempo he ahorrado?
      </p>
      <div className="card">
        <button> Actualizar </button>
      </div>

    </>
  )
}

export default App
