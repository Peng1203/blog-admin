<template>
  <Peng-Dialog title="添加标签" width="40%" v-model="addTagDialogStatus">
    <template #main>
      <Peng-Form
        ref="addFormRef"
        size="default"
        labelP="top"
        :labelW="'90px'"
        :formData="addTagState.data"
        :formItemList="addTagState.formItemList"
      >
        <template #tagIcon>
          <IconSelector
            :prepend="preIcon"
            v-model="addTagState.data.tagIcon"
            @get="(icon) => (addTagState.data.tagIcon = icon)"
          />
        </template>
      </Peng-Form>
    </template>

    <template #footer>
      <el-button size="small" @click="addTagDialogStatus = false">
        取消
      </el-button>
      <el-button type="primary" size="small" @click="handleAdd">
        确认
      </el-button>
    </template>
  </Peng-Dialog>
</template>

<script lang="ts" setup>
import { ref, reactive, watch, computed, defineAsyncComponent } from 'vue'
import { ElMessage } from 'element-plus'
import { useTagApi } from '@/api/tag/index'

const IconSelector = defineAsyncComponent(
  () => import('@/components/iconSelector/index.vue')
)

const { addTag } = useTagApi()

const emits = defineEmits(['updateList'])

const addTagDialogStatus = ref<boolean>(false)

const addTagState = reactive({
  data: {
    tagName: '',
    tagIcon: '',
    tagDesc: '',
    createdTime: '',
    updateTime: '',
  },
  formItemList: ref<FormItem[]>([
    {
      // xs: 24,
      // span: 12,
      type: 'input',
      label: '标签名',
      prop: 'tagName',
      placeholder: '',
      rules: [{ required: true, trigger: 'change' }],
    },
    {
      // xs: 24,
      // span: 12,
      type: 'slot',
      label: '标签图标',
      prop: 'tagIcon',
      slotName: 'tagIcon',
    },
    {
      // xs: 24,
      // span: 12,
      type: 'textarea',
      label: '标签描述',
      prop: 'tagDesc',
      placeholder: '请输入标签描述',
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
  const addRes = await addNewTag()
  if (!addRes) return
  addTagDialogStatus.value = false
  emits('updateList')
}

// 添加权限标识
const addNewTag = async (): Promise<boolean> => {
  try {
    const { tagName, tagDesc, tagIcon } = addTagState.data
    const params = { tagName, tagDesc, tagIcon }
    const { data: res } = await addTag(params)
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

// 图标选择器前置图标
const preIcon = computed<string>(() => {
  if (addTagState.data.tagIcon) return addTagState.data.tagIcon
  else return 'ele-Pointer'
})

// 弹框关闭时清除表单信息
watch(addTagDialogStatus, async (val) => {
  if (val) return
  addFormRef.value.getRef().resetFields()

  addTagState.data = {
    tagName: '',
    tagIcon: '',
    tagDesc: '',
    createdTime: '',
    updateTime: '',
  }
})

defineExpose({ addTagDialogStatus })
</script>

<style lang="scss" scoped></style>
