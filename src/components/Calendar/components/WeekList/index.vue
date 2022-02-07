<template>
  <section class="grid grid-cols-7 border-t border-gray-300 border-solid">
    <n-text
      v-for="weekName in weekList"
      :key="weekName"
      class="border-l px-1 py-1 text-xs cursor-default"
      depth="3"
      >{{ weekName }}</n-text
    >
  </section>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { NText } from 'naive-ui'
import useSettingStore from '@/stores/useSettingStore'
import { WEEK_INFO } from '@/constant/index'

const settingStore = useSettingStore()
const { weekNormal, weekStart } = storeToRefs(settingStore)

const weekList = computed(() => {
  let infoList: string[] = []
  if (weekStart.value === 'startSunday') {
    const currentWeekList = Array.from(WEEK_INFO)
    infoList = [...currentWeekList.splice(-1, 1), ...currentWeekList]
  } else {
    infoList = Array.from(WEEK_INFO)
  }
  settingStore.$patch({
    weekList: infoList
  })

  if (weekNormal.value) {
    return infoList.map((info) => `星期${info}`)
  }
  return infoList.map((info) => `周${info}`)
})
</script>

<style scoped module></style>
