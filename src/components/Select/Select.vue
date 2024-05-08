<template>
  <el-select-v2
    v-if="props.virtual"
    v-model="value"
    v-bind="$attrs"
    :size="props.size"
    :options="options"
    :clearable="clearable"
    :filterable="filterable"
    :style="`width: ${props.width}`"
    @change="handleSelectChange"
  />

  <el-select
    v-else
    v-model="value"
    v-bind="$attrs"
    :size="props.size"
    :clearable="clearable"
    :filterable="filterable"
    :style="`width: ${props.width}`"
    @change="handleSelectChange"
  >
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
      :disabled="item.disabled"
    />
  </el-select>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { SelectAttribute } from './';

// 双向数据绑定值
// const value = defineModel()
const emits = defineEmits(['update:modelValue', 'selectChange', 'change']);

const props = withDefaults(defineProps<SelectAttribute>(), {
  width: '100px',
  size: 'default',
  filterable: true,
  virtual: false,
});

const value = ref(props.modelValue);

const handleSelectChange = (val: any) => {
  emits('update:modelValue', val);
  emits('selectChange', val);
  emits('change', val);
};
</script>

<style scoped lang="scss"></style>
