export type FormItemEnum = 'slot' | 'input' | 'select' | 'switch' | 'checkbox' | 'radio' | 'pwd' | 'transparent' | 'textarea';

// 封装表单formItem属性
export interface FormItem {
  // type: string // slot input select
  type: FormItemEnum; // slot input select
  label: string;
  prop: string;
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
  options?: OperationItem[] | RadioItem[] | any;
  multiple?: boolean; // 开启多选
  tText?: string | number;
  fText?: string | number;
  tValue?: string | number | boolean;
  fValue?: string | number | boolean;
  /**
   * 密码强度等级
   */
  strengthLevel?: 0 | 1 | 2 | 3;
  [key: string]: any;
  /**
   * 输入框 自动填充历史值
   */
  autocomplete?: boolean;
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
