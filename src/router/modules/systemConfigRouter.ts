import { RouteRecordRaw } from 'vue-router';

// 系统设置
const routerRules: RouteRecordRaw[] = [
  {
    path: '/sysConfig',
    name: 'SysConfig',
    redirect: { name: '' },
    meta: {
      title: '系统设置',
      icon: 'iconfont icon-xitongshezhi',
      orderNum: 7,
      isHide: false,
      isKeepAlive: false,
    },
    children: [
      {
        path: '/sysConfig/update',
        name: 'SysUpdate',
        component: () => import('@/views/system/config/systemUpdate'),
        meta: {
          title: '系统更新',
          icon: 'iconfont icon-xitonggengxin1',
          isKeepAlive: false,
          orderNum: 1,
          isHide: false,
        },
      },
    ],
  },
];

export default routerRules;
