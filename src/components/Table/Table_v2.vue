<template>
  <!-- $attrs---{{ $attrs }}
  <br />
  $props---{{ $props }}
  <br /> -->
  <!-- v-bind="$attrs" -->
  <!-- {{ Object.keys(slots) }} -->
  page --- {{ page }}
  <br />
  myPage --- {{ myPage }}
  <br />
  pageSize ---{{ pageSize }}
  <br />
  myPageSize ---{{ myPageSize }}
  <el-table
    v-bind="$props"
    v-loading="loading"
    :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    @selection-change="handleSelectionChange"
    @filter-change="handleFilterTable"
  >
    <!-- 复选功能 -->
    <el-table-column
      width="40"
      type="selection"
      v-if="selection"
      :align="'center'"
    />

    <!-- 展开行功能 -->
    <el-table-column
      width="50"
      type="expand"
      :align="'center'"
      v-if="slots.expand"
    >
      <template #default="scope">
        <slot
          name="expand"
          v-bind="scope"
        />
      </template>
    </el-table-column>

    <!-- 索引列 -->
    <el-table-column
      type="index"
      v-if="index"
      :index="indexMethod"
    />

    <template
      :key="i"
      v-for="({ sort, tooltip, slotName, ...argsAttr }, i) of tableColumns"
    >
      <!-- 自定义某列 -->
      <el-table-column
        v-if="slotName"
        v-bind="argsAttr"
        :sortable="sort"
        :show-overflow-tooltip="tooltip"
      >
        <template #default="scope">
          <slot
            :prop="argsAttr.prop"
            :scope="scope"
            :row="scope.row"
            :name="slotName"
          />
        </template>
      </el-table-column>

      <el-table-column
        v-else
        v-bind="argsAttr"
        :sortable="sort"
        :show-overflow-tooltip="tooltip"
      />
    </template>

    <!-- 操作列 -->
    <el-table-column
      label="操作"
      v-if="operationColumn"
    >
      <template #header>
        <slot name="operationHeaderSlot" />
      </template>

      <template #default="scope">
        <slot
          :scope="scope"
          :row="scope.row"
          name="operationStartSlot"
        />

        <PengButton
          circle
          title="添加"
          type="success"
          icon="Plus"
          @click="handleAddBtn(scope.row)"
          v-if="operationColumnBtns.includes('add')"
        />

        <PengButton
          circle
          title="修改信息"
          type="primary"
          icon="Edit"
          @click="handleEditBtn(scope.row)"
          v-if="operationColumnBtns.includes('edit')"
        />

        <el-popconfirm
          width="auto"
          icon="DeleteFilled"
          icon-color="#f56c6c"
          :title="`是否删除 ?`"
          @confirm="handleDelBtn(scope.row)"
          v-if="operationColumnBtns.includes('delete')"
        >
          <template #reference>
            <PengButton
              circle
              title="删除"
              type="danger"
              icon="Delete"
            />
          </template>
        </el-popconfirm>

        <PengButton
          circle
          title="查看"
          type="info"
          icon="View"
          @click="handleView(scope.row)"
          v-if="operationColumnBtns.includes('view')"
        />

        <slot
          :scope="scope"
          :row="scope.row"
          name="operationEndSlot"
        />
      </template>
    </el-table-column>

    <!-- 过滤 当有二级表头时也不展示 -->
    <el-table-column
      width="30"
      fixed="right"
      align="center"
      column-key="filter"
      class-name="filter-column-header"
      filter-placement="bottom"
      :filters="filterList"
      v-if="filterColumn"
    >
      <template #header>
        <el-icon>
          <Tools />
        </el-icon>
      </template>
    </el-table-column>

    <template
      #append
      v-if="slots.append"
    >
      <slot name="append" />
    </template>
  </el-table>

  <!-- :disabled="disabled" -->
  <el-pagination
    mt15
    v-if="pager"
    background
    :size="size"
    :total="total"
    :page-sizes="[5, 10, 30, 50, 100, 200]"
    v-model:current-page="myPage"
    v-model:page-size="myPageSize"
    layout="total, sizes, prev, pager, next, jumper"
    @size-change="handlePageSzieChange"
    @current-change="handlePageChange"
  />
</template>

<script setup lang="ts" generic="T">
import { useSlots, onMounted, computed, ref } from 'vue'
import { SlotProps, SlotOperationProps, ColumnItem, OperationType } from './'
import { ElTable, ElTableColumn, ElPagination } from 'element-plus'
import type { TableProps, TableInstance, TableColumnInstance, TableColumnCtx } from 'element-plus'

