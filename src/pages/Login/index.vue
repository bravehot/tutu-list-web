<template>
  <section id="tutu-app-login" />
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const authingContainer = ref<HTMLElement>()

onMounted(() => {
  if (window.AuthingNativeJsUIComponents) {
    const guard = new window.AuthingNativeJsUIComponents.Guard(import.meta.env.VITE_AUTHING_ID)
    guard.on('load', () => {
      const tutuLoginContainer = document.getElementById('tutu-app-login')
      const container = document.getElementById('authing_guard_container')
      if (container) {
        document.body.removeChild(container)
        authingContainer.value = container
        tutuLoginContainer?.appendChild(container)
      } else {
        window.$message.error('authing_guard_container loading failed')
      }
    })
    guard.on('load-error', () => {
      window.$message.error('Error loading authing')
    })
    // 监听登录成功事件
    guard.on('login', (user: any) => {
      const { token, id, tokenExpiredAt } = user || {}
      if (authingContainer.value) {
        window.localStorage.setItem('_authing_token', token || '')
        window.localStorage.setItem('_auth_user_id', id)
        window.localStorage.setItem('_auth_expiredAt', tokenExpiredAt || '')
        // document.cookie = `csrfToken=${token}` || ''
        router.push('/calendar')
      }
    })

    // 监听登录失败事件
    guard.on('login-error', (error: any) => {
      // eslint-disable-next-line no-console
      console.log(error, 'login-error')
    })

    // 监听注册成功事件
    guard.on('register', (user: any) => {
      // eslint-disable-next-line no-console
      console.log(user, 'register')
    })

    // 监听注册失败事件
    guard.on('register-error', (error: any) => {
      // eslint-disable-next-line no-console
      console.log(error, 'register-error')
    })
  } else {
    window.$message.error('Authing 组件加载失败')
  }
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
