export interface SelectAttribute {
  modelValue: any;
  width?: string;
  options: any[];
  size?: SizeEnum;
  placeholder?: string;
  disabled?: boolean;
  multiple?: boolean;
  // valueKey?: string
  clearable?: boolean;
  filterable?: boolean;
  // 是否使用虚拟化选择器
  virtual?: boolean;
}
