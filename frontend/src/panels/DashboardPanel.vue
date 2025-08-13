<template>
  <div class="q-pa-md column q-gutter-md">
    <div class="row q-col-gutter-md">
      <q-card v-for="kpi in kpis" :key="kpi.label" class="col">
        <q-card-section>
          <div class="text-subtitle1">{{ kpi.label }}</div>
          <div class="text-h6">{{ formatJPY(kpi.value) }}</div>
        </q-card-section>
      </q-card>
    </div>
    <q-card>
      <q-card-section style="height:300px">
        <div ref="chartEl" class="fit" />
      </q-card-section>
    </q-card>
    <div class="row q-col-gutter-md">
      <q-card v-for="bill in bills" :key="bill.card" class="col">
        <q-card-section>{{ bill.card }}: {{ formatJPY(bill.amount) }}</q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'
import { formatJPY } from '@/utils/format'
const kpis = [
  { label: '収入', value: 300000 },
  { label: '支出', value: 200000 },
  { label: '差額', value: 100000 }
]
const bills = [
  { card: 'Visa', amount: 50000 },
  { card: 'Master', amount: 30000 }
]
const chartEl = ref<HTMLDivElement>()
onMounted(() => {
  if (chartEl.value) {
    const chart = echarts.init(chartEl.value)
    chart.setOption({
      series: [{
        type: 'pie',
        radius: ['40%', '70%'],
        data: [
          { value: 200000, name: '支出' },
          { value: 100000, name: '残額' }
        ]
      }]
    })
  }
})
</script>
