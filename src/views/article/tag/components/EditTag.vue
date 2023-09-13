<template>
  <Peng-Drawer
    :title="'修改标签信息'"
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
      >
        <template #tagIcon>
          <!-- style="width: 300px !important;" -->
          <!-- 
            @clear="handleClearIcon" -->
          <!-- disabled -->
          <IconSelector
            :prepend="preIcon"
            v-model="editFormState.data.tagIcon"
            @get="(icon: string) => (editFormState.data.tagIcon = icon)"
          />
        </template>
      </Peng-Form>

      <div class="mt20 flex-e-c">
        <el-button size="small" @click="editDrawerStatus = false">
          取消
        </el-button>
        <el-button size="small" type="primary" @click="handleSaveEdit">
          保存
        </el-button>
      </div>
    </template>
  </Peng-Drawer>
</template>

<script lang="ts" setup>
import {
  ref,
  reactive,
  inject,
  PropType,
  watch,
  defineAsyncComponent,
  computed,
} from 'vue'
import { useTagApi } from '@/api/tag/index'
import { ElMessage } from 'element-plus'

const IconSelector = defineAsyncComponent(
  () => import('@/components/iconSelector/index.vue')
)
const { updataTagInfo } = useTagApi()

const deviceClientType = inject('deviceClientType')

const props = defineProps({
  editRow: {
    type: Object as PropType<object>,
    require: true,
  },
})
const emits = defineEmits(['updateList'])

// 抽屉状态
const editDrawerStatus = ref<boolean>(false)

const editFormState = reactive({
  data: {
    id: 0,
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

// 图标选择器前置图标
const preIcon = computed<string>(() => {
  if (editFormState.data.tagIcon) return editFormState.data.tagIcon
  else return 'ele-Pointer'
})

const editFormRef = ref<any>(null)
// 处理保存修改
const handleSaveEdit = async () => {
  const valdateRes = await editFormRef.value
    .getRef()
    .validate()
    .catch(() => false)
  if (!valdateRes) return
  const editRes = await saveEditTag()
  if (!editRes) return
  editDrawerStatus.value = false
  emits('updateList')
}

// 保存修改数据
const saveEditTag = async (): Promise<boolean> => {
  try {
    const { id, tagName, tagIcon, tagDesc, createdTime, updateTime } =
      editFormState.data
    const params = {
      tagName,
      tagIcon,
      tagDesc,
    }
    const { data: res } = await updataTagInfo(id, params)
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

// // 获取当前点击的 icon 图标
// const handleGetIcon = (icon: string) => (editFormState.data.tagIcon = icon)

watch(
  () => props.editRow,
  (val: any) => {
    editFormState.data = JSON.parse(JSON.stringify(val))
    if (editFormState.data.tagIcon === null) editFormState.data.tagIcon = ''
  },
  {
    deep: true,
  }
)

// 当窗口关闭时 重置表单校验 重置图标
watch(editDrawerStatus, async (val) => {
  if (val) return

  editFormRef.value.getRef().resetFields()
  editFormState.data.tagIcon = ''
})

defineExpose({ editDrawerStatus })
</script>

<style lang="scss" scoped></style>
