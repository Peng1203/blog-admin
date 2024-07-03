import request from '@/utils/request'
import { TransformedResponse } from 'Api'
import { Method } from '../types'
import axios, { AxiosProgressEvent } from 'axios'
// Canceler

export function useResourceApi() {
  return {
    getResourceList<T>(
      params?: Record<'path', string>
    ): TransformedResponse<T> {
      return request({
        url: '/resource',
        method: Method.GET,
        params,
      })
    },
    uploadResource<T = string>(
      file: FormData,
      onUploadProgress: (progressEvent: AxiosProgressEvent) => any,
      item: any
    ): TransformedResponse<T> {
      return request({
        url: '/resource',
        method: Method.POST,
        data: file,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress,
        cancelToken: new axios.CancelToken(c => (item.cancel = c)),
      })
    },
  }
}
