<template>
  <div class="q-pa-md">
    <PageTitle title="Life Plan Simulation" />
    <div class="q-my-md">
      <ChartPanel title="Simulation Results" />
    </div>
    <q-btn color="primary" label="Run Simulation" @click="run" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import PageTitle from '../components/common/PageTitle.vue';
import ChartPanel from '../components/common/ChartPanel.vue';

export default defineComponent({
  name: 'LifePlanSimulationView',
  components: { PageTitle, ChartPanel },
  setup() {
    function run() {
      console.log('simulate');
    }
    return { run };
  }
});
</script>
