<script setup lang="ts">
  import { ref, onMounted, watch } from 'vue'
  import { response_data } from './data'
  import { BarChart } from 'vue-chart-3'
  import { Chart, registerables } from 'chart.js'
  import { chartOptions } from './chartOptions'
  import { format, parseISO } from 'date-fns'

  import {
    IonButtons,
    IonButton,
    IonModal,
    IonHeader,
    IonContent,
    IonToolbar,
    IonTitle,
    IonItem,
    IonInput,
    IonLabel,
    IonDatetime,
    IonDatetimeButton,
    IonSpinner
   } from '@ionic/vue'

  Chart.register(...registerables)

  const loading = ref(false)
  const data_ = ref({})
  const date = ref(new Date().toISOString().slice(0, 10))
  const modal = ref(null)

  // trigger date change when the date is modified
  const dateChange = (dateFromIonDatetime) => {
    date.value = dateFromIonDatetime.detail.value.substring(0, 10)
    console.log(modal)
    modal.value.$el.dismiss()
  }

  const getData = async (date) => {
    console.log('getting data, for date: ', date.value)
    loading.value = true
    const formattedDate = date.value.split('-').reverse().join('-')
    const corsProxy = 'https://cors-anywhere.herokuapp.com/'
    // const corsProxy = 'https://proxy.cors.sh/'
    const url = `https://www.nordpoolgroup.com/api/marketdata/page/10?endDate=${formattedDate}`
    const response = await fetch(corsProxy + url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const reponse_ = await response.json()

    let data = reponse_

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

    data_.value = {
      labels: data.map(i => i.date + 'h'),
      datasets: [
        {
          data: data.map(i => i.value),
          backgroundColor: ['#3880ff'],
        },
      ],
    }
    loading.value = false
  }

  watch(date, async (curr, prev) => {
    if (curr != prev) {
      await getData(date)
    }
  })

  onMounted(async () => {
    await getData(date)
  })

</script>

<template>

  <h3>EUR/MWh</h3>
  <br><br>

  <BarChart :chartData="data_" :height="100" :width="100" :options="chartOptions" />
  <ion-datetime-button datetime="datetime"></ion-datetime-button>
  <ion-modal ref="modal" :keep-contents-mounted="true">
    <ion-datetime presentation="date" locale="lt-ES" id="datetime" @ionChange="dateChange"></ion-datetime>
  </ion-modal>
  <br>
  <div style="width: 100%; text-align: center;">
    <div style="display: inline-block;">
      <ion-spinner v-if="loading" name="crescent"></ion-spinner>
    </div>
  </div>
</template>

<style scoped>

</style>
