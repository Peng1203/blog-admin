import qs from 'qs';
import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosError, AxiosResponse } from 'axios';
import { ElMessage, ElMessageBox, ElLoading } from 'element-plus';
import { Session, Local } from '@/utils/storage';
import { handleRefreshACToken } from './refreshToken';
import router from '@/router';

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
  async (error: AxiosError<any>) => {
    console.log('响应拦截器 ------', error);
    const { code, message, response, config } = error;
    if (code === 'ERR_NETWORK' || message === 'Network Error') return ElMessage.error('服务器连接错误!');
    const { status, data } = response!;

    switch (status) {
      case 400:
        ElMessage.error(data.message);
        break;
      case 401:
        const apiCode = response?.data.code;
        switch (apiCode) {
          case 40102:
            ElMessage.warning(data.message);
            break;
          case 40104:
            // token过期触发的401 存在2种情况 access_token过期 refresh_token过期
            // 根据接口中的 错误信息判断
            // 该情况为 access_token 过期 需要调用刷新token的接口
            // 重发出401接口的请求 该接口返回一个boolean类型 标识刷新tokem接口成功或者失败  刷新失败则不从新发起请求 否则会进入死循环
            const refreshIsSuccess = await handleRefreshACToken();
            if (!refreshIsSuccess) return;
            // 修改准备发送的config对象的 token字段 否则会死循环401
            config!.headers['Authorization'] = `Bearer ${Session.getACToken}`;
            // 重新发送请 并将该次请求返回出去 用于触发业务组件中的后续操作
            return service.request(error.config!);
          case 40105:
            // 该情况为 refresh_token 过期 直接返回登录页
            ElMessage.error(data.message);
            return router.push({ name: 'login' });
          default:
            ElMessage.error(data.message);
            break;
        }
        break;
      default:
        ElMessage.error(data.message);
        break;
    }
    return Promise.reject(error.response?.data);
  }
);

// 导出 axios 实例
export default service;
