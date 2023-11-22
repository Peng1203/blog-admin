<template>
  <div class="system-user-container layout-padding">
    <el-card
      shadow="hover"
      class="layout-padding-auto"
    >
      <!-- 顶部 -->
      <!-- <IconSelector v-model="test" /> -->
      <div class="mb15 flex-sb-c">
        <div>
          <el-button
            size="default"
            type="success"
            @click="
              () => {
                addDialogRef.addMenuDialogStatus = true;
                isAddChildren = false;
              }
            "
          >
            <!-- @click="addAuthDialogRef.addAuthPermissonDialogStatus = true" -->
            <el-icon>
              <Menu />
            </el-icon>
            添加菜单
          </el-button>
        </div>

        <Search
          placeholder="菜单名称"
          :loading="tableState.loading"
          v-model="tableState.queryStr"
          @search="handleSearch"
        />
      </div>

      <Table
        defaultExpandAll
        operationColumn
        :operationColumnBtns="['add', 'edit', 'delete']"
        :isNeedPager="false"
        :data="tableState.data"
        :loading="tableState.loading"
        :columns="tableState.tableColumns"
        @columnSort="handleColumnChange"
        @addBtn="handleAddChildrenMenu"
        @editBtn="handleEditMenu"
        @deleteBtn="handleDelMenu"
      >
        <template #queryHighNight="{ row, prop }">
          <span v-html="queryStrHighlight(row[prop], tableState.queryStr)" />
        </template>

        <!-- 图标 -->
        <template #iconSlot="{ row, prop }">
          <span v-if="!row[prop]">--</span>

          <Peng-Icon
            v-else
            size="20"
            :name="row[prop]"
          />
        </template>

        <!-- 访问路径 -->
        <template #pathSlot="{ row, prop }">
          <el-link type="primary">
            {{ row[prop] }}
          </el-link>
        </template>

        <!-- 缓存 -->
        <template #isKeepSlot="{ row, prop }">
          <el-switch
            v-model="row[prop]"
            :active-value="1"
            :inactive-value="0"
            size="small"
          />
          <!-- :disabled="row.children.length" -->
        </template>

        <!-- 隐藏 -->
        <template #isHiddenSlot="{ row, prop }">
          <el-switch
            v-model="row[prop]"
            :active-value="1"
            :inactive-value="0"
            size="small"
          />
          <!-- :disabled="row.children.length" -->
        </template>
      </Table>
    </el-card>

    <!-- 编辑菜单抽屉 -->
    <EditMenuDrawer
      :editRow="editRow"
      ref="editDrawerRef"
      @updateList="handleUpdate"
    />

    <!-- 添加菜单对话框 -->
    <AddMenuDialog
      ref="addDialogRef"
      :parentRow="parentRow"
      :isAddChildren="isAddChildren"
      @updateList="handleUpdate"
    />
  </div>
</template>

<script setup lang="ts" name="Menu">
import { defineAsyncComponent, ref, onMounted, reactive } from 'vue';
import { ElMessage } from 'element-plus';
import { queryStrHighlight } from '@/utils/queryStrHighlight';
import { useMenuApi } from '@/api';
import { useMenuInfo } from '@/stores/menuList';
import Table, { ColumnItem, ColumnChangeParams } from '@/components/Table';
import { MenuData, MenuListData } from './types';
import Search from '@/components/Search';

const { getMenus, deleteMenu } = useMenuApi();

const menuStore = useMenuInfo();

// 表格参数
const tableState = reactive({
  loading: false,
  data: ref<MenuData[]>([]),
  tableColumns: ref<ColumnItem<MenuData>[]>([
    {
      label: '菜单名',
      prop: 'menuName',
      minWidth: 120,
      tooltip: true,
      fixed: 'left',
      slotName: 'queryHighNight',
      classNname: 'expand-row',
    },
    {
      label: '图标',
      prop: 'menuIcon',
      minWidth: 100,
      tooltip: true,
      slotName: 'iconSlot',
      align: 'center',
    },
    {
      label: '访问路径',
      prop: 'menuPath',
      slotName: 'pathSlot',
      minWidth: 170,
      tooltip: true,
    },
    {
      label: '缓存',
      prop: 'isKeepalive',
      slotName: 'isKeepSlot',
      align: 'center',
      minWidth: 80,
    },
    {
      label: '隐藏',
      prop: 'isHidden',
      slotName: 'isHiddenSlot',
      align: 'center',
      minWidth: 80,
    },
    {
      label: '排序',
      prop: 'orderNum',
      align: 'center',
      minWidth: 80,
    },
    // { label: '持有角色', prop: 'roles', minWidth: 200, tooltip: true },
    { label: '更新时间', prop: 'updateTime', minWidth: 200, sort: true },
    { label: '创建时间', prop: 'createTime', minWidth: 200, sort: true },
  ]),
  column: '',
  order: '',
  queryStr: '',
});

// 获取菜单表格数据
const getMenuTableData = async () => {
  try {
    tableState.loading = true;
    const { column, order, queryStr } = tableState;
    const params = {
      queryStr,
      column,
      order,
    };
    const { data: res } = await getMenus<MenuListData>(params);
    const { code, success, data } = res;
    if (code !== 20000 || !success) return;
    tableState.data = data.list;
  } catch (e) {
    console.log(e);
  } finally {
    tableState.loading = false;
  }
};

// 搜索
const handleSearch = () => getMenuTableData();

// 表格排序
const handleColumnChange = ({ column, order }: ColumnChangeParams) => {
  tableState.column = column;
  tableState.order = order;
  getMenuTableData();
};

// 处理删除菜单
const handleDelMenu = async (row: MenuData) => {
  const delRes = await deleteMenuById(row.id);
  if (!delRes) return;
  handleUpdate();
};

// 删除菜单
const deleteMenuById = async (id: number): Promise<boolean> => {
  try {
    const { data: res } = await deleteMenu<string>(id);
    const { code, data, success } = res;
    if (code !== 20000 || !success) return false;
    ElMessage.success(data);
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};

// 处理编辑菜单
const EditMenuDrawer = defineAsyncComponent(() => import('./components/EditMenu.vue'));
const editDrawerRef = ref<RefType>(null);
const editRow = ref<MenuData>();
const handleEditMenu = (row: MenuData) => {
  editRow.value = JSON.parse(JSON.stringify(row));
  editDrawerRef.value.editDrawerStatus = true;
};

const isAddChildren = ref<boolean>();
const handleAddChildrenMenu = (row: MenuData) => {
  parentRow.value = row;
  isAddChildren.value = true;
  addDialogRef.value.addMenuDialogStatus = true;
};

// 添加子菜单的父菜单
const parentRow = ref<MenuData>();
// 处理添加菜单
const AddMenuDialog = defineAsyncComponent(() => import('./components/AddMenu.vue'));
const addDialogRef = ref<RefType>(null);

// 添加全部菜单按钮
// const AddAllMenuButton = defineAsyncComponent(() => import('./components/AddAllMenu.vue'));

// 处理子组件通知父组件更新列表
const handleUpdate = () => {
  getMenuTableData();
  menuStore.getMenuData(true);
};

// 页面加载时
onMounted(() => {
  getMenuTableData();
});
</script>

<style lang="scss" scoped>
.system-user-container {
  :deep(.el-card__body) {
    color: #fff;
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: auto;
    .el-table {
      flex: 1;
    }
  }

  :deep(.expand-row > .cell) {
    display: flex;
    align-items: center;
  }
}
</style>
