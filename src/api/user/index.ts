import request from '@/utils/request'

export function useUserApi() {
  return {
    /**
     * 获取用户列表
     * @author Peng
     * @date 2023-04-15
     * @param {any} params:object
     * @returns {any}
     */
    getUserList(params: object) {
      return request({
        url: '/user/getUserList',
        method: 'get',
        params,
      })
    },
    /**
     * 添加用户
     * @author Peng
     * @date 2023-04-15
     * @param {any} params:object
     * @returns {any}
     */
    addUser(params: object) {
      return request({
        url: '/user/addUser',
        method: 'post',
        data: params,
      })
    },
    /**
     * 更新用户信息
     * @author Peng
     * @date 2023-04-15
     * @param {any} userId:number
     * @param {any} params:object
     * @returns {any}
     */
    updateUserInfo(userId: number, params: object) {
      return request({
        url: `/user/updateUserInfoById/${userId}`,
        method: 'put',
        data: params,
      })
    },
    /**
     * 通过ID删除用户
     * @author Peng
     * @date 2023-04-15
     * @param {any} userId:number
     * @returns {any}
     */
    deleteUserById(userId: number) {
      return request({
        url: `/user/deleteUserById/${userId}`,
        method: 'delete',
      })
    },
    /**
     * 上传用户头像
     * @author Peng
     * @date 2023-04-03
     * @param {any} userId:number
     * @param {any} file:FormData
     * @returns {any}
     */
    uploadUserAvatar(userId: number, file: FormData) {
      return request({
        url: `/user/uploadAvatarById/${userId}`,
        method: 'patch',
        data: file,
        headers: {
          'Content-Type': 'multipart/form-data',
          'resource-classification': 'user-cover',
        },
      })
    },
    /**
     * 获取用户下拉筛选数据
     * @author Peng
     * @date 2023-04-29
     * @returns {any}
     */
    getAllUserOptions() {
      return request({
        url: '/user/getAllUserOptions',
        method: 'get',
      })
    },
    /**
     * 修改用户密码
     * @author Peng
     * @date 2023-05-07
     * @param {any} userId:number
     * @param {any} params:object
     * @returns {any}
     */
    changeUserPwd(userId: number, params: object) {
      return request({
        url: `/user/changePasswordById/${userId}`,
        method: 'post',
        data: params,
      })
    },
    /**
     * 批量删除用户
     * @author Peng
     * @date 2023-06-26
     * @param {any} ids:number[]
     * @returns {any}
     */
    batchDeleteUsers(ids: number[]) {
      return request({
        url: '/user/deleteUsers',
        method: 'delete',
        data: { ids },
      })
    },
  }
}
