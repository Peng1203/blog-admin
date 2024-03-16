import { ChatItem } from '@/views/chat';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useChatCPTStore = defineStore('chatGPT', {
  state: () => ({
    chatList: ref<ChatItem[]>([]),
  }),
  actions: {},
  persist: {
    key: 'chatList',
    storage: window.localStorage,
  },
});
