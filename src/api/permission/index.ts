import request from '@/utils/request';
import { TransformedResponse, RequestListParams } from 'Api';
/**
 * 操作权限标识
 * @author Peng
 * @date 2023-04-16
 * @returns {any}
 */
export function usePermissionApi() {
  return {
    /**
     * 获取权限标识列表
     * @author Peng
     * @date 2023-04-16
     * @param {any} params:RequestListParams
     * @returns {any}
     */
    getPermissions<T = any>(params: RequestListParams): TransformedResponse<T> {
      return request({
        url: '/permission',
        method: 'get',
        params,
      });
    },
    /**
     * 添加权限标识
     * @author Peng
     * @date 2023-04-17
     * @param {any} params:object
     * @returns {any}
     */
    addPermission<T = any>(params: object): TransformedResponse<T> {
      return request({
        url: '/permission',
        method: 'post',
        data: params,
      });
    },
    /**
     * 删除权限标识
     * @author Peng
     * @date 2023-04-17
     * @param {any} id:number
     * @returns {any}
     */
    delAuthPermission(id: number) {
      return request({
        url: `/auth-permission/deleteAuthPermById/${id}`,
        method: 'delete',
      });
    },
    /**
     * 更新权限标识信息
     * @author Peng
     * @date 2023-04-17
     * @param {any} id:number
     * @param {any} params:object
     * @returns {any}
     */
    updateAuthPermInfo(id: number, params: object) {
      return request({
        url: `/auth-permission/updateAuthPermInfoById/${id}`,
        method: 'put',
        data: params,
      });
    },
  };
}
