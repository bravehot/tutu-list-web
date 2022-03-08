<template>
  <section class="h-screen w-screen overflow-hidden">
    <NConfigProvider :locale="zhCN" :date-locale="dateZhCN">
      <n-message-provider>
        <router-view />
        <Message />
      </n-message-provider>
    </NConfigProvider>
  </section>
</template>
<script setup lang="ts">
import { zhCN, dateZhCN, NConfigProvider, NMessageProvider } from 'naive-ui'
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import useGlobalStore from '@/stores/globalStore'
import { getUser } from '@/services/user'

import Message from './components/Message.vue'

const globalStore = useGlobalStore()
const route = useRoute()

onMounted(async () => {
  const excludePaths = ['Login', 'Home']
  if (route.name && !excludePaths.includes(route.name.toString())) {
    const info = await getUser()
    globalStore.saveUserInfo(info.data)
  }
})
</script>
