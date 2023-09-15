import { UserData } from '@/views/user/user';

export interface LoginData {
  user: UserData;
  tokens: {
    access_token: string;
    refresh_token: string;
  };
}
