<template>
  <n-form ref="loginFormRef" :model="loginInfo" :rules="rules">
    <n-form-item-row label="手机号" path="phone">
      <n-input-number
        v-model:value="loginInfo.phone"
        placeholder="请输入手机号"
        :show-button="false"
        class="w-full"
      />
    </n-form-item-row>

    <n-form-item-row v-if="props.tabsType === 'password'" label="密码" path="password">
      <n-input v-model:value="loginInfo.password" type="password" />
    </n-form-item-row>

    <n-form-item-row v-else label="验证码" path="validationCode">
      <n-input
        v-model:value="loginInfo.validationCode"
        :style="{ width: '270px' }"
        :show-button="false"
        placeholder="请输入验证码"
      />
      <n-button
        :style="{ width: '100px' }"
        class="ml-2"
        :disabled="verificationText !== 60"
        @click="getVerificationCode"
      >
        {{ verificationText === 60 ? '获取验证码' : `剩余${verificationText}秒` }}
      </n-button>
    </n-form-item-row>
  </n-form>
  <n-button type="primary" block secondary strong @click="handleLogin">登录</n-button>
</template>

<script setup lang="ts">
import { reactive, ref, defineProps, onUnmounted } from 'vue'
import { NForm, NInputNumber, NButton, NInput, NFormItemRow } from 'naive-ui'

const rules = {
  phone: {
    key: 'phone',
    required: true,
    trigger: ['input', 'blur'],
    validator: (_rule: any, value: string) => {
      if (!value) {
        return new Error('请输入手机号')
      }
      if (/^1(3\d|4[5-9]|5[0-35-9]|6[2567]|7[0-8]|8\d|9[0-35-9])\d{8}$/.test(value)) {
        return true
      }
      return new Error('手机号格式不正确')
    }
  },
  password: {
    required: true,
    message: '请输入密码',
    trigger: ['input', 'blur']
  },
  validationCode: [
    {
      required: true,
      message: '请输入验证码',
      trigger: ['input', 'blur']
    },
    {
      trigger: ['blur'],
      min: 6,
      max: 6,
      message: '验证码长度为6位'
    }
  ]
}
type LoginFormInfo = {
  phone?: number
  password?: string
  validationCode?: string
}

const props = defineProps<{ tabsType: 'phone' | 'password' }>()

const verificationText = ref<number>(60)
const timer = ref<number>()
const loginFormRef = ref()

const loginInfo = reactive<LoginFormInfo>({
  phone: undefined,
  password: undefined,
  validationCode: undefined
})

onUnmounted(() => {
  clearInterval(timer.value)
})
const handleLogin = () => {
  loginFormRef.value?.validate((_errors: any) => {
    // if (!errors) {
    // }
  })
}
const getVerificationCode = () => {
  loginFormRef.value?.validate(
    (errors: any) => {
      if (!errors) {
        timer.value = setInterval(() => {
          if (verificationText.value === 1) {
            verificationText.value = 60
            clearInterval(timer.value)
          } else {
            verificationText.value -= 1
          }
        }, 1000)
      }
    },
    (rule: any) => {
      return rule?.key === 'phone'
    }
  )
}
</script>
