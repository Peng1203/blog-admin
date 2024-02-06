import { ElNotification, ElMessage } from 'element-plus';

type MsgTypeEnum = 'success' | 'warning' | 'info' | 'error';

type NotificationTypeEnum = 1 | 2;

/**
 * notificationType
 *  1 为ElNotification 通知组件
 *  2 为ElMessage 消息提示组件
 */
export const useNotificationMsg = (
  title: string,
  message: string,
  msgType: MsgTypeEnum = 'success',
  notificationType: NotificationTypeEnum = 1,
  duration: number = 3000
) => {
  if (notificationType === 1) {
    ElNotification({
      title,
      message,
      duration,
      type: msgType,
    });
  } else {
    ElMessage({
      duration,
      message,
      type: msgType,
    });
  }
};
