import { Canceler } from 'axios'

export enum StatusEnum {
  PENDING = 0,
  UPLOADING = 1,
  SUCCESS = 2,
  FAIL = 3,
}

export interface FileData {
  name: string
  type: string
  size: number
  /** 上传成功 资源路径 */
  url: string
  /** 文件的状态 有三种状态 上传前(待上传) 上传中(上传进度条) 上传后(成功 / 失败) */
  status: StatusEnum
  /** 文件的 MIME 类型 */
  mimeType: string
  fileData?: File
  /** 上传进度 */
  uploadProcess?: number
  /** 仅针对图片类型 是否开启压缩 */
  isCompress?: boolean
  errMsg?: string
  /** 取消上传的函数 */
  cancel?: Canceler
  /** 暂停状态 当 status 为上次中时生效 */
  pause?: boolean
  [key: string]: any
}
