import request from '@/utils/request'
import { TransformedResponse } from 'Api'
import { Method } from '../types'

export function useCommonApi() {
  return {
    /** 解析IP */
    getIPInfo(ip: string): TransformedResponse<{
      city: number
      region: string
    }> {
      return request({
        url: '/common/ipParse',
        method: Method.GET,
        params: { ip },
      })
    },
  }
}
