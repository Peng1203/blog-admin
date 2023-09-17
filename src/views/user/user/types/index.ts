export interface UserData {
  id: number;
  userName: string;
  // password: string
  roles: any[];
  email: string | null;
  nickName: string | null;
  userEnabled: number;
  userAvatar: string | null;
  createTime: string | Date;
  updateTime: string | Date;
}

export interface UserListData {
  list: UserData[];
  total: number;
}
