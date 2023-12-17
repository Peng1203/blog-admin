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
          @click="addDialogRef.addCategoryDialogStatus = true"
        >
          <Peng-Icon
            name="icon-fenlei"
            class="mr5"
          />
          添加分类
        </el-button>

        <Search
          placeholder="请输入分类名称"
          :loading="tableState.loading"
          v-model="tableState.queryStr"
          @search="handleSearch"
        />
      </div>

      <Table
        operationColumn
        :operationColumnBtns="['edit', 'delete']"
        :isFilterShowColumn="false"
        :data="tableState.data"
        :loading="tableState.loading"
        :pagerInfo="tableState.pagerInfo"
        :columns="tableState.tableColumns"
        @columnSort="handleColumnChange"
        @pageNumOrSizeChange="handlePageInfoChange"
        @editBtn="handleEditCategory"
        @deleteBtn="handleDelCategory"
      >
        <!-- 权限标识名称 权限标识代码 查询高亮 -->
        <template #queryHighNight="{ row, prop }">
          <div class="flex-s-c">
            <span
              class="ml5"
              v-html="queryStrHighlight(row[prop], tableState.queryStr)"
            />
          </div>
        </template>

        <!-- 相关文章数 -->
        <template #articleSlot="{ row, prop }">
          {{ row[prop].length || 0 }}
        </template>
      </Table>
    </el-card>

    <!-- 编辑分类抽屉 -->
    <EditCategoryDrawer
      :editRow="editRow"
      ref="editDrawerRef"
      @updateList="handleUpdate"
    />

    <!-- 添加分类对话框 -->
    <AddCategoryDialog
      ref="addDialogRef"
      @updateList="handleUpdate"
    />
  </div>
</template>

<script setup lang="ts" name="ArticleCategory">
import { defineAsyncComponent, ref, onMounted, reactive } from 'vue';
import { ElMessage } from 'element-plus';
import Table, { ColumnItem, PageInfo, PageChangeParams, ColumnChangeParams } from '@/components/Table';
import Search from '@/components/Search';
import { queryStrHighlight } from '@/utils/queryStrHighlight';
import { useCategoryApi } from '@/api/category/index';
import { CategoryData, CategoryListDate } from './types';
import { useArticleInfo } from '@/stores/articleInfo';

const { getCategorys, deleteCategory } = useCategoryApi();

const articleInfoStore = useArticleInfo();

// 表格参数
const tableState = reactive({
  loading: false,
  data: ref<CategoryData[]>([]),
  tableColumns: ref<ColumnItem<CategoryData>[]>([
    {
      label: '分类名称',
      prop: 'categoryName',
      minWidth: 130,
      tooltip: true,
      fixed: 'left',
      slotName: 'queryHighNight',
    },
    {
      label: '文章数',
      prop: 'articles',
      width: 130,
      align: 'center',
      slotName: 'articleSlot',
    },
    { label: '更新时间', prop: 'updateTime', minWidth: 200, sort: true },
    { label: '创建时间', prop: 'createTime', minWidth: 200, sort: true },
  ]),
  column: '',
  order: '',
  queryStr: '',

  // 分页器信息
  pagerInfo: ref<PageInfo>({
    page: 1,
    pageSize: 10,
    total: 0,
  }),
});

// 获取分类表格数据
const getCategoryTableData = async () => {
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
    const { data: res } = await getCategorys<CategoryListDate>(params);
    const { code, message, data, success } = res;

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
  getCategoryTableData();
};

// 搜索
const handleSearch = () => {
  tableState.pagerInfo.page = 1;
  getCategoryTableData();
};

// 表格排序
const handleColumnChange = ({ column, order }: ColumnChangeParams) => {
  tableState.column = column;
  tableState.order = order;
  getCategoryTableData();
};

// 处理删除分类
const handleDelCategory = async (row: CategoryData) => {
  const delRes = await deleteCategoryById(row.id);
  if (delRes) getCategoryTableData();
};

// 删除分类
const deleteCategoryById = async (id: number): Promise<boolean> => {
  try {
    const { data: res } = await deleteCategory<string>(id);
    const { code, data, success } = res;
    if (code !== 20000 || !success) return false;
    ElMessage.success(data);
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};

// 处理编辑分类
const editRow = ref<CategoryData>();
const EditCategoryDrawer = defineAsyncComponent(() => import('./components/EditCategory.vue'));
const editDrawerRef = ref<RefType>(null);
const handleEditCategory = (row: CategoryData) => {
  editRow.value = JSON.parse(JSON.stringify(row));
  editDrawerRef.value.editDrawerStatus = true;
};

// 处理添加分类
const AddCategoryDialog = defineAsyncComponent(() => import('./components/AddCategory.vue'));
const addDialogRef = ref<RefType>(null);

const handleUpdate = () => {
  getCategoryTableData();
  articleInfoStore.getCategoryData(true);
};

// 页面加载时
onMounted(() => {
  getCategoryTableData();
});
</script>

<style lang="scss" scoped></style>
