import { RouteRecordRaw } from 'vue-router';

// 资源管理路由规则
const routerRules: RouteRecordRaw[] = [
  {
    path: '/resource',
    name: 'Resource',
    component: () => import('@/views/resource/index.vue'),
    meta: {
      title: '资源管理',
      icon: 'iconfont icon-ziyuan-resources',
      isKeepAlive: false,
      orderNum: 5,
      isHide: false,
    },
  },
];

export default routerRules;
