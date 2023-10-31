import { ListApiBaseResponse, BooleanEnum } from 'Api';

export interface MenuData {
  id: number;
  menuName: string;
  menuPath: string;
  menuUri: string;
  menuIcon: string | null;
  orderNum: number;
  parentId: number;
  message: MessageEnum;
  isHidden: BooleanEnum;
  isKeepalive: BooleanEnum;
  createTime: string | Date;
  updateTime: string | Date;
  children: MenuData[];
}

export type MenuListData = ListApiBaseResponse<MenuData>;
