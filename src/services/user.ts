import request from './api'

const getUser = () => {
  request({
    url: '/user'
  })
}

const getUser1 = () => {
  request({
    url: '/user'
  })
}

export { getUser, getUser1 }
