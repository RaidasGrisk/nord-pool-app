<script setup lang="ts">
  import { ref, onMounted, watch } from 'vue'
  import { response_data } from './data'
  import { BarChart } from 'vue-chart-3'
  import { Chart, registerables } from 'chart.js'
  import { chartOptions } from './chartOptions'
  import { format, parseISO } from 'date-fns'
  import { getPriceData } from '../utils/getPriceData'

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
    IonSpinner,
    IonSelectOption,
    IonSelect,
    IonList,
   } from '@ionic/vue'

  Chart.register(...registerables)

  const loading = ref(false)
  const data_ = ref({})
  const countries = ref([])
  const countrySelection = ref('LT')
  const date = ref(new Date().toISOString().slice(0, 10))
  const modal = ref(null)

  // trigger date change when the date is modified
  const dateChange = (dateFromIonDatetime) => {
    date.value = dateFromIonDatetime.detail.value.substring(0, 10)
    console.log(modal)
    modal.value.$el.dismiss()
  }

  const getData = async (date) => {
    loading.value = true
    const data = await getPriceData(date.value)

    countries.value = Object.keys(data)
    for (const idx in countries.value) {
      const country = countries.value[idx]
      data_.value[country] = {
        labels: data[country].map(i => i.date + '-' + (i.date + 1) + 'h'),
        datasets: [
          {
            data: data[country].map(i => i.value),
            backgroundColor: ['#3880ff'],
          },
        ],
      }
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
  <br><br>
  <BarChart :chartData="data_[countrySelection]" :height="100" :width="100" :options="chartOptions" />
  <ion-datetime-button datetime="datetime"></ion-datetime-button>

  <div class="outer">
    <div class="inner">
      <ion-list lines="none">
        <ion-item fill="solid">
          <ion-select interface="action-sheet" @ionChange="countrySelection = $event.detail.value" :value="countrySelection">
            <ion-select-option v-for="country in countries" :value="country" :key="country">{{ country }}</ion-select-option>
          </ion-select>
        </ion-item>
      </ion-list>
    </div>
  </div>

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

.outer {
  width:100%;
  display: flex;
  justify-content: center;
}

</style>
