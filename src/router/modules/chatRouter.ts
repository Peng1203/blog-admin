import { RouteRecordRaw } from 'vue-router';

const routerRules: Array<RouteRecordRaw> = [
  {
    path: '/ChatGPT',
    name: 'ChatGPT',
    component: () => import('@/views/chat'),
    meta: {
      title: 'ChatGPT',
      isHide: false,
      isAffix: true,
      isKeepAlive: false,
      icon: 'iconfont icon-ChatGPT',
      orderNum: 1,
    },
  },
];

export default routerRules;
