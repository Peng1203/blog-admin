import { defineStore } from 'pinia';
import { Local, Session } from '@/utils/storage';
import { useLoginApi } from '@/api/login';
import { ElMessage } from 'element-plus';
import { UserInfosState } from '@/types/pinia';
import { MenuData } from '@/views/auth/menu';

/**
 * 用户信息
 * @methods setUserInfos 设置用户信息
 */

const { logout, getUserMenu } = useLoginApi();

export const useUserInfo = defineStore('userInfo', {
  state: (): UserInfosState => ({
    userInfos: {
      id: 0,
      userName: '',
      nickName: '',
      email: '',
      userEnabled: 0,
      userAvatar: '',
      createTime: '',
      updateTime: '',
      roles: [],
    },
    menus: <MenuData[]>[],
    requestMenuNum: 0,
  }),
  actions: {
    // 更新用户信息
    updataUserInfo() {},
    // 设置 用户信息
    async setUserInfos(data: any) {
      // 存储用户信息到浏览器缓存
      this.userInfos = data;
    },
    // 获取用户菜单
    async getMenus() {
      try {
        this.requestMenuNum++;
        if (this.requestMenuNum > 1) return;
        const uId = this.userInfos.id || Local.getUserInfo().id;
        console.log('uId ------', uId);
        const { data: res } = await getUserMenu<MenuData[]>(uId);
        console.log('res ------', res);
        const { code, success, data } = res;
        if (code !== 20000 || !success) return;
        this.menus = data;
      } catch (error) {
        console.log('error ------', error);
      } finally {
        this.requestMenuNum--;
      }
    },
    // 用户退出登录
    async userLogout() {
      try {
        const params = {
          id: this.userInfos.id,
          userName: this.userInfos.userName,
          // token: this.userInfos.token
        };
        const { data: res } = await logout<string>(params);
        const { code, message, data, success } = res;
        if (code !== 20000 && !success) return;
        ElMessage.success(message);
        setTimeout(() => {
          Session.clear();
          window.location.reload();
        }, 500);
      } catch (e) {
        throw e;
      }
    },
  },
});
