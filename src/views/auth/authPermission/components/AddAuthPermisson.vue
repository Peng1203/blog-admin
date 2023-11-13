<template>
  <Peng-Dialog
    title="添加权限标识"
    width="500px"
    v-model="addAuthPermissonDialogStatus"
  >
    <template #main>
      <Peng-Form
        ref="addAuthFormRef"
        size="default"
        :labelW="'90px'"
        :formData="addAuthState.data"
        :formItemList="addAuthState.formItemList"
      ></Peng-Form>
    </template>

    <template #footer>
      <el-button
        size="small"
        @click="addAuthPermissonDialogStatus = false"
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
import { useAuthPermissionApi } from '@/api/authPermission/index'
import { ElMessage } from 'element-plus'

const emits = defineEmits(['updateList'])

const { addAuthPermission } = useAuthPermissionApi()

const addAuthPermissonDialogStatus = ref<boolean>(false)

watch(addAuthPermissonDialogStatus, (val) => {
	if (!val) {
		addAuthFormRef.value.getRef().resetFields()

		addAuthState.data = {
			permissionName: '',
			permissionCode: '',
			desc: '',
			updateTime: '',
			createdTime: '',
		}
	}
})
const addAuthState = reactive({
	data: {
		permissionName: '',
		permissionCode: '',
		desc: '',
		updateTime: '',
		createdTime: '',
	},
	formItemList: ref<FormItem[]>([
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
			placeholder: '请输入权限标识',
			rules: [
				{ required: true, trigger: 'blur' },
				{ min: 2, trigger: 'blur' },
			],
		},
		{
			type: 'textarea',
			label: '描述',
			prop: 'desc',
			placeholder: '请输入权限标识描述',
		},
	]),
})

const addAuthFormRef = ref<any>(null)
// 处理添加操作
const handleAdd = async () => {
	const validRes = await addAuthFormRef.value
		.getRef()
		.validate()
		.catch(() => false)
	if (!validRes) return
	const addRes = await addNewAuthPermission()
	if (!addRes) return
	addAuthPermissonDialogStatus.value = false
	emits('updateList')
}

// 添加权限标识
const addNewAuthPermission = async (): Promise<boolean> => {
	try {
		const { permissionName, permissionCode, desc } = addAuthState.data
		const params = { permissionName, permissionCode, desc }
		const { data: res } = await addAuthPermission(params)
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

defineExpose({ addAuthPermissonDialogStatus })
</script>

<style lang='scss' scoped>
</style>@/api/permission/index