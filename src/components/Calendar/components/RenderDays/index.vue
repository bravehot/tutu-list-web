<template>
  <section
    :class="['grid grid-cols-7 border', $style['render-days-wrapper'], $style['day-border']]"
  >
    <Popover
      :render-days-list="renderDaysInfo.renderDaysList"
      @change-info="changeRenderDaysInfo"
    />
  </section>
</template>
<script setup lang="ts">
import { defineProps, watchEffect, reactive } from 'vue'
import dayjs from 'dayjs'
import useSettingStore from '@/stores/useSettingStore'

// import { MOCK_INFO } from '@/mock/index'
import { getTodoByMonth } from '@/services/todo'

import Popover from './Popover.vue'

import type { RenderDaysType, TodoListType } from '../../types'
import { getRenderDaysConfig } from '../../utils'

const props = defineProps<{
  currentMonth: number
}>()

const settingStore = useSettingStore()

const renderDaysInfo = reactive<{
  renderDaysList: RenderDaysType[]
}>({ renderDaysList: [] })

const changeRenderDaysInfo = ({ index, todoList }: { index: number; todoList: TodoListType[] }) => {
  if (renderDaysInfo.renderDaysList[index] && Array.isArray(todoList)) {
    renderDaysInfo.renderDaysList[index].todoList = todoList
  }
}
watchEffect(async () => {
  const [year, month] = dayjs(props.currentMonth).format('YYYY-MM').split('-')

  // 拿到当前月的农历/休班信息
  const renderDaysConfig = getRenderDaysConfig(+year, +month, settingStore.weekStart)
  if (renderDaysConfig.length) {
    const { data } = await getTodoByMonth({
      startTime: renderDaysConfig[0].time,
      endTime: renderDaysConfig[renderDaysConfig.length - 1].time
    })
    const renderDayResult = renderDaysConfig.map((renderDayItem) => {
      const findTodoList = data.find((item) => item.time === renderDayItem.time)
      return {
        ...renderDayItem,
        id: findTodoList?.id,
        todoList: findTodoList?.todoItems
      }
    })
    renderDaysInfo.renderDaysList = renderDayResult
  } else {
    window.$message.error('月信息加载失败')
  }
})
</script>

<style scoped module>
.render-days-wrapper {
  height: calc(100vh - 80px);
}

.render-days-wrapper {
  height: calc(100vh - 80px);
}
.day-border {
  @apply border-solid border-gray-300;
}
.day-text {
  @apply px-2 py-1 text-xs;
}
</style>
