<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonList } from '@ionic/vue';
import ExploreContainer from '@/components/ExploreContainer.vue';
import PriceContainer from '@/components/PriceContainer.vue';
</script>

<template>

  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>⚡ kaina, EUR/MWh</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="false">
      <ion-list class="container">
        <ion-item>
          <ion-label>
            <PriceContainer />
          </ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>

</template>

<style>

</style>
