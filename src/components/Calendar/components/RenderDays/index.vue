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

import { MOCK_INFO } from '@/mock/index'
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
  const renderDays = getRenderDaysConfig(+year, +month, settingStore.weekStart).map(
    (renderItem, index) => {
      return {
        ...renderItem,
        todoList: MOCK_INFO[index] || []
      }
    }
  )
  const res = await Promise.resolve(renderDays)
  renderDaysInfo.renderDaysList = res
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
.day-border {
  @apply border-solid border-gray-300;
}
.day-text {
  @apply px-2 py-1 text-xs;
}
</style>
