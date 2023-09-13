<template>
  <div class="system-user-container layout-padding">
    <el-card shadow="hover" class="layout-padding-auto">
      <!-- 顶部 -->
      <!-- <IconSelector v-model="test" /> -->
      <div class="mb15 flex-sb-c">
        <el-button v-auth="'ADD'" size="default" type="success" class="ml10" @click="addDialogRef.addTagDialogStatus = true">
          <!-- @click="addAuthDialogRef.addAuthPermissonDialogStatus = true" -->

          <Peng-Icon name="icon-tags" class="mr5" />
          添加标签
        </el-button>

        <Peng-Search placeholder="请输入标签名称" :loading="tableState.loading" v-model="tableState.queryStr" @search="handleSearch" />
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
        <template #queryHighNight="{ row, prop }">
          <div class="flex-s-c">
            <!-- <Peng-Icon
              v-if="row.tagIcon"
              :name="row.tagIcon"
            /> -->
            <!-- style="margin-left: 10px;" -->
            <span class="ml5" v-html="queryStrHighlight(row[prop], tableState.queryStr)" />
          </div>
        </template>

        <!-- 标签图标 -->
        <template #tagIcon="{ row, prop }">
          <!-- type="class" -->
          <Peng-Icon v-if="row[prop]" :name="row[prop]" size="30" />
          <span style="color: red" v-else>{{ '未设置图标' }}</span>
          <!-- <i v-if="row[prop].indexOf('iconfont') !== -1"></i> -->
        </template>

        <!-- 操作 -->
        <template #operation="{ row }">
          <!-- :disabled="row.id === 1" -->
          <el-button circle v-auth="'EDIT'" title="修改标签信息" size="small" type="primary" :icon="Edit" @click="handleEditTag(row)" />
          <!-- @click="handleEditAuthPermission(row)" -->
          <el-button circle v-auth="'DELETE'" title="删除" size="small" type="danger" :icon="Delete" @click="handleDelTag(row)" />
          <!-- @click="handleDeleteAuthPermission(row)" -->
          <!-- :disabled="row.id === 1" -->
        </template>
      </Peng-Table>
    </el-card>

    <!-- 编辑标签抽屉 -->
    <EditTagDrawer :editRow="editRow" ref="editDrawerRef" @updateList="getTagTableData" />

    <!-- 添加标签对话框 -->
    <AddTagDialog ref="addDialogRef" @updateList="getTagTableData" />
  </div>
</template>

<script setup lang="ts" name="ArticleTag">
import { defineAsyncComponent, ref, onMounted, reactive } from 'vue'
// import { RouteRecordRaw } from 'vue-router'
import { ElMessageBox, ElMessage } from 'element-plus'
// import { storeToRefs } from 'pinia'
// import { useRoutesList } from '@/stores/routesList'
// import { setBackEndControlRefreshRoutes } from "@/router/backEnd";
import { Delete, Edit } from '@element-plus/icons-vue'
import { queryStrHighlight } from '@/utils/queryStrHighlight'
import { useTagApi } from '@/api/tag/index'
import { AxiosResponse } from 'axios'

const { getTagList, deleteTagById } = useTagApi()

// 表格参数
const tableState: TableStateType<Tag> = reactive({
  loading: false,
  data: [],
  tableColumns: [
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
      prop: 'tagIcon',
      minWidth: 100,
      tooltip: true,
      slotName: 'tagIcon',
      align: 'center',
    },
    {
      label: '描述',
      prop: 'tagDesc',
      minWidth: 250,
      tooltip: true,
      align: 'center',
    },
    { label: '更新时间', prop: 'updateTime', minWidth: 200, sort: true },
    { label: '创建时间', prop: 'createdTime', minWidth: 200, sort: true },
    { label: '操作', prop: '', minWidth: 95, slotName: 'operation', fixed: 'right' },
  ],
  column: '',
  order: '',
  queryStr: '',

  // 分页器信息
  pagerInfo: {
    page: 1,
    pageSize: 10,
    total: 0,
  },
})

// 获取标签表格数据
const getTagTableData = async () => {
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
    const { data: res }: AxiosResponse<TableRes<Tag>> = await getTagList(params)
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
  getTagTableData()
}

// 搜索
const handleSearch = () => {
  tableState.pagerInfo.page = 1
  getTagTableData()
}

// 表格排序
const handleColumnChange = ({ column, order }: ColumnChangeParams) => {
  tableState.column = column
  tableState.order = order
  getTagTableData()
}

// 处理删除标签
const handleDelTag = async (row: any) => {
  const confirmRes = await ElMessageBox.confirm(`此操作将永久删除标签：“${row.tagName}”，是否继续?`, '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  }).catch(() => false)
  if (!confirmRes) return
  const delRes = await deleteTag(row.id)
  if (delRes) getTagTableData()
}

// 删除标签
const deleteTag = async (id: number): Promise<boolean> => {
  try {
    const { data: res } = await deleteTagById(id)
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

// 处理编辑标签
const editRow = ref()
const EditTagDrawer = defineAsyncComponent(() => import('./components/EditTag.vue'))
const editDrawerRef = ref<any>(null)
const handleEditTag = (row: any) => {
  editRow.value = JSON.parse(JSON.stringify(row))
  editDrawerRef.value.editDrawerStatus = true
}

// 处理添加标签
const AddTagDialog = defineAsyncComponent(() => import('./components/AddTag.vue'))
const addDialogRef = ref<any>(null)

// 页面加载时
onMounted(() => {
  getTagTableData()
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
