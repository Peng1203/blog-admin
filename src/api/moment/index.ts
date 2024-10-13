import request from '@/utils/request'
import { TransformedResponse, RequestListParams } from 'Api'
import { Method } from '../types'

export function useMomentApi() {
  return {
    addMoment<T>(data): TransformedResponse<T> {
      return request({
        url: '/moment',
        method: Method.POST,
        data: JSON.stringify(data),
      })
    },
  }
}
