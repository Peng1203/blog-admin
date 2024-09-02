<template>
  <div>
    <!-- size="small" -->

    <Table
      filterColumn
      pager
      operationColumn
      selection
      :current-row-key="'name'"
      :data="state.data"
      :columns="state.columns"
      :total="114"
      v-model:page="page"
      v-model:pageSize="pageSize"
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

    <h1>page --- {{ page }}</h1>
    <h1>pageSize --- {{ pageSize }}</h1>
  </div>
</template>

<script setup lang="ts">
import Table, { ColumnProps } from '@/components/Table/Table_v2.vue'
// import { ColumnItem } from '@/components/Table'
import { reactive, ref } from 'vue'

interface User {
  id: number
  name: string
  age: number
}

const state = reactive({
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
  columns: <ColumnProps<User>[]>[
    { label: '名称', prop: 'name', slotName: 'nameSlot' },
    {
      label: '年龄',
      prop: 'age',
      formatter(row, column) {
        if (row[column.property] >= 18) return `成年`
        else return `未成年`
      },
    },
  ],
})

const page = ref(1)
const pageSize = ref(10)
</script>
