import { defineStore } from 'pinia';

export const useChatCPTStore = defineStore('chatGPT', {
  state: () => ({}),
  actions: {},
  persist: {
    key: 'chatList',
    storage: window.localStorage,
  },
});
