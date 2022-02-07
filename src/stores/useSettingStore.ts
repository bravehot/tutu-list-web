import { defineStore } from 'pinia'

export type SettingStoreType = {
  weekStart: 'startMonday' | 'startSunday' // 标识周开始的时间
  weekNormal: boolean // 星期一还是周一叫法，默认是星期一
  weekList: string[] // 日历中展示星期的信息
}

const useSettingStore = defineStore('setting', {
  state: () =>
    ({
      weekStart: 'startMonday',
      weekNormal: true,
      weekList: []
    } as SettingStoreType)
})

export default useSettingStore
