import { defineStore } from 'pinia'
import User from '@/types/user'

export type GlobalStoreType = {
  userInfo: User
}

const useGlobalStore = defineStore('global', {
  state: () =>
    ({
      userInfo: {}
    } as GlobalStoreType),
  actions: {
    saveUserInfo(userInfo: User) {
      this.userInfo = userInfo
    }
  }
})

export default useGlobalStore
