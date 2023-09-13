import request from '@/utils/request'

export function useArticleApi() {
  return {
    /**
     * 获取文章列表
     * @author Peng
     * @date 2023-04-29
     * @param {any} params:object
     * @returns {any}
     */
    getArticleList(params: object) {
      return request({
        url: '/article/getArticleList',
        method: 'get',
        params,
      })
    },
    /**
     * 通过文章id获取详情信息
     * @author Peng
     * @date 2023-05-03
     * @param {any} articleId:number
     * @returns {any}
     */
    getArticleDetailById(articleId: number) {
      return request({
        url: `/article/articleDetail/${articleId}`,
        method: 'get',
      })
    },
    /**
     * 添加文章
     * @author Peng
     * @date 2023-04-29
     * @param {any} params:object
     * @returns {any}
     */
    addArticle(params: object) {
      return request({
        url: '/article/addArticle',
        method: 'post',
        data: params,
      })
    },
    /**
     * 通过文章ID更新文章
     * @author Peng
     * @date 2023-04-29
     * @param {any} articleId:number
     * @param {any} params:object
     * @returns {any}
     */
    updateArticle(articleId: number, params: object) {
      return request({
        url: `/article/updateArticleById/${articleId}`,
        method: 'put',
        data: params,
      })
    },
    /**
     * 通过ID删除文章
     * @author Peng
     * @date 2023-04-29
     * @param {any} articleId:number
     * @returns {any}
     */
    delArticleById(articleId: number) {
      return request({
        url: `/article/deleteArticleById/${articleId}`,
        method: 'delete',
      })
    },
    /**
     * 上传文章头像
     * @author Peng
     * @date 2023-04-29
     * @param {any} file:FormData
     * @param {any} type:string
     * @returns {any}
     */
    uploadArticleCover(file: FormData) {
      return request({
        url: '/article/upload-resources',
        method: 'post',
        data: file,
        headers: {
          'Content-Type': 'multipart/form-data',
          'resource-classification': 'cover',
        },
      })
    },
    /**
     * 上传文章内容图片
     * @author Peng
     * @date 2023-06-07
     * @param {any} file:FormData
     * @param {any} type:string
     * @returns {any}
     */
    uploadArticleContentResource(file: FormData) {
      return request({
        url: '/article/upload-resources',
        method: 'post',
        data: file,
        headers: {
          'Content-Type': 'multipart/form-data',
          'resource-classification': 'content',
        },
      })
    },
  }
}
