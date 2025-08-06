<template>
  <q-drawer :model-value="modelValue" @update:model-value="update" show-if-above bordered overlay>
    <q-list>
      <q-item v-for="item in items" :key="item.path" clickable v-ripple :to="item.path" active-class="bg-grey-3" @click="update(false)">
        <q-item-section>{{ item.label }}</q-item-section>
      </q-item>
    </q-list>
  </q-drawer>
</template>

<script lang="ts">
import { defineComponent, toRef } from 'vue';

export default defineComponent({
  name: 'SideMenu',
  props: {
    modelValue: {
      type: Boolean,
      required: true
    }
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const modelValue = toRef(props, 'modelValue');
    const items = [
      { path: '/', label: 'Dashboard' },
      { path: '/data-entry', label: 'Data Entry' },
      { path: '/budget-settings', label: 'Budget Settings' },
      { path: '/asset-management', label: 'Asset Management' },
      { path: '/life-plan', label: 'Life Plan Simulation' },
      { path: '/reports', label: 'Reports' },
      { path: '/settings', label: 'Settings' }
    ];
    function update(val: boolean) {
      emit('update:modelValue', val);
    }
    return { modelValue, items, update };
  }
});
</script>
