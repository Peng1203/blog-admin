<template>
  <div class="system-user-container layout-padding">
    <el-card
      shadow="hover"
      class="layout-padding-auto"
    >
      <!-- 顶部 -->
      <div class="mb15 flex-sb-c">
        <el-button
          size="default"
          type="success"
          class="ml10"
          @click="addAuthDialogRef.addAuthPermissonDialogStatus = true"
        >
          <i class="iconfont icon-permissions-o" />
          添加权限标识
        </el-button>

        <Peng-Search
          placeholder="请输入权限标识名称"
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
        <!-- 权限标识名称 权限标识代码 查询高亮 -->
        <template #queryHighlight="{ row, prop }">
          <span v-html="queryStrStyle(row[prop])" />
        </template>

        <!-- 操作 -->
        <template #operation="{ row }">
          <!-- :disabled="row.id === 1" -->
          <el-button
            circle
            title="修改信息"
            size="small"
            type="primary"
            :icon="Edit"
            @click="handleEditAuthPermission(row)"
          />
          <!-- @click="handleEditUserInfo(row)" -->
          <el-button
            circle
            title="删除"
            size="small"
            type="danger"
            :icon="Delete"
            @click="handleDeleteAuthPermission(row)"
          />
          <!-- :disabled="row.id === 1" -->
          <!-- @click="handleDelUser(row)" -->
        </template>
      </Peng-Table>
    </el-card>
    <!-- 修改权限标识信息 -->
    <EditAuthPermissonDrawer
      ref="editAuthDrawerRef"
      :editRow="editAuthRowInfo"
      @updateList="handleUpdate"
    />

    <!-- 添加权限标识 -->
    <AddAuthPermissonDialog
      ref="addAuthDialogRef"
      @updateList="handleUpdate"
    />
  </div>
</template>

<script lang="ts" setup name="SystemAuthPermission">
import { AxiosResponse } from 'axios';
import { ElMessage, ElMessageBox } from 'element-plus';
import { ref, reactive, onMounted, defineAsyncComponent } from 'vue';
import { useAuthPermissionApi } from '@/api/authPermission/index';
import { Delete, Edit } from '@element-plus/icons-vue';
import { useUserAuthList } from '@/stores/userAuthList';
import { ColumnItem } from '@/components/Table';

const userAuthStore = useUserAuthList();

const { getAuthPermissionList, delAuthPermission } = useAuthPermissionApi();
// 表格参数
const tableState = reactive({
  loading: false,
  queryStr: '',
  column: '',
  order: '',
  data: ref<AuthPermission[]>([]),
  tableColumns: ref<ColumnItem[]>([
    {
      label: '标识名称',
      prop: 'permissionName',
      minWidth: 100,
      tooltip: true,
      slotName: 'queryHighlight',
    },
    {
      label: '标识CODE',
      prop: 'permissionCode',
      minWidth: 130,
      tooltip: true,
      slotName: 'queryHighlight',
    },
    { label: '描述', prop: 'desc', tooltip: true },
    { label: '更新时间', prop: 'updateTime', width: 200, sort: true },
    { label: '创建时间', prop: 'createdTime', width: 200, sort: true },
    {
      label: '操作',
      prop: 'operation',
      width: 95,
      slotName: 'operation',
      fixed: 'right',
    },
  ]),

  // 分页器信息
  pagerInfo: ref<PageInfo>({
    page: 1,
    pageSize: 10,
    total: 0,
  }),
});

// 获取权限标识数据
const getAuthPermissionTableData = async (): Promise<void> => {
  try {
    tableState.loading = true;
    const params = {
      page: tableState.pagerInfo.page,
      pageSize: tableState.pagerInfo.pageSize,
      queryStr: tableState.queryStr,
      column: tableState.column,
      order: tableState.order,
    };
    const { data: res }: AxiosResponse<AuthPermissionData> = await getAuthPermissionList(params);
    const { code, message, data, total } = res;
    if (code !== 200 || message !== 'Success') return;
    tableState.data = data;
    tableState.pagerInfo.total = total;
  } catch (e) {
    console.log(e);
  } finally {
    tableState.loading = false;
  }
};

// 表格排序
const handleColumnChange = ({ column, order }: ColumnChangeParams) => {
  tableState.column = column;
  tableState.order = order;
  getAuthPermissionTableData();
};

// 分页器修改时触发
const handlePageInfoChange = ({ page, pageSize }: PageChangeParams) => {
  tableState.pagerInfo.page = page;
  tableState.pagerInfo.pageSize = pageSize;
  getAuthPermissionTableData();
};

// 文字搜索高亮
const queryStrStyle = (str: string) => {
  const regex = new RegExp(tableState.queryStr, 'ig');
  return str.replace(regex, `<font color="red">$&</font>`);
};

// 搜索
const handleSearch = () => {
  tableState.pagerInfo.page = 1;
  getAuthPermissionTableData();
};

// 处理删除权限标识
const handleDeleteAuthPermission = async (row: AuthPermission) => {
  const confirmRes = await ElMessageBox.confirm(
    `此操作将永久删除操作权限标识：“${row.permissionName}”，是否继续?`,
    '提示',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).catch(() => false);
  if (!confirmRes) return;
  const delRes = await delAuthPermissionById(row.id);
  if (delRes) getAuthPermissionTableData();
};
// 通过ID删除权限标识
const delAuthPermissionById = async (id: number): Promise<boolean> => {
  try {
    const { data: res } = await delAuthPermission(id);
    const { code, data, message } = res;
    if (code !== 200 || message !== 'Success') {
      ElMessage.error(data);
      return false;
    }
    ElMessage.success(data);
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};

// 编辑权限标识
const EditAuthPermissonDrawer = defineAsyncComponent(() => import('./components/EditAuthPermisson.vue'));

const editAuthDrawerRef = ref<RefType>(null);
const editAuthRowInfo = ref();
// 编辑权限标识
const handleEditAuthPermission = (row: AuthPermission) => {
  editAuthRowInfo.value = JSON.parse(JSON.stringify(row));
  editAuthDrawerRef.value.editDrawerStatus = true;
};

// 添加权限标识
const AddAuthPermissonDialog = defineAsyncComponent(() => import('./components/AddAuthPermisson.vue'));
const addAuthDialogRef = ref<RefType>(null);

const handleUpdate = () => {
  getAuthPermissionTableData();
  userAuthStore.getAllAuthPermissionList(true);
};

onMounted(() => {
  getAuthPermissionTableData();
});
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
