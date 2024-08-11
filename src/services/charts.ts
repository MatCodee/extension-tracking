var option = {
    title: {
      left: 'center',
      textStyle: {
        color: '#FFFFFF'
      }
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'horizontal',
      top: 'top', 
      textStyle: {
        color: '#FFFFFF'
      },
      padding: [10, 0, 10, 0]
    },
    grid: {
        top: '20%' // Ajusta la distancia del gráfico desde el borde superior del contenedor
    },
    series: [
      {
        name: 'Categoria',
        type: 'pie',
        radius: '50%',
        data: [
          { value: 1048, name: 'Social' },
          { value: 735, name: 'Entretenimiento' },
          { value: 580, name: 'Otros' },
          { value: 484, name: 'Deportes' },
          { value: 300, name: 'Noticias' },
          { value: 300, name: 'Juegos' },
          { value: 300, name: 'Aprender' },

        ],
        label: {
            color: '#FFFFFF'
        },

      }
    ]
  };
  
  export default option;