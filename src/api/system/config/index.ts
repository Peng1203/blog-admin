import { eventSourceRequest, EventSourceOptions } from '@/utils/eventSource';

export function useSystemConfigApi() {
  return {
    /**
     * 更新Web服务
     */
    updateWebSys(options: EventSourceOptions) {
      return eventSourceRequest('/system/update/web', options);
    },
    /**
     * 更新Admin服务
     */
    updateAdminSys(options: EventSourceOptions) {
      return eventSourceRequest('/system/update/admin', options);
    },
    /**
     * 更新Serve服务
     */
    updateServeSys(options: EventSourceOptions) {
      return eventSourceRequest('/system/update/serve', options);
    },
  };
}
