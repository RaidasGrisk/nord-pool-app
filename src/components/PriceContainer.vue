<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { response_data } from './data'
  import { BarChart } from 'vue-chart-3'
  import { Chart, registerables } from 'chart.js'
  import { chartOptions } from './chartOptions'

  Chart.register(...registerables);

  const data_ = ref({})
  const date = ref(new Date().toISOString().slice(0, 10))

  const getData = async () => {

    const corsProxy = 'https://cors-anywhere.herokuapp.com/'
    // const corsProxy = 'https://proxy.cors.sh/'
    const url = `https://www.nordpoolgroup.com/api/marketdata/page/10?endDate=${date.value}`
    const response = await fetch(corsProxy + url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const reponse_ = await response.json()

    let data = response_data
    console.log(data)

    // filter out rows with data for Min, Max, etc.
    const namesToFilterOut = ['Min', 'Max', 'Average', 'Peak', 'Off-peak 1', 'Off-peak 2']
    data = data.data.Rows.filter(row => !namesToFilterOut.includes(row.Name))

    // filter out LTU data only
    data = data.map(row => (
      {
        value: parseFloat(row.Columns.filter(col => col.Name == 'LT')[0].Value.replace(',', '.')),
        date: new Date(row.StartTime).getHours(),
      }
    ))
    console.log(data)


    data_.value = {
      labels: data.map(i => i.date + 'h'),
      datasets: [
        {
          data: data.map(i => i.value),
          backgroundColor: ['#3880ff'],
        },
      ],
    }

  }

  onMounted(() => {
    getData()
  })

</script>

<template>
  <BarChart :chartData="data_" :height="100" :width="100" :options="chartOptions" />
</template>

<style scoped>

</style>
