export interface AddUserParams {
  userName: string;
  password: string;
  roleIds: number[];
  email: string;
  nickName: string;
  userEnabled: 0 | 1;
  userAvatar: string;
}
