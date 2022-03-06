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
    tabindex="-1"
    @blur="handleBlur($event)"
    @focus="handleFocus($event, dayInfo)"
    @click="handleTodoClick($event, dayInfo, index)"
  >
    <section
      class="h-full overflow-hidden relative"
      @click="handleClickDay($event, index, dayInfo)"
    >
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
        <span v-if="dayInfo.isHoliday" :class="['text-green-400 bg-green-50', $style['day-text']]"
          >休</span
        >
        <span v-if="dayInfo.isAdjustRest" :class="['text-red-400 bg-red-50', $style['day-text']]"
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
  </section>
  <PopoverContentVue
    :visible="popoverVisible.show"
    :placement="popoverVisible.placement"
    :position="popoverPosition"
  >
    <PopoverTitle
      :time="currentClickPopover"
      :todo-list-id="currentOpen.id"
      @delete="handleDeleteItem"
    />
    <PopoverContent :todo-context="todoContext" @change-info="handleChangeTodoContext" />
  </PopoverContentVue>
</template>
<script setup lang="ts">
import { defineProps, shallowRef, reactive, toRefs, defineEmits, ref, onMounted } from 'vue'
// import { NPopover } from 'naive-ui'
import dayjs from 'dayjs'
/**
 * Container 包含可拖动的元素或组件，它的每一个子元素都应该被 Draggable 包裹
 * Draggable 每一个要被设置为可拖动的元素都需要被 Draggable 包裹。
 * vue3-smooth-dnd 目前无 ts 版本
 */
// @ts-ignore
import { Container, Draggable } from 'vue3-smooth-dnd'
import { saveTodoInfo, deleteTodoItem, getTodoByDay } from '@/services/todo'
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

const currentClickPopover = ref<string>('')

const currentOpen = reactive<{ id: number; time: string }>({
  id: -1,
  time: ''
})
const openPopoverIndex = reactive({
  popoverIndex: -1,
  todoId: -1
})

const popoverPosition = reactive<{ left: number; top: number }>({
  left: NaN,
  top: NaN
})

const popoverVisible = reactive<{ show: boolean; placement: PlacementType }>({
  show: false,
  placement: 'left-start'
})

const todoContext = reactive<{ title: string; description: string }>({
  title: '',
  description: ''
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

const handleChangeTodoContext = (type: 'title' | 'description', value: string) => {
  todoContext[type] = value
}

const handleTodoClick = (event: Event, dayInfo: RenderDaysType, index: number) => {
  if (dayInfo.time !== currentClickPopover.value) {
    const postion = (event.currentTarget as HTMLElement).getBoundingClientRect()
    popoverPosition.left = postion.left
    popoverPosition.top = postion.top
    popoverVisible.show = true
    currentClickPopover.value = dayInfo.time || ''
  } else {
    popoverVisible.show = false
    currentClickPopover.value = ''
  }
  popoverVisible.placement = getPlacement(index, props.renderDaysList)
}

const handleBlur = (event: FocusEvent) => {
  event.stopPropagation()

  // const postion = (event.target as HTMLElement).getBoundingClientRect()
  // popoverPosition.left = postion.left
  // popoverPosition.top = postion.top
  // popoverVisible.show = true
}

const handleFocus = (event: FocusEvent, dayInfo: RenderDaysType) => {
  console.log('dayInfo: ', dayInfo)
  event.stopPropagation()
  // if (dayInfo.id !== currentOpen.id) {
  // } else {
  //   popoverVisible.show = false
  // }
}

const handleClickDay = (event: Event, index: number, dayInfo: RenderDaysType) => {
  const target = event.target as HTMLElement
  const todoId = target.dataset.id

  currentOpen.id = Number(todoId) ?? -1
  currentOpen.time = dayInfo.time

  openPopoverIndex.popoverIndex = index
  openPopoverIndex.todoId = Number(todoId)

  // open the parent element or todo element
  if (target?.className.includes('todo-item')) {
    const todoList = props.renderDaysList[index]?.todoList || []
    const findTodo = todoList.find((todoItem) => todoItem.id === Number(todoId))
    const { title = '', description = '' } = findTodo || {}

    todoContext.description = description
    todoContext.title = title
  } else {
    todoContext.description = ''
    todoContext.title = ''
  }
}

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
    window.$message.success('添加成功')
    // 更新当天的 todo 项
    getCurrentDayInfo(info.time)
  }
}

const handlePopoverShow = (visible: boolean, time: string) => {
  if (!visible) {
    const { popoverIndex, todoId } = toRefs(openPopoverIndex)
    // 查看 或 编辑
    if (!Number.isNaN(todoId.value)) {
      const { todoList = [], time: renderTime } = props.renderDaysList[popoverIndex.value]
      const findTodo = todoList.find((todoItem) => todoItem.id === Number(todoId.value))
      const { title = '', description = '' } = findTodo || {}
      if (title !== todoContext.title || description !== todoContext.description) {
        handleSaveTodoInfo({
          id: todoId.value,
          time: renderTime,
          title: todoContext.title,
          description: todoContext.description,
          type: 'EDIT'
        })
      }
    } else if (todoContext.title || todoContext.description) {
      // 新增
      handleSaveTodoInfo({
        title: todoContext.title,
        description: todoContext.description,
        time,
        type: 'ADD'
      })
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

const handleDeleteItem = async () => {
  if (currentOpen.id !== -1) {
    const { code } = await deleteTodoItem(currentOpen.id)
    if (code === 200) {
      window.$message.success('删除成功')
      getCurrentDayInfo(currentOpen.time)
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
