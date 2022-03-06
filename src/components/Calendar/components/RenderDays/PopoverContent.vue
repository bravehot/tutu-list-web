<template>
  <input
    ref="titleDOM"
    :value="todoContext.title"
    :class="[$style['base-input'], 'text-sm w-full px-1 placeholder-gray-400']"
    type="text"
    placeholder="今天想干点什么呀"
    @keydown="handleInputKeyDown"
    @input="handleInputChange($event, 'title')"
  />

  <section class="w-full h-full relative">
    <textarea
      ref="descriptionDOM"
      :value="todoContext.description"
      :class="[
        'text-sm w-full px-1 placeholder-gray-300',
        $style['base-input'],
        $style.description
      ]"
      type="textarea"
      placeholder="请输入描述"
      @input="handleInputChange($event, 'description')"
    >
    </textarea>
    <div v-if="todoListId && todoListId !== -1" class="absolute right-0 bottom-1 flex items-center">
      <n-button quaternary strong circle class="mr-2">
        <template #icon>
          <n-icon size="18" class="text-green-500"> <SaveOutline /> </n-icon>
        </template>
      </n-button>
      <n-button quaternary strong circle @click="handleDelete">
        <template #icon>
          <n-icon size="18" class="text-red-500">
            <Trash />
          </n-icon>
        </template>
      </n-button>
    </div>
  </section>
</template>
<script setup lang="ts">
import { reactive, ref, onMounted, defineProps, watch, defineEmits } from 'vue'
import { NButton, NIcon } from 'naive-ui'
import { Trash, SaveOutline } from '@vicons/ionicons5'

const props = defineProps<{
  todoListId?: number
  todoContext: {
    title: string
    description: string
  }
}>()
const emits = defineEmits<{
  (_event: 'change-info', _type: 'title' | 'description', _value: string): void
  (_event: 'delete'): void
}>()

const descriptionDOM = ref<HTMLTextAreaElement>()
const titleDOM = ref<HTMLInputElement>()

const todoContext = reactive<{ title: string; description: string }>({
  title: props.todoContext.title,
  description: props.todoContext.description
})

onMounted(() => {
  titleDOM?.value?.focus()
})

watch(props.todoContext, ({ title, description }, _prev) => {
  todoContext.title = title
  todoContext.description = description
})

const handleInputKeyDown = (event: KeyboardEvent) => {
  if (event.code === 'Enter') {
    event.preventDefault()
    descriptionDOM.value?.focus()
  }
}

const handleInputChange = (event: Event, type: 'title' | 'description') => {
  const target = event?.target as HTMLInputElement
  emits('change-info', type, target.value)
}

const handleDelete = () => {
  emits('delete')
}
</script>

<style scoped module>
.base-input {
  @apply border-transparent focus:border-transparent focus:ring-0 focus:outline-none;
}
.description {
  height: 200px;
  resize: none;
}
</style>
