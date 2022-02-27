import type User from '@/types/user'

import request from './api'

const getUser = () => {
  return request<User>({
    url: '/user'
  })
}

const getUser1 = () => {
  request({
    url: '/user'
  })
}

export { getUser, getUser1 }
