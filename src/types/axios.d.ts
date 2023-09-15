/* eslint-disable */
import * as axios from 'axios';

import { AxiosHeaders, AxiosRequestConfig } from 'axios';

// 扩展 axios 数据返回类型，可自行扩展
declare module 'axios' {
  export interface AxiosResponse<T = any> {
    config: AxiosRequestConfig;
    data: T;
    headers: AxiosHeaders;
    request: XMLHttpRequest;
    status: number;
    statusText: string;
  }
  export type RequestListParams<T = any> = {
    page: number;
    pageSize: number;
    queryStr: string;
    column: string;
    order: string;
    [key: string]: T;
  };

  export interface ApiBaseResponse<T = any> {
    /**
     * Api状态码
     * 20000 请求成功
     * 20001 更新成功
     * 20100 创建成功
     */
    code: number;
    /**
     * 请求状态
     */
    success: boolean;
    /**
     * 响应消息
     */
    message: string;
    data: T;
  }
}
