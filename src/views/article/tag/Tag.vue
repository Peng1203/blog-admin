<template>
  <div class="table-container layout-padding">
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
            @click="addDialogRef.addTagDialogStatus = true"
          >
            <!-- @click="addAuthDialogRef.addAuthPermissonDialogStatus = true" -->

            <Peng-Icon
              name="icon-tags"
              class="mr5"
            />
            添加标签
          </el-button>

          <el-button
            size="default"
            type="danger"
            :disabled="!tableState.selectVal.length"
            @click="handleBatchDelete"
          >
            <el-icon>
              <Delete />
            </el-icon>
            删 除
          </el-button>
        </div>

        <Peng-Search
          placeholder="请输入标签名称"
          :loading="tableState.loading"
          v-model="tableState.queryStr"
          @search="handleSearch"
        />
      </div>
      <Peng-Table
        is-selection
        operationColumn
        :operationColumnBtns="['edit', 'delete']"
        :isFilterShowColumn="false"
        :data="tableState.data"
        :loading="tableState.loading"
        :pagerInfo="tableState.pagerInfo"
        :columns="tableState.tableColumns"
        @columnSort="handleColumnChange"
        @pageNumOrSizeChange="handlePageInfoChange"
        @editBtn="handleEditTag"
        @deleteBtn="handleDelTag"
        @selectionChange="(value: TagData[]) => (tableState.selectVal = value)"
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

        <!-- 标签图标 -->
        <template #tagIcon="{ row, prop }">
          <!-- type="class" -->
          <Peng-Icon
            v-if="row[prop]"
            :name="row[prop]"
            size="30"
          />
          <span v-else>
            {{ '未设置图标' }}
          </span>
        </template>
      </Peng-Table>
    </el-card>

    <!-- 编辑标签抽屉 -->
    <EditTagDrawer
      :editRow="editRow"
      ref="editDrawerRef"
      @updateList="handleUpdate"
    />

    <!-- 添加标签对话框 -->
    <AddTagDialog
      ref="addDialogRef"
      @updateList="handleUpdate"
    />
  </div>
</template>

<script setup lang="tsx" name="ArticleTag">
import { defineAsyncComponent, ref, onMounted, reactive } from 'vue';
import { queryStrHighlight } from '@/utils/queryStrHighlight';
import {
  ColumnItem,
  PageInfo,
  PageChangeParams,
  ColumnChangeParams,
} from '@/components/Table';
import { useTagApi } from '@/api/tag/index';
import { TagData, TagListData } from './';
import { useArticleInfo } from '@/stores/articleInfo';
import { useNotificationMsg } from '@/utils/notificationMsg';

const { getTags, deleteTag, batchDeleteTag } = useTagApi();

const articleInfoStore = useArticleInfo();

// 表格参数
const tableState = reactive({
  selectVal: ref<TagData[]>([]),
  loading: false,
  data: ref<TagData[]>([]),
  tableColumns: ref<ColumnItem<TagData>[]>([
    {
      label: '标签名',
      prop: 'tagName',
      minWidth: 130,
      tooltip: true,
      fixed: 'left',
      slotName: 'queryHighNight',
    },
    {
      label: '图标',
      prop: 'icon',
      minWidth: 100,
      tooltip: true,
      slotName: 'tagIcon',
      align: 'center',
    },
    {
      label: '文章数',
      prop: 'articles',
      width: 130,
      align: 'center',
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

// 获取标签表格数据
const getTagTableData = async () => {
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
    const { data: res } = await getTags<TagListData>(params);
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
  getTagTableData();
};

// 搜索
const handleSearch = () => {
  tableState.pagerInfo.page = 1;
  getTagTableData();
};

// 表格排序
const handleColumnChange = ({ column, order }: ColumnChangeParams) => {
  tableState.column = column;
  tableState.order = order;
  getTagTableData();
};

const handleUpdate = () => {
  getTagTableData();
  articleInfoStore.getTagData(true);
};

// 处理删除标签
const handleDelTag = async (row: TagData) => {
  const delRes = await deleteTagById(row.id);
  if (delRes) handleUpdate();
};

// 删除标签
const deleteTagById = async (id: number): Promise<boolean> => {
  try {
    const { data: res } = await deleteTag<string>(id);
    const { code, data, success } = res;
    if (code !== 20000 || !success) return false;
    useNotificationMsg('成功', data);
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};

// 批量删除标签
const deleteTags = async () => {
  try {
    const ids = tableState.selectVal.map(tag => tag.id);
    const { data: res } = await batchDeleteTag<string>(ids);
    const { code, data, success } = res;
    if (code !== 20000 || !success) return false;
    useNotificationMsg('成功', data);
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};

const handleBatchDelete = async () => {
  const delRes = await deleteTags();
  if (delRes) handleUpdate();
};

// 处理编辑标签
const editRow = ref();
const EditTagDrawer = defineAsyncComponent(
  () => import('./components/EditTag.vue')
);
const editDrawerRef = ref<any>(null);
const handleEditTag = (row: any) => {
  editRow.value = JSON.parse(JSON.stringify(row));
  editDrawerRef.value.editDrawerStatus = true;
};

// 处理添加标签
const AddTagDialog = defineAsyncComponent(
  () => import('./components/AddTag.vue')
);
const addDialogRef = ref<any>(null);

// 页面加载时
onMounted(() => {
  getTagTableData();
});
</script>

<style lang="scss" scoped></style>
