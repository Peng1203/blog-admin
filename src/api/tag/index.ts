import request from '@/utils/request'

export function useTagApi() {
  return {
    /**
     * 获取标签列表
     * @author Peng
     * @date 2023-04-28
     * @param {any} params:object
     * @returns {any}
     */
    getTagList(params: object) {
      return request({
        url: '/article-tag/getTagList',
        method: 'get',
        params,
      })
    },
    /**
     * 添加标签
     * @author Peng
     * @date 2023-04-28
     * @param {any} params:object
     * @returns {any}
     */
    addTag(params: object) {
      return request({
        url: '/article-tag/addTag',
        method: 'post',
        data: params,
      })
    },
    /**
     * 通过ID更新标签信息
     * @author Peng
     * @date 2023-04-28
     * @param {any} tagId:number
     * @param {any} params:object
     * @returns {any}
     */
    updataTagInfo(tagId: number, params: object) {
      return request({
        url: `/article-tag/updateTagById/${tagId}`,
        method: 'put',
        data: params,
      })
    },
    /**
     * 通过ID删除标签
     * @author Peng
     * @date 2023-04-28
     * @param {any} tagId:number
     * @returns {any}
     */
    deleteTagById(tagId: number) {
      return request({
        url: `/article-tag/deleteTagById/${tagId}`,
        method: 'delete',
      })
    },
  }
}
