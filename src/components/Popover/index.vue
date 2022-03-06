<template>
  <section ref="triggerContainer" @click="handleClick">
    <slot name="trigger" />
  </section>

  <teleport to="body">
    <section :style="containerStyle" class="absolute left-0 right-0 top-0">
      <slot v-if="show" />
    </section>
  </teleport>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue'

// const styles = computed(() => {})
const triggerContainer = ref<HTMLElement>()
const show = ref<boolean>(false)
const position = reactive<{
  top: number
  left: number
}>({ top: NaN, left: NaN })

const containerStyle = computed(() => {
  return {
    transform: `translateX(${position.left}px) translateY(${position.top}px)`
  }
})
const handleClick = (event: Event) => {
  event.stopPropagation()
  const triggerPosition = triggerContainer.value?.getBoundingClientRect()
  console.log('triggerPosition: ', triggerPosition)
  const { top, width, height, right } = triggerPosition || {}
  if (top && right && width && height) {
    position.left = right - width
    position.top = top
    show.value = !show.value
    console.log('position: ', position)
  }
}
</script>
