import request from '@/utils/request'

export function useCategoryApi() {
  return {
    /**
     * 获取分类列表
     * @author Peng
     * @date 2023-04-29
     * @param {any} params:object
     * @returns {any}
     */
    getCategoryList(params: object) {
      return request({
        url: '/article-category/getCategoryList',
        method: 'get',
        params,
      })
    },
    /**
     * 添加分类
     * @author Peng
     * @date 2023-04-29
     * @param {any} params:object
     * @returns {any}
     */
    addCategory(params: object) {
      return request({
        url: '/article-category/addCategory',
        method: 'post',
        data: params,
      })
    },
    /**
     * 通过ID更新分类信息
     * @author Peng
     * @date 2023-04-29
     * @param {any} categoryId:number
     * @param {any} params:object
     * @returns {any}
     */
    updateCategory(categoryId: number, params: object) {
      return request({
        url: `/article-category/updateCategoryById/${categoryId}`,
        method: 'put',
        data: params,
      })
    },
    /**
     * 通过ID删除分类
     * @author Peng
     * @date 2023-04-29
     * @param {any} categoryId:number
     * @returns {any}
     */
    deleteCategoryById(categoryId: number) {
      return request({
        url: `/article-category/deleteCategoryById/${categoryId}`,
        method: 'delete',
      })
    },
  }
}
