<template>
  <Dialog
    title="添加标签"
    v-model="addCategoryDialogStatus"
    @clickConfirm="handleAdd"
    @dialogClose="handleDialogClose"
  >
    <Form
      ref="addFormRef"
      :labelW="'120px'"
      :formItems="addCategoryState.formItemList"
      v-model="addCategoryState.data"
    />
  </Dialog>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import Dialog from '@/components/Dialog'
import Form, { FormItem } from '@/components/Form'
import { useCategoryApi } from '@/api/category/index'
import { CategoryData } from '../types'
import { useNotificationMsg } from '@/hooks/useNotificationMsg'

const { addCategory } = useCategoryApi()

const emits = defineEmits(['updateList'])

const addCategoryDialogStatus = ref<boolean>(false)

const addCategoryState = reactive({
  data: ref<CategoryData>({
    id: 0,
    categoryName: '',
    createTime: '',
    updateTime: '',
  }),
  formItemList: ref<FormItem<CategoryData>[]>([
    {
      type: 'input',
      label: '分类名',
      prop: 'categoryName',
      placeholder: '',
      rules: [{ required: true, trigger: 'change' }],
    },
  ]),
})

const addFormRef = ref<RefType>(null)
// 处理添加操作
const handleAdd = async () => {
  const validRes = await addFormRef.value
    .getRef()
    .validate()
    .catch(() => false)
  if (!validRes) return
  const addRes = await addNewCategory()
  if (!addRes) return
  handleDialogClose()
  emits('updateList')
}

// 添加分类
const addNewCategory = async (): Promise<boolean> => {
  try {
    const { categoryName } = addCategoryState.data
    const { data: res } = await addCategory<CategoryData>({ categoryName })
    const { code, message, success } = res
    if (code !== 20100 || !success) return false
    useNotificationMsg('成功', message)
    return true
  } catch (e) {
    console.log(e)
    return false
  }
}

const resetAddForm = () => {
  addCategoryState.data.categoryName = ''
}

const handleDialogClose = () => {
  resetAddForm()
  addFormRef.value.getRef().resetFields()
  addCategoryDialogStatus.value = false
}

defineExpose({ addCategoryDialogStatus })
</script>

<style lang="scss" scoped></style>
