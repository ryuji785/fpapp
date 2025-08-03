<template>
  <div class="card-statement">
    <label>
      Card:
      <select v-model="selected" @change="filter">
        <option v-for="name in cardNames" :key="name" :value="name">{{ name }}</option>
      </select>
    </label>
    <div class="statement-table">Statement for {{ selected }}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'CardStatement',
  setup() {
    // In real usage, card names and statements would come from Pinia store
    const cardNames = ['Visa', 'Mastercard'];
    const selected = ref(cardNames[0]);

    function filter() {
      // Placeholder for filter logic
    }

    return { cardNames, selected, filter };
  }
});
</script>

<style scoped>
.card-statement {
  padding: 1rem;
}
.statement-table {
  margin-top: 1rem;
}
</style>
