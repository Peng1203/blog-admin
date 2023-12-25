import { EventSourcePolyfill, EventListenerOrEventListenerObject } from 'event-source-polyfill';
import { Session } from './storage';
import { handleRefreshACToken } from './refreshToken';
import { ElMessage } from 'element-plus';

type MsgCb<T = any> = (data: T) => void;

interface Option {
  openCallback?: () => void;
  msgCallback: MsgCb;
  errCallback?: () => void;
}

export type EventSourceOptions = Option | MsgCb;

export const eventSourceRequest = (url: string, options: EventSourceOptions): EventSourcePolyfill => {
  const createEventSource = () => {
    return new EventSourcePolyfill(import.meta.env.VITE_API_URL + url, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Session.getACToken()}`,
      },
    });
  };

  const es = createEventSource();
  if (typeof options === 'object') {
    options?.openCallback && es.addEventListener('open', options.openCallback);
    options?.msgCallback && es.addEventListener('message', options.msgCallback);
    options?.errCallback
      ? es.addEventListener('error', options.errCallback)
      : es.addEventListener('error', () => es.close());
  } else if (typeof options === 'function') {
    es.addEventListener('message', options);
    es.addEventListener('error', () => es.close());
  }

  const handleError = async (err: any) => {
    if (err!.status === 401 && err!.statusText === 'Unauthorized') {
      // 关闭旧的EventSource实例
      es.close();
      // 刷新token
      await handleRefreshACToken();
      // 重新创建EventSource实例
      const newEs = createEventSource();
      // 重新绑定事件监听器
      if (typeof options === 'object') {
        options?.openCallback && newEs.addEventListener('open', options.openCallback);
        options?.msgCallback && newEs.addEventListener('message', options.msgCallback);
        options?.errCallback && newEs.addEventListener('error', options.errCallback);
      } else if (typeof options === 'function') {
        newEs.addEventListener('message', options);
      }
    } else if (err.data === 'Bad Request Exception') {
      ElMessage.error('参数有误!');
    } else if (err.data === 'Conflict Exception') {
      ElMessage.warning('有服务正在更新中 请稍后重试!');
    } else {
      console.log('SSE 其他错误 ------', err);
    }
  };

  // 捕获SSE接口错误
  es.addEventListener('error', handleError);

  return es;
};
