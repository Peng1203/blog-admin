import { defineStore } from 'pinia'
import { useResourceApi } from '@/api'
import type { ResourceListData, ResourceData } from '@/views/resource/list'
import { useNotificationMsg } from '@/utils/notificationMsg'

const { getResourceList, deleteResourceFile } = useResourceApi()

export const useResourceStore = defineStore('resource', {
  state: () => ({
    list: <ResourceData[]>[],
  }),
  actions: {
    async getResourceList(refresh = false) {
      try {
        if (this.list.length && !refresh) return
        const { data: res } = await getResourceList<ResourceListData>()
        const { code, success, data } = res
        if (code !== 20000 || !success) return
        this.list = data
      } catch (e) {
        console.log('e', e)
      }
    },
    async deleteResource(fileName: string) {
      try {
        const { data: res } = await deleteResourceFile(fileName)
        const { data, code, success } = res
        if (code !== 20000 || !success) return
        useNotificationMsg('', data)
        const delIndex = this.list.findIndex(item => item.name === fileName)
        if (delIndex === -1) return
        this.list.splice(delIndex, 1)
      } catch (e) {
        console.log('e', e)
      }
    },
  },
})
