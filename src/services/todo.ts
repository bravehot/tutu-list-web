import request from './api'

const getTodoList = () => {
  request({
    baseURL: '/todo'
  })
}

const getTodoList1 = () => {
  request({
    baseURL: '/todo'
  })
}

export { getTodoList, getTodoList1 }
