import request from '@/utils/fetchRequest';
import { Method } from '../types';
import { PostMessageParams } from './params';

export function useChatApi() {
  return {
    postChatContent(
      params: PostMessageParams,
      cb: (value: Response) => Promise<void> | Response | PromiseLike<Response>
    ) {
      request({
        url: '/openai/chat',
        method: Method.POST,
        body: JSON.stringify(params),
      }).then(cb);
    },
  };
}
