import { RouteRecordRaw } from 'vue-router';

// 文章管理路由规则
const routerRules: RouteRecordRaw[] = [
  {
    path: '/article',
    name: 'Article',
    redirect: { name: 'ArticleList' },
    meta: {
      title: '文章管理',
      isLink: '',
      isHide: false,
      isKeepAlive: false,
      isAffix: false,
      isIframe: false,
      // icon: 'iconfont icon-wenzhangfenlei1',
      icon: 'iconfont icon-wenzhangfenlei2',
    },
    children: [
      {
        path: '/article/writeArticle',
        name: 'WriteArticle',
        component: () => import('@/views/article/writeArticle'),
        meta: {
          title: '写文章',
          isLink: '',
          isHide: false,
          isKeepAlive: false,
          isAffix: false,
          isIframe: false,
          // icon: 'iconfont icon-tianchongxing-',
          icon: 'iconfont icon-weibiaoti--',
        },
      },
      {
        path: '/article/writeArticle/:aid',
        name: 'EditArticle',
        component: () => import('@/views/article/writeArticle'),
        meta: {
          noRender: true,
          title: '编辑文章',
        },
      },
      {
        path: '/article/list',
        name: 'ArticleList',
        component: () => import('@/views/article/article'),
        meta: {
          title: '文章列表',
          isLink: '',
          isHide: false,
          isKeepAlive: false,
          isAffix: false,
          isIframe: false,
          icon: 'iconfont icon-wenzhangguanli',
        },
      },
      {
        path: '/article/tag',
        name: 'ArticleTag',
        component: () => import('@/views/article/tag'),
        meta: {
          title: '标签管理',
          isLink: '',
          isHide: false,
          isKeepAlive: false,
          isAffix: false,
          isIframe: false,
          icon: 'iconfont icon-tags',
        },
      },
      {
        path: '/article/category',
        name: 'ArticleCategory',
        component: () => import('@/views/article/category'),
        meta: {
          title: '分类管理',
          isLink: '',
          isHide: false,
          isKeepAlive: false,
          isAffix: false,
          isIframe: false,
          icon: 'iconfont icon-fenlei',
        },
      },
    ],
  },
];

export default routerRules;
