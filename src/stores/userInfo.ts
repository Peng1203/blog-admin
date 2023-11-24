import { defineStore } from 'pinia';
import { Session } from '@/utils/storage';
import { useLoginApi } from '@/api/login';
import { ElMessage } from 'element-plus';
import { UserInfosState } from '@/types/pinia';

/**
 * 用户信息
 * @methods setUserInfos 设置用户信息
 */

const { logout } = useLoginApi();

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
