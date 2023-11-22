<template>
  <div
    h300px
    overflow-y-auto
  >
    <!-- <Tree v-model:checked-permission="checkedPermissionKeys" /> -->
    <el-input
      size="small"
      v-model="filterText"
      placeholder="标识名称"
    />
    <el-tree
      show-checkbox
      node-key="id"
      ref="treeRef"
      :data="data"
      :props="defaultProps"
      :default-checked-keys="checkedKeys"
      :default-expanded-keys="expandedKeys"
      :filter-node-method="filterNode"
      @check="handleCheckboxChange"
    />
  </div>
</template>

<script setup lang="ts" name="">
import { ref, onMounted, watchEffect, PropType, watch } from 'vue';
import { ElTree } from 'element-plus';
import { usePermissionInfo } from '@/stores/permissionList';
import { PermissionData } from '../types';

const emits = defineEmits(['update:checkedPermission']);

const props = defineProps({
  checkedPermission: {
    type: Array as PropType<number[]>,
    default: () => [],
  },
});

const permissionStore = usePermissionInfo();

const defaultProps = {
  children: 'children',
  label: 'permissionName',
};

const filterText = ref('');

// 选中的数据
const checkedKeys = ref<number[]>([]);
// 默认展开的数据
const expandedKeys = ref<number[]>([]);
// 树形结构数据
const data = ref<PermissionData[]>();

const handleCheckboxChange = (checkedNodes: PermissionData, checkedInfo: any) => {
  emits('update:checkedPermission', checkedInfo.checkedKeys);
};

const filterNode = (value: string, data: any) => {
  if (!value) return true;
  return data.permissionName.includes(value);
};

const treeRef = ref<InstanceType<typeof ElTree>>();
watch(filterText, val => {
  treeRef.value!.filter(val);
});

watch(
  () => permissionStore.permissionList,
  val => (data.value = val),
  { deep: true }
);

watchEffect(() => {
  checkedKeys.value = JSON.parse(JSON.stringify(props.checkedPermission));
});

onMounted(async () => {
  await permissionStore.getPermissionData();
  data.value = permissionStore.permissionList;
});
</script>

<style scoped lang="scss"></style>
