import { defineStore } from 'pinia'
import { useResourceApi } from '@/api'
import type { ResourceListData, ResourceData } from '@/views/resource/list'

const { getResourceList } = useResourceApi()

export const useResourceStore = defineStore('resource', {
  state: () => ({
    list: <ResourceData[]>[],
  }),
  actions: {
    async getResourceList() {
      try {
        if (this.list.length) return
        const { data: res } = await getResourceList<ResourceListData>()
        const { code, success, data } = res
        if (code !== 20000 || !success) return
        this.list = data
      } catch (e) {
        console.log('e', e)
      }
    },
  },
})
