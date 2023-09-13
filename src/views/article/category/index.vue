<template>
  <div class="system-user-container layout-padding">
    <el-card shadow="hover" class="layout-padding-auto">
      <!-- 顶部 -->
      <!-- <IconSelector v-model="test" /> -->
      <div class="mb15 flex-sb-c">
        <el-button v-auth="'ADD'" size="default" type="success" class="ml10" @click="addDialogRef.addCategoryDialogStatus = true">
          <!-- @click="addAuthDialogRef.addAuthPermissonDialogStatus = true" -->

          <Peng-Icon name="icon-fenlei" class="mr5" />
          添加分类
        </el-button>

        <Peng-Search placeholder="请输入分类名称" :loading="tableState.loading" v-model="tableState.queryStr" @search="handleSearch" />
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
              v-if="row.categoryIcon"
              :name="row.categoryIcon"
            /> -->
            <!-- style="margin-left: 10px;" -->
            <span class="ml5" v-html="queryStrHighlight(row[prop], tableState.queryStr)" />
          </div>
        </template>

        <!-- 分类图标 -->
        <template #categoryIcon="{ row, prop }">
          <!-- type="class" -->
          <Peng-Icon v-if="row[prop]" :name="row[prop]" size="30" />
          <span style="color: red" v-else>{{ '未设置图标' }}</span>
          <!-- <i v-if="row[prop].indexOf('iconfont') !== -1"></i> -->
        </template>

        <!-- 操作 -->
        <template #operation="{ row }">
          <!-- :disabled="row.id === 1" -->
          <el-button circle v-auth="'EDIT'" title="修改分类信息" size="small" type="primary" :icon="Edit" @click="handleEditCategory(row)" />
          <!-- @click="handleEditAuthPermission(row)" -->
          <el-button circle v-auth="'DELETE'" title="删除" size="small" type="danger" :icon="Delete" @click="handleDelCategory(row)" />
          <!-- @click="handleDeleteAuthPermission(row)" -->
          <!-- :disabled="row.id === 1" -->
        </template>
      </Peng-Table>
    </el-card>

    <!-- 编辑分类抽屉 -->
    <EditCategoryDrawer :editRow="editRow" ref="editDrawerRef" @updateList="getCategoryTableData" />

    <!-- 添加分类对话框 -->
    <AddCategoryDialog ref="addDialogRef" @updateList="getCategoryTableData" />
  </div>
</template>

<script setup lang="ts" name="ArticleCategory">
import { AxiosResponse } from 'axios'
import { defineAsyncComponent, ref, onMounted, reactive } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { Delete, Edit } from '@element-plus/icons-vue'
import { queryStrHighlight } from '@/utils/queryStrHighlight'
import { useCategoryApi } from '@/api/category/index'

const { getCategoryList, deleteCategoryById } = useCategoryApi()

// 表格参数
const tableState = reactive({
  loading: false,
  data: ref<Category[]>([]),
  tableColumns: ref<ColumnItem[]>([
    {
      label: '分类名称',
      prop: 'categoryName',
      minWidth: 130,
      tooltip: true,
      fixed: 'left',
      slotName: 'queryHighNight',
    },
    {
      label: '描述',
      prop: 'categoryDesc',
      minWidth: 250,
      tooltip: true,
      align: 'center',
    },
    { label: '更新时间', prop: 'updateTime', minWidth: 200, sort: true },
    { label: '创建时间', prop: 'createdTime', minWidth: 200, sort: true },
    { label: '操作', prop: 'slot', minWidth: 95, slotName: 'operation', fixed: 'right' },
  ]),
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

// 获取分类表格数据
const getCategoryTableData = async () => {
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
    const { data: res }: AxiosResponse<TableRes<Category>> = await getCategoryList(params)
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
  getCategoryTableData()
}

// 搜索
const handleSearch = () => {
  tableState.pagerInfo.page = 1
  getCategoryTableData()
}

// 表格排序
const handleColumnChange = ({ column, order }: ColumnChangeParams) => {
  tableState.column = column
  tableState.order = order
  getCategoryTableData()
}

// 处理删除分类
const handleDelCategory = async (row: Category) => {
  const confirmRes = await ElMessageBox.confirm(`此操作将永久删除分类：“${row.categoryName}”，是否继续?`, '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  }).catch(() => false)
  if (!confirmRes) return
  const delRes = await deleteCategory(row.id)
  if (delRes) getCategoryTableData()
}

// 删除分类
const deleteCategory = async (id: number): Promise<boolean> => {
  try {
    const { data: res } = await deleteCategoryById(id)
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

// 处理编辑分类
const editRow = ref<Category>()
const EditCategoryDrawer = defineAsyncComponent(() => import('./components/EditCategory.vue'))
const editDrawerRef = ref<RefType>(null)
const handleEditCategory = (row: any) => {
  editRow.value = JSON.parse(JSON.stringify(row))
  editDrawerRef.value.editDrawerStatus = true
}

// 处理添加分类
const AddCategoryDialog = defineAsyncComponent(() => import('./components/AddCategory.vue'))
const addDialogRef = ref<RefType>(null)

// 页面加载时
onMounted(() => {
  getCategoryTableData()
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