// 获取 ElTable 组件的实例类型
// type ElTableInstance = InstanceType<typeof ElTable>

export type Props<T> = TableProps<T> & {
  /** 数据列表 */
  data: T[]
  columns: ColumnProps<T>[]
  loading?: boolean
  selection?: boolean
  /** 过滤列 */
  filterColumn?: boolean
  /** 索引列 */
  index?: boolean
  /** 自定义索引 */
  indexMethod?: (index: number) => number
  /** 操作列 */
  operationColumn?: boolean
  operationColumnBtns?: [OperationType?, OperationType?, OperationType?, OperationType?]

  /** 分页器 */
  pager?: boolean
  // page?: number
  // pageSize?: number
  total?: number
}

export type ColumnProps<T> = Omit<TableColumnCtx<T>, 'sortable' | 'showOverflowTooltip'> & {
  label: string
  // prop: keyof T | 'operation'
  prop: keyof T extends string ? keyof T : never
  sort?: boolean | 'custom'
  tooltip?: boolean
  fixed?: boolean | 'left' | 'right'
  slotName?: `${keyof T extends string ? keyof T : never}Slot`
  align?: 'left' | 'center' | 'right'
  // [key: string]: any
}

// 定义组件属性
const props = withDefaults(defineProps<Props<T>>(), {
  // 扩展属性默认值
  loading: false,
  selection: false,
  filterColumn: false,
  index: false,
  indexMethod: index => index + 1,
  rowKey: 'id',
  size: 'default',
  stripe: true,
  operationColumn: false,
  operationColumnBtns: () => ['edit', 'delete'],

  // 分页器属性
  pager: true,
  // page: 0,
  // pageSize: 0,
  total: 0,

  // eltable 选填属性默认值
  fit: true,
  showHeader: true,
  emptyText: '暂无数据',
  defaultExpandAll: false,
})

// 为组件命名 方便递归调用
defineOptions({
  name: 'PengTable',
})

// 定义插槽 为插槽接受值添加类型
const slots = useSlots()
type SlotsType = {
  /** 展开行内容插槽 */
  expand(scope: { row: T; expanded: boolean; $index: number; store: any }): any
  /** 插入至表格最后一行之后的内容 */
  append(): any

  /** 操作列 自动表头内容 */
  operationHeaderSlot(): any
  /** 操作行 内容前插槽 */
  operationStartSlot(props: SlotOperationProps<T>): any
  /** 操作行 内容后插槽 */
  operationEndSlot(props: SlotOperationProps<T>): any
} & { [K in keyof typeof slots]: (props: SlotProps<T>) => any }
defineSlots<SlotsType>()

// 表格展示的 columns
interface filterItem {
  text: string
  value: any
}
const filterData = ref<Array<keyof T>>([])

const tableColumns = computed<ColumnItem<T>[]>(() => {
  if (!filterData.value.length) return props.columns
  return props.columns.filter(colums => filterData.value.includes(colums.prop as any))
})

const filterList = computed<filterItem[]>(() =>
  tableColumns.value.map(item => ({ text: item.label, value: item.prop }))
)
const handleFilterTable = (filters: any) => {
  const { filter } = filters
  if (!filter) return
  // @ts-ignore
  if (!filter.length) return (tableColumns.value = props.columns)
  // @ts-ignore
  filterData.value = filter
}

const emits = defineEmits([
  'columnSort',
  'pageChange',
  'pageSizeChange',
  'pagerChange',
  'selectionChange',
  'rowClick',
  'dbRowClick',
  'mouseRightRowClick',
  'addBtn',
  'editBtn',
  'deleteBtn',
  'viewBtn',
])

// 复选内容变化事件
const handleSelectionChange = (selectVal: T[]) => emits('selectionChange', selectVal)

// 操作按钮事件
const handleAddBtn = (row: T) => emits('addBtn', row)
const handleEditBtn = (row: T) => emits('editBtn', row)
const handleDelBtn = (row: T) => emits('deleteBtn', row)
const handleView = (row: T) => emits('viewBtn', row)

// 分页器
let myPage = defineModel<number>('page')
let myPageSize = defineModel<number>('pageSize')

const handlePageChange = (newPage: number) => {
  myPage.value = newPage
}

const handlePageSzieChange = (newPageSize: number) => {
  myPage.value = 1
  myPageSize.value = newPageSize
}

onMounted(() => {
  // tableColumns.value = props.columns;
})
</script>
