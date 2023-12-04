import md5 from 'md5';

/**
 * 密码加密
 * @param pwd 初始密码
 */
export function passwordEncryption(pwd: string): string {
  const strArr: string[] = [];
  for (let i = 0; i < pwd.length; i++) {
    strArr.push(pwd[i]);
  }

  strArr[0] = pwd[pwd.length - 2];
  strArr[1] = pwd[pwd.length - 1];
  strArr[2] = pwd[pwd.length - 3];

  strArr[strArr.length - 2] = pwd[0];
  strArr[strArr.length - 1] = pwd[1];

  return md5(strArr.join(''));
}
