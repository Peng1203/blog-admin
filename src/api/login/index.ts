import request from '@/utils/request';
import { RawResponse, TransformedResponse } from 'Api';
import { LoginParams } from './params';
import { Local } from '@/utils/storage';

export function useLoginApi() {
  return {
    /**
     * @method 获取验证码
     */
    getCaptcha<T>(): RawResponse<T> {
      return request({
        url: '/login/captcha',
        method: 'get',
      });
    },
    /**
     * @method 登录
     */
    login<T>(data: LoginParams): TransformedResponse<T> {
      return request({
        url: '/login',
        method: 'post',
        data,
      });
    },
    /**
     * @method 退出登录
     */
    signOut(data: object) {
      return request({
        url: '/user/logout',
        method: 'post',
        data,
      });
    },
    /**
     * @method 刷新token
     */
    refreshToken(): TransformedResponse<{ access_token: string; refresh_token: string }> {
      return request({
        url: '/auth/refreshAccessToekn',
        method: 'patch',
        data: JSON.stringify({
          refresh_token: Local.getRFToken(),
        }),
      });
    },
  };
}
