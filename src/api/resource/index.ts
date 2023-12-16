import request from '@/utils/request';
import { TransformedResponse, RequestListParams } from 'Api';
import { Method } from '../types';

export function useResourceApi() {
  return {
    getNetdiskDir<T>(params?: Record<'path', string>): TransformedResponse<T> {
      return request({
        url: '/resource/netdisk',
        method: Method.GET,
        params,
      });
    },
  };
}
