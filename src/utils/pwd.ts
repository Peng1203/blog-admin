// 密码强度检测
export const passwordStrengthLevelDetection = (value: any): number => {
  if (!value) return 0;
  let level = 1;

  // 强
  let strongRegex = /^(?![a-zA-z]+$)(?!\d+$)(?![!@#$%^&*]+$)(?![a-zA-z\d]+$)(?![a-zA-z!@#$%^&*]+$)(?![\d!@#$%^&*]+$)[a-zA-Z\d!@#$%^&*]+$ /;
  // 中
  let mediumRegex = /^(?![a-zA-z]+$)(?!\d+$)(?![!@#$%^&*]+$)[a-zA-Z\d!@#$%^&*]+$/;
  // 弱
  let enoughRegex = /^(?:\d+|[a-zA-Z]+|[!@#$%^&*]+)$/; //弱

  if (enoughRegex.test(value)) level = 1;
  if (mediumRegex.test(value)) level = 2;
  if (strongRegex.test(value)) level = 3;

  return level;
};
