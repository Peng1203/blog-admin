<template>
  <div class="table-container layout-padding">
    <el-card
      shadow="hover"
      class="layout-padding-auto"
    >
      <Peng-Table
        :data="tableState.data"
        :columns="tableState.columns"
        :is-need-pager="false"
      >
        <template #operationSlot="{ row }">
          <el-button
            circle
            title="复制"
            size="small"
            type="info"
            icon="CopyDocument"
            color="#007BFF"
            v-copy="row.url"
          />

          <el-button
            circle
            title="下载"
            size="small"
            type="success"
            icon="Download"
            @click="handleDownload(row.url)"
          />
        </template>
      </Peng-Table>
    </el-card>
  </div>
</template>

<script setup lang="ts" name="ResourceList">
import { onMounted, reactive, ref } from 'vue'
import { ColumnItem } from '@/components/Table'
import { useResourceStore } from '@/stores/resource'
import type { ResourceData } from './types'

const store = useResourceStore()

const tableState = reactive({
  data: <ResourceData[]>[],
  columns: ref<ColumnItem<ResourceData>[]>([
    {
      label: '名称',
      prop: 'name',
    },
    {
      label: '修改日期',
      prop: 'atime',
    },
    {
      label: '类型',
      prop: 'type',
    },
    {
      label: '大小',
      prop: 'size',
    },
    {
      label: '操作',
      prop: 'operation',
      slotName: 'operationSlot',
      width: 100,
    },
  ]),
})

const handleDownload = (url: string) => window.open(url, '_blank')

onMounted(() => {
  store.getResourceList().then(() => (tableState.data = store.list))
})
</script>
