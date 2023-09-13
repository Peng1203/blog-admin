<template>
  <div class="peng-drawer">
    <el-drawer
      :size="size"
      :title="title"
      :modal="modal"
      :direction="direction"
      :before-close="handleClose"
      :with-header="hasHeader"
      :modal-class="mdClass"
      v-model="drawerStatus"
    >
      <!-- 自定义header -->
      <template #header>
        <slot name="header" />
      </template>

      <slot name="main" />

      <!-- 自定义底部 -->
      <template #footer>
        <slot name="footer" />
      </template>
    </el-drawer>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, PropType, watch } from 'vue'
interface DrawerProps {
	title: string
	size?: number | string
	modelValue: boolean
	direction?: string
	modal?: boolean
	hasHeader?: boolean
	mdClass?: string
}

export default defineComponent({
	props: {
		title: {
			type: String as PropType<string>,
			default: '是否忘记传递标题了?😋',
		},
		size: {
			type: String as PropType<string | number>,
			default: '30%',
		},
		modelValue: {
			type: Boolean as PropType<boolean>,
			default: false,
		},
		// 打开方向
		direction: {
			type: String as PropType<string>,
			default: 'rtl', // rtl / ltr / ttb / btt
		},
		modal: {
			type: Boolean as PropType<boolean>,
			default: true,
		},
		// 是否展示标题
		hasHeader: {
			type: Boolean as PropType<boolean>,
			default: true,
		},
		// 遮罩层类名
		mdClass: {
			type: String as PropType<string>,
			default: '',
		},
	},
	emits: ['update:modelValue'],
	setup(props: DrawerProps, { emit }) {
		const drawerStatus = ref<boolean>(props.modelValue)
		watch(
			() => props.modelValue,
			(val) => (drawerStatus.value = val),
			{
				immediate: true,
				deep: true,
			}
		)
		// 关闭窗口
		const handleClose = () => {
			drawerStatus.value = false
			emit('update:modelValue', drawerStatus.value)
		}

		return {
			drawerStatus,
			handleClose,
		}
	},
})
</script>

<style lang='scss' scoped>
.peng-drawer {
	:deep(.el-drawer__body) {
		padding: 10px 20px;
	}
}
</style>