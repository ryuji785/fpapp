<template>
  <q-header elevated class="bg-green-7 text-white">
    <q-toolbar class="relative-position">
      <q-btn flat dense round @click="toggleDrawer">
        <transition name="rotate" mode="out-in">
          <q-icon :key="drawer ? 'close' : 'open'" :name="drawer ? 'close' : 'menu'" />
        </transition>
      </q-btn>
      <q-toolbar-title class="absolute-center">FPApp</q-toolbar-title>
      <div class="q-ml-auto row items-center q-gutter-sm">
        <span>{{ formattedNow }}</span>
        <q-icon name="account_circle" />
        <span>{{ username }}</span>
      </div>
    </q-toolbar>
  </q-header>
</template>

<script lang="ts">
import { defineComponent, toRef, ref, onMounted, onUnmounted, computed } from 'vue';

const TopAppBar = defineComponent({
  name: 'TopAppBar',
  props: {
    drawer: {
      type: Boolean,
      required: true
    },
    username: {
      type: String,
      required: true
    }
  },
  emits: ['update:drawer'],
  setup(props, { emit }) {
    const drawer = toRef(props, 'drawer');
    const username = toRef(props, 'username');

    const now = ref(new Date());
    let timer: number;

    onMounted(() => {
      timer = window.setInterval(() => {
        now.value = new Date();
      }, 1000);
    });

    onUnmounted(() => {
      clearInterval(timer);
    });

    const formattedNow = computed(() =>
      now.value.toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })
    );

    function toggleDrawer() {
      emit('update:drawer', !drawer.value);
    }

    return { drawer, toggleDrawer, formattedNow, username };
  }
});

export default TopAppBar;
</script>

<style scoped>
.rotate-enter-active, .rotate-leave-active {
  transition: transform 0.2s ease;
}
.rotate-enter-from, .rotate-leave-to {
  transform: rotate(180deg);
}
</style>
