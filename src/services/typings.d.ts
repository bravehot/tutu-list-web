/*global API*/
declare namespace API {

  type BaseResponseType<T> = {
    code: number,
    message: string,
    data: T
  }

  type TodoSaveRequest = {
    id?: number
    title: string
    description?: string
    time: string
    type: 'EDIT' | 'ADD'
  }

  type TodoListItem = {
    id: number
    doneTime: string,
    description:string,
    title:string
    done: 0 | 1
  }

  type TodoList = {
    id: number,
    time: string
    todoItems: TodoListItem[]
  }
}

