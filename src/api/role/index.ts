import request from '@/utils/request'
import type { RequestListParams } from 'axios'

export function useRoleApi() {
  return {
    /**
     * 获取角色列表
     * @author Peng
     * @date 2023-04-21
     * @param {any} params:RequestListParams
     * @returns {any}
     */
    getRoleList(params: RequestListParams) {
      return request({
        url: '/role/getRoleList',
        method: 'get',
        params,
      })
    },
    /**
     * 添加角色
     * @author Peng
     * @date 2023-04-21
     * @param {any} params:object
     * @returns {any}
     */
    addRole(params: object) {
      return request({
        url: '/role/addRole',
        method: 'post',
        data: params,
      })
    },
    /**
     * 通过ID更新角色信息
     * @author Peng
     * @date 2023-04-21
     * @param {any} id:number
     * @param {any} params:object
     * @returns {any}
     */
    updateRole(id: number, params: object) {
      return request({
        url: `/role/updateRoleInfoById/${id}`,
        method: 'put',
        data: params,
      })
    },
    /**
     * 通过ID删除角色信息
     * @author Peng
     * @date 2023-04-21
     * @param {any} id:number
     * @returns {any}
     */
    deleteRole(id: number) {
      return request({
        url: `/role/deleteRoleById/${id}`,
        method: 'delete',
      })
    },
  }
}
