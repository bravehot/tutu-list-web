<template>
  <section
    v-for="(dayInfo, index) in renderDaysList"
    :key="`${dayInfo.year}-${dayInfo.month}-${dayInfo.day}`"
    orientation="vertical"
    group-name="day-info"
    :class="[
      'px-2 py-1 border-l border-b h-full',
      { 'bg-gray-50': dayInfo.isLastMonth || dayInfo.isNextMonth }
    ]"
    @click="handleTodoClick($event, dayInfo, index)"
  >
    <section class="h-full overflow-hidden relative click-out">
      <section :class="['flex justify-between items-center click-out', $style['day-info']]">
        <div class="text-center leading-4 cursor-default click-out">
          <span
            :class="[
              'text-sm mr-2 font-normal text-gray-700 click-out',
              {
                'inline-block bg-blue-500 rounded-full h-6 w-6 text-center leading-6 !text-white':
                  TODAY === `${dayInfo.year}-${dayInfo.month}-${dayInfo.day}`
              }
            ]"
            >{{ dayInfo.day }}</span
          >
          <span class="cName text-xs text-gray-400 align-bottom click-out">{{
            dayInfo.festivalName || dayInfo.cName
          }}</span>
        </div>
        <span
          v-if="dayInfo.isHoliday"
          :class="['text-green-400 bg-green-50 click-out', $style['day-text']]"
          >休</span
        >
        <span
          v-if="dayInfo.isAdjustRest"
          :class="['text-red-400 bg-red-50 click-out', $style['day-text']]"
          >班</span
        >
      </section>

      <section :class="[$style['todo-wrapper'], 'absolute', 'w-full']">
        <Container
          :key="`${dayInfo.year}-${dayInfo.month}-${dayInfo.day}`"
          lock-axis="x"
          class="h-full"
          orientation="vertical"
          group-name="col-items"
          :get-child-payload="getCardPayload(`${dayInfo.year}-${dayInfo.month}-${dayInfo.day}`)"
          :drop-placeholder="{
            className: 'bg-green-100 rounded-md',
            animationDuration: '300',
            showOnTop: true
          }"
          @drop="(event: any) => handleDrop(`${dayInfo.year}-${dayInfo.month}-${dayInfo.day}`, event)"
        >
          <Draggable
            v-for="(todoItem, draggableIndex) in dayInfo.todoList"
            :key="todoItem.id"
            :data-id="todoItem.id"
            :index="draggableIndex"
            :class="[
              'w-full cursor-pointer todo-item text-xs border rounded border-green-100 mb-1 text-green-500 bg-green-400 bg-opacity-50',
              { 'text-opacity-50 bg-green-200': todoItem.done }
            ]"
            @click="handleClickTodo(todoItem)"
          >
            <span
              :data-id="todoItem.id"
              :class="[
                'inline-block w-full todo-item transform scale-90',
                $style['todo-item-info']
              ]"
              >{{ todoItem.title }}</span
            >
          </Draggable>
        </Container>
      </section>
    </section>
  </section>
  <PopoverContentVue
    :visible="popoverVisible.show"
    :placement="popoverVisible.placement"
    :position="popoverPosition"
  >
    <PopoverTitle
      :time="currentClickPopover.time"
      :done="currentClickPopover.done"
      :todo-list-id="openPopoverIndex.todoId"
      @change-done="handleTodoDoneStatus"
    />
    <PopoverContent
      :todo-context="todoContext"
      :todo-list-id="openPopoverIndex.todoId"
      :content-save-btn="isContentSave"
      @change-info="handleChangeTodoContext"
      @delete="handleDeleteItem"
    />
  </PopoverContentVue>
</template>
<script setup lang="ts">
import { defineProps, shallowRef, reactive, defineEmits, onMounted, watch, ref } from 'vue'
import dayjs from 'dayjs'
/**
 * Container 包含可拖动的元素或组件，它的每一个子元素都应该被 Draggable 包裹
 * Draggable 每一个要被设置为可拖动的元素都需要被 Draggable 包裹。
 * vue3-smooth-dnd 目前无 ts 版本
 */
// @ts-ignore
import { Container, Draggable } from 'vue3-smooth-dnd'
import { saveTodoInfo, deleteTodoItem, getTodoByDay, changeTodoStatus } from '@/services/todo'
import PopoverContentVue from '@/components/PopoverContent.vue'
import { getPlacement } from '../../utils'

