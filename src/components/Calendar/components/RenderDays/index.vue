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

import { getTodoByMonth, handleChangeTime, getTodoByDay } from '@/services/todo'

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

const changeRenderDaysInfo = async ({
  index,
  todoList,
  type,
  todoId = -1
}: {
  index: number
  todoList: TodoListType[]
  type: 'FROM' | 'TO' | 'REFRESH'
  todoId?: number
}) => {
  if (renderDaysInfo.renderDaysList[index] && Array.isArray(todoList)) {
    const { time } = renderDaysInfo.renderDaysList[index]
    if (type === 'REFRESH') {
      renderDaysInfo.renderDaysList[index].todoList = todoList
    }
    if (type === 'TO') {
      const { code } = await handleChangeTime({ toTime: time, id: todoId })
      if (code === 200) {
        window.$message.success('移动成功')

        const { data } = await getTodoByDay({ time })
        renderDaysInfo.renderDaysList[index].todoList = data.todoItems
      }
      return
    }
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
