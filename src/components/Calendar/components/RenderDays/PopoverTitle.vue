<template>
  <section class="flex pb-2 border-b border-gray-100 items-center">
    <Icon size="22" class="mr-2">
      <CalendarSharp :class="calendarSharpColor" />
    </Icon>
    <p :class="['text-sm', calendarSharpColor]">
      <span v-if="[0, 1, 2].includes(Math.abs(titleInfo.diffDays))">{{ titleInfo.title }}</span>
      <span v-else>{{ titleInfo.title }}</span>
    </p>

    <n-button
      v-if="todoListId && todoListId !== -1"
      class="ml-auto"
      quaternary
      strong
      circle
      @click="handleDelete"
    >
      <template #icon>
        <n-icon size="18" class="text-red-500">
          <Trash />
        </n-icon>
      </template>
    </n-button>
  </section>
</template>
<script setup lang="ts">
import { computed, defineProps } from 'vue'
import dayjs from 'dayjs'
import { storeToRefs } from 'pinia'

import { NButton, NIcon } from 'naive-ui'
import { Icon } from '@vicons/utils'
import { CalendarSharp, Trash } from '@vicons/ionicons5'

import updateLocale from 'dayjs/plugin/updateLocale'
import weekOfYear from 'dayjs/plugin/weekOfYear'

import useSettingStore from '@/stores/useSettingStore'

const props = defineProps<{
  time: string
  todoListId?: number
}>()

const emits = defineEmits<{
  (_event: 'delete'): void
}>()

const { weekStart, weekList } = storeToRefs(useSettingStore())
dayjs.extend(weekOfYear)

if (weekStart.value === 'startMonday') {
  dayjs.extend(updateLocale)
  dayjs.updateLocale('en', {
    weekStart: 1
  })
}

const titleInfo = computed<{ title: string; diffDays: number }>(() => {
  let title = ''
  const diffDays = dayjs(props.time).diff(dayjs().format('YYYY-MM-DD'), 'd')
  const currentWeek = dayjs().week()
  const selectWeek = dayjs(props.time).week()
  const currentDays = dayjs(props.time).format('MM月DD日')

  const weekDay = dayjs(props.time).get('day') === 0 ? 6 : dayjs(props.time).get('day') - 1

  // 处理本周上周和下周的 title
  if ([0, 1].includes(Math.abs(selectWeek - currentWeek))) {
    const diffWeeks = selectWeek - currentWeek
    switch (diffWeeks) {
      case 0:
        title = `本周${weekList.value[weekDay]}，${currentDays}`
        break
      case 1:
        title = `下周${weekList.value[weekDay]}，${currentDays}`
        break
      case -1:
        title = `上周${weekList.value[weekDay]}，${currentDays}`
        break
      default:
    }
  } else if (diffDays > 0) {
    title = `${dayjs(props.time).format('MM月DD日')}，${diffDays}天后`
  } else {
    title = `${dayjs(props.time).format('MM月DD日')}，延期${Math.abs(diffDays)}天`
  }

  switch (Math.abs(diffDays)) {
    case 0:
      title = `今天，周${weekList.value[weekDay]}，${currentDays}`
      break
    case 1:
      title = `${diffDays > 0 ? '明天' : '昨天'}，周${weekList.value[weekDay]}，${currentDays}`
      break
    case 2:
      title = `${diffDays > 0 ? '后天' : '前天'}，周${weekList.value[weekDay]}，${currentDays}`
      break
    default:
  }

  return { title, diffDays }
})

const calendarSharpColor = computed(() => {
  const { diffDays } = titleInfo.value
  if (diffDays === 0) {
    return 'text-blue-400'
  }
  return diffDays > 0 ? 'text-green-400	' : 'text-red-400	'
})

const handleDelete = () => {
  emits('delete')
}
</script>
