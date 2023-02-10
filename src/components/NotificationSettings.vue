<script setup lang="ts">
  import { ref, onMounted, watch } from 'vue'
  import { LocalNotifications } from '@capacitor/local-notifications'

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

  const date = ref()

  // watch(date, async (curr, prev) => {
  //   if (curr != prev) {
  //   }
  // })

  onMounted(async () => {
    console.log('mounted')
    await LocalNotifications.schedule({
      notifications: [
        {
          id: 1234,
          channelId: 'reminders',
          title: 'My Title',
          body: 'My body',
          schedule: {
            on: {
              hour: 12,
              minute: 30
            },
            ScheduleEvery: 'minute',
            allowWhileIdle: true,
          },
          extra: {
          },
        },
      ],
    })
  })

</script>

<template>
  asdjhgasd
</template>

<style scoped>

</style>
