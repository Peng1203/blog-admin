declare interface PengTableAttribute {
  data: any[]
  columns: ColumnItem[]
  border?: boolean
  isSelection?: boolean
  checkBoxIsEnableCallBack?: function
  loading?: boolean
  isFilterShowColumn?: boolean
  isNeedPager?: boolean
  pagerInfo?: PageInfo
}
// 表格column 可选属性
declare interface ColumnItem<T = any> {
  label: string
  prop?: string
  width?: number | string | 'auto'
  minWidth?: number | string
  sort?: boolean | 'custom'
  tooltip?: boolean
  fixed?: boolean | 'left' | 'right'
  slotName?: string
  align?: 'left' | 'center' | 'right'
  childrenColumns?: ColumnItem[]
  [key: string]: T
}
// 分页器信息
declare interface PageInfo {
  page: number
  pageSize: number
  total: number
  pageSizeList?: number[]
}

type OrderEnum = 'ASC' | 'DESC' | ''

// 表格排序切换 参数
interface ColumnChangeParams {
  column: string
  order: OrderEnum
}
// 分页器切换 参数
interface PageChangeParams {
  page: number
  pageSize: number
}