import type { RenderDaysType, TodoListType, PlacementType } from '../../types'

import PopoverTitle from './PopoverTitle.vue'
import PopoverContent from './PopoverContent.vue'

type PopoverPropsType = {
  renderDaysList: RenderDaysType[]
}
const props = defineProps<PopoverPropsType>()
const emits = defineEmits<{
  (
    _event: 'change-info',
    _info: {
      index: number
      todoList: TodoListType[]
      type: 'FROM' | 'TO' | 'REFRESH'
      todoId?: number
    }
  ): void
}>()

// 点击外侧的 todoList
const currentClickPopover = reactive<{ time: string; done: number }>({ time: '', done: 0 })
// 内层点击的 todo id
const openPopoverIndex = reactive({
  popoverIndex: -1,
  todoId: -1
})
// 判断是否是通过里面的 popoverContent 组件点击的保存
const isContentSave = ref<boolean>(false)

const popoverPosition = reactive<{ left: number; top: number; width: number; height: number }>({
  left: NaN,
  top: NaN,
  width: NaN,
  height: NaN
})

const popoverVisible = reactive<{ show: boolean; placement: PlacementType }>({
  show: false,
  placement: 'left-start'
})

const todoContext = reactive<{
  title: string
  description: string
  lastTitle: string
  lastDescription: string
}>({
  title: '',
  description: '',
  lastTitle: '',
  lastDescription: ''
})

const TODAY = shallowRef<string>(dayjs().format('YYYY-M-D'))

onMounted(() => {
  const func = () => {
    popoverVisible.show = false
  }
  window.addEventListener('resize', func)
  return () => {
    window.removeEventListener('resize', func)
  }
})

const getCurrentDayInfo = async (time: string) => {
  const { code, data } = await getTodoByDay({ time })
  if (code === 200) {
    const findIndex = props.renderDaysList.findIndex((item) => {
      return item.time === data.time
    })
    if (findIndex !== -1) {
      emits('change-info', {
        index: findIndex,
        todoList: data.todoItems ?? [],
        type: 'REFRESH'
      })
    }
  }
}

const handleSaveTodoInfo = async (info: API.TodoSaveRequest) => {
  const { code } = await saveTodoInfo(info)
  if (code === 200) {
    window.$message.success(info.id ? '修改成功' : '添加成功')
    // 更新当天的 todo 项
    getCurrentDayInfo(info.time)
  }
}

watch(
  () => [openPopoverIndex.todoId, currentClickPopover.time],
  ([todoId], [preTodoId, preTime]) => {
    if (todoId !== preTodoId && (preTodoId !== -1 || todoId === -1)) {
      const findTodoList = props.renderDaysList.find((renderItem) => renderItem.time === preTime)
      if (findTodoList) {
        const todo = findTodoList.todoList?.find((todoItem) => +todoItem.id === +preTodoId)
        // 切换到了 todo time 或者 切换了 todo
        if (todo && (todoId === -1 || todoId !== preTodoId)) {
          if (
            todo.title !== todoContext.lastTitle ||
            todo.description !== todoContext.lastDescription
          ) {
            // 关闭 todo time 的时候，取当前的 todoContext 的值
            const info = {
              title: currentClickPopover.time === '' ? todoContext.title : todoContext.lastTitle,
              description:
                currentClickPopover.time === ''
                  ? todoContext.description
                  : todoContext.lastDescription
            }
            handleSaveTodoInfo({
              ...info,
              id: Number(preTodoId),
              time: preTime.toString(),
              type: 'EDIT'
            })
          }
        }
      }
    }
  }
)

watch(
  () => [openPopoverIndex.todoId, currentClickPopover.time],
  ([todoId, time], [preTodoId, preTime]) => {
    if (todoId === preTodoId && preTime) {
      const info = {
        title: '',
        description: ''
      }
      if (todoId === preTodoId && time) {
        info.title = todoContext.title || todoContext.lastTitle
        info.description = todoContext.description || todoContext.lastDescription
      } else {
        info.title = todoContext.title
        info.description = todoContext.description
      }
      if (info.title) {
        handleSaveTodoInfo({ ...info, type: 'ADD', time: preTime.toString() })
      }
    }
  }
)

