<template>
  <Drawer
    :title="'修改角色信息'"
    v-model="editDrawerStatus"
    @clickConfirm="handleSaveEdit"
  >
    {{ editFormState.data }}
    <Form
      ref="editFormRef"
      label-p="top"
      :labelW="100"
      :formItems="editFormState.formItemList"
      v-model="editFormState.data"
    >
      <!-- 菜单 -->
      <template #menuSlot>
        <MenuTree
          :height="150"
          v-model:checked-menu="editFormState.data.menus"
        />
      </template>

      <!-- 权限标识 -->
      <template #permissionSlot>
        <PermissionTree
          filter
          :height="150"
          v-model:checked-permission="editFormState.data.permissions"
        />
      </template>
    </Form>
  </Drawer>
</template>

<script lang="ts" setup>
import { ref, reactive, watch } from 'vue';
import { useRoleApi } from '@/api/role/index';
import { ElMessage } from 'element-plus';
import { AddEditRoleType, RoleEntityData } from '../types';
import Drawer from '@/components/Drawer';
import Form, { FormItem } from '@/components/Form';
import { MenuTree } from '@/views/auth/menu';
import { PermissionTree } from '@/views/auth/authPermission';
import { usePermissionInfo } from '@/stores/permissionList';

const { updateRole } = useRoleApi();

interface EditRowProps {
  editRow: RoleEntityData;
}

const props = withDefaults(defineProps<EditRowProps>(), {
  editRow: () => ({} as RoleEntityData),
});
const emits = defineEmits(['updateList']);

const permissionStore = usePermissionInfo();

// 抽屉状态
const editDrawerStatus = ref<boolean>(false);

const editFormState = reactive({
  data: ref<AddEditRoleType>({
    id: 0,
    roleName: '',
    menus: [],
    permissions: [],
    updateTime: '',
    createTime: '',
    description: '',
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

const editFormRef = ref<RefType>(null);
// 处理保存修改
const handleSaveEdit = async () => {
  const valdateRes = await editFormRef.value
    .getRef()
    .validate()
    .catch(() => false);
  if (!valdateRes) return;
  const editRes = await saveEditRole();
  if (!editRes) return;
  editDrawerStatus.value = false;
  emits('updateList');
};

// 保存修改数据
const saveEditRole = async (): Promise<boolean> => {
  try {
    const { id, permissions: pIds, createTime, updateTime, ...args } = editFormState.data;
    const permissions = pIds?.filter(id => !permissionStore.permissionList.find(p => p.id === id));
    const params = {
      ...args,
      permissions,
    };
    const { data: res } = await updateRole<RoleEntityData>(id!, params);
    const { code, data, message, success } = res;
    if (code !== 20000 || !success) return false;
    ElMessage.success(message);
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};

watch(
  () => props.editRow,
  val => {
    editFormState.data = JSON.parse(JSON.stringify(val));
    editFormState.data.permissions = val.permissions.map(({ id }) => id);
    editFormState.data.menus = val.menus.map(({ id }) => id);
  },
  { deep: true }
);

defineExpose({ editDrawerStatus });
</script>

<style lang="scss" scoped></style>
