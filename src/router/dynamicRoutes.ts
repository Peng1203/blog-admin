import { RouteRecordRaw } from 'vue-router';
import authRouterRules from './modules/authRouter';
import userRouterRules from './modules/userRouter';
import articleRouterRules from './modules/articleRouter';
import resourceRouterRules from './modules/resourceRouter';
import testRouterRules from './modules/testRouter';
import systemConfigRouterRules from './modules/configRouter';
import chatRouterRules from './modules/chatRouter';
/**
 * 需要权限的路由表
 * @author Peng
 * @date 2023-03-18
 */

export const allDynamicRoutes: Array<RouteRecordRaw> = [
  {
    path: '/index',
    name: 'Index',
    redirect: '/home',
    component: () => import('@/layout/index.vue'),
    // meta: {
    //   isKeepAlive: false,
    // },
    children: [
      {
        path: '/home',
        name: 'Home',
        component: () => import('@/views/home/index.vue'),
        meta: {
          title: '首页',
          isHide: false,
          isAffix: true,
          isKeepAlive: false,
          // roles: ['admin', 'common'],
          icon: 'ele-HomeFilled',
          orderNum: 1,
        },
      },
      // 权限管理
      ...authRouterRules,
      // 用户管理
      ...userRouterRules,
      // 文章管理
      ...articleRouterRules,
      // 资源管理
      ...resourceRouterRules,
      // 测试
      ...testRouterRules,
      // 系统设置
      ...systemConfigRouterRules,
      // ChatGPT
      ...chatRouterRules,
      // 个人中心
      {
        path: '/personal',
        name: 'Personal',
        component: () => import('@/views/personal/index.vue'),
        meta: {
          title: '个人中心',
          isLink: '',
          isHide: false,
          isKeepAlive: false,
          isAffix: false,
          isIframe: false,
          icon: 'ele-UserFilled',
          orderNum: 20,
        },
      },
    ],
  },
];
