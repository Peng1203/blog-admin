import request from '@/utils/request';
import { TransformedResponse, RequestListParams } from 'Api';

export function useTagApi() {
  return {
    /**
     * 获取标签列表
     * @author Peng
     * @date 2023-04-28
     * @param {any} params:object
     * @returns {any}
     */
    getTags<T>(params: RequestListParams): TransformedResponse<T> {
      return request({
        url: '/tag',
        method: 'get',
        params,
      });
    },
    /**
     * 添加标签
     * @author Peng
     * @date 2023-04-28
     * @param {any} data:object
     * @returns {any}
     */
    addTag<T>(data: object): TransformedResponse<T> {
      return request({
        url: '/tag',
        method: 'post',
        data: JSON.stringify(data),
      });
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
      });
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
      });
    },
  };
}
