import { UploadRawFile, UploadRequestOptions } from 'element-plus';
import { Awaitable } from 'element-plus/es/utils';

export interface FormAttribute {
  /**
   * 表单数据
   */
  modelValue: Record<string, unknown>;
  /**
   * 表单配置项
   */
  formItems: FormItem[];
  /**
   * label 宽度
   */
  labelW?: string | number;
  /**
   * label 定位
   */
  labelP?: string;
  /**
   * 表单组件尺寸 大小
   */
  size?: SizeEnum;
  /**
   * 是否禁用该表单内的所有组件
   */
  disabled?: boolean;
  /**
   * 行内表单模式
   */
  inline?: boolean;
  /**
   * 每行间隔
   */
  gutter?: number;
}

export type FormItemEnum =
  | 'slot'
  | 'input'
  | 'select'
  | 'switch'
  | 'checkbox'
  | 'radio'
  | 'pwd'
  | 'transparent'
  | 'textarea'
  | 'upload';

export type AcceptEnum = '.png' | '.jpg' | '.jpeg' | '.gif' | '.webp' | '.txt' | '.mp3' | '.mp4';

// 封装表单formItem属性
export type FormItem<T = any> = BaseFormItem<T> & UploadLimit;

/** 封装表单formItem基础属性 */
export interface BaseFormItem<T = any> {
  // type: string // slot input select
  type: FormItemEnum; // slot input select
  label: string;
  prop: keyof T | T;
  size?: string;
  placeholder?: string;
  labelItemW?: string | number;
  required?: boolean;
  rules?: any[];
  disabled?: boolean;
  span?: number;
  offset?: number;
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
  isShow?: boolean;
  slotName?: string;
  /** 下拉框的数据 复选框数据 */
  options?: OperationItem[] | RadioItem[] | any;
  /** 开启多选 */
  multiple?: boolean;
  /** switch true 文本 */
  tText?: string | number;
  /** switch false 文本 */
  fText?: string | number;
  /** switch true 值 */
  tValue?: string | number | boolean;
  /** switch false 值 */
  fValue?: string | number | boolean;
  /** 宽度 */
  width?: number;
  /** 高度 */
  height?: number;
  /**
   * 密码强度等级
   */
  strengthLevel?: 0 | 1 | 2 | 3;
  /**
   * 输入框 自动填充历史值
   */
  autocomplete?: boolean;
  /** 是否显示已上传文件列表 */
  fsShow?: boolean;
  /** 自动上传 */
  autoUpload?: boolean;
  /** 文件上传前的回调 返回 false 或者 Promise.reject() 停止上传 */
  // beforeUploadCb?: (rawFile: UploadRawFile) => Awaitable<void | undefined | null | boolean | File | Blob>;
  /** 自定义上传函数 */
  customUploadCb?: (options: UploadRequestOptions) => any;
  [key: string]: any;
}

/** 文件上传的限制属性 */
export interface UploadLimit {
  /** 上传文件类型 */
  accept?: AcceptEnum[];
  /** 允许上传文件的最大数量 */
  limit?: number;
  /** 单个文件最大大小 Mb */
  fileMaxSize?: number;
}

// 封装表单 下拉框 / switch 组件 自定义事件传递参数
export type FormItemChangeType = {
  newVal: any;
  prop: string;
  index: number;
};

// 下拉数据 Options 项
export interface OperationItem {
  label: string;
  value: string | number | boolean;
  [key: string]: any;
}

// radio 菜单 Options 项
export interface RadioItem {
  value: number | string | null;
  label: number | string;
  disabled?: boolean;
  border?: boolean;
  size?: 'large' | 'default' | 'small';
}
