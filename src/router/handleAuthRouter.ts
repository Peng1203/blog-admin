import { RouteRecordRaw } from 'vue-router'
import { allDynamicRoutes } from './dynamicRoutes'
import { router, formatFlatteningRoutes } from './index'
import { Session } from '@/utils/storage'
import { useRoutesList } from '/@/stores/routesList'
import pinia from '@/stores/index'
import { useUserInfo } from '@/stores/userInfo'
import { useTagsViewRoutes } from '@/stores/tagsViewRoutes'
import { NextLoading } from '@/utils/loading'
// import Cookies from 'js-cookie';

/**
 * 处理 登录用户的路由表
 * 该方法会在登录成功 和 页面刷新时执行
 * @author Peng
 * @date 2023-03-18
 * @returns {any}
 */
export async function handleUserAuthRouters(): Promise<any> {
  if (window.nextLoading === undefined) NextLoading.start()

  const storesRoutesList = useRoutesList(pinia)
  const useUserInfoStores = useUserInfo()
  const storesTagsView = useTagsViewRoutes(pinia)

  const userInfo = Session.get('userInfo')
  useUserInfoStores.setUserInfos({ ...userInfo, token: Session.get('token') })

  const allRouterRules = formatFlatteningRoutes(allDynamicRoutes[0].children)

  const { id, userName } = userInfo

  // 当登录 用户为 admin 用户是不进行菜单处理直接添加全部权限路由
  if (id === 1 && userName === 'admin') {
    // 将全部权限路由添加到路由规则中
    await allDynamicRoutes.forEach((route: RouteRecordRaw) =>
      router.addRoute(route)
    )
    // 设置
    await storesRoutesList.setRoutesList(allDynamicRoutes[0].children as any)
    await storesTagsView.setTagsViewRoutes(allRouterRules)
    // 返回第一个跳转后第一个展示的菜单展示
    NextLoading.done()
    return (allDynamicRoutes[0].children as any)[0].name
  } else {
    if (window.nextLoading === undefined) NextLoading.start()
    const { menus } = userInfo
    // 当角色没有菜单时直接返回
    if (!menus.length) return ''

    const allMenuRules = allDynamicRoutes[0].children

    // 过滤出持有的一级菜单
    const handleAfterMenus: any = allMenuRules?.filter(m =>
      menus.find((item: Menu) => item.menuURI === m.name)
    )

    // 递归处理 持有的菜单 设置的配置项
    handleChildrenMenu(handleAfterMenus, menus)

    const newRule: RouteRecordRaw[] = allDynamicRoutes
    newRule[0].children = handleAfterMenus
    await newRule.forEach((route: RouteRecordRaw) => router.addRoute(route))
    // 设置
    await storesRoutesList.setRoutesList(newRule[0].children)
    await storesTagsView.setTagsViewRoutes(allRouterRules)

    NextLoading.done()

    // 返回第一个跳转后第一个展示的菜单展示
    const toRouter = newRule[0].children.find(
      (rule: RouteRecordRaw) => rule.meta && !rule.meta.isHide
    )
    return toRouter.name
  }
}
// 菜单规则
function handleChildrenMenu(children: RouteRecordRaw[], menus: Menu[]) {
  // 需要删除元素的索引
  let dels: number[] = []

  children.forEach((item: RouteRecordRaw, i) => {
    const findRes = menus.find((menu: Menu) => menu.menuURI === item.name)

    if (findRes) {
      const {
        menuIcon,
        menuName,
        menuPath,
        menuType,
        menuRedirect,
        otherConfig,
      } = findRes

      item.path = menuPath

      if (menuRedirect) item.redirect = { name: menuRedirect }

      if (item.meta) {
        item.meta.icon = menuIcon
        item.meta.title = menuName
        item.meta.isKeepAlive = otherConfig.isKeepAlive
        item.meta.isHide = otherConfig.isHide
        item.meta.menuType = menuType
        // item.meta. =
        // item.meta. =
      }
    } else {
      dels.push(i)
    }

    // 当存在其他子节点是继续递归处理
    if (item.children && item.children.length)
      handleChildrenMenu(item.children, menus)
  })

  // 删除未持有的菜单
  // 重大到小删除元素 防止影响其他数据索引
  dels.sort((a, b) => b - a)

  dels.forEach(i => children.splice(i, 1))
}
