<script setup lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue';

import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

Chart.defaults.font.size = 12
Chart.defaults.font.family = '"Roboto", "Helvetica Neue", sans-serif'
</script>


<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>
