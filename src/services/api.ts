import axios from 'axios'
import type { AxiosRequestConfig, AxiosResponse } from 'axios'

import router from '@/routes'

type ResponseType<T> = {
  code: number
  message: string
  data: T
}

const { MODE, VITE_STAGING_URL, VITE_DEV_URL, VITE_PRODUCTION_URL } = import.meta.env

const systemCodeMaps: Record<number, string> = {
  404: '404 Not Found',
  504: '网关错误',
  405: 'Method Not Allowed'
} as const

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
axiosInterface.interceptors.response.use(
  (response: AxiosResponse) => {
    const { status, data } = response

    // 处理 http 请求状态码
    if (status === 200) {
      const { code, message } = data
      if (+code === 403) {
        router.push('/login')
      } else if (+code !== 200) {
        window.$message.error(message)
      }
    }
    return response
  },
  ({ response }) => {
    window.$message.error(systemCodeMaps[response.status])
  }
)

const request = async <T>(config: AxiosRequestConfig): Promise<ResponseType<T>> => {
  const { data } = await axiosInterface(config)
  return data
}

export default request
