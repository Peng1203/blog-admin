<template>
  <el-table
    v-bind="$attrs"
    v-loading="loading"
    row-key="id"
    style="width: 100%"
    :data="data"
    :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
  >
    <el-table-column
      width="45"
      type="selection"
      v-if="selection"
    />
    <slot name="expand"></slot>

    <template
      :key="i"
      v-for="(
        {
          label,
          prop,
          width,
          minWidth,
          sort,
          tooltip,
          fixed,
          align,
          slotName,
          childrenColumns,
          classNname,
        },
        i
      ) in tableColumns"
    >
      <!-- 自定义某列 -->
      <el-table-column
        v-if="slotName"
        :prop="prop"
        :label="label"
        :width="width || 'auto'"
        :sortable="sort"
        :min-width="minWidth"
        :class-name="classNname"
        :show-overflow-tooltip="tooltip"
        :fixed="
          deviceClientType === 'pc' ? fixed : fixed === 'left' ? false : fixed
        "
        :align="align || 'left'"
      >
        <template #default="scope">
          <slot
            :prop="prop"
            :name="slotName"
            :scope="scope"
            :row="scope.row"
          />
        </template>
      </el-table-column>

      <!-- 二级表头 -->
      <!-- :width="width || 'auto'" -->
      <!-- <el-table-column
        :label="label"
        :align="align || 'center'"
        :class-name="classNname"
        v-else-if="childrenColumns && childrenColumns.length"
      >
        <template
          :key="childrenItem.prop"
          v-for="childrenItem in childrenColumns"
        >
          <el-table-column
            v-if="childrenItem.slotName"
            :class-name="classNname"
            :label="childrenItem.label"
            :prop="childrenItem.prop"
            :min-width="childrenItem.minWidth"
            :sortable="childrenItem.sort"
            :show-overflow-tooltip="childrenItem.tooltip"
            :width="childrenItem.width || 'auto'"
          >
            <template #default="scope">
              <slot
                :scope="scope"
                :row="scope.row"
                :name="childrenItem.slotName"
                :prop="childrenItem.prop"
              />
            </template>
          </el-table-column>

          <el-table-column
            v-else
            :class-name="classNname"
            :label="childrenItem.label"
            :prop="childrenItem.prop"
            :min-width="childrenItem.minWidth"
            :sortable="childrenItem.sort"
            :show-overflow-tooltip="childrenItem.tooltip"
            :width="childrenItem.width || 'auto'"
          ></el-table-column>
        </template>
      </el-table-column> -->

      <el-table-column
        v-else
        :prop="prop"
        :label="label"
        :width="width"
        :sortable="sort"
        :class-name="classNname"
        :min-width="minWidth || ''"
        :show-overflow-tooltip="tooltip"
        :fixed="deviceClientType === 'pc' ? fixed : false"
        :align="align || 'left'"
      />
    </template>
  </el-table>
</template>

<script setup lang="tsx" generic="T">
import { ref, useSlots, inject, onMounted } from 'vue'
import {
  TableAttribute_v2,
  SlotProps,
  SlotOperationProps,
  ColumnItem,
} from './'

const deviceClientType = inject('deviceClientType')

const slots = useSlots()
type SlotsType = {
  expand(): any
  operationStartSlot(props: SlotOperationProps<T>): any
  operationEndSlot(props: SlotOperationProps<T>): any
} & { [K in keyof typeof slots]: (props: SlotProps<T>) => any }

// 定义组件属性
const props = withDefaults(defineProps<TableAttribute_v2<T>>(), {
  loading: false,
  selection: false,
  hasFilterColumn: false,
})

// 定义插槽
defineSlots<SlotsType>()

// 表格展示的 columns
let tableColumns = ref<ColumnItem<T>[]>([])

onMounted(() => {
  // tableColumns.value = props.columns;
})
</script>

<style scoped lang="scss"></style>
