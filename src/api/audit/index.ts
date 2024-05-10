import request from '@/utils/request';
import { TransformedResponse, RequestListParams } from 'Api';
import { Method } from '../types';

export function useAuditApi() {
  return {
    /** 获取审计列表 */
    getAuditLogs<T>(params: RequestListParams): TransformedResponse<T> {
      return request({
        url: '/audit',
        method: Method.GET,
        params,
      });
    },
  };
}
