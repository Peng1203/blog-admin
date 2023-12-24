import { EventSourcePolyfill, EventListenerOrEventListenerObject } from 'event-source-polyfill';
import { Session } from './storage';
import { handleRefreshACToken } from './refreshToken';

type MsgCb<T = any> = (data: T) => void;

interface Option {
  openCallback?: () => void;
  msgCallback: MsgCb;
  closeCallback?: () => void;
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
    options?.closeCallback && es.addEventListener('close', options.closeCallback);
  } else if (typeof options === 'function') {
    es.addEventListener('message', options);
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
        options?.closeCallback && newEs.addEventListener('close', options.closeCallback);
      } else if (typeof options === 'function') {
        newEs.addEventListener('message', options);
      }
    } else {
      console.log('SSE 其他错误 ------', err);
    }
  };

  // 捕获SSE接口错误
  es.addEventListener('error', handleError);

  return es;
};
