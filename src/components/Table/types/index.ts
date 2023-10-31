export interface TableAttribute {
  data: any[];
  columns: ColumnItem[];
  border?: boolean;
  isSelection?: boolean;
  checkBoxIsEnableCallBack?: Function;
  loading?: boolean;
  /** 过滤列 */
  isFilterShowColumn?: boolean;
  /** 是否需要分页器 */
  isNeedPager?: boolean;
  /** 分页器信息 */
  pagerInfo?: PageInfo;
  /** 尺寸 */
  size?: SizeEnum;
  /** 斑马纹 */
  stripe?: boolean;
  emptyText?: string;
}

export interface BaseTableAttribute {
  data: any[];
  columns: ColumnItem[];
  border?: boolean;
  isSelection?: boolean;
  checkBoxIsEnableCallBack?: () => {};
  loading?: boolean;
  isFilterShowColumn?: boolean;
  isNeedPager?: boolean;
  pagerInfo?: PageInfo;
}
// 表格column 可选属性
export interface ColumnItem<T = any> {
  label: string;
  prop: keyof T | 'operation';
  width?: number | string | 'auto';
  minWidth?: number | string;
  sort?: boolean | 'custom';
  tooltip?: boolean;
  fixed?: boolean | 'left' | 'right';
  slotName?: string;
  align?: 'left' | 'center' | 'right';
  childrenColumns?: ColumnItem<T>[];
  classNname?: string;
  [key: string]: any;
}
// 分页器信息
export interface PageInfo {
  page: number;
  pageSize: number;
  total: number;
  pageSizeList?: number[];
}

export type OrderEnum = 'ASC' | 'DESC' | '';

// 表格排序切换 参数
export interface ColumnChangeParams {
  column: string;
  order: OrderEnum;
}
// 分页器切换 参数
export interface PageChangeParams {
  page: number;
  pageSize: number;
}
