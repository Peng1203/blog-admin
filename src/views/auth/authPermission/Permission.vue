<template>
  <div class="table-container layout-padding">
    <el-card
      shadow="hover"
      class="layout-padding-auto"
    >
      <!-- 顶部 -->
      <div class="mb15 flex-sb-c">
        <el-button
          size="default"
          type="success"
          @click="handleAddPermission(0)"
        >
          <i class="iconfont icon-permissions-o" />
          创建权限分组
        </el-button>

        <Peng-Search
          placeholder="请输入权限标识名称"
          :loading="tableState.loading"
          v-model="tableState.queryStr"
          @search="handleSearch"
        />
      </div>
      <Peng-Table
        defaultExpandAll
        operationColumn
        isFilterShowColumn
        :operationColumnWidth="45 * 3"
        :operationColumnBtns="['edit', 'delete']"
        :is-need-pager="false"
        :data="tableState.data"
        :loading="tableState.loading"
        :pagerInfo="tableState.pagerInfo"
        :columns="tableState.tableColumns"
        @columnSort="handleColumnChange"
        @pageNumOrSizeChange="handlePageInfoChange"
        @editBtn="handleEditAuthPermission"
        @deleteBtn="handleDeleteAuthPermission"
      >
        <!-- 权限标识名称 权限标识代码 查询高亮 -->
        <template #queryHighlight="{ row, prop }">
          <span v-html="queryStrHighlight(row[prop], tableState.queryStr)" />
        </template>

        <!-- 请求方式 -->
        <template #requestMethodSlot="{ row, prop }">
          <el-tag
            w60
            style="border: none"
            v-if="row[prop]"
            effect="dark"
            :color="handleMethodTagColor(row[prop])"
          >
            {{ handleMethodTagText(row[prop]) }}
          </el-tag>
        </template>

        <!-- 操作 -->
        <template #operationStartSlot="{ row }">
          <el-button
            circle
            title="添加"
            size="small"
            type="success"
            :icon="Plus"
            v-if="[null, ''].includes(row.permissionCode)"
            @click="handleAddPermission(row)"
          />
        </template>
      </Peng-Table>
    </el-card>

    <!-- 修改权限标识信息 -->
    <EditAuthPermissonDrawer
      ref="editAuthDrawerRef"
      :editRow="editAuthRowInfo"
      :permissionCodeOptions="permissionCodeOptions"
      @updateList="handleUpdate"
    />

    <!-- 添加权限标识 -->
    <AddAuthPermissonDialog
      ref="addAuthDialogRef"
      :parentId="parentId"
      :permissionCodeOptions="permissionCodeOptions"
      @updateList="handleUpdate"
    />
  </div>
</template>

<script lang="ts" setup name="SystemAuthPermission">
import { ref, reactive, onMounted, defineAsyncComponent } from 'vue'
import { usePermissionInfo } from '@/stores/permissionList'
import { usePermissionApi } from '@/api'
import { Plus } from '@element-plus/icons-vue'
import { ColumnItem, PageInfo, PageChangeParams, ColumnChangeParams } from '@/components/Table'
import { PermissionData, PermissionListData } from './types'
import { queryStrHighlight } from '@/utils/queryStrHighlight'
import { resourceMethodOptions } from './'
import { SelectOptionItem } from '@/components/Select'
import { useNotificationMsg } from '@/utils/notificationMsg'
import { isObject } from 'lodash'

const permissionStore = usePermissionInfo()

const { getPermissions, delAuthPermission, getPermCodeOptions } = usePermissionApi()
// 表格参数
const tableState = reactive({
  loading: false,
  queryStr: '',
  column: '',
  order: '',
  data: ref<PermissionData[]>([]),
  tableColumns: ref<ColumnItem<PermissionData>[]>([
    {
      label: '标识名称',
      prop: 'permissionName',
      minWidth: 160,
      slotName: 'queryHighlight',
    },
    {
      label: '标识CODE',
      prop: 'permissionCode',
      minWidth: 160,
      tooltip: true,
      slotName: 'queryHighlight',
    },
    {
      label: '请求资源',
      prop: 'resourceUrl',
      minWidth: 130,
      tooltip: true,
    },
    {
      label: '请求方式',
      prop: 'resourceMethod',
      minWidth: 130,
      slotName: 'requestMethodSlot',
    },
    { label: '描述', prop: 'description', minWidth: 100, tooltip: true },
    { label: '更新时间', prop: 'updateTime', width: 200, sort: 'custom' },
    { label: '创建时间', prop: 'createTime', width: 200, sort: 'custom' },
  ]),

  // 分页器信息
  pagerInfo: ref<PageInfo>({
    page: 1,
    pageSize: 9999,
    total: 0,
  }),
})

