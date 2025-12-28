<script setup lang="ts">
type ButtonProps = {
  label?: string
  onClick?: () => void
  href?: string
  disabled?: boolean
  type?: 'normal' | 'alert'
};

type ModalProps = {
  isOpen: boolean
  primaryButton?: ButtonProps
};

const props = defineProps<ModalProps>();
const emit = defineEmits<{
  (e: 'close'): void
}>();

const ANIMATION_DURATION = 300;

// DOM に出しておくかどうか
const isMounted = ref(false);
// 開きアニメ / 閉じアニメの状態
const isOpened = ref(false);

let openTimer: ReturnType<typeof setTimeout> | null = null;
let closeTimer: ReturnType<typeof setTimeout> | null = null;

function clearTimers() {
  if (openTimer) clearTimeout(openTimer);
  if (closeTimer) clearTimeout(closeTimer);
  openTimer = null;
  closeTimer = null;
}

function onClose() {
  emit('close')
}

// isOpen が true でマウントされたら、次のフレームで isOpened を true にしてアニメ開始
watch(
  () => props.isOpen,
  (next) => {
    clearTimers();

    if (next) {
      // 1. まずマウント
      isMounted.value = true;
      isOpened.value = false;

      // 2. 次の tick で isOpened=true にしてフェードイン
      openTimer = setTimeout(() => {
        isOpened.value = true;
      }, 10)
      return
    }

    // 閉じる指示
    // 1. isOpened=false にしてフェードアウト開始
    isOpened.value = false;

    // 2. アニメーション時間後にアンマウント
    closeTimer = setTimeout(() => {
      isMounted.value = false;
    }, ANIMATION_DURATION)
  },
  { immediate: true }
)

onBeforeUnmount(() => {
  clearTimers();
})
</script>

<template>
  <div
    v-if="isMounted"
    :class="[
      `
      fixed inset-0 z-50
      flex items-center justify-center
      bg-black/20 backdrop-blur
      transition-opacity duration-300
      `,
      isOpened ? 'opacity-100' : 'opacity-0',
    ]"
    @click="onClose"
  >
    <div
      :class="[
        `
        bg-white
        p-[30px] w-[350px]
        rounded-[30px]
        transition-transform duration-300
        `,
        isOpened ? 'scale-100' : 'scale-98',
      ]"
      @click.stop
    >
      <!-- 本文 -->
      <div class="text-center">
        <slot />
      </div>

      <!-- 下部のボタングループ -->
      <div class="flex flex-col mt-[30px] gap-y-[15px]">
        <!-- primaryButton: href -->
        <NuxtLink
          v-if="props.primaryButton?.href"
          :to="props.primaryButton.href"
          :aria-disabled="props.primaryButton.disabled ? 'true' : 'false'"
          :class="[
            `
            text-white font-bold
            disabled:bg-gray-400 disabled:cursor-not-allowed
            duration-300 ease-in-out
            rounded-md h-[50px]
            flex items-center justify-center
            `,
            props.primaryButton.type === 'alert'
              ? 'bg-rose-500 hover:bg-rose-600'
              : 'bg-neutral-700 hover:bg-neutral-800',
            props.primaryButton.disabled ? 'pointer-events-none opacity-60' : '',
          ]"
        >
          {{ props.primaryButton.label || '' }}
        </NuxtLink>

        <!-- primaryButton: onClick -->
        <button
          v-if="props.primaryButton?.onClick"
          type="button"
          :disabled="props.primaryButton.disabled"
          :class="[
            `
            h-[50px]
            text-white font-bold
            hover:cursor-pointer
            disabled:bg-gray-400 disabled:cursor-not-allowed
            duration-300 ease-in-out
            rounded-[15px] 
            flex items-center justify-center
            `,
            props.primaryButton.type === 'alert'
              ? 'bg-rose-500 hover:bg-rose-600'
              : 'bg-neutral-700 hover:bg-neutral-800',
          ]"
          @click="props.primaryButton.onClick?.()"
        >
          {{ props.primaryButton.label || '' }}
        </button>

        <button
          type="button"
          class="
            h-[50px]
            font-bold
            bg-gray-100 hover:bg-gray-200 hover:cursor-pointer
            disabled:bg-gray-400 disabled:cursor-not-allowed
            duration-300 ease-in-out
            rounded-[15px]
            flex items-center justify-center
          "
          @click="onClose"
        >
          とじる
        </button>
      </div>
    </div>
  </div>
</template>