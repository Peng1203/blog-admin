<template>
  <Peng-Drawer
    :title="'修改用户信息'"
    :direction="deviceClientType === 'pc' ? 'rtl' : 'btt'"
    :size="deviceClientType === 'pc' ? '400px' : '50%'"
    v-model="editDrawerStatus"
  >
    <template #main>
      <Peng-Form
        ref="editFormRef"
        size="default"
        :labelW="100"
        :formData="editFormState.data"
        :formItemList="editFormState.formItemList"
      />

      <div class="mt20 flex-e-c">
        <el-button
          size="small"
          @click="editDrawerStatus = false"
        >
          取消
        </el-button>
        <el-button
          size="small"
          type="primary"
          @click="handleSaveEdit"
        >
          保存
        </el-button>
      </div>
    </template>
  </Peng-Drawer>
</template>

<script lang="ts" setup>
import { ref, reactive, inject, PropType, watch } from 'vue'
import { useAuthPermissionApi } from '@/api/authPermission/index'
import { ElMessage } from 'element-plus'
const { updateAuthPermInfo } = useAuthPermissionApi()

const deviceClientType = inject('deviceClientType')

const props = defineProps({
	editRow: {
		type: Object as PropType<object>,
		require: true,
	},
})
const emits = defineEmits(['updateList'])

// 抽屉状态
const editDrawerStatus = ref<boolean>(false)

const editFormState = reactive({
	data: {
		id: 0,
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

const editFormRef = ref<any>(null)
// 处理保存修改
const handleSaveEdit = async () => {
	const valdateRes = await editFormRef.value
		.getRef()
		.validate()
		.catch(() => false)
	if (!valdateRes) return
	const editRes = await saveEditAuthPermisson()
	if (!editRes) return
	editDrawerStatus.value = false
	emits('updateList')
}

// 保存修改数据
const saveEditAuthPermisson = async (): Promise<boolean> => {
	try {
		const { id, permissionName, permissionCode, desc, updateTime, createdTime } = editFormState.data
		const params = {
			permissionName,
			permissionCode,
			desc,
		}
		const { data: res } = await updateAuthPermInfo(id, params)
		const { code, data, message } = res
		if (code !== 200 || message !== 'Success') {
			ElMessage.error(data)
			return false
		}
		ElMessage.success(data)
		return true
	} catch (e) {
		console.log(e)
		return false
	}
}

watch(
	() => props.editRow,
	(val) => (editFormState.data = JSON.parse(JSON.stringify(val))),
	{
		deep: true,
	}
)

defineExpose({ editDrawerStatus })
</script>

<style lang='scss' scoped>
</style>@/api/permission/index