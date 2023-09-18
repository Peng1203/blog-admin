import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useRoleApi } from '@/api';

const { getRole } = useRoleApi();

export const useRolesInfo = defineStore('rolesInfo', {
  state: () => ({
    // 角色数据列表
    roleList: ref<RoleDate[]>([]),
    // 角色下拉数据
    roleOption: ref<OptionItem[]>([]),
  }),
  actions: {
    async getRoleData(isUpdate?: boolean) {
      try {
        const {} = await getRole({
          page: 1,
          pageSize: 999,
          queryStr: '',
          column: '',
          order: '',
        });
      } catch (error) {
        throw error;
      }
    },
  },
});
