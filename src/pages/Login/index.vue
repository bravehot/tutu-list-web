<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useMessage } from 'naive-ui'

import useSettingStore from '@/stores/useSettingStore'
import { Guard } from '@authing/native-js-ui-components'
import '@authing/native-js-ui-components/lib/index.min.css'

const settingStore = useSettingStore()
const authingContainer = ref<HTMLElement>()

const message = useMessage()
window.$message = message
onMounted(() => {
  const guard = new Guard(import.meta.env.VITE_AUTHING_ID)
  guard.on('load', () => {
    const container = document.getElementById('authing_guard_container')
    if (container) {
      authingContainer.value = container
    }
  })
  // 监听登录事件
  guard.on('login', (user) => {
    console.log(user)
    if (authingContainer.value) {
      authingContainer.value.style.display = 'none'
    }
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

watch(
  () => settingStore.isLogin,
  (isLogin) => {
    if (isLogin && authingContainer.value) {
      authingContainer.value.style.display = 'none'
    }
  }
)
</script>

<style lang="css">
#authing_guard_container {
  @apply w-screen h-screen absolute top-0 bg-white;
}
#authing_guard_container > .authing-g2-render-module {
  @apply w-full h-full flex justify-center items-center;
}
</style>
