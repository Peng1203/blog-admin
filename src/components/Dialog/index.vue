<template>
  <div class="peng-dialog">
    <el-dialog
      :width="width"
      :title="title"
      :modal="modal"
      :before-close="handleClose"
      :close-on-click-modal="modelClose"
      :close-on-press-escape="escClose"
      :draggable="draggable"
      :align-center="aCenter"
      v-model="dialogStatus"
    >
      <template #header>
        <slot name="header" />
      </template>

      <slot name="main" />

      <template #footer>
        <slot name="footer" />
      </template>
    </el-dialog>
  </div>

</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
// 封装对话框选项抽屉
interface PengDialogAttribute {
	modelValue: boolean
	title: string
	width?: string | number
	fullscreen?: boolean
	modal?: boolean
	modelClose?: boolean
	escClose?: boolean
	draggable?: boolean
	aCenter?: boolean
}

const props = withDefaults(defineProps<PengDialogAttribute>(), {
	fullscreen: false,
	modal: true,
	width: '770px',
	modelClose: true,
	escClose: true,
	draggable: false,
	aCenter: false,
})

const emits = defineEmits(['update:modelValue', 'dialogClose'])

const dialogStatus = ref<boolean>(true)

watch(
	() => props.modelValue,
	(val) => (dialogStatus.value = val),
	{
		deep: true,
		immediate: true,
	}
)
const handleClose = () => {
	dialogStatus.value = false
	emits('update:modelValue', dialogStatus.value)
	emits('dialogClose', dialogStatus.value)
}
</script>

<style lang='scss' scoped>
.peng-dialog {
	:deep(.el-dialog) {
		max-height: 70vh;
		border-radius: 8px;
	}
	:deep(.el-dialog__header) {
		margin-right: 0px !important;
		border-bottom: 1px solid rgb(180, 169, 169);
	}
	:deep(.el-dialog__body) {
		max-height: calc(70vh - 111px) !important;
	}
}
</style>