export const chartOptions = {
  plugins: {
    legend: {
      display: false
    }
  },
  scales: {
    x: {
      ticks: {
        display: true
      },
      title: {
        display: true,
      },
      display: true,
      border: {
        display: true
      },
      grid: {
        drawBorder: true,
        display: false,
        drawOnChartArea: false,
        drawTicks: false,
      }
    },
    y: {
      display: true,
      border: {
        display: false
      },
      grid: {
        display: false,
        drawOnChartArea: false,
        drawTicks: false,
      }
    }
  }
}
