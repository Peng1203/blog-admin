<template>
  <div w100>
    <el-input
      v-if="filter"
      size="small"
      v-model="filterText"
      placeholder="标识名称"
    />

    <el-scrollbar
      mt5
      :height="`${height}px`"
    >
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
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts" name="">
import { ref, onMounted, PropType, watch } from 'vue';
import { ElTree } from 'element-plus';
import { usePermissionInfo } from '@/stores/permissionList';
import { PermissionData } from '../types';

const emits = defineEmits(['update:checkedPermission']);

const props = defineProps({
  checkedPermission: {
    type: Array as PropType<number[]>,
    default: () => [],
  },
  filter: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  height: {
    type: Number as PropType<number>,
    default: 200,
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

watch(
  () => props.checkedPermission,
  val => {
    checkedKeys.value = JSON.parse(JSON.stringify(val));
    if (!val.length) treeRef.value!.setCheckedKeys([]);
  },
  { deep: true }
);

onMounted(async () => {
  await permissionStore.getPermissionData();
  data.value = permissionStore.permissionList;
});
</script>

<style scoped lang="scss"></style>
