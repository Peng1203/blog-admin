<template>
  <div class="system-user-container layout-padding">
    <el-card shadow="hover" class="layout-padding-auto">
      <!-- 顶部操作 -->
      <div class="mb15 flex-sb-c">
        <div>
          <el-button
            v-auth="'ADD'"
            size="default"
            type="success"
            class="ml10"
            @click="() => (addDialogRef.addUserDialogStatus = true)"
          >
            <!-- @click="handleShowAddDialog" -->
            <el-icon>
              <ele-FolderAdd />
            </el-icon>
            新增用户
          </el-button>

          <el-button
            v-auth="'DELETE'"
            size="default"
            type="danger"
            :disabled="!tableState.selectVal.length"
            @click="handleBatchDelUser"
          >
            <el-icon>
              <Delete />
            </el-icon>
            批量删除
          </el-button>

          <!-- virtual -->
          <Peng-Select
            class="ml12"
            width="150px"
            placeholder="角色过滤"
            v-model="tableState.roleId"
            :options="[
              { label: '全部', value: 0 },
              ...userAuthStore.allRoleOptions,
            ]"
            @change="handleRoleFilter"
          />
        </div>

        <Peng-Search
          placeholder="请输入用户名"
          :loading="tableState.loading"
          v-model="tableState.queryStr"
          @search="handleSearch"
        />
      </div>

      <!-- 用户表格 -->
      <Peng-Table
        :isSelection="true"
        :isFilterShowColumn="true"
        :data="tableState.data"
        :loading="tableState.loading"
        :pagerInfo="tableState.pagerInfo"
        :columns="tableState.tableColumns"
        :checkBoxIsEnableCallBack="handleCheckboxIsEnable"
        @selectionChange="(val: any) => tableState.selectVal = val.map((item: any)=> item.id)"
        @columnSort="handleColumnChange"
        @pageNumOrSizeChange="handlePageInfoChange"
      >
        <!-- 用户名 -->
        <template #uName="{ row, prop }">
          <span v-html="queryStrStyle(row[prop])" />
        </template>
        <!-- 状态 -->
        <template #state="{ row, prop }">
          <el-tag
            size="small"
            effect="dark"
            type="success"
            v-if="row[prop] === 1"
          >
            启用
          </el-tag>
          <el-tag size="small" effect="dark" type="danger" v-else>锁定</el-tag>
        </template>

        <!-- 操作 -->
        <template #operation="{ row }">
          <el-button
            circle
            v-auth="'EDIT'"
            title="修改信息"
            size="small"
            type="primary"
            :icon="Edit"
            :disabled="row.id === 1"
            @click="handleEditUserInfo(row)"
          />
          <el-button
            circle
            v-auth="'DELETE'"
            title="删除"
            size="small"
            type="danger"
            :icon="Delete"
            :disabled="row.id === 1"
            @click="handleDelUser(row)"
          />
        </template>
      </Peng-Table>
    </el-card>
    <!-- 添加用户对话框 -->
    <AddUserDialog ref="addDialogRef" @updateList="getUserTableData" />

    <!-- 编辑用户信息抽屉 -->
    <EditUserDrawer
      :editRow="editRow"
      ref="editDrawerRef"
      @updateList="getUserTableData"
    />
  </div>
</template>

<script setup lang="ts" name="SystemUser">
import { defineAsyncComponent, reactive, onMounted, ref, nextTick } from 'vue'
import { useUserAuthList } from '@/stores/userAuthList'
import { ElMessageBox, ElMessage } from 'element-plus'
import { Delete, Edit } from '@element-plus/icons-vue'
// import PengFrom from '@/components/Form/Index.vue'
import { useUserApi } from '@/api/user'
import { AxiosResponse } from 'axios'

const { getUserList, deleteUserById, batchDeleteUsers } = useUserApi()

const userAuthStore = useUserAuthList()

