<template>
  <Peng-Drawer
    :title="'修改分类信息'"
    :direction="deviceClientType === 'pc' ? 'rtl' : 'btt'"
    :size="deviceClientType === 'pc' ? '400px' : '50%'"
    v-model="editDrawerStatus"
  >
    <template #main>
      <Peng-Form
        ref="editFormRef"
        size="default"
        :labelW="100"
        labelP="top"
        :formData="editFormState.data"
        :formItemList="editFormState.formItemList"
      />

      <div class="mt20 flex-e-c">
        <el-button size="small" @click="editDrawerStatus = false">取消</el-button>
        <el-button size="small" type="primary" @click="handleSaveEdit">保存</el-button>
      </div>
    </template>
  </Peng-Drawer>
</template>

<script lang="ts" setup>
import { ref, reactive, inject, PropType, watch } from 'vue'
import { AxiosResponse } from 'axios'
import { ElMessage } from 'element-plus'
import { useCategoryApi } from '@/api/category/index'

const { updateCategory } = useCategoryApi()

const deviceClientType = inject('deviceClientType')

const props = defineProps({
  editRow: {
    type: Object as PropType<Category>,
    require: true,
  },
})
const emits = defineEmits(['updateList'])

// 抽屉状态
const editDrawerStatus = ref<boolean>(false)

const editFormState = reactive({
  data: ref<Category>({
    id: 0,
    categoryName: '',
    categoryDesc: '',
    createdTime: '',
    updateTime: '',
  }),
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

const editFormRef = ref<RefType>(null)
// 处理保存修改
const handleSaveEdit = async () => {
  const valdateRes = await editFormRef.value
    .getRef()
    .validate()
    .catch(() => false)
  if (!valdateRes) return
  const editRes = await saveEditCategory()
  if (!editRes) return
  editDrawerStatus.value = false
  emits('updateList')
}

// 保存修改数据
const saveEditCategory = async (): Promise<boolean> => {
  try {
    const { id, categoryName, categoryDesc, createdTime, updateTime } = editFormState.data
    const params = {
      categoryName,
      categoryDesc,
    }
    const { data: res }: AxiosResponse<ResResponse<string>> = await updateCategory(id, params)
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

watch(
  () => props.editRow,
  (val: Category | undefined) => val && (editFormState.data = JSON.parse(JSON.stringify(val))),
  { deep: true }
)

// 当窗口关闭时 重置表单校验 重置图标
watch(editDrawerStatus, async val => {
  if (val) return
  editFormRef.value.getRef().resetFields()
})

defineExpose({ editDrawerStatus })
</script>

<style lang="scss" scoped></style>