// 获取权限标识数据
const getAuthPermissionTableData = async (): Promise<void> => {
  try {
    tableState.loading = true
    const params = {
      page: tableState.pagerInfo.page,
      pageSize: tableState.pagerInfo.pageSize,
      queryStr: tableState.queryStr,
      column: tableState.column,
      order: tableState.order,
    }
    const { data: res } = await getPermissions<PermissionListData>(params)
    const { code, success, data } = res
    if (code !== 20000 || !success) return
    tableState.data = data.list
    tableState.pagerInfo.total = data.total
  } catch (e) {
    console.log(e)
  } finally {
    tableState.loading = false
  }
}

// 表格排序
const handleColumnChange = ({ column, order }: ColumnChangeParams) => {
  tableState.column = column
  tableState.order = order
  getAuthPermissionTableData()
}

// 分页器修改时触发
const handlePageInfoChange = ({ page, pageSize }: PageChangeParams) => {
  tableState.pagerInfo.page = page
  tableState.pagerInfo.pageSize = pageSize
  getAuthPermissionTableData()
}

// 搜索
const handleSearch = () => {
  tableState.pagerInfo.page = 1
  getAuthPermissionTableData()
}

// 处理删除权限标识
const handleDeleteAuthPermission = async (row: PermissionData) => {
  const delRes = await delAuthPermissionById(row.id)
  if (!delRes) return
  handleUpdate()
}
// 通过ID删除权限标识
const delAuthPermissionById = async (id: number): Promise<boolean> => {
  try {
    const { data: res } = await delAuthPermission<string>(id)
    const { code, data, success } = res
    if (code !== 20000 || !success) return false
    useNotificationMsg('', data)
    return true
  } catch (e) {
    console.log(e)
    return false
  }
}

// 编辑权限标识
const EditAuthPermissonDrawer = defineAsyncComponent(() => import('./components/EditAuthPermisson.vue'))

const editAuthDrawerRef = ref<RefType>(null)
const editAuthRowInfo = ref<PermissionData>({
  id: 0,
  permissionName: '',
  permissionCode: '',
  resourceMethod: 1,
  resourceUrl: '',
  parentId: 0,
  description: '',
  updateTime: '',
  createTime: '',
  children: [],
})
// 编辑权限标识
const handleEditAuthPermission = (row: PermissionData) => {
  editAuthRowInfo.value = JSON.parse(JSON.stringify(row))
  editAuthDrawerRef.value.editDrawerStatus = true
}

// 添加权限标识
const AddAuthPermissonDialog = defineAsyncComponent(() => import('./components/AddAuthPermisson.vue'))
const addAuthDialogRef = ref<RefType>(null)

const handleUpdate = async () => {
  permissionStore.getPermissionData(true)
  await getAuthPermissionTableData()
  // 更新下拉数据的 禁用状态
  getPermissionCodeOptions()
}

const handleMethodTagColor = (value: any) => {
  return resourceMethodOptions.find(item => item.value === value)!.color
}

const handleMethodTagText = (value: any) => {
  return resourceMethodOptions.find(item => item.value === value)!.label
}

// 用于区分添加权限标识的类型 0 为目录
const parentId = ref<number>()

const handleAddPermission = (row?: PermissionData | number) => {
  if (isObject(row)) parentId.value = row?.id
  else parentId.value = 0
  addAuthDialogRef.value.addAuthPermissonDialogStatus = true
}

const permissionCodeOptions = ref<SelectOptionItem[]>([])
const getPermissionCodeOptions = async () => {
  try {
    const { data: res } = await getPermCodeOptions<OptionItem[]>()
    const { code, success, data } = res
    if (code !== 20000 || !success) return
    permissionCodeOptions.value = data.map(item => {
      return {
        ...item,
        disabled: optionItemIsDisabled(item.value, tableState.data),
      }
    })
  } catch (e) {
    console.log('e', e)
  }
}

const optionItemIsDisabled = (value: string, PermissionData: PermissionData[]): boolean => {
  for (let i = 0; i < PermissionData.length; i++) {
    if (PermissionData[i].permissionCode === value) return true

    if (PermissionData[i].children.length) {
      if (optionItemIsDisabled(value, PermissionData[i].children)) return true
    }
  }
  return false
}

onMounted(async () => {
  await getAuthPermissionTableData()
  getPermissionCodeOptions()
})
</script>

<style lang="scss" scoped></style>
