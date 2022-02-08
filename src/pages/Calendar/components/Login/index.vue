<template>
  <section :class="$style['login-wrapper']" />
  <section :class="$style['login-form']">
    <n-tabs
      :default-value="loginType"
      size="large"
      justify-content="space-evenly"
      :on-update:value="handleTabsChange"
    >
      <n-tab-pane name="password" tab="账号密码登录">
        <LoginForm :tabs-type="loginType" />
      </n-tab-pane>
      <n-tab-pane name="phone" tab="验证码登录">
        <LoginForm :tabs-type="loginType" />
      </n-tab-pane>
    </n-tabs>
  </section>
</template>

<script setup lang="ts">
import { NTabs, NTabPane } from 'naive-ui'
import { ref } from 'vue'
import LoginForm from './LoginForm.vue'

type TabsType = 'phone' | 'password'

const loginType = ref<TabsType>('password')

const handleTabsChange = (tabInfo: TabsType) => {
  loginType.value = tabInfo
}
</script>

<style scoped module>
.login-wrapper {
  @apply w-screen h-screen fixed left-0 top-0 filter grayscale-50 blur;
  background: url('/src/static/img/calendar-bg.png') no-repeat content-box;
}

.login-form {
  @apply absolute left-0 right-0 top-0 bottom-0 my-auto mx-auto bg-white shadow-2xl px-4 py-8 rounded-md border;
  width: 400px;
  height: 330px;
}
</style>
