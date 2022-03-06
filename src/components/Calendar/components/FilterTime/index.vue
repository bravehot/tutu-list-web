<template>
  <section :class="['flex items-center justify-between filter-box', $style['filter-time-box']]">
    <section class="flex items-center">
      <Icon
        size="20"
        class="hover:text-green-400 mr-4 cursor-pointer text-gray-500"
        @click="handleMonth('LAST')"
      >
        <ArrowUndoOutline />
      </Icon>
      <n-date-picker
        :value="currentMonth"
        type="month"
        format="yyyy年MM月"
        input-readonly
        :on-update:value="updateValue"
      />
      <Icon
        size="20"
        class="hover:text-green-400 ml-4 cursor-pointer text-gray-500"
        @click="handleMonth('NEXT')"
      >
        <ArrowRedoOutline />
      </Icon>
    </section>
    <PopoverContent>
      <template #trigger> <n-button>button info</n-button> </template>
      渲染到 body
    </PopoverContent>
  </section>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

import dayjs from 'dayjs'
import { NDatePicker, NButton } from 'naive-ui'

import { Icon } from '@vicons/utils'
import { ArrowUndoOutline, ArrowRedoOutline } from '@vicons/ionicons5'

import PopoverContent from '../../../Popover/index.vue'

const props = defineProps<{
  currentMonth: number
}>()

const emit = defineEmits<{
  (_event: 'change', _month: number): void
}>()

const updateValue = (time: number | null) => {
  emit('change', time || dayjs().valueOf())
}

const handleMonth = (type: 'LAST' | 'NEXT') => {
  const month =
    type === 'LAST'
      ? dayjs(props.currentMonth).subtract(1, 'month')
      : dayjs(props.currentMonth).add(1, 'month')

  emit('change', month.valueOf())
}
</script>

<style scoped module>
.filter-time-box {
  height: 55px;
}
</style>
