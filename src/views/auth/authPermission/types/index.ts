import { ListApiBaseResponse } from 'Api';

export type ResourceMethodType = 1 | 2 | 3 | 4 | 5 | 6 | null;
export interface PermissionData {
  id: number;
  permissionName: string;
  permissionCode: string | null;
  resourceMethod: ResourceMethodType;
  resourceUrl: string | null;
  parentId: number;
  description: string | null;
  updateTime: string;
  createTime: string;
  children: PermissionData[];
}

export type PermissionListData = ListApiBaseResponse<PermissionData>;

export type AddPermissionType = Partial<PermissionData>;
