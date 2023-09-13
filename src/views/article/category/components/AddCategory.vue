<template>
  <Peng-Dialog title="添加分类" width="40%" v-model="addCategoryDialogStatus">
    <template #main>
      <Peng-Form
        ref="addFormRef"
        size="default"
        labelP="top"
        :labelW="'90px'"
        :formData="addCategoryState.data"
        :formItemList="addCategoryState.formItemList"
      />
    </template>

    <template #footer>
      <el-button size="small" @click="addCategoryDialogStatus = false">取消</el-button>
      <el-button type="primary" size="small" @click="handleAdd">确认</el-button>
    </template>
  </Peng-Dialog>
</template>

<script lang="ts" setup>
import { ref, reactive, watch } from 'vue'
import { AxiosResponse } from 'axios'
import { ElMessage } from 'element-plus'
import { useCategoryApi } from '@/api/category/index'

const { addCategory } = useCategoryApi()

const emits = defineEmits(['updateList'])

const addCategoryDialogStatus = ref<boolean>(false)

const addCategoryState = reactive({
  data: {
    categoryName: '',
    categoryDesc: '',
    createdTime: '',
    updateTime: '',
  },
  formItemList: ref<FormItem[]>([
    {
      // xs: 24,
      // span: 12,
      type: 'input',
      label: '分类名',
      prop: 'categoryName',
      placeholder: '',
      rules: [{ required: true, trigger: 'change' }],
    },
    {
      // xs: 24,
      // span: 12,
      type: 'textarea',
      label: '分类描述',
      prop: 'categoryDesc',
      placeholder: '请输入分类描述',
      // rules: [{ required: true, trigger: 'blur' }],
    },
  ]),
})

const addFormRef = ref<any>(null)
// 处理添加操作
const handleAdd = async () => {
  const validRes = await addFormRef.value
    .getRef()
    .validate()
    .catch(() => false)
  if (!validRes) return
  const addRes = await addNewCategory()
  if (!addRes) return
  addCategoryDialogStatus.value = false
  emits('updateList')
}

// 添加权限标识
const addNewCategory = async (): Promise<boolean> => {
  try {
    const { categoryName, categoryDesc } = addCategoryState.data
    const params = { categoryName, categoryDesc }
    const { data: res }: AxiosResponse<ResResponse<string>> = await addCategory(params)
    const { code, data, message } = res
    if (code !== 200 || message !== 'Success') {
      ElMessage.error(data)
      return false
    } else {
      ElMessage.success(data)
      return true
    }
  } catch (e) {
    console.log(e)
    return false
  }
}

// 弹框关闭时清除表单信息
watch(addCategoryDialogStatus, async val => {
  if (val) return
  addFormRef.value.getRef().resetFields()

  addCategoryState.data = {
    categoryName: '',
    categoryDesc: '',
    createdTime: '',
    updateTime: '',
  }
})

defineExpose({ addCategoryDialogStatus })
</script>

<style lang="scss" scoped></style>
