<template>
  <Peng-Drawer
    :title="'修改用户信息'"
    :direction="deviceClientType === 'pc' ? 'rtl' : 'btt'"
    :size="deviceClientType === 'pc' ? '400px' : '50%'"
    v-model="editDrawerStatus"
  >
    <template #main>
      <!-- :inline="true" -->
      <!-- size="large" -->
      <!-- :disabled="true" -->
      <Peng-Form
        ref="editFormRef"
        size="default"
        :labelW="80"
        :formData="editFormState.data"
        :formItemList="editFormState.formItemList"
      />

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
import { ref, reactive, inject, watch, onMounted, PropType } from 'vue'
import { storeToRefs } from 'pinia'
import { ElMessage } from 'element-plus'
import { useUserApi } from '@/api/user/index'
import { useUserAuthList } from '@/stores/userAuthList'

const userAuthListStore = useUserAuthList()
const userAuthList = storeToRefs(userAuthListStore)

const deviceClientType = inject('deviceClientType')
const { updateUserInfo } = useUserApi()

const props = defineProps({
  editRow: {
    type: Object as PropType<object>,
    require: true,
  },
})

// 抽屉状态
const editDrawerStatus = ref<boolean>(false)

const emits = defineEmits(['updateList'])
// 编辑状态信息
const editFormState = reactive({
  data: {
    id: 0,
    roleId: 0,
    userName: '',
    state: 0,
    email: '',
    unsealTime: '',
    updateTime: '',
    createdTime: '',
  },
  formItemList: ref<FormItem[]>([
    { type: 'input', label: '用户名', prop: 'userName' },
    {
      type: 'select',
      label: '角色',
      prop: 'roleId',
      options: [],
    },
    { type: 'input', label: '邮箱', prop: 'email' },
    {
      type: 'switch',
      label: '用户状态',
      prop: 'state',
      tValue: 1,
      fValue: 0,
      tText: '启用',
      fText: '锁定',
      isInline: true,
    },
  ]),
})

watch(
  () => props.editRow,
  (val) => {
    editFormState.data = JSON.parse(JSON.stringify(val))
  }
)
// 保存编辑信息
const saveEditUserInfo = async () => {
  try {
    const {
      id,
      roleId,
      userName,
      state,
      email,
      unsealTime,
      updateTime,
      createdTime,
    } = editFormState.data
    const params = {
      roleId,
      userName,
      state,
      email,
      unsealTime,
    }
    const { data: res } = await updateUserInfo(id, params)
    const { data, code, message } = res
    if (code !== 200 || message !== 'Success') return ElMessage.error(data)
    ElMessage.success(data)
  } catch (e) {
    // ElMessage.error('更新失败')
    console.log(e)
  }
}

// 处理保存修改信息
const handleSaveEdit = async () => {
  await saveEditUserInfo()
  editDrawerStatus.value = false
  emits('updateList')
}

watch(editDrawerStatus, async (val) => {
  if (val) {
    await userAuthListStore.getAllRoleList()
    editFormState.formItemList[1].options = userAuthList.allRoleOptions.value
  }
})

defineExpose({ editDrawerStatus })
</script>

<style lang="scss" scoped></style>
