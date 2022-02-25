import axios from 'axios'
import type { AxiosRequestConfig, AxiosResponse } from 'axios'

type ResponseType<T> = {
  code: number
  message: string
  data: T[]
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
    // eslint-disable-next-line no-param-reassign
    config.headers!.Authorization = `${token}`
  }
  return config
})

// 响应拦截
axiosInterface.interceptors.response.use((response: AxiosResponse) => {
  console.log('response: ', response)
  if (response.status === 200) {
    return response.data
  }
  return {}
})

const request = async <T>(config: AxiosRequestConfig): Promise<ResponseType<T>> => {
  const { data } = await axiosInterface.request<ResponseType<T>>(config)
  console.log('data: ', data)
  return { code: data.code, data: data.data, message: data.message }
}

export default request
