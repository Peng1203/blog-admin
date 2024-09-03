<template>
  <!-- $attrs---{{ $attrs }}
  <br />
  $props---{{ $props }}
  <br /> -->
  <!-- v-bind="$attrs" -->
  <!-- {{ Object.keys(slots) }} -->
  <!-- page --- {{ page }}
  <br />
  myPage --- {{ myPage }}
  <br />
  pageSize ---{{ pageSize }}
  <br />
  myPageSize ---{{ myPageSize }}
  <br />
  {{ tableColumns }}
  <br />
  {{ loading }} -->
  <el-table
    ref="tableRef"
    v-bind="$props"
    v-loading="loading"
    :row-style="getRowStyle"
    :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    @selection-change="handleSelectionChange"
    @filter-change="handleFilterTable"
    @sort-change="handleColumnSort"
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
      <!-- :filter-method="handleFilterTable" -->
      <!-- :filterM -->
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
import { Props, ColumnItem, SlotProps, OrderProp, SlotsType, Emits, SortInfo } from './'
import { ElTable, ElTableColumn, ElPagination } from 'element-plus'
import type { TableInstance } from 'element-plus'

// 获取 ElTable 组件的实例类型
// type ElTableInstance = InstanceType<typeof ElTable>

// 定义组件属性
const props = withDefaults(defineProps<Props<T>>(), {
  // 扩展属性默认值
  // loading: false,
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

  autoLoadData: true,
})

// 为组件命名 方便递归调用
defineOptions({
  name: 'PengTable',
})

// 定义插槽 为插槽接受值添加类型
const slots = useSlots()
defineSlots<SlotsType<T> & { [K in keyof typeof slots]: (props: SlotProps<T>) => any }>()

const loading = defineModel<boolean>('loading')
const handleGetData = async () => {
  if (!props.autoLoadData) return
  try {
    loading.value = true
    await props?.getData?.()
  } catch (e) {
    console.log('e', e)
  } finally {
    loading.value = false
  }
}

// 表格展示的 columns
const filterData = ref<Array<keyof T>>([])

const tableColumns = computed<ColumnItem<T>[]>(() => {
  if (!filterData.value.length) return props.columns
  return props.columns.filter(colums => !filterData.value.includes(colums.prop as any))
})

const filterList = computed<any[]>(() => props.columns.map(item => ({ text: item.label, value: item.prop })))
const handleFilterTable = (filters: any) => {
  const { filter } = filters
  if (!filter) return
  // @ts-ignore
  // if (!filter.length) return (tableColumns.value = props.columns)
  filterData.value = filter
}

// const emits = defineEmits<Emits>()
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
const handleSelectionChange = (selectVal: T[]) => {
  emits('selectionChange', selectVal)
}

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
  emits('pageChange', newPage)
  emits('pagerChange', { page: newPage, pageSize: myPageSize.value })
  handleGetData()
}

const handlePageSzieChange = (newPageSize: number) => {
  myPage.value = 1
  myPageSize.value = newPageSize
  emits('pageSizeChange', newPageSize)
  emits('pagerChange', { page: 1, pageSize: newPageSize })
  handleGetData()
}

// 排序
const myColumn = defineModel<string>('column')
const myOrder = defineModel<string>('order')
const handleColumnSort = (sortInfo: SortInfo) => {
  const orderProp: OrderProp = {
    ascending: 'ASC',
    descending: 'DESC',
  }
  const column = orderProp[sortInfo.order] ? sortInfo.prop : ''
  const order = orderProp[sortInfo.order] || ''
  myColumn.value = column
  myOrder.value = order
  emits('columnSort', { column, order })
  handleGetData()
}

const getRowStyle = ({ row }) => {
  return { '--process': `${row.process}%` }
}

// const tableRef = useComponentRef(ElTable)
const tableRef = ref<TableInstance | null>(null)

defineExpose(
  new Proxy(
    {},
    {
      get(_target, key) {
        return tableRef.value?.[key]
      },
      has(_target, key) {
        return key in tableRef.value
      },
    }
  )
)

onMounted(() => {
  handleGetData()
})
</script>
<style scoped lang="scss">
:deep(.el-table__row) {
  position: relative;
  &::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    z-index: 99;
    // width: 100%;
    width: var(--process);
    height: 2px;
    transition: width 0.3s ease;
    background-color: #409eff;
  }
}
</style>

<style>
.el-table .fail-row {
  --el-table-tr-bg-color: rgba(244, 67, 54, 0.1);
}
.el-table .success-row {
  --el-table-tr-bg-color: rgba(76, 175, 80, 0.1);
}
</style>
