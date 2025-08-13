<template>
  <q-drawer :model-value="modelValue" @update:model-value="val => emit('update:modelValue', val)"
            show-if-above bordered :breakpoint="1024" width="240">
    <q-list>
      <q-item v-for="it in items" :key="it.key" clickable v-ripple
              @click="go(it.key)">
        <q-item-section>{{ it.label }}</q-item-section>
      </q-item>
    </q-list>
  </q-drawer>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar'
const $q = useQuasar()
const props = defineProps<{ modelValue: boolean, items: {key:string,label:string}[] }>()
const emit  = defineEmits<{ (e:'update:modelValue',v:boolean):void; (e:'navigate',name:string):void }>()
function go(name:string){
  emit('navigate', name)
  if(!$q.screen.gt.md) emit('update:modelValue', false)
}
</script>
