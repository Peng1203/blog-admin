<template>
  <Drawer
    :title="'修改用户信息'"
    v-model="editDrawerStatus"
    @clickConfirm="handleSaveEdit"
  >
    <Form
      ref="editFormRef"
      label-p="top"
      :labelW="80"
      :formItems="editFormState.formItemList"
      v-model="editFormState.data"
    />
  </Drawer>
</template>

<script lang="ts" setup>
import { ref, reactive, PropType, watch, watchEffect } from 'vue';
import { usePermissionApi } from '@/api';
import { ElMessage } from 'element-plus';
import Form, { FormItem } from '@/components/Form';
import Drawer from '@/components/Drawer';
import { PermissionData, resourceMethodOptions } from '../';

const { updateAuthPermInfo } = usePermissionApi();

const props = defineProps({
  editRow: {
    type: Object as PropType<PermissionData>,
    require: true,
  },
});
const emits = defineEmits(['updateList']);

// 抽屉状态
const editDrawerStatus = ref<boolean>(false);

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
      label: '标识名称',
      prop: 'permissionName',
      placeholder: '请输入权限标识名称',
      rules: [{ required: true, trigger: 'blur' }],
    },
    {
      type: 'input',
      label: '标识CODE',
      prop: 'permissionCode',
      isShow: false,
      rules: [
        { required: true, trigger: 'blur' },
        { min: 2, trigger: 'blur' },
      ],
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
});

const editFormRef = ref<any>(null);
// 处理保存修改
const handleSaveEdit = async () => {
  const [validateMethod, validateProps] = props.editRow!.parentId
    ? ['validate', undefined]
    : ['validateField', ['permissionName']];
  const isValidatePass = await editFormRef.value
    .getRef()
    [validateMethod](validateProps)
    .catch(() => false);
  if (!isValidatePass) return;
  const editRes = await saveEditAuthPermisson();
  if (!editRes) return;
  editDrawerStatus.value = false;
  emits('updateList');
};

// 保存修改数据
const saveEditAuthPermisson = async (): Promise<boolean> => {
  try {
    const { id, updateTime, createTime, children, ...params } = editFormState.data;
    const { data: res } = await updateAuthPermInfo<string>(id, params);
    const { code, data, success } = res;
    if (code !== 20001 || !success) return false;
    ElMessage.success(data);
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};

watchEffect(() => {
  const isEditParent = ['', null, undefined].includes(props.editRow?.permissionCode);

  editFormState.formItemList.find(item => item.prop === 'permissionCode')!.isShow = !isEditParent;
  editFormState.formItemList.find(item => item.prop === 'resourceUrl')!.isShow = !isEditParent;
  editFormState.formItemList.find(item => item.prop === 'resourceMethod')!.isShow = !isEditParent;
});

watch(
  () => props.editRow,
  val => (editFormState.data = JSON.parse(JSON.stringify(val))),
  { deep: true }
);

defineExpose({ editDrawerStatus });
</script>

<style lang="scss" scoped></style>
