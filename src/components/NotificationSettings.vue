<script setup lang="ts">
  import { ref, onMounted, watch } from 'vue'
  import { LocalNotifications } from '@capacitor/local-notifications'
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
    IonList,
  } from '@ionic/vue'


  const modalOpen = ref(false)

  const notificationInfo = ref({
    pending: null,
    delivered: null
  })

  const getNotificationInfo = async () => {
    const n1 = await LocalNotifications.getPending()
    notificationInfo.value.pending = n1
    console.log(n1)
    const n2 = await LocalNotifications.getDeliveredNotifications()
    notificationInfo.value.delivered = n2
    console.log(n2)
  }

  const removeAllDeliveredNotifications = async () => {
    await LocalNotifications.removeAllDeliveredNotifications()
    const n1 = await LocalNotifications.getPending()
    await LocalNotifications.cancel(n1)
  }

  const sceduleNotification = async () => {
    const now = new Date()
    await LocalNotifications.schedule({
      notifications: [{
        title: 'Test notification',
        body: 'test text',
        id: 1,
        schedule: {
          on: {
            minute: new Date().getUTCMinutes() + 1
          }
        }
      }]
    })
  }

  const pullDataAndSetNotifications = async () => {

    const date = new Date()
    // date.setDate(date.getDate() + 1)
    const data = await getPriceData(date.toISOString().slice(0, 10))
    console.log(data)
    const [price, hour] = [data.map(i => i.value), data.map(i => i.date)]
    console.log(price, hour)

    // ignore night prices
    const [price_, hour_] = [price.slice(6, 21), hour.slice(6, 21)]

    // stats
    const [indexMin, indexMax] = [
      price_.indexOf(Math.min(...price_)),
      price_.indexOf(Math.max(...price_))
    ]
    const avg = price_.reduce((a, b) => a + b, 0) / price_.length

    const stats = {
      'min': price_[indexMin],
      'max': price_[indexMax],
      'avg': avg,

      'minFromAvg': Math.round(((price_[indexMin] / avg) * 100) - 100),
      'maxFromAvg': Math.round(((price_[indexMax] / avg) * 100) - 100),
    }

    console.log(stats)

    // scedule notifications
    const dateMin = new Date()
    dateMin.setHours(hour_[indexMin])
    dateMin.setMinutes(0)
    dateMin.setSeconds(0)
    console.log('min price at: ', dateMin)

    await LocalNotifications.schedule({
      notifications: [{
        title: '⚡ Electricity price 🟢',
        body: `Over the next hour (${dateMin}), the electricity price is ${stats.min}, that is ${stats.minFromAvg}% lower than average.`,
        id: 2,
        sound: 'beep.aiff',
        schedule: {
          at: dateMin
        },
      }]
    })

    const dateMax = new Date()
    dateMax.setHours(hour_[indexMax])
    dateMax.setMinutes(0)
    dateMax.setSeconds(0)
    console.log('max price at: ', dateMax)
    await LocalNotifications.schedule({
      notifications: [{
        title: '⚡ Electricity price 🔴',
        body: `Over the next hour (${dateMax}), the electricity price is ${stats.max}, that is ${stats.maxFromAvg}% higher than average.`,
        id: 3,
        sound: 'beep.aiff',
        schedule: {
          at: dateMax
        },
      }]
    })
  }

  onMounted(async () => {
    console.log('mounted')
    // await sceduleNotification()
    await pullDataAndSetNotifications()
  })

</script>

<template>

  <ion-list class="container">
    <ion-item>
      Notification tests
    </ion-item>
    <ion-item>
      <ion-button expand="block" @click="modalOpen = true">Investigate notifications</ion-button>
    </ion-item>
    <ion-item>
      <ion-button expand="block" @click="pullDataAndSetNotifications">pull data and scedule</ion-button>
    </ion-item>
    <ion-item>
      <ion-button expand="block" @click="removeAllDeliveredNotifications">remove all</ion-button>
    </ion-item>
  </ion-list>

  <ion-modal :is-open="modalOpen">
    <ion-header>
      <ion-toolbar>
        <ion-title>Notification Info</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="modalOpen = false">Close</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-button @click="getNotificationInfo">get info</ion-button>
      <ion-button @click="sceduleNotification">create new notification</ion-button>
      <p>
        {{ JSON.stringify(notificationInfo, null, 2) }}
      </p>
    </ion-content>
  </ion-modal>

</template>

<style scoped>


</style>
