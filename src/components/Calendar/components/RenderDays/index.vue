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

import type { RenderDaysType } from '../../types'
import { getRenderDaysConfig } from '../../utils'

const props = defineProps<{
  currentMonth: number
}>()

const settingStore = useSettingStore()

const renderDaysInfo = reactive<{
  renderDaysList: RenderDaysType[]
}>({ renderDaysList: [] })

watchEffect(async () => {
  const [year, month] = dayjs(props.currentMonth).format('YYYY-MM').split('-')

  // 拿到当前月的农历/休班信息
  const renderDaysConfig = getRenderDaysConfig(+year, +month, settingStore.weekStart)
  if (renderDaysConfig.length) {
    const { year: startYear, month: startMonth, day: startDay } = renderDaysConfig[0]
    const {
      year: endYear,
      month: endMonth,
      day: endDay
    } = renderDaysConfig[renderDaysConfig.length - 1]
    const { data } = await getTodoByMonth({
      startTime: `${startYear}-${startMonth}-${startDay}`,
      endTime: `${endYear}-${endMonth}-${endDay}`
    })
    const renderDayResult = renderDaysConfig.map((renderDayItem) => {
      const { year: renderYear, month: renderMonth, day: renderDay } = renderDayItem
      const findTodoList = data.find(
        (item) => item.time === `${renderYear}-${renderMonth}-${renderDay}`
      )
      return {
        ...renderDayItem,
        todoList: findTodoList?.todoItems
      }
    })
    renderDaysInfo.renderDaysList = renderDayResult
  } else {
    window.$message.error('月信息加载失败')
  }
})

const changeRenderDaysInfo = (index: number, todoList: Pick<RenderDaysType, 'todoList'>) => {
  if (renderDaysInfo.renderDaysList[index]) {
    renderDaysInfo.renderDaysList[index].todoList = Array.isArray(todoList) ? todoList : []
  }
}
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
