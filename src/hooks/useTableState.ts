import { ref, reactive } from 'vue'
import { ColumnItem } from '@/components/Table'

export function useTableState<T>() {
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

  // Optionally, you can add methods to handle sorting, filtering, pagination, etc.
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
    tableState.page = page
    tableState.pageSize = pageSize
  }

  function startLoading() {
    tableState.loading = true
  }

  function stopLoading() {
    tableState.loading = false
  }

  return {
    tableState,
    setLoading,
    setColumns,
    setData,
    setTotal,
    setPageInfo,
    startLoading,
    stopLoading,
  }
}