const handleClickTodo = (todoItemInfo: TodoListType) => {
  if (openPopoverIndex.todoId !== todoItemInfo.id) {
    todoContext.lastTitle = todoContext.title
    todoContext.lastDescription = todoContext.description

    todoContext.title = todoItemInfo.title
    todoContext.description = todoItemInfo.description
  }
  currentClickPopover.done = todoItemInfo.done
}

const handleChangeTodoContext = (type: 'title' | 'description', value: string) => {
  todoContext[type] = value
}

const handleTodoClick = (event: Event, dayInfo: RenderDaysType, index: number) => {
  event.preventDefault()
  event.stopPropagation()
  const target = event.target as HTMLElement

  const positionInfo = (element: HTMLElement) => {
    if (element) {
      const postion = element.getBoundingClientRect()
      popoverPosition.left = postion.left + postion.width
      popoverPosition.top = postion.top
      popoverPosition.width = postion.width
      popoverPosition.height = postion.height
    }
  }

  positionInfo(event.currentTarget as HTMLElement)
  // 点击空白区
  if (target.className.includes('smooth-dnd-container') || target.className.includes('click-out')) {
    // 如果点击的不是同一个 todoDay
    if (dayInfo.time !== currentClickPopover.time) {
      popoverVisible.show = true
      currentClickPopover.time = dayInfo.time || ''

      todoContext.lastTitle = todoContext.title
      todoContext.lastDescription = todoContext.description

      todoContext.title = ''
      todoContext.description = ''
    } else {
      popoverVisible.show = false
      currentClickPopover.time = ''
    }
    openPopoverIndex.todoId = -1
  } else {
    // 点击 todo 项
    const todoId = target.dataset.id || -1
    if (Number(todoId) !== Number(openPopoverIndex.todoId)) {
      openPopoverIndex.todoId = Number(todoId) || -1
      popoverVisible.show = true
      currentClickPopover.time = dayInfo.time
    } else {
      openPopoverIndex.todoId = -1
      popoverVisible.show = false

      todoContext.title = ''
      todoContext.description = ''
    }
  }
  popoverVisible.placement = getPlacement(index, props.renderDaysList)
}

const handleDrop = (time: string, dropResult: any) => {
  const { removedIndex, addedIndex, payload } = dropResult
  let itemToAdd = payload
  if (removedIndex !== null || addedIndex !== null) {
    const currentDayIndex = props.renderDaysList.findIndex(({ year, month, day }) => {
      return `${year}-${month}-${day}` === time
    })
    const currentInfo = props.renderDaysList[currentDayIndex]
    const todoList = currentInfo.todoList || []
    if (removedIndex !== null) {
      const [firstList] = todoList.splice(removedIndex, 1)
      itemToAdd = firstList
      if (Array.isArray(currentInfo.todoList)) {
        emits('change-info', {
          index: currentDayIndex,
          todoList: currentInfo.todoList,
          type: 'FROM',
          todoId: itemToAdd.id
        })
      }
    }
    if (addedIndex !== null) {
      todoList.splice(addedIndex, 0, itemToAdd)
      emits('change-info', {
        index: currentDayIndex,
        todoList: Array.isArray(todoList) ? todoList : [],
        type: 'TO',
        todoId: itemToAdd.id
      })
    }
  }
}

const getCardPayload = (time: string) => {
  return (index: number) => {
    const findInfo = props.renderDaysList.find(
      ({ year, month, day }: RenderDaysType) => `${year}-${month}-${day}` === time
    )
    return findInfo?.todoList ? findInfo.todoList[index] : {}
  }
}

const handleTodoDoneStatus = async (status: boolean, todoId: number) => {
  currentClickPopover.done = Number(status)
  const { code } = await changeTodoStatus({ id: todoId })
  if (code === 200) {
    window.$message.success('状态修改成功')
    getCurrentDayInfo(currentClickPopover.time)
    popoverVisible.show = false
  }
}

const handleDeleteItem = async () => {
  if (openPopoverIndex.todoId !== -1) {
    const { code } = await deleteTodoItem(openPopoverIndex.todoId)
    if (code === 200) {
      window.$message.success('删除成功')
      getCurrentDayInfo(currentClickPopover.time)
    }
  }
}
</script>
<style scoped module>
.day-text {
  @apply px-2 py-1 text-xs;
}

.day-info {
  height: 28px;
  align-items: center;
}

.todo-item-info {
  padding: 2px;
}
.todo-wrapper {
  max-height: calc(100% - 28px);
  height: calc(100% - 28px);
  overflow: hidden;
}
</style>
