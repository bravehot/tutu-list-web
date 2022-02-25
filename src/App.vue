<template>
  <section class="h-screen w-screen overflow-hidden">
    <NConfigProvider :locale="zhCN" :date-locale="dateZhCN">
      <n-message-provider>
        <router-view />
      </n-message-provider>
    </NConfigProvider>
  </section>
</template>
<script setup lang="ts">
import { zhCN, dateZhCN, NConfigProvider, NMessageProvider, useMessage } from 'naive-ui'

try {
  const message = useMessage()
  if (window.$message) {
    window.$message = message
  }
  // eslint-disable-next-line no-empty
} catch (_error) {}
</script>