// 表格参数
const tableState = reactive({
  loading: false,
  selectVal: ref<number[]>([]),
  data: ref<User[]>([]),
  tableColumns: ref<ColumnItem[]>([
    {
      label: '用户名',
      prop: 'userName',
      minWidth: 130,
      tooltip: true,
      fixed: 'left',
      slotName: 'uName',
    },
    { label: '角色', prop: 'roleName', minWidth: 150 },
    {
      label: '用户状态',
      prop: 'state',
      slotName: 'state',
      minWidth: 120,
      sort: true,
    },
    { label: '邮箱', prop: 'email', minWidth: 200, tooltip: true },
    { label: '解禁时间', prop: 'unsealTime', minWidth: 200, sort: true },
    { label: '更新时间', prop: 'updateTime', minWidth: 200, sort: true },
    { label: '创建时间', prop: 'createdTime', minWidth: 200, sort: true },
    {
      label: '操作',
      prop: '',
      minWidth: 95,
      slotName: 'operation',
      fixed: 'right',
    },
  ]),
  column: '',
  order: '',
  queryStr: '',
  roleId: 0,
  // 分页器信息
  pagerInfo: ref<PageInfo>({
    page: 1,
    pageSize: 10,
    total: 0,
  }),
})

// 根据条件来判断复选框是否可选
const handleCheckboxIsEnable = (row: User) => (row.id === 1 ? false : true)

// 搜索
const handleSearch = () => {
  tableState.pagerInfo.page = 1
  getUserTableData()
}

// 分页器修改时触发
const handlePageInfoChange = ({ page, pageSize }: PageChangeParams) => {
  tableState.pagerInfo.page = page
  tableState.pagerInfo.pageSize = pageSize
  getUserTableData()
}

// 表格排序
const handleColumnChange = ({ column, order }: ColumnChangeParams) => {
  tableState.column = column
  tableState.order = order
  getUserTableData()
}

// 文字搜索高亮
const queryStrStyle = (str: string) => {
  const regex = new RegExp(tableState.queryStr, 'ig')
  return str.replace(regex, `<font color="red">$&</font>`)
}

// 获取用户表格数据
const getUserTableData = async () => {
  try {
    tableState.loading = true
    const params = {
      page: tableState.pagerInfo.page,
      pageSize: tableState.pagerInfo.pageSize,
      queryStr: tableState.queryStr,
      column: tableState.column,
      order: tableState.order,
      roleId: tableState.roleId,
    }
    const { data: res }: AxiosResponse<UserData> = await getUserList(params)
    const { code, message, data, total } = res
    if (code !== 200 || message !== 'Success') return
    tableState.data = data
    tableState.pagerInfo.total = total
  } catch (e) {
    throw e
  } finally {
    tableState.loading = false
  }
}

// 打开删除用户
const handleDelUser = (row: User) => {
  ElMessageBox.confirm(
    `此操作将永久删除用户：“${row.userName}”，是否继续?`,
    '提示',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(async () => {
      const delRes = await deleteUser(row.id)
      if (delRes) getUserTableData()
    })
    .catch(() => {})
}
// 删除用户
const deleteUser = async (id: number): Promise<boolean> => {
  try {
    const { data: res }: AxiosResponse<ResResponse> = await deleteUserById(id)
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

// 引入编辑用户抽屉组件
const EditUserDrawer = defineAsyncComponent(
  () => import('./components/EditUser.vue')
)
const editDrawerRef = ref<RefType>(null)
const editRow = ref<User>()
// 打开编辑用户信息抽屉
const handleEditUserInfo = (row: User) => {
  editRow.value = JSON.parse(JSON.stringify(row))
  editDrawerRef.value.editDrawerStatus = true
}

// 引入添加用户对话框组件
const AddUserDialog = defineAsyncComponent(
  () => import('./components/AddUser.vue')
)
const addDialogRef = ref<RefType>(null)

// 按角色过滤
const handleRoleFilter = () => {
  tableState.pagerInfo.page = 1
  getUserTableData()
}

// 处理批量删除用户操作
const handleBatchDelUser = async () => {
  const delRes = await batchDel()
  if (delRes) getUserTableData()
}
// 批量删除用户
const batchDel = async (): Promise<boolean> => {
  try {
    const { data: res }: AxiosResponse<ResResponse> = await batchDeleteUsers(
      tableState.selectVal
    )
    const { code, message, data } = res
    if (code !== 200 || message !== 'Success') return false
    ElMessage.success(data)
    return true
  } catch (e) {
    console.log(e)
    return false
  }
}

onMounted(() => {
  getUserTableData()
  userAuthStore.getAllRoleList()
})
</script>

<style scoped lang="scss">
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
