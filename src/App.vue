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
import useGlobalStore from '@/stores/globalStore'
import { getUser } from '@/services/user'

import Message from './components/Message.vue'

const globalStore = useGlobalStore()

onMounted(async () => {
  const { hash } = window.location
  const excludePaths = ['#login']
  if (!excludePaths.includes(hash)) {
    const info = await getUser()
    globalStore.saveUserInfo(info.data)
  }
})
</script>
