<script setup lang="ts">
const emit = defineEmits<{
  (e: 'click'): void
}>();

function onClick() {
  emit('click');
}
</script>

<template>
  <button
    @click="onClick"
    class="
      py-2 px-3 mx-auto 
      hover:text-white
      bg-white hover:bg-neutral-700
      border-2 border-neutral-700
      shadow-lg
      rounded-full
      duration-300 ease-in-out
    "
  >
    <div class="
      font-bold text-sm
    ">
      思い出を追加する
    </div>
  </button>
</template>
