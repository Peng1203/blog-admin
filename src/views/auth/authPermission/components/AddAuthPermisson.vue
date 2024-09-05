<template>
  <Dialog
    :title="props.parentId ? '添加权限标识' : '创建权限分组'"
    v-model="addAuthPermissonDialogStatus"
    @clickConfirm="handleAdd"
    @dialogClose="handleDialogClose"
  >
    <Peng-Form
      ref="addAuthFormRef"
      :labelW="'120px'"
      :formItems="formItemList"
      v-model="addAuthState.data"
    />
  </Dialog>
</template>

<script lang="ts" setup>
import { ref, reactive, PropType, computed } from 'vue'
import { usePermissionApi } from '@/api'
import Dialog from '@/components/Dialog'
import { FormItem } from '@/components/Form'
import { PermissionData, AddPermissionType, resourceMethodOptions } from '../'
import { useNotificationMsg } from '@/hooks/useNotificationMsg'
import { SelectOptionItem } from '@/components/Select'

const emits = defineEmits(['updateList'])

const props = defineProps({
  parentId: {
    type: Number,
    default: 0,
  },
  permissionCodeOptions: {
    type: Array as PropType<SelectOptionItem[]>,
  },
})

const { addPermission } = usePermissionApi()

const addAuthPermissonDialogStatus = ref<boolean>(false)

const addAuthState = reactive({
  data: ref<AddPermissionType>({
    permissionName: '',
    permissionCode: '',
    resourceUrl: '',
    resourceMethod: 1,
    parentId: 0,
    description: '',
  }),
})

const addAuthFormRef = ref<RefType>(null)
// 处理添加操作
const handleAdd = async () => {
  const [validateMethod, validateProps] = props.parentId
    ? ['validate', undefined]
    : ['validateField', ['permissionName']]
  // 动态调用校验方法
  // prettier-ignore
  const isValidatePass = await addAuthFormRef.value
    .getRef()[validateMethod](validateProps)
    .catch(() => false);

  if (!isValidatePass) return
  const addRes = await addNewAuthPermission()
  if (!addRes) return
  emits('updateList')
  handleDialogClose()
}

// 添加权限标识
const addNewAuthPermission = async (): Promise<boolean> => {
  try {
    const { resourceMethod, permissionCode, ...args } = addAuthState.data
    const params = {
      ...args,
      resourceMethod: props.parentId ? resourceMethod : null,
      permissionCode: props.parentId ? permissionCode : null,
      parentId: props.parentId,
    }
    const { data: res } = await addPermission<PermissionData>(params)
    const { code, message, success } = res
    if (code !== 20100 || !success) return false
    useNotificationMsg('', message)
    return true
  } catch (e) {
    console.log(e)
    return false
  }
}

const resetAddForm = () => {
  addAuthState.data.permissionName = ''
  addAuthState.data.permissionCode = ''
  addAuthState.data.resourceUrl = ''
  addAuthState.data.resourceMethod = 1
  addAuthState.data.parentId = 0
  addAuthState.data.description = ''
}

const handleDialogClose = () => {
  resetAddForm()
  addAuthFormRef.value.getRef().resetFields()
  addAuthPermissonDialogStatus.value = false
}

const isAddChildren = computed<boolean>(() => !!props.parentId)
const formItemList = computed<FormItem<PermissionData>[]>(() => [
  {
    type: 'input',
    label: '名称',
    prop: 'permissionName',
    placeholder: '',
    rules: [{ required: true, trigger: 'blur' }],
  },
  {
    type: 'select',
    label: '标识CODE',
    prop: 'permissionCode',
    isShow: isAddChildren.value,
    options: props.permissionCodeOptions,
    rules: [{ required: true, trigger: 'change' }],
  },
  {
    type: 'input',
    label: '请求资源',
    prop: 'resourceUrl',
    isShow: isAddChildren.value,
    rules: [
      { required: true, trigger: 'blur' },
      { min: 2, trigger: 'blur' },
    ],
  },
  {
    type: 'select',
    label: '请求方式',
    prop: 'resourceMethod',
    isShow: isAddChildren.value,
    options: resourceMethodOptions,
  },
  {
    type: 'textarea',
    label: '描述',
    prop: 'description',
    placeholder: '请输入权限标识描述',
  },
])

defineExpose({ addAuthPermissonDialogStatus })
</script>

<style lang="scss" scoped></style>
