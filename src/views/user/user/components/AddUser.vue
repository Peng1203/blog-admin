<template>
  <!-- width="40%" -->
  <Peng-Dialog
    title="添加用户"
    v-model="addUserDialogStatus"
  >
    <!-- <template #header>哈哈哈哈 标题</template> -->

    <template #main>
      <div>
        <!-- inline -->
        <Peng-Form
          ref="addUserFormRes"
          size="default"
          :labelW="'90px'"
          :formData="addUserState.data"
          :formItemList="addUserState.formItemList"
        />
      </div>
    </template>

    <template #footer>
      <el-button
        size="small"
        @click="addUserDialogStatus = false"
      >取消</el-button>
      <el-button
        type="primary"
        size="small"
        @click="handleAdd"
      >确认</el-button>
    </template>

  </Peng-Dialog>
</template>

<script lang="ts" setup>
import { ref, reactive, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useUserApi } from '@/api/user'
import { ElMessage } from 'element-plus'
import { useUserAuthList } from '@/stores/userAuthList'

const userAuthListStore = useUserAuthList()
const userAuthList = storeToRefs(userAuthListStore)

const emits = defineEmits(['updateList'])
const { addUser } = useUserApi()
// 对话框状态
const addUserDialogStatus = ref<boolean>(false)

const addUserState = reactive({
  data: {
    userName: '',
    password: '',
    roleId: '',
    email: '',
    state: 0,
  },
  formItemList: ref<FormItem[]>([
    {
      type: 'input',
      label: '用户名',
      prop: 'userName',
      xs: 24,
      span: 12,
      placeholder: '请输入用户名',
      rules: [
        { required: true, trigger: 'blur' },
        { min: 2, max: 6, trigger: 'blur' },
      ],
    },
    {
      type: 'pwd',
      label: '密码',
      prop: 'password',
      xs: 24,
      span: 12,
      placeholder: '请输入密码',
      rules: [
        { required: true, trigger: 'blur' },
        { min: 6, max: 15, trigger: 'blur' },
      ],
    },
    {
      type: 'select',
      label: '角色',
      prop: 'roleId',
      options: [],
      xs: 24,
      span: 12,
      placeholder: '请输入选择角色',
      rules: [{ required: true, trigger: 'change' }],
    },
    {
      type: 'input',
      label: '邮箱',
      prop: 'email',
      xs: 24,
      span: 12,
      placeholder: '请输入邮箱',
    },
    {
      type: 'switch',
      label: '用户状态',
      prop: 'state',
      tValue: 1,
      fValue: 0,
      tText: '启用',
      fText: '锁定',
      isInline: true,
      xs: 24,
      span: 12,
    },
  ]),
})

const addUserFormRes = ref<any>(null)
// 处理添加用户
const handleAdd = async () => {
  // 校验表单
  const validataRes = await addUserFormRes.value
    .getRef()
    .validate()
    .catch(() => false)
  if (!validataRes) return
  const addRes = await addNewUser()
  if (!addRes) return
  addUserDialogStatus.value = false
  emits('updateList')
}
// 添加用户
const addNewUser = async (): Promise<boolean> => {
  try {
    const params = addUserState.data
    const { data: res } = await addUser(params)
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

watch(addUserDialogStatus, async (val) => {
  if (val) {
    await userAuthListStore.getAllRoleList()
    addUserState.formItemList[2].options = userAuthList.allRoleOptions.value
  } else {
    addUserFormRes.value.getRef().resetFields()
    addUserState.data = {
      userName: '',
      password: '',
      roleId: '',
      email: '',
      state: 0,
    }
  }
})

defineExpose({ addUserDialogStatus })
</script>

<style lang='scss' scoped>
</style>