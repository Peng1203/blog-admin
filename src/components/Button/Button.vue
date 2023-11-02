<template>
  <el-button
    :size="size"
    :type="attrType"
    :plain="plain"
    :round="round"
    :circle="circle"
    :dark="dark"
    :loading="loading"
    :icon="`ele-${iconClass}`"
    @click="handleBtnClick"
  >
    <component
      v-if="icon"
      :is="icon"
    />
    {{ label }}
  </el-button>
</template>

<script setup lang="ts">
import { ButtonAttribute } from './index';
import { Delete, Edit } from '@element-plus/icons-vue';

const emits = defineEmits(['click']);

const props = withDefaults(defineProps<ButtonAttribute>(), {
  label: '',
  size: 'default',
  icon: '',
  iconClass: '',
  type: '',
  plain: false,
  round: false,
  circle: false,
  loading: false,
  dark: false,
  color: '#fff',
  primary: false,
  success: false,
  info: false,
  warning: false,
  danger: false,
});

const handleBtnClick = () => emits('click');

const iconClassHashMapping = () => {
  if (props.iconClass === 'Delete') return Delete;
  else if (props.iconClass === 'Edit') return Edit;
};

console.log('props ------', props);
const attrType = () => {
  if (props.type) return props.type;
  if (props.primary) return 'primary';
  if (props.success) return 'success';
  if (props.info) return 'info';
  if (props.warning) return 'warning';
  if (props.danger) return 'danger';
};
</script>

<style scoped lang="scss"></style>
