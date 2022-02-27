import axios from 'axios'
import type { AxiosRequestConfig, AxiosResponse } from 'axios'

import router from '@/routes'

type ResponseType<T> = {
  code: number
  message: string
  data: T
}
const { MODE, VITE_STAGING_URL, VITE_DEV_URL, VITE_PRODUCTION_URL } = import.meta.env

let BASE_URL: string = ''
switch (MODE) {
  case 'staging':
    BASE_URL = VITE_STAGING_URL
    break
  case 'dev':
    BASE_URL = VITE_DEV_URL
    break
  case 'production':
    BASE_URL = VITE_PRODUCTION_URL
    break
  default:
    break
}

const errorMessage = (message: string) => {
  // $message 会有一定程度的延迟挂载，如果没有挂载上，使用console.error做降级处理
  if (window.$message) {
    window.$message.error(message)
  } else {
    // eslint-disable-next-line no-console
    console.error(message)
  }
}

const axiosInterface = axios.create({
  baseURL: `${BASE_URL}/api`,
  timeout: 10000,
  headers: {
    'content-type': 'application/json'
  }
})

// 请求拦截
axiosInterface.interceptors.request.use((config: AxiosRequestConfig) => {
  const token = localStorage.getItem('_authing_token')
  if (token) {
    const { headers } = config
    headers!.Authorization = `${token}`
  }
  return config
})

// 响应拦截
axiosInterface.interceptors.response.use((response: AxiosResponse) => {
  const { status, data } = response

  // 处理 http 请求状态码
  if (status === 200) {
    const { code } = data
    // const settingsStore = useSettingStore()
    switch (code) {
      case 403:
        router.push('/login')
        break
      case code !== 200:
        errorMessage(data.message)
        break
      default:
        break
    }
  }
  return response
})

const request = async <T = any>(config: AxiosRequestConfig): Promise<ResponseType<T>> => {
  const { data } = await axiosInterface(config)
  return data
}

export default request
