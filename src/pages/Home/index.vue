<template>
  <div class="h-screen w-screen overflow-hidden bg-gray-100 relative">
    <div
      :class="[
        'rounded-full w-full bg-green-300 translate-x-2/4 origin-center -translate-y-20',
        $style['main-circle'],
        $style['clay']
      ]"
    ></div>
    <section
      class="flex justify-between absolute content max-w-screen-2xl w-11/12 h-5/6 -inset-0 m-auto"
    >
      <div :class="['bg-yellow-200 translate-y-12', $style['content-info'], $style['clay']]">
        <section
          :class="[
            $style['content'],
            'inline-block',
            'px-10',
            'py-20',
            'flex',
            'flex-col',
            'justify-around',
            'h-full'
          ]"
        >
          <p :class="[$style['tutu-title'], 'text-7xl text-white text-center']">Tutu List</p>
          <section
            :class="[
              'text-white rounded-2xl px-10 py-5 leading-loose text-lg font-medium ml-5',
              $style['tutu-description'],
              $style['clay']
            ]"
          >
            Tutu List 是一款以日历为视角的 todo
            待办应用，该应用是由互联网民工中的一名肥宅前端工程师开发，涉及 Web 端、Electron
            桌面端、Flutter 客户端、并基于 Serverless 能力构建，欢迎大家登录体验！！！
            <div class="w-4/5 mt-5 grid grid-cols-2 gap-12">
              <button
                type="button"
                :class="[
                  'bg-red-500 rounded-2xl text-lg font-medium py-3 hover:bg-red-400',
                  $style['clay-button']
                ]"
              >
                登 录
              </button>
              <button
                type="button"
                :class="[
                  'bg-purple-600  rounded-2xl font-medium text-lg py-3 hover:bg-purple-500',
                  $style['clay-button']
                ]"
              >
                下 载
              </button>
            </div>
          </section>
          <div :class="['absolute -top-20 left-0 origin-center', $style['rocket']]"></div>
        </section>
      </div>
      <section class="flex justify-center relative">
        <img src="../../static/img/main-pic-3.png" class="scale-75" />
        <div :class="['absolute bottom-0 right-0 !bg-contain', $style.roadmap]"></div>
        <div :class="['absolute bottom-0 right-5', $style['cursor-pointer-img']]"></div>
      </section>
    </section>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'HomeInfo'
})
</script>
<style scoped module>
@keyframes straightLine {
  0% {
    transform: rotate(58deg);
  }

  50% {
    transform: rotate(48deg);
  }

  100% {
    transform: rotate(58deg);
  }
}
.main-circle {
  height: 120%;
}
.content-info {
  border-radius: 30px;
  width: 480px;
  height: 90%;
}
.tutu-title {
  font-family: 'Fredoka One';
  text-shadow: 0 0.075em rgb(0 0 0 / 25%);
}
.tutu-description {
  font-family: 'SupermercadoOne-Regular';
  width: 580px;
  background-color: #58aece;
}
.clay {
  box-shadow: 8px 8px 16px 0 rgb(0 0 0 / 20%) inset, -8px -8px 16px 0 rgb(0 0 0 / 25%) inset,
    8px 8px 16px 0 rgb(255 255 255 / 20%) inset;
}

.clay-button {
  box-shadow: 4px 4px 8px 0 rgba(0, 0, 0, 0.25) inset, -8px -8px 12px 0 rgba(0, 0, 0, 0.2) inset,
    8px 8px 12px 0 hsla(0, 0%, 100%, 0.3) inset;
}

.roadmap {
  width: 200px;
  height: 200px;
  background: url('/src/static/img/calendar1.png') no-repeat content-box;
}

.cursor-pointer-img {
  width: 120px;
  height: 120px;
  top: 30%;
  background: url('../../static/img/cursor-pointer.png') content-box;
}

.rocket {
  width: 120px;
  height: 240px;
  background: url('../../static/img/rocket.png') no-repeat content-box;
  background-size: contain;
  animation: straightLine 3s infinite;
}
</style>
