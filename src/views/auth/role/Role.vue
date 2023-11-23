<template>
  <div class="system-user-container layout-padding">
    <el-card
      shadow="hover"
      class="layout-padding-auto"
    >
      <!-- 顶部 -->
      <!-- <IconSelector v-model="test" /> -->
      <div class="mb15 flex-sb-c">
        <el-button
          size="default"
          type="success"
          @click="addDialogRef.addRoleDialogStatus = true"
        >
          <!-- @click="addAuthDialogRef.addAuthPermissonDialogStatus = true" -->
          <Peng-Icon name="icon-jiaoseguanli1" />
          <span ml5>添加角色</span>
        </el-button>

        <Search
          placeholder="角色名称 / 角色描述"
          :loading="tableState.loading"
          v-model="tableState.queryStr"
          @search="handleSearch"
        />
      </div>

      <Table
        operationColumn
        :operationColumnBtns="['edit', 'delete', 'view']"
        :data="tableState.data"
        :loading="tableState.loading"
        :pagerInfo="tableState.pagerInfo"
        :columns="tableState.tableColumns"
        @columnSort="handleColumnChange"
        @pageNumOrSizeChange="handlePageInfoChange"
        @editBtn="handleEditRole"
        @deleteBtn="handleDelRole"
        @viewBtn="handleViewRole"
      >
        <template #queryHighNight="{ row, prop }">
          <span v-html="queryStrHighlight(row[prop], tableState.queryStr)" />
        </template>
      </Table>
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
import { defineAsyncComponent, ref, onMounted, reactive } from 'vue';
import { ElMessage } from 'element-plus';
import { queryStrHighlight } from '@/utils/queryStrHighlight';
import { useRoleApi } from '@/api/role/index';
import { useRolesInfo } from '@/stores/roleList';
import { RoleData, RoleListData, RoleEntityData } from './types';
import Table, { ColumnItem, PageInfo, PageChangeParams, ColumnChangeParams } from '@/components/Table';
import Search from '@/components/Search';

const { getRole, deleteRole } = useRoleApi();

const roleStore = useRolesInfo();

// 表格参数
const tableState = reactive({
  loading: false,
  data: ref<RoleData[]>([]),
  tableColumns: ref<ColumnItem<RoleData>[]>([
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
      prop: 'description',
      minWidth: 150,
      sort: false,
      tooltip: true,
      slotName: 'queryHighNight',
    },
    { label: '更新时间', prop: 'updateTime', minWidth: 200, sort: 'custom' },
    { label: '创建时间', prop: 'createTime', minWidth: 200, sort: 'custom' },
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
});

// 获取角色表格数据
const getRoleTableData = async () => {
  try {
    tableState.loading = true;
    const { pagerInfo, column, order, queryStr } = tableState;
    const params = {
      queryStr,
      column,
      order,
      page: pagerInfo.page,
      pageSize: pagerInfo.pageSize,
    };
    const { data: res } = await getRole<RoleListData>(params);

    const { code, data, success } = res;
    if (code !== 20000 || !success) return;
    tableState.data = data.list;
    tableState.pagerInfo.total = data.total;
  } catch (e) {
    console.log(e);
  } finally {
    tableState.loading = false;
  }
};

// 分页器修改时触发
const handlePageInfoChange = ({ page, pageSize }: PageChangeParams) => {
  tableState.pagerInfo.page = page;
  tableState.pagerInfo.pageSize = pageSize;
  getRoleTableData();
};

// 搜索
const handleSearch = () => {
  tableState.pagerInfo.page = 1;
  getRoleTableData();
};

// 表格排序
const handleColumnChange = ({ column, order }: ColumnChangeParams) => {
  tableState.column = column;
  tableState.order = order;
  getRoleTableData();
};

// 处理删除角色
const handleDelRole = async (row: RoleData) => {
  const delRes = await deleteRoleById(row.id);
  if (!delRes) return;
  handleUpdate();
};

// 删除角色
const deleteRoleById = async (id: number): Promise<boolean> => {
  try {
    const { data: res } = await deleteRole<string>(id);
    const { code, data, message, success } = res;
    if (code !== 20000 || !success) return false;
    ElMessage.success(data);
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};

// 处理编辑角色
const editRow = ref<RoleEntityData>();
const EditRoleDrawer = defineAsyncComponent(() => import('./components/EditRole.vue'));
const editDrawerRef = ref<RefType>(null);
const handleEditRole = (row: RoleEntityData) => {
  editRow.value = row;
  editDrawerRef.value.editDrawerStatus = true;
};

// 处理添加角色
const AddRoleDialog = defineAsyncComponent(() => import('./components/AddRole.vue'));
const addDialogRef = ref<RefType>(null);

// 查看角色
const handleViewRole = () => {};

// 更新列表
const handleUpdate = () => {
  getRoleTableData();
  roleStore.getRoleData(true);
};

// 页面加载时
onMounted(async () => {
  getRoleTableData();
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
