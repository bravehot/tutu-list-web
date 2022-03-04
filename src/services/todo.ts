import request from './api'

// 保存 todo 信息
const saveTodoInfo = (info: API.TodoSaveRequest) => {
  return request({
    url: '/todo/addTodoItem',
    method: 'POST',
    data: info
  })
}

// 获取当天的 todo 项
const getTodoByDay = (params: { time: string }) => {
  return request<API.TodoList>({
    url: '/todo/getTodoListByDay',
    method: 'GET',
    params
  })
}

// 获取开始到结束日期的 todo 项
const getTodoByMonth = (params: { startTime: string; endTime: string }) => {
  return request<API.TodoList[]>({
    url: '/todo/getTodoListByMonth',
    method: 'GET',
    params
  })
}

// 删除当前 todo 项
const deleteTodoItem = (id: number) => {
  return request<API.BaseResponseType<any>>({
    url: '/todo/deleteTodoItem',
    method: 'DELETE',
    data: { id }
  })
}

export { saveTodoInfo, getTodoByDay, getTodoByMonth, deleteTodoItem }
