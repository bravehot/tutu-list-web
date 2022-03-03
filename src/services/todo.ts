import request from './api'

const saveTodoInfo = (info: API.TodoSaveRequest) => {
  return request({
    url: '/todo/addTodoItem',
    method: 'POST',
    data: info
  })
}

const getTodoByDay = (params: { time: string }) => {
  return request({
    url: '/todo/getTodoListByDay',
    method: 'GET',
    params
  })
}

const getTodoByMonth = (params: { startTime: string; endTime: string }) => {
  return request<API.TodoList[]>({
    url: '/todo/getTodoListByMonth',
    method: 'GET',
    params
  })
}

export { saveTodoInfo, getTodoByDay, getTodoByMonth }
