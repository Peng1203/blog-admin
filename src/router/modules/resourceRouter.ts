import { RouteRecordRaw } from 'vue-router';

// 资源管理路由规则
const routerRules: RouteRecordRaw[] = [
  {
    path: '/resource',
    name: 'Resource',
    redirect: { name: '' },
    meta: {
      title: '资源管理',
      icon: 'iconfont icon-ziyuan-resources',
      isKeepAlive: false,
      orderNum: 5,
      isHide: false,
    },
    children: [
      {
        path: '/resource/netdisk',
        name: 'Netdisk',
        component: () => import('@/views/resource/netdisk'),
        meta: {
          title: '网盘',
          icon: 'iconfont icon-wangpan',
          isKeepAlive: false,
          orderNum: 1,
          isHide: false,
        },
      },
    ],
  },
];

export default routerRules;
