<template>
  <Drawer
    :title="editRow.parentId ? '修改权限标识信息' : '修改权限分组信息'"
    v-model="editDrawerStatus"
    @clickConfirm="handleSaveEdit"
  >
    <Peng-Form
      ref="editFormRef"
      label-p="top"
      :labelW="80"
      :formItems="editFormState.formItemList"
      v-model="editFormState.data"
    />
  </Drawer>
</template>

<script lang="ts" setup>
import { ref, reactive, PropType, watch, watchEffect } from 'vue'
import { usePermissionApi } from '@/api'
import { FormItem } from '@/components/Form'
import Drawer from '@/components/Drawer'
import { PermissionData, resourceMethodOptions } from '../'
import { SelectOptionItem } from '@/components/Select'
import { useNotificationMsg } from '@/utils/notificationMsg'

const { updateAuthPermInfo } = usePermissionApi()

const props = defineProps({
  editRow: {
    type: Object as PropType<PermissionData>,
    default: () => ({}),
  },
  permissionCodeOptions: {
    type: Array as PropType<SelectOptionItem[]>,
  },
})
const emits = defineEmits(['updateList'])

// 抽屉状态
const editDrawerStatus = ref<boolean>(false)

const editFormState = reactive({
  data: ref<PermissionData>({
    id: 0,
    permissionName: '',
    permissionCode: '',
    resourceUrl: '',
    resourceMethod: 1,
    parentId: 0,
    description: '',
    updateTime: '',
    createTime: '',
    children: [],
  }),
  formItemList: ref<FormItem<PermissionData>[]>([
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
      isShow: false,
      options: props.permissionCodeOptions,
      rules: [{ required: true, trigger: 'blur' }],
    },
    {
      type: 'input',
      label: '请求资源',
      prop: 'resourceUrl',
      isShow: false,
      rules: [
        { required: true, trigger: 'blur' },
        { min: 2, trigger: 'blur' },
      ],
    },
    {
      type: 'select',
      label: '请求方式',
      prop: 'resourceMethod',
      isShow: false,
      options: resourceMethodOptions,
    },
    {
      type: 'textarea',
      label: '描述',
      prop: 'description',
      placeholder: '请输入权限标识描述',
    },
  ]),
})

const editFormRef = ref<any>(null)
// 处理保存修改
const handleSaveEdit = async () => {
  const [validateMethod, validateProps] = props.editRow!.parentId
    ? ['validate', undefined]
    : ['validateField', ['permissionName']]
  // prettier-ignore
  const isValidatePass = await editFormRef.value
    .getRef()[validateMethod](validateProps)
    .catch(() => false);
  if (!isValidatePass) return
  const editRes = await saveEditAuthPermisson()
  if (!editRes) return
  emits('updateList')
  editDrawerStatus.value = false
}

// 保存修改数据
const saveEditAuthPermisson = async (): Promise<boolean> => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
    const { id, updateTime, createTime, children, ...params } =
      editFormState.data
    const { data: res } = await updateAuthPermInfo<string>(id, params)
    const { code, data, success } = res
    if (code !== 20001 || !success) return false
    useNotificationMsg('', data)
    return true
  } catch (e) {
    console.log(e)
    return false
  }
}

watchEffect(() => {
  if (!Object.keys(props.editRow).length) return
  const isEditParent = ['', null, undefined].includes(
    props.editRow?.permissionCode
  )

  editFormState.formItemList.find(
    item => item.prop === 'permissionCode'
  )!.isShow = !isEditParent
  editFormState.formItemList.find(item => item.prop === 'resourceUrl')!.isShow =
    !isEditParent
  editFormState.formItemList.find(
    item => item.prop === 'resourceMethod'
  )!.isShow = !isEditParent

  editDrawerStatus.value &&
    (editFormState.formItemList.find(
      item => item.prop === 'permissionCode'
    ).options = props.permissionCodeOptions)
})

watch(
  () => props.editRow,
  val =>
    !Object.keys(val).length &&
    (editFormState.data = JSON.parse(JSON.stringify(val))),
  { deep: true }
)

defineExpose({ editDrawerStatus })
</script>

<style lang="scss" scoped></style>
