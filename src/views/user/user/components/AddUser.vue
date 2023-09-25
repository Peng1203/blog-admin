<template>
  <!-- width="40%" -->
  <Dialog
    title="添加用户"
    v-model="addUserDialogStatus"
    @clickCancel="addUserDialogStatus = false"
    @clickConfirm="handleAdd"
  >
    <template #main>
      <!-- inline -->
      <Form
        labelW="180"
        ref="addUserFormRef"
        :formData="addUserState.data"
        :formItemList="addUserState.formItemList"
      >
        <template #pwdSlot>1212</template>
      </Form>
    </template>
  </Dialog>
</template>

<script lang="ts" setup>
import { ref, reactive, watch } from 'vue';
import { useUserApi } from '@/api/user';
import { ElMessage } from 'element-plus';
import { useRolesInfo } from '@/stores/roleList';
import Dialog from '@/components/Dialog';
import Form, { FormItem } from '@/components/Form';
import { passwordStrengthLevelDetection } from '@/utils/pwd';
const emits = defineEmits(['updateList']);
const { addUser } = useUserApi();

const roleStore = useRolesInfo();

// 校验密码强度
const passwordStrengthDetection = (rule: any, value: any, callback: any) => {
  const findFormItem = addUserState.formItemList.find(item => item.prop === 'password');
  if (!value) return findFormItem && (findFormItem.strengthLevel = 0);

  let level = passwordStrengthLevelDetection(value);
  if (findFormItem) findFormItem.strengthLevel = level as any;
  callback();
};

// 对话框状态
const addUserDialogStatus = ref<boolean>(false);

const addUserState = reactive({
  data: {
    userName: 'test',
    nickName: '',
    password: '123456',
    roleIds: [1],
    email: '',
    userEnabled: 1,
    userAvatar: '',
  },
  formItemList: ref<FormItem[]>([
    {
      type: 'input',
      label: '用户名',
      prop: 'userName',
      span: 20,
      placeholder: '请输入用户名',
      rules: [
        { required: true, trigger: 'blur' },
        { min: 2, max: 8, trigger: 'blur' },
      ],
    },
    {
      type: 'input',
      label: '昵称',
      prop: 'nickName',
      span: 20,
      placeholder: '请输入昵称',
      rules: [{ min: 2, max: 16, trigger: 'blur' }],
    },
    {
      type: 'pwd',
      label: '密码',
      prop: 'password',
      span: 20,
      placeholder: '请输入密码',
      strengthLevel: 0,
      rules: [
        { required: true, trigger: 'blur' },
        { min: 6, max: 15, trigger: 'blur' },
        {
          validator: passwordStrengthDetection,
          trigger: 'change',
        },
      ],
    },
    {
      type: 'select',
      label: '角色',
      multiple: true,
      prop: 'roleIds',
      options: [],

      span: 20,
      placeholder: '请输入选择角色',
      rules: [{ required: true, trigger: 'change' }],
    },
    {
      type: 'input',
      label: '邮箱',
      prop: 'email',
      span: 20,
      placeholder: '请输入邮箱',
    },
    {
      type: 'switch',
      label: '状态',
      prop: 'userEnabled',
      tValue: 1,
      fValue: 0,
      tText: '启用',
      fText: '锁定',
      isInline: true,
      span: 20,
    },
  ]),
});

const addUserFormRef = ref<RefType>(null);
// 处理添加用户
const handleAdd = async () => {
  // 校验表单
  const validataRes = await addUserFormRef.value
    .getRef()
    .validate()
    .catch(() => false);
  if (!validataRes) return;
  const addRes = await addNewUser();
  if (!addRes) return;
  addUserDialogStatus.value = false;
  emits('updateList');
};
// 添加用户
const addNewUser = async (): Promise<boolean> => {
  try {
    const { email, ...other } = addUserState.data;
    const params = {
      ...other,
      ...(email ? { email } : {}),
    };
    const { data: res } = await addUser(params);
    console.log('res ------', res);
    const { code, data, message } = res;
    if (code !== 200 || message !== 'Success') {
      ElMessage.error(data);
      return false;
    } else {
      ElMessage.success(data);
      return true;
    }
  } catch (e) {
    console.log(e);
    return false;
  }
};

const formInit = () => {
  addUserState.data = {
    userName: '',
    nickName: '',
    password: '',
    roleIds: [],
    email: '',
    userEnabled: 1,
    userAvatar: '',
  };
  addUserFormRef.value.getRef().resetFields();
  const findFormItem = addUserState.formItemList.find(item => item.prop === 'password');
  if (findFormItem) findFormItem.strengthLevel = 0;
};

watch(addUserDialogStatus, async val => {
  if (val) {
    const rolesItem = addUserState.formItemList.find(item => item.prop === 'roleIds');
    rolesItem?.options && !rolesItem.options.length && (rolesItem.options = roleStore.roleOption);
  } else {
    formInit();
  }
});

defineExpose({ addUserDialogStatus });
</script>

<style lang="scss" scoped></style>
