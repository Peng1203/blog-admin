// 菜单列表响应结构
interface MenuData {
  URIs: string[]
  code: number
  data: Menu[]
  message: MessageEnum
  total: number
}

// 菜单其他配置

interface OtherConfig {
  isHide: boolean
  isKeepAlive: boolean
  parentMenuName: string | ''
}

// 菜单信息
interface Menu {
  id: number
  menuName: string
  menuIcon: string
  menuPath: string
  menuURI: string
  parentId: number
  menuType: '1' | '2' | '3' | '4'
  menuRedirect: string
  otherConfig: OtherConfig
  updateTime: string
  createdTime: string
  children?: Menu[]
}
