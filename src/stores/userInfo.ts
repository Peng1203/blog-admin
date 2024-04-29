import { defineStore } from 'pinia';
import { Local, Session } from '@/utils/storage';
import { useAuthApi } from '@/api/auth';
import { ElMessage } from 'element-plus';
import { UserInfosState } from '@/types/pinia';
import { MenuData } from '@/views/auth/menu';
import { UserData } from '@/views/user/user';

/**
 * 用户信息
 * @methods setUserInfos 设置用户信息
 */

const { logout, getUserMenu, getUserPermission } = useAuthApi();

export const useUserInfo = defineStore('userInfo', {
  state: (): UserInfosState => ({
    userInfos: <UserData>{},
    menus: <MenuData[]>[],
    permissions: <string[]>[],
  }),
  actions: {
    // 更新用户信息
    updataUserInfo() {},
    /** 设置用户信息 */
    async setUserInfos(data: any) {
      // 存储用户信息到浏览器缓存
      this.userInfos = data;
    },
    /** 获取用户菜单 */
    async getMenus() {
      try {
        const uId = this.userInfos.id || Local.getUserInfo().id;
        const { data: res } = await getUserMenu<MenuData[]>(uId);
        const { code, success, data } = res;
        if (code !== 20000 || !success) return;
        this.menus = data;
      } catch (error) {
        console.log('error ------', error);
      }
    },
    /** 获取用户权限标识 */
    async getPermissions() {
      const uId = this.userInfos.id || Local.getUserInfo().id;
      const { data: res } = await getUserPermission<string[]>(uId);
      const { code, success, data } = res;
      if (code !== 20000 || !success) return;
      this.permissions = data;
    },
    /** 用户退出登录 */
    async userLogout() {
      try {
        const params = {
          id: this.userInfos.id,
          userName: this.userInfos.userName,
          // token: this.userInfos.token
        };
        const { data: res } = await logout<string>(params);
        const { code, message, success } = res;
        if (code !== 20000 && !success) return;
        ElMessage.success(message);
        setTimeout(() => {
          Session.clear();
          window.location.reload();
        }, 500);
      } catch (e) {
        console.log('e ------', e);
      }
    },
  },
});
