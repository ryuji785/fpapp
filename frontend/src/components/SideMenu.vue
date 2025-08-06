<template>
  <q-drawer :model-value="modelValue" @update:model-value="update" show-if-above bordered overlay>
    <q-list>
      <q-item
        v-for="item in items"
        :key="item.key"
        clickable
        v-ripple
        active-class="bg-grey-3"
        @click="handle(item.key)"
      >
        <q-item-section>{{ item.label }}</q-item-section>
      </q-item>
    </q-list>
  </q-drawer>
</template>

<script lang="ts">
import { defineComponent, toRef } from 'vue';
import { menuItems } from '../panels';
import { useGoldenLayout } from '../composables/useGoldenLayout';

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
    const open = useGoldenLayout();
    const items = menuItems;
    function update(val: boolean) {
      emit('update:modelValue', val);
    }
    function handle(key: string) {
      open(key);
      update(false);
    }
    return { modelValue, items, update, handle };
  }
});
</script>
