import qs from 'qs';
import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosError, AxiosResponse } from 'axios';
import { ElMessage, ElMessageBox, ElLoading } from 'element-plus';
import { Session, Local } from '@/utils/storage';

// 配置新建一个 axios 实例
const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  timeout: 5000,
  headers: { 'Content-Type': 'application/json' },
  paramsSerializer: {
    serialize(params) {
      return qs.stringify(params, { allowDots: true });
    },
  },
});
// 全屏loading 计数器
let fullscreenLoadingCounter: number = 0;
let loading: any = null;

window.httpRequestList = [];
// 添加请求拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = Session.getACToken();
    token && (config.headers['Authorization'] = `Bearer ${token}`);

    config.cancelToken = new axios.CancelToken(cancel => {
      window.httpRequestList.push(cancel); //存储cancle
    });
    // 是否开启全屏loading
    if ((<any>config)?.fullscreenLoading) {
      // 第一个需要开启全屏loading的请求
      if (!fullscreenLoadingCounter) {
        loading = ElLoading.service({ fullscreen: true });
      }
      fullscreenLoadingCounter++;
    }

    return config;
  },
  error => {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 添加响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError<any>) => {
    console.log('响应拦截器 ------', error);
    const { code, message, response } = error;
    if (code === 'ERR_NETWORK' || message === 'Network Error') return ElMessage.error('服务器连接错误!');
    const { status, data } = response!;

    switch (status) {
      case 400:
        ElMessage.error(data.message);
        break;
      case 401:
        ElMessage.error(data.message);
        break;
      default:
        break;
    }
    console.log('status ------', status);
    return Promise.reject(error.response?.data);
  }
);

// 导出 axios 实例
export default service;
