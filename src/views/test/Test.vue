<template>
  <div>
    <!-- size="small" -->
    <button @click="handleClick">测试</button>
    <Table
      ref="tableRef"
      filterColumn
      pager
      operationColumn
      selection
      :current-row-key="'name'"
      :data="state.data"
      :columns="state.columns"
      :total="114"
      :getData="getDataList"
      v-model:page="page"
      v-model:pageSize="pageSize"
      v-model:order="state.order"
      v-model:column="state.column"
      @column-sort="handleColumnSort"
    >
      <template #nameSlot="{ row, prop }">
        row --- {{ row.age }}
        <br />
        prop --- {{ prop }}
        <br />
        <!-- scope --- {{ scope }} -->
        <br />
      </template>
    </Table>
  </div>
</template>

<script setup lang="ts">
import { ColumnItem } from '@/components/Table'
import Table from '@/components/Table/Table_v2.vue'
import { useComponentRef } from '@/composables/useComponentRef'
import { ElTable } from 'element-plus'
// import { ColumnItem } from '@/components/Table'
import { onMounted, reactive, ref } from 'vue'

interface User {
  id: number
  name: string
  age: number
}

const page = ref(1)
const pageSize = ref(10)

const state = reactive({
  selectVal: [],
  order: '',
  column: '',
  data: ref<User[]>([
    {
      id: 1,
      name: 'zs',
      age: 18,
    },
    {
      id: 2,
      name: 'ls',
      age: 16,
    },
  ]),
  columns: <ColumnItem<User>[]>[
    { label: '名称', prop: 'name', slotName: 'nameSlot' },
    {
      label: '年龄',
      prop: 'age',
      // sort: 'custom',
      // sort: true,
      formatter(row, column) {
        if (row[column.property] >= 18) return `成年`
        else return `未成年`
      },
    },
  ],
})

const getDataList = async () => {
  try {
    const params = {
      page: page.value,
      pageSize: pageSize.value,
      column: state.column,
      order: state.order,
    }
    console.log('params', { ...params })
    await new Promise(res => setTimeout(res, 1500))
  } catch (e) {
    console.log('e', e)
  }
}

const tableRef = useComponentRef(ElTable)

const handleClick = () => {
  console.log(
    `%c tableRef ----`,
    'color: #fff;background-color: #000;font-size: 18px',

    tableRef.value?.clearSelection?.()
  )
}

const handleColumnSort = value => {
  console.log(value)
}
onMounted(() => {})
</script>
