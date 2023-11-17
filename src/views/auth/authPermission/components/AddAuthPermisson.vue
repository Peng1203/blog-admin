<template>
  <Dialog
    title="添加权限标识"
    v-model="addAuthPermissonDialogStatus"
    @clickConfirm="handleAdd"
    @dialogClose="handleDialogClose"
  >
    {{ addAuthState.data }}
    <Form
      ref="addAuthFormRef"
      :labelW="'120px'"
      :formItems="addAuthState.formItemList"
      v-model="addAuthState.data"
    />
  </Dialog>
</template>

<script lang="ts" setup>
import { ref, reactive, watch } from 'vue';
import { usePermissionApi } from '@/api';
import { ElMessage } from 'element-plus';
import Dialog from '@/components/Dialog';
import Form, { FormItem, RadioItem, OperationItem } from '@/components/Form';
import { PermissionData, AddPermissionType, resourceMethodOptions } from '../';
const emits = defineEmits(['updateList']);

const { addPermission } = usePermissionApi();

const addAuthPermissonDialogStatus = ref<boolean>(false);

const addAuthState = reactive({
  data: ref<AddPermissionType>({
    permissionName: '',
    permissionCode: '',
    resourceUrl: '',
    resourceMethod: 1,
    parentId: 0,
    description: '',
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
      rules: [
        { required: true, trigger: 'blur' },
        { min: 2, trigger: 'blur' },
      ],
    },
    {
      type: 'input',
      label: '请求资源',
      prop: 'resourceUrl',
      rules: [
        { required: true, trigger: 'blur' },
        { min: 2, trigger: 'blur' },
      ],
    },
    {
      type: 'select',
      label: '请求方式',
      prop: 'resourceMethod',
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

const addAuthFormRef = ref<RefType>(null);
// 处理添加操作
const handleAdd = async () => {
  const validRes = await addAuthFormRef.value
    .getRef()
    .validate()
    .catch(() => false);
  if (!validRes) return;
  const addRes = await addNewAuthPermission();
  if (!addRes) return;
  resetAddForm();
  addAuthPermissonDialogStatus.value = false;
  emits('updateList');
};

// 添加权限标识
const addNewAuthPermission = async (): Promise<boolean> => {
  try {
    const { data: res } = await addPermission<PermissionData>(addAuthState.data);
    const { code, data, message, success } = res;
    if (code !== 20100 || !success) return false;
    console.log('data ------', data);
    ElMessage.success(message);
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};

const resetAddForm = () => {
  addAuthState.data.permissionName = '';
  addAuthState.data.permissionCode = '';
  addAuthState.data.resourceUrl = '';
  addAuthState.data.resourceMethod = 1;
  addAuthState.data.parentId = 0;
  addAuthState.data.description = '';
};

const handleDialogClose = () => {
  resetAddForm();
  addAuthFormRef.value.getRef().resetFields();
};

defineExpose({ addAuthPermissonDialogStatus });
</script>

<style lang="scss" scoped></style>
@/api/permission/index
