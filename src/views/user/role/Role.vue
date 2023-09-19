<template>
  <div class="system-user-container layout-padding">
    <el-card shadow="hover" class="layout-padding-auto">
      <!-- 顶部 -->
      <!-- <IconSelector v-model="test" /> -->
      <div class="mb15 flex-sb-c">
        <el-button
          v-auth="'ADD'"
          size="default"
          type="success"
          class="ml10"
          @click="addDialogRef.addRoleDialogStatus = true"
        >
          <!-- @click="addAuthDialogRef.addAuthPermissonDialogStatus = true" -->
          <Peng-Icon name="icon-jiaoseguanli1" />
          <span style="margin-left: 5px">添加角色</span>
        </el-button>

        <Peng-Search
          placeholder="请输入角色名称或角色描述"
          :loading="tableState.loading"
          v-model="tableState.queryStr"
          @search="handleSearch"
        />
      </div>

      <Peng-Table
        :isFilterShowColumn="true"
        :data="tableState.data"
        :loading="tableState.loading"
        :pagerInfo="tableState.pagerInfo"
        :columns="tableState.tableColumns"
        @columnSort="handleColumnChange"
        @pageNumOrSizeChange="handlePageInfoChange"
      >
        <template #queryHighNight="{ row, prop }">
          <div class="flex-s-c">
            <span
              class="ml5"
              v-html="queryStrHighlight(row[prop], tableState.queryStr)"
            />
          </div>
        </template>

        <!-- 操作 -->
        <template #operation="{ row }">
          <!-- :disabled="row.id === 1" -->
          <el-button
            circle
            v-auth="'EDIT'"
            title="修改角色信息"
            size="small"
            type="primary"
            :icon="Edit"
            @click="handleEditRole(row)"
          />
          <!-- @click="handleEditAuthPermission(row)" -->
          <el-button
            circle
            v-auth="'DELETE'"
            title="删除"
            size="small"
            type="danger"
            :icon="Delete"
            @click="handleDelRole(row)"
          />
          <!-- @click="handleDeleteAuthPermission(row)" -->
          <!-- :disabled="row.id === 1" -->
        </template>
      </Peng-Table>
    </el-card>

    <!-- 编辑角色抽屉 -->
    <EditRoleDrawer
      :editRow="editRow"
      :menus="tableState.menuTreeData"
      ref="editDrawerRef"
      @updateList="handleUpdate"
    />

    <!-- 添加角色对话框 -->
    <AddRoleDialog
      ref="addDialogRef"
      :menus="tableState.menuTreeData"
      @updateList="handleUpdate"
    />
  </div>
</template>

<script setup lang="ts" name="SystemRole">
import { defineAsyncComponent, ref, onMounted, reactive } from 'vue'
import { AxiosResponse } from 'axios'
// import { RouteRecordRaw } from 'vue-router'
import { ElMessageBox, ElMessage } from 'element-plus'
// import { storeToRefs } from 'pinia'
// import { useRoutesList } from '@/stores/routesList'
// import { setBackEndControlRefreshRoutes } from "@/router/backEnd";
import { Delete, Edit } from '@element-plus/icons-vue'
import { useUserAuthList } from '@/stores/userAuthList'
import { queryStrHighlight } from '@/utils/queryStrHighlight'
import { useRoleApi } from '@/api/role/index'

const { getRoleList, deleteRole } = useRoleApi()

const userAuthStore = useUserAuthList()

// 表格参数
const tableState = reactive({
  loading: false,
  data: ref<Role[]>([]),
  tableColumns: ref<ColumnItem[]>([
    {
      label: '角色名称',
      prop: 'roleName',
      minWidth: 130,
      tooltip: true,
      fixed: 'left',
      slotName: 'queryHighNight',
    },
    {
      label: '角色描述',
      prop: 'roleDesc',
      minWidth: 150,
      sort: false,
      tooltip: true,
      slotName: 'queryHighNight',
    },
    // { label: '菜单', prop: 'menus', minWidth: 170, tooltip: true },
    // {
    //   label: '操作权限',
    //   prop: 'operationPermissions',
    //   minWidth: 100,
    //   tooltip: true,
    // },
    { label: '更新时间', prop: 'updateTime', minWidth: 200, sort: true },
    { label: '创建时间', prop: 'createdTime', minWidth: 200, sort: true },
    {
      label: '操作',
      prop: 'operation',
      minWidth: 95,
      slotName: 'operation',
      fixed: 'right',
    },
  ]),
  column: '',
  order: '',
  queryStr: '',

  // 菜单树形数据
  menuTreeData: ref<any[]>([]),

  // 分页器信息
  pagerInfo: ref<PageInfo>({
    page: 1,
    pageSize: 10,
    total: 0,
  }),
})

// 获取角色表格数据
const getRoleTableData = async () => {
  try {
    tableState.loading = true
    const { pagerInfo, column, order, queryStr } = tableState
    const params = {
      queryStr,
      column,
      order,
      page: pagerInfo.page,
      pageSize: pagerInfo.pageSize,
    }
    const { data: res }: AxiosResponse<RoleDate> = await getRoleList(params)
    const { code, message, data, total } = res
    if (code !== 200 || message !== 'Success') return
    tableState.data = data
    tableState.pagerInfo.total = total
  } catch (e) {
    console.log(e)
  } finally {
    tableState.loading = false
  }
}

// 分页器修改时触发
const handlePageInfoChange = ({ page, pageSize }: PageChangeParams) => {
  tableState.pagerInfo.page = page
  tableState.pagerInfo.pageSize = pageSize
  getRoleTableData()
}

// 搜索
const handleSearch = () => {
  tableState.pagerInfo.page = 1
  getRoleTableData()
}

// 表格排序
const handleColumnChange = ({ column, order }: ColumnChangeParams) => {
  tableState.column = column
  tableState.order = order
  getRoleTableData()
}

// 处理删除角色
const handleDelRole = async (row: Role) => {
  const confirmRes = await ElMessageBox.confirm(
    `此操作将永久角色：“${row.roleName}”，是否继续?`,
    '提示',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).catch(() => false)
  if (!confirmRes) return
  const delRes = await deleteRoleById(row.id)
  if (delRes) getRoleTableData()
}

// 删除角色
const deleteRoleById = async (id: number): Promise<boolean> => {
  try {
    const { data: res } = await deleteRole(id)
    const { code, data, message } = res
    if (code !== 200 || message !== 'Success') {
      ElMessage.error(data)
      return false
    }
    ElMessage.success(data)
    return true
  } catch (e) {
    console.log(e)
    return false
  }
}

// 处理编辑角色
const editRow = ref()
const EditRoleDrawer = defineAsyncComponent(
  () => import('./components/EditRole.vue')
)
const editDrawerRef = ref<RefType>(null)
const handleEditRole = (row: Role) => {
  editRow.value = JSON.parse(JSON.stringify(row))
  editDrawerRef.value.editDrawerStatus = true
}

// 处理添加角色
const AddRoleDialog = defineAsyncComponent(
  () => import('./components/AddRole.vue')
)
const addDialogRef = ref<RefType>(null)

// 更新列表
const handleUpdate = () => {
  getRoleTableData()
  userAuthStore.getAllRoleList(true)
}

// 页面加载时
onMounted(async () => {
  getRoleTableData()
  await userAuthStore.getAllMenuList()
  tableState.menuTreeData = userAuthStore.allMenuList
})
</script>

<style lang="scss" scoped>
.system-user-container {
  :deep(.el-card__body) {
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: auto;
    .el-table {
      flex: 1;
    }
  }
}
</style>
