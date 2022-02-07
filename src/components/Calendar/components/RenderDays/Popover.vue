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
    @click="handleClickDay($event, index)"
  >
    <n-popover
      :style="{ width: '300px' }"
      trigger="click"
      :placement="getPlacement(index, renderDaysList)"
      :on-update:show="handlePopoverShow"
    >
      <template #trigger>
        <section class="h-full overflow-hidden relative">
          <section :class="['flex justify-between items-center', $style['day-info']]">
            <div class="text-center leading-4 cursor-default">
              <span
                :class="[
                  'text-sm mr-2 font-normal text-gray-700',
                  {
                    'inline-block bg-blue-500 rounded-full h-6 w-6 text-center leading-6 !text-white':
                      TODAY === `${dayInfo.year}-${dayInfo.month}-${dayInfo.day}`
                  }
                ]"
                >{{ dayInfo.day }}</span
              >
              <span class="cName text-xs text-gray-400 align-bottom">{{
                dayInfo.festivalName || dayInfo.cName
              }}</span>
            </div>
            <span
              v-if="dayInfo.isHoliday"
              :class="['text-green-400 bg-green-50', $style['day-text']]"
              >休</span
            >
            <span
              v-if="dayInfo.isAdjustRest"
              :class="['text-red-400 bg-red-50', $style['day-text']]"
              >班</span
            >
          </section>

          <section :class="[$style['todo-wrapper'], 'absolute', 'w-full']">
            <Container
              :key="`${dayInfo.year}-${dayInfo.month}-${dayInfo.day}`"
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
                  'w-full cursor-pointer todo-item text-xs border rounded border-green-100 mb-1 text-green-500 bg-green-400 bg-opacity-50'
                ]"
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
      </template>
      <PopoverTitle :time="`${dayInfo.year}-${dayInfo.month}-${dayInfo.day}`" />
      <PopoverContent :todo-context="todoContext" @change-info="handleChangeTodoContext" />
    </n-popover>
  </section>
</template>
<script setup lang="ts">
import { defineProps, shallowRef, reactive, toRefs, defineEmits } from 'vue'
import { NPopover } from 'naive-ui'
import dayjs from 'dayjs'
/**
 * Container 包含可拖动的元素或组件，它的每一个子元素都应该被 Draggable 包裹
 * Draggable 每一个要被设置为可拖动的元素都需要被 Draggable 包裹。
 */
// @ts-ignore
import { Container, Draggable } from 'vue3-smooth-dnd'
import type { RenderDaysType } from '../../types'
import { getPlacement } from '../../utils'

import PopoverTitle from './PopoverTitle.vue'
import PopoverContent from './PopoverContent.vue'

type PopoverPropsType = {
  renderDaysList: RenderDaysType[]
}

type TodoListType = Pick<RenderDaysType, 'todoList'>

const props = defineProps<PopoverPropsType>()
const emit = defineEmits<{
  (_event: 'change-info', _index: number, _todoList: TodoListType): void
}>()

const openPopoverIndex = reactive({
  popoverIndex: -1,
  todoId: -1
})

const TODAY = shallowRef<string>(dayjs().format('YYYY-M-D'))
const todoContext = reactive<{ title: string; content: string }>({
  title: '',
  content: ''
})

const handleChangeTodoContext = (type: 'title' | 'content', value: string) => {
  todoContext[type] = value
}

const handleClickDay = (event: MouseEvent, index: number) => {
  const target = event.target as HTMLElement
  const todoId = target.dataset.id

  openPopoverIndex.popoverIndex = index
  openPopoverIndex.todoId = Number(todoId)

  // open the parent element or todo element
  if (target?.className.includes('todo-item')) {
    const todoList = props.renderDaysList[index]?.todoList || []
    const findTodo = todoList.find((todoItem) => todoItem.id === Number(todoId))
    const { title = '', description = '' } = findTodo || {}

    todoContext.content = description
    todoContext.title = title
  } else {
    todoContext.content = ''
    todoContext.title = ''
  }
}

const handlePopoverShow = (visible: boolean) => {
  if (!visible) {
    const { popoverIndex, todoId } = toRefs(openPopoverIndex)
    // check or edit
    if (!Number.isNaN(todoId.value)) {
      const { todoList = [], year, month, day } = props.renderDaysList[popoverIndex.value]
      const findTodo = todoList.find((todoItem) => todoItem.id === Number(todoId.value))
      const { title = '', description = '' } = findTodo || {}
      // check the info has changed
      if (title !== todoContext.title || description !== todoContext.content) {
        const requestInfo = {
          id: todoId.value,
          time: `${year}-${month}-${day}`,
          title: todoContext.title,
          content: todoContext.content
        }
        console.log('requestInfo: ', requestInfo)
      }
    }
  }
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
      emit('change-info', currentDayIndex, todoList as TodoListType)
    }
    if (addedIndex !== null) {
      todoList.splice(addedIndex, 0, itemToAdd)
      emit('change-info', currentDayIndex, todoList as TodoListType)
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
