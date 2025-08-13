<template>
  <div class="q-pa-md">
    <q-tabs v-model="tab" inline-label>
      <q-tab name="1y" label="1年" />
      <q-tab name="20y" label="20年" />
    </q-tabs>
    <div class="q-mt-md">前提: 収入/支出は一定</div>
    <div ref="chartEl" style="height:300px"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import * as echarts from 'echarts'
const tab = ref('1y')
const chartEl = ref<HTMLDivElement>()
let chart: echarts.ECharts | null = null
function render() {
  if (!chartEl.value) return
  if (!chart) chart = echarts.init(chartEl.value)
  const months = Array(tab.value === '1y' ? 12 : 20).fill(0).map((_,i)=>i+1)
  chart.setOption({
    xAxis: { type: 'category', data: months },
    yAxis: {},
    series: [
      { type: 'bar', stack: 'a', data: months.map(()=>200000), name:'収入' },
      { type: 'bar', stack: 'a', data: months.map(()=>-150000), name:'支出' }
    ]
  })
}
onMounted(render)
watch(tab, render)
</script>
