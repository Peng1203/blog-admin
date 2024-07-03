import { ListApiBaseResponse, BooleanEnum } from 'Api'

export interface MenuData {
  id: number
  menuName: string
  menuPath: string
  menuUri: string
  menuIcon: string
  orderNum: number
  parentId: number
  isHidden: BooleanEnum
  isKeepalive: BooleanEnum
  createTime: string
  updateTime: string
  children: MenuData[]
}

export type MenuListData = ListApiBaseResponse<MenuData>

export type AddMenuType = Partial<MenuData>

export type EditMenuType = AddMenuType

export interface EditProps {
  editRow: MenuData
}
