<template>
  <Dialog
    title="添加角色"
    v-model="addRoleDialogStatus"
    @clickConfirm="handleAdd"
    @dialogClose="handleDialogClose"
  >
    <Form
      ref="addFormRef"
      :labelW="'120px'"
      :formItems="addRoleState.formItemList"
      v-model="addRoleState.data"
    >
      <!-- 菜单 -->
      <template #menuSlot>
        <MenuTree
          :height="150"
          v-if="addRoleDialogStatus"
          v-model:checked-menu="addRoleState.data.menus"
        />
      </template>

      <!-- 权限标识 -->
      <template #permissionSlot>
        <PermissionTree
          filter
          :height="150"
          v-if="addRoleDialogStatus"
          v-model:checked-permission="addRoleState.data.permissions"
        />
      </template>
    </Form>
  </Dialog>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue';
import { ElMessage } from 'element-plus';
import { useRoleApi } from '@/api/role/index';
import Dialog from '@/components/Dialog';
import Form, { FormItem } from '@/components/Form';
import { AddEditRoleType, RoleData } from '../types';
import { MenuTree, MenuData } from '@/views/auth/menu';
import { usePermissionInfo } from '@/stores/permissionList';
import { PermissionTree, PermissionData } from '@/views/auth/authPermission';

const emits = defineEmits(['updateList']);

const { addRole } = useRoleApi();

const permissionStore = usePermissionInfo();

const addRoleDialogStatus = ref<boolean>(false);

const addRoleState = reactive({
  data: ref<AddEditRoleType>({
    roleName: '',
    description: '',
    menus: [],
    permissions: [],
  }),
  formItemList: ref<FormItem<AddEditRoleType>[]>([
    {
      type: 'input',
      label: '角色名称',
      prop: 'roleName',
      placeholder: '请输入角色名称',
      rules: [{ required: true, trigger: 'blur' }],
    },
    {
      type: 'slot',
      slotName: 'menuSlot',
      label: '菜单',
      prop: 'menus',
      required: true,
    },
    {
      type: 'slot',
      slotName: 'permissionSlot',
      label: '权限',
      prop: 'permissions',
    },
    {
      type: 'textarea',
      label: '角色描述',
      prop: 'description',
      placeholder: '请输入角色描述',
    },
  ]),
});

const addFormRef = ref<RefType>(null);
// 处理添加操作
const handleAdd = async () => {
  if (addRoleState!.data.menus && !addRoleState.data.menus.length) return;

  const validRes = await addFormRef.value
    .getRef()
    .validate()
    .catch(() => false);
  if (!validRes) return;
  const addRes = await addNewRole();
  if (!addRes) return;
  addRoleDialogStatus.value = false;
  emits('updateList');
};

// 添加角色
const addNewRole = async (): Promise<boolean> => {
  try {
    const { permissions: pIds, ...args } = addRoleState.data;
    const permissions = pIds?.filter(id => !permissionStore.permissionList.find(p => p.id === id));
    const params = {
      ...args,
      permissions,
    };

    const { data: res } = await addRole<RoleData<MenuData, PermissionData>>(params);
    const { code, data, message, success } = res;
    if (code !== 20100 || !success) return false;
    ElMessage.success(message);
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};

const resetAddForm = () => {
  addRoleState.data.roleName = '';
  addRoleState.data.description = '';
  addRoleState.data.menus = [];
  addRoleState.data.permissions = [];
};

const handleDialogClose = () => {
  resetAddForm();
  addFormRef.value.getRef().resetFields();
};

defineExpose({ addRoleDialogStatus });
</script>

<style lang="scss" scoped></style>
