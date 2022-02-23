<template>
  <NConfigProvider :locale="zhCN" :date-locale="dateZhCN">
    <section class="h-screen w-screen overflow-hidden">
      <router-view></router-view>
    </section>
  </NConfigProvider>
</template>
<script setup lang="ts">
import { zhCN, dateZhCN, NConfigProvider } from 'naive-ui'
import { onMounted } from 'vue'
import { Guard } from '@authing/native-js-ui-components'
import '@authing/native-js-ui-components/lib/index.min.css'

onMounted(() => {
  const guard = new Guard(import.meta.env.VITE_AUTHING_ID)
  guard.show()

  // 监听登录事件
  guard.on('login', (user) => {
    console.log(user)
  })

  // 监听登录失败事件
  guard.on('login-error', (error) => {
    console.log(error, 'login-error')
  })

  // 监听注册成功事件
  guard.on('register', (user) => {
    console.log(user, 'register')
  })

  // 监听注册失败事件
  guard.on('register-error', (error) => {
    console.log(error, 'register-error')
  })
})
</script>

<style lang="css">
#authing_guard_container {
  @apply w-screen h-screen absolute top-0 bg-white;
}
#authing_guard_container > .authing-g2-render-module {
  @apply w-full h-full flex justify-center items-center;
}
</style>
