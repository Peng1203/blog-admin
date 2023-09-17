import request from '@/utils/request';
import { RawResponse, TransformedResponse } from 'Api';
import { LoginParams } from './params';

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
  };
}
