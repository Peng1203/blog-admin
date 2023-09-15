import request from '@/utils/request';
import { ApiBaseResponse, AxiosResponse } from 'axios';
import { CAPTCHA, LOGIN } from './url';
import { LoginParams } from './params';

/**
 * （不建议写成 request.post(xxx)，因为这样 post 时，无法 params 与 data 同时传参）
 *
 * 登录api接口集合
 * @method getCaptcha 获取用户登录验证码
 * @method verifyCaptcha 校验验证码
 * @method signIn 用户登录
 * @method signOut 用户退出登录
 */
export function useLoginApi() {
  return {
    getCaptcha<T>(): Promise<AxiosResponse<T>> {
      return request({
        url: CAPTCHA,
        method: 'get',
      });
    },
    login<T = any>(data: LoginParams): Promise<AxiosResponse<ApiBaseResponse<T>>> {
      return request({
        url: LOGIN,
        method: 'post',
        data,
      });
    },
    signOut(data: object) {
      return request({
        url: '/user/logout',
        method: 'post',
        data,
      });
    },
  };
}

const { getCaptcha } = useLoginApi();

async function name() {
  const res = await getCaptcha<string>();
  res.data;
}
