<template>
  <NConfigProvider :locale="zhCN" :date-locale="dateZhCN">
    <section class="h-screen w-screen overflow-hidden">
      <router-view></router-view>
    </section>
  </NConfigProvider>
</template>
<script setup lang="ts">
import { zhCN, dateZhCN, NConfigProvider } from 'naive-ui'
</script>
