import request from '@/utils/request';
import { TransformedResponse, RequestListParams } from 'Api';
import { UserParams } from './params';
import { Method } from '../types';

export function useUserApi() {
  return {
    /**
     * 获取用户列表
     */
    getUsers<T = any>(params: RequestListParams): TransformedResponse<T> {
      return request({
        url: '/user',
        method: Method.GET,
        params,
      });
    },
    /**
     * 添加用户
     */
    addUser<T>(params: UserParams): TransformedResponse<T> {
      return request({
        url: '/user',
        method: Method.POST,
        data: JSON.stringify(params),
      });
    },
    /**
     * 更新用户信息
     */
    updateUser<T>(userId: number, params: UserParams): TransformedResponse<T> {
      return request({
        url: `/user/${userId}`,
        method: Method.PUT,
        data: JSON.stringify(params),
      });
    },
    update<T>(userId: number, params: UserParams): TransformedResponse<T> {
      return request({
        url: `/user/${userId}`,
        method: Method.PATCH,
        data: JSON.stringify(params),
      });
    },
    /**
     * 通过ID删除用户
     */
    deleteUserById<T>(userId: number): TransformedResponse<T> {
      return request({
        url: `/user/${userId}`,
        method: Method.DELETE,
      });
    },
    /**
     * 批量删除用户
     */
    deleteUsers(ids: number[]): TransformedResponse<string> {
      return request({
        url: `/user`,
        method: Method.DELETE,
        data: JSON.stringify({ ids }),
      });
    },
    /**
     * 上传用户头像
     */
    uploadAvatar(userId: number, file: FormData): TransformedResponse<string> {
      return request({
        url: `/user/avater/${userId}`,
        method: Method.POST,
        data: file,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    },
    /**
     * 修改用户密码
     */
    changeUserPwd(userId: number, params: object) {
      return request({
        url: `/user/changePasswordById/${userId}`,
        method: Method.POST,
        data: params,
      });
    },
  };
}
