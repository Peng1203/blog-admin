import { defineStore } from 'pinia';
import { Session } from '@/utils/storage';
import { useLoginApi } from '@/api/login';
import { ElMessage } from 'element-plus';

/**
 * 用户信息
 * @methods setUserInfos 设置用户信息
 */

const { signOut } = useLoginApi();

export const useUserInfo = defineStore('userInfo', {
  state: (): UserInfosState => ({
    userInfos: {
      id: 0,
      userName: '',
      roleId: 0,
      roleName: '',
      avatar: '',
      menus: [],
      authBtnList: [],
      createdTime: '',
      updateTime: '',
      token: '',
    },
  }),
  actions: {
    // 更新用户信息
    updataUserInfo() {},
    // 设置 用户信息
    async setUserInfos(data: any) {
      // 存储用户信息到浏览器缓存
      this.userInfos = data;
    },
    // 用户退出登录
    async userLogout() {
      try {
        const params = {
          id: this.userInfos.id,
          userName: this.userInfos.userName,
          // token: this.userInfos.token
        };
        const { data: res } = await signOut(params);
        const { code, message, data } = res;
        if (code !== 200 && message !== 'Success') return;
        ElMessage.success(data);
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
