import { ref } from 'vue'
import { defineStore } from 'pinia'
import { usePermissionApi } from '@/api'
import { PermissionData, PermissionListData } from '@/views/auth/authPermission'

const { getPermissions } = usePermissionApi()

export const usePermissionInfo = defineStore('permissionInfo', {
  state: () => ({
    permissionList: ref<PermissionData[]>([]),
  }),
  actions: {
    async getPermissionData(isUpdate?: boolean) {
      if (!isUpdate && this.permissionList.length) return
      const { data: res } = await getPermissions<PermissionListData>({
        page: 1,
        pageSize: 9999,
        queryStr: '',
        column: '',
        order: '',
      })
      const { code, success, data } = res
      if (code !== 20000 || !success) return
      this.permissionList = data.list
    },
  },
})
