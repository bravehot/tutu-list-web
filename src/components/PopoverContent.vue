<template>
  <teleport to="body">
    <transition name="fade" :duration="150">
      <section
        v-if="visible"
        ref="popoverContainer"
        :style="containerStyle"
        class="popover-container absolute p-2 left-0 right-0 top-0 bg-white shadow-md rounded-md border border-gray-200 border-solid z-10"
      >
        <div :class="arrowClass" :style="arrowStyle"></div>
        <slot />
      </section>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import { defineProps, ref, computed } from 'vue'
import type { PlacementType } from './Calendar/types'

const props = defineProps<{
  visible: boolean
  placement: PlacementType
  position: {
    left: number
    top: number
    width: number
    height: number
  }
}>()

const popoverContainer = ref<HTMLElement>()

const containerStyle = computed(() => {
  let transform = ''
  let { left, top } = props.position
  const { width } = props.position
  left += 8
  switch (props.placement) {
    case 'right-start':
      transform = `translateX(${left}px) translateY(${top}px)`
      break
    case 'left-start':
      left -= width + 16
      transform = `translateX(${left}px) translateY(${top}px) translateX(-100%)`
      break
    case 'top-start':
      left -= width
      transform = `translateX(${left}px) translateY(${top}px) translateY(-100%)`
      break
    case 'top':
    case 'right-end':
      left -= width
      top -= 8
      transform = `translateX(${left}px) translateY(${top}px) translateY(-100%)`
      break
    case 'top-end':
      left -= width
      transform = `translateX(${left + width - 16}px) translateY(${
        top - 8
      }px) translateX(-100%) translateY(-100%)`
      break
    default:
      break
  }
  return {
    width: '300px',
    transform,
    transition: 'transform 0.15s ease'
  }
})

const arrowClass = computed(() => {
  const { placement } = props
  const baseClass = 'absolute rotate-45 border-gray-200 border-solid z-0 bg-white'
  if (placement.startsWith('left')) {
    return `${baseClass} border-r border-t`
  }
  if (placement.startsWith('top')) {
    return `${baseClass} border-r border-b`
  }

  return `${baseClass} border-l border-b`
})

const arrowStyle = computed(() => {
  const { placement } = props
  const baseStyle = {
    width: '14px',
    height: '14px'
  }
  if (placement.startsWith('left')) {
    return {
      ...baseStyle,
      top: '30px',
      right: '-8px'
    }
  }
  if (placement.startsWith('top')) {
    if (placement === 'top-end') {
      return { ...baseStyle, bottom: '-8px', right: '16px' }
    }
    return { ...baseStyle, bottom: '-8px', left: '16px' }
  }

  return { width: '14px', height: '14px', left: '-8px', top: '30px' }
})
</script>

<style lang="css" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

<style lang="css"></style>
