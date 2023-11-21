import { MenuData } from '@/views/auth/menu';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useMenuInfo = defineStore('menuInfo', {
  state: () => ({
    menuList: ref<MenuData[]>([]),
  }),
  actions: {
    async getMenuData(isUpdate?: boolean) {
      if (!isUpdate && this.menuList.length) return;
    },
  },
});
