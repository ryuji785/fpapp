<template>
  <div class="q-pa-md column q-gutter-md">
    <q-card>
      <q-card-section>
        <div class="text-h6">プロフィール</div>
        <q-input v-model="profile.name" label="名前" />
      </q-card-section>
    </q-card>
    <q-card>
      <q-card-section>
        <div class="text-h6">表示</div>
        <q-toggle v-model="dark" label="ダークモード" />
        <q-select v-model="currency" :options="currencies" label="通貨" />
      </q-card-section>
    </q-card>
    <q-card>
      <q-card-section>
        <div class="text-h6">予算</div>
        <q-input v-model.number="budget.monthly" type="number" label="月次予算" />
        <q-input v-model.number="budget.alert" type="number" label="アラート閾値" />
      </q-card-section>
    </q-card>
    <div class="row q-gutter-sm">
      <q-btn label="データエクスポート" />
      <q-btn label="データインポート" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const profile = ref({ name: 'User' })
const dark = ref(false)
const currency = ref('JPY')
const currencies = ['JPY', 'USD']
const budget = ref({ monthly: 0, alert: 0 })
</script>
