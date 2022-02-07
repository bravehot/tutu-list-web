<template>
  <FilterTime :current-month="currentMonth" @change="handleMonth" />
  <WeekList />
  <RenderDays :current-month="currentMonth" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import dayjs from 'dayjs'

import FilterTime from './components/FilterTime/index.vue'
import RenderDays from './components/RenderDays/index.vue'
import WeekList from './components/WeekList/index.vue'

const currentMonth = ref<number>(dayjs().valueOf())
const handleMonth = (date: number) => {
  currentMonth.value = date
}
</script>
