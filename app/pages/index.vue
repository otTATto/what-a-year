<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid';
import type { EventItem } from '~/types/event'

// 思い出リスト
const events = ref<EventItem[]>([]);

// 思い出リストを日付順にソート
const sortedEvents = computed(() => {
  return [...events.value].sort((a, b) => {
    return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
  });
});

// 思い出を追加する
const isAddEventModalOpen = ref<boolean>(false);
const addEventDate = ref<string>('2025-01-01');
const addEventName = ref<string>('');
const addEvent = () => {
  const eventDate = addEventDate.value;
  const eventName = addEventName.value;

  // TODO: 本来はバリデーションエラーのメッセージをユーザーに示したい
  if (!eventDate || !eventName) return;

  events.value.push({
    id: uuidv4(),
    title: eventName,
    startDate: eventDate,
  });

  // addEventName だけ空にする
  // MEMO: addEventDate は、次の入力が前の入力した日付に近いことが予測されるため敢えて残す
  addEventName.value = '';

  isAddEventModalOpen.value = false;
}

// 思い出を編集する
const isEditEventModalOpen = ref<boolean>(false);
const currentEditEventId = ref<string>();
const currentEditEvent = computed(() => {
  return events.value.find(event => event.id === currentEditEventId.value);
});
const removeEvent = () => {
  // currentEditEventId 以外のもので events を再生成
  events.value = events.value.filter(event => event.id !== currentEditEventId.value);
  
  isEditEventModalOpen.value = false;
};

// 日付 'YYYY-MM-DD' → 'YYYY.MM.DD' にフォーマット
const formatDate = (dateString: string): string => {
  const [year, month, day] = dateString.split('-');
  return `${year}.${month}.${day}`;
};

// 日付から曜日を取得する
const getDayOfWeek = (dateString: string): string => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const date = new Date(dateString);
  return days[date.getDay()] || '';
};

// 日付から曜日に応じた色の class を返す
const getDayOfWeekClass = (dateString: string): string => {
  const date = new Date(dateString);
  const day = date.getDay();
  if (day === 0) return 'text-rose-500'; // 日曜日は赤
  if (day === 6) return 'text-sky-500'; // 土曜日は青
  return 'text-neutral-500';
}

</script>

<template>
  <!-- 思い出を追加するモーダル -->
  <Modal 
    :is-open="isAddEventModalOpen"
    :primary-button="{ 
      label: '追加する', 
      type: 'normal', 
      onClick: addEvent, 
      disabled: !(addEventDate && addEventName),
     }"
    @close="isAddEventModalOpen = false"
  >
    <h3 class='
      font-bold
      text-lg
    '>
      思い出を追加します
    </h3>
    <div class='flex flex-col gap-y-[15px] my-[30px]'>
      <input 
        type='date'
        id='input-date' 
        v-model='addEventDate'
        class='
          h-[50px] w-full 
          rounded-[15px] 
          p-3
          border-2 border-neutral-700
        '
      />
      <input 
        type='text'
        id='input-name' 
        v-model='addEventName'
        placeholder='例: 焼き肉を食べたよ' 
        class='
          h-[50px] w-full 
          rounded-[15px] 
          p-3
          border-2 border-neutral-700
        '
      />
    </div>
  </Modal>

  <!-- 思い出を編集するモーダル -->
  <Modal
    :is-open="isEditEventModalOpen"
    :primary-button="{
      label: '削除する',
      type: 'alert',
      onClick: removeEvent,
    }"
    @close="isEditEventModalOpen = false"
  >
    <h3 class='
      font-bold
      text-lg
    '>
      この思い出を編集します
    </h3>
    <div 
      v-if="currentEditEvent"
      class="
        px-6 py-4 my-[30px]
        bg-neutral-100
        rounded-[15px]
      "
    >
      <!-- 日付 -->
      <div class="
        text-sm
        flex items-end gap-x-3
      ">
        <div>
          {{ formatDate(currentEditEvent.startDate) }}
        </div>
        <div 
          :class="getDayOfWeekClass(currentEditEvent.startDate)"
          class="
            text-xs 
          "
        >
          {{ getDayOfWeek(currentEditEvent.startDate) }}
        </div>
      </div>
      <!-- 思い出タイトル -->
      <div class="
        text-lg font-bold
        text-start
        truncate
        overflow-hidden
        whitespace-nowrap
      ">
        {{ currentEditEvent.title }}
      </div>
    </div>
  </Modal>

  <div v-if="events.length === 0">
    <div class="
      absolute top-[45vh]
      w-full
      text-center
      flex items-center justify-center
    ">
      <div class="text-sm">
        思い出を追加するとここに表示されます<br>
        下部のボタンから思い出を追加しましょう！
      </div>
    </div>
  </div>

  <!-- 画面本体 -->
  <div class="h-screen ">
    <div class="max-w-[500px] mx-auto p-[15px]">
      <!-- ロゴ: WHAT A YEAR! -->
      <img 
        src="/logo.webp"
        class="max-w-[300px] mx-auto pt-[30px]"
      >
      <!-- 思い出アイテム -->
      <div v-if="events.length !== 0">
        <div class="
          my-[30px]
          flex flex-col gap-y-[15px]
        ">
          <div 
            v-for="event in sortedEvents"
            :key="event.id"
          >
            <div 
              @click="() => {
                currentEditEventId = event.id;
                isEditEventModalOpen = true;
              }"
              class="
                flex items-center
                p-3
                hover:bg-white hover:cursor-pointer
                duration-300 ease-in-out
                rounded-[15px]
              "
            >
              <!-- 日付 -->
              <div class="
                w-[150px]
                text-sm
                flex items-center gap-x-3
              ">
                <!-- YYYY.MM.DD -->
                <div>
                  {{ formatDate(event.startDate) }}
                </div>
                <!-- 曜日 -->
                <div 
                  :class="getDayOfWeekClass(event.startDate)"
                  class="
                    text-xs 
                    mt-[1px]
                  "
                >
                  {{ getDayOfWeek(event.startDate) }}
                </div>
              </div>
              <!-- 思い出タイトル -->
              <div class="
                w-[250px] md:w-[350px]
                text-lg font-bold
                truncate
                overflow-hidden
                whitespace-nowrap
              ">
                {{ event.title }}
              </div>
            </div>
          </div>
        </Div>
      </div>
    </div>
    <!-- 思い出追加ボタン -->
    <Button 
      @click="isAddEventModalOpen = true"
      class="
        h-[50px] w-[180px]
        absolute bottom-[50px] left-1/2 -translate-x-1/2
      "
    />
    <AppFooter />
  </div>
</template>

<style>
</style>