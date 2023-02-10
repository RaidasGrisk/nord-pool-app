<script setup lang="ts">
  import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonList } from '@ionic/vue';
  import NotificationSettings from '@/components/NotificationSettings.vue'
</script>

<template>

  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Nustatymai</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-list class="container">
        <ion-item>
          <ion-label>
            <NotificationSettings />
          </ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>

</template>
