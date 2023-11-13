import { ListApiBaseResponse } from 'Api';

export interface RoleData {
  id: number;
  roleName: string;
  description: string | null;
  menus: any[];
  permissions: any[];
  createTime: string | Date;
  updateTime: string | Date;
}

export type RoleListData = ListApiBaseResponse<RoleData>;
