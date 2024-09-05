import { ref, reactive, type Ref } from 'vue'
import { RequestListParams } from 'Api'
import _ from 'lodash'
import { ColumnItem } from '@/components/Table'
interface CommonParams {
  page: number
  pageSize: number
  queryStr: string
  column: string
  order: string
}
 
interface TableState<T> {
  loading: boolean
  selectVal: Ref<T[]>
  data: Ref<T[]>
  columns: Ref<ColumnItem<T>[]>
  column: string
  order: string
  queryStr: string
  page: number
  pageSize: number
  total: number
}

type Return1<T> = {
  tableState: TableState<T>
  setLoading: (isLoading: boolean) => void
  setColumns: (columns: ColumnItem<T>[]) => void
  setData: (data: T[]) => void
  setTotal: (total: number) => void
  setPageInfo: (page: any, pageSize: any) => void
  startLoading: () => boolean
  stopLoading: () => boolean
  getCommonParams: (exclude?: Array<keyof CommonParams>) => RequestListParams
}

type Return2<T, K extends string> = {
  [P in K as `${K}TableState`]: TableState<T>
} & {
  [P in K as `set${Capitalize<P>}Loading`]: (isLoading: boolean) => void
} & {
  [P in K as `set${Capitalize<P>}Columns`]: (columns: ColumnItem<T>[]) => void
} & {
  [P in K as `set${Capitalize<P>}Data`]: (data: T[]) => void
} & {
  [P in K as `set${Capitalize<P>}Total`]: (total: number) => void
} & {
  [P in K as `set${Capitalize<P>}PageInfo`]: (page: any, pageSize: any) => void
} & {
  [P in K as `start${Capitalize<P>}Loading`]: () => boolean
} & {
  [P in K as `stop${Capitalize<P>}Loading`]: () => boolean
} & {
  [P in K as `get${Capitalize<P>}CommonParams`]: (exclude?: Array<keyof CommonParams>) => RequestListParams
}

// 函数重载声明
export function useTableState<T>(): Return1<T>
export function useTableState<T, K extends string>(key: K): Return2<T, K>

export function useTableState<T, K extends string>(key?: K) {
  const tableState = reactive({
    loading: false,
    selectVal: ref<T[]>([]),

    data: ref<T[]>([]),
    columns: ref<ColumnItem<T>[]>([]),
    column: '',
    order: '',
    queryStr: '',

    page: 1,
    pageSize: 10,
    total: 0,
  })

  const getCommonParams = (exclude: Array<keyof CommonParams> = []) => {
    const { column, order, queryStr, page, pageSize } = tableState
    const params = { column, order, queryStr, page, pageSize }
    return _.omit(params, exclude) as RequestListParams
  }

  const setLoading = (isLoading: boolean) => {
    tableState.loading = isLoading
  }

  const setColumns = (columns: ColumnItem<T>[]) => {
    tableState.columns = columns
  }

  const setData = (data: T[]) => {
    tableState.data = data
  }

  const setTotal = (total: number) => {
    tableState.total = total
  }

  const setPageInfo = (page, pageSize) => {
    page && (tableState.page = page)
    pageSize && (tableState.pageSize = pageSize)
  }

  const startLoading = () => (tableState.loading = true)

  const stopLoading = () => (tableState.loading = false)

  return key
    ? ({
        [`${key}TableState`]: tableState,
        [`set${capitalize(key)}Loading`]: setLoading,
        [`set${capitalize(key)}Columns`]: setColumns,
        [`set${capitalize(key)}Data`]: setData,
        [`set${capitalize(key)}Total`]: setTotal,
        [`set${capitalize(key)}PageInfo`]: setPageInfo,
        [`start${capitalize(key)}Loading`]: startLoading,
        [`stop${capitalize(key)}Loading`]: stopLoading,
        [`get${capitalize(key)}CommonParams`]: getCommonParams,
      } as Return2<T, K>)
    : ({
        tableState,
        setLoading,
        setColumns,
        setData,
        setTotal,
        setPageInfo,
        startLoading,
        stopLoading,
        getCommonParams,
      } as unknown as Return1<T>)
}

function capitalize<T extends string>(str: T): Capitalize<T> {
  return (str.charAt(0).toUpperCase() + str.slice(1)) as Capitalize<T>
}
