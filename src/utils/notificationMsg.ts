import { ElNotification, ElMessage } from 'element-plus';

type MsgTypeEnum = 'success' | 'Warning' | 'Info' | 'Error';

/**
 * 1 为ElNotification 通知组件
 * 2 为ElMessage 消息提示组件
 */
type NotificationTypeEnum = 1 | 2;

export const useNotificationMsg = (
  title: string,
  message: string,
  msgType: MsgTypeEnum = 'success',
  notificationType: NotificationTypeEnum = 1
) => {
  if (notificationType === 1) {
    ElNotification({
      title,
      message
      type: msgType
    })
  }
};
