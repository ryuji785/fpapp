<template>
  <div class="row q-col-gutter-md q-pa-md">
    <q-form class="col-12 col-md-6 column q-gutter-md">
      <q-select v-model="form.type" :options="types" label="種別" />
      <q-input v-model="form.date" type="date" label="日付" />
      <q-input v-model.number="form.amount" type="number" label="金額" />
      <q-input v-model="form.category" label="カテゴリ" />
      <q-input v-model="form.method" label="方法" />
      <q-input v-model="form.memo" label="メモ" />
      <q-btn label="登録" color="primary" />
    </q-form>
    <div class="col-12 col-md-6">
      <q-list bordered>
        <q-item v-for="r in recent" :key="r.id">
          <q-item-section>{{ r.date }} {{ r.category }} {{ formatJPY(r.amount) }}</q-item-section>
        </q-item>
      </q-list>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { formatJPY } from '@/utils/format'
const types = ['収入', '支出']
const form = ref({ type: '', date: '', amount: 0, category: '', method: '', memo: '' })
const recent = ref([
  { id: 1, date: '2024-01-01', category: '食費', amount: -5000 },
  { id: 2, date: '2024-01-02', category: '給与', amount: 250000 }
])
</script>
