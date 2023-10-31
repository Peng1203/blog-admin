import { ListApiBaseResponse, BooleanEnum } from 'Api';

export interface UserData {
  id: number;
  userName: string;
  password?: string;
  roles: any[];
  email: string | null;
  nickName: string | null;
  userEnabled: BooleanEnum;
  userAvatar: string | null;
  createTime: string | Date;
  updateTime: string | Date;
}

export type UserListData = ListApiBaseResponse<UserData>;

//
export interface AddProps {
  roles: OptionItem[];
}

export interface EditProps extends AddProps {
  editRow: UserData;
}

export type AddEditUserType = Partial<UserData & { roleIds: number[] }>;
