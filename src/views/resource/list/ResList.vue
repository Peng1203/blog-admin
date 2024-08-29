<template>
  <div class="table-container layout-padding">
    <el-card
      shadow="hover"
      class="layout-padding-auto"
    >
      <div mb15>
        <el-button
          size="default"
          type="primary"
          :disabled="!tableState.selectVal.length"
          @click="handleBatchDown"
        >
          <el-icon>
            <Download />
          </el-icon>
          下 载
        </el-button>

        <el-button
          size="default"
          type="danger"
          :disabled="!tableState.selectVal.length"
          @click="handleBatchDel"
        >
          <el-icon>
            <Delete />
          </el-icon>
          删 除
        </el-button>
      </div>
      <!-- :border="false" -->

      <Peng-Table
        isSelection
        operationColumn
        :operationColumnWidth="200"
        :operationColumnBtns="['delete']"
        :data="dataList"
        :columns="tableState.columns"
        :loading="tableState.loading"
        :is-need-pager="false"
        :default-sort="{ prop: 'atime', order: 'descending' }"
        @deleteBtn="handleDelete"
        @dbRowClick="handleRowDbClikc"
        @selectionChange="val => (tableState.selectVal = val)"
      >
        <template #nameSlot="{ row, prop }">
          <span v-html="queryStrHighlight(row[prop!], tableState.queryStr)" />
        </template>

        <template #operationHeaderSlot>
          <div flex-sb-c>
            <el-input
              size="small"
              v-model="tableState.queryStr"
            />

            <el-button
              ml5
              size="small"
              type="primary"
              icon="RefreshRight"
              @click="handleRefreshList"
            />
          </div>
        </template>

        <template #operationStartSlot="{ row }">
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
            @click="handleDownload(row)"
          />

          <el-button
            circle
            title="预览"
            size="small"
            type="info"
            icon="ele-View"
            @click="handlePreView(row)"
          />
        </template>
      </Peng-Table>

      <div mt10>
        <el-tag
          type="info"
          size="small"
          effect="light"
        >
          文件数量: {{ dataList.length }}
        </el-tag>

        <el-tag
          ml5
          type="primary"
          size="small"
          effect="light"
        >
          选中文件数: {{ tableState.selectVal.length }}
        </el-tag>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts" name="ResourceList">
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue'
import { ColumnItem } from '@/components/Table'
import { useResourceStore } from '@/stores/resource'
import type { ResourceListItem } from './types'
import request from '@/utils/request'
import FileSaver from 'file-saver'
import axios, { AxiosProgressEvent, Canceler } from 'axios'
import { useNotificationMsg } from '@/utils/notificationMsg'
import { queryStrHighlight } from '@/utils/queryStrHighlight'
import { api as viewerApi } from 'v-viewer'
import { concurRequest } from '@/utils/concurRequest'
import { BroadcastChannelEnum } from '@/constants'
import { formatByteSize } from '@/utils/file'

const store = useResourceStore()

const tableState = reactive({
  loading: false,
  selectVal: [],
  queryStr: '',
  columns: ref<ColumnItem<ResourceListItem>[]>([
    {
      label: '名称',
      prop: 'name',
      tooltip: true,
      slotName: 'nameSlot',
    },
    {
      label: '修改日期',
      prop: 'atime',
      sort: true,
      width: 165,
    },
    // {
    //   label: 'Mime类型',
    //   prop: 'mimeType',
    // },
    {
      label: '类型',
      prop: 'type',
      sort: true,
      width: 80,
      filters: [
        { text: '图片', value: 'image' },
        { text: '视频', value: 'video' },
        { text: '音频', value: 'audio' },
        { text: '文本', value: 'text' },
        { text: '其他', value: '' },
      ],
      filterMethod(
        value: string,
        row: ResourceListItem
        // column: TableColumnCtx<ResourceListItem>
      ) {
        if (!row.mimeType) return true

        if (value === 'text') return row.mimeType.includes(value) || ['js', 'ts'].includes(row.type)

        return row.mimeType.includes(value)
      },
    },
    {
      label: '大小',
      prop: 'size',
      width: 100,
      sort: true,
      formatter: ({ size }) => formatByteSize(size),
    },
  ]),
})

// 取消请求的函数
const cancelCbs = ref<Canceler[]>([])
const handleDownload = async (row: ResourceListItem) => {
  try {
    // 重新下载时 重置下载进度为 0
    row.process = 0
    // FileSaver 也可以通过传入 url 触发下载
    // FileSaver.saveAs(row.url, row.name)

    const { data: blobRes } = await request({
      url: row.url,
      method: 'GET',
      responseType: 'blob',
      withCredentials: false,
      cancelToken: new axios.CancelToken(c => cancelCbs.value.push(c)),
      onDownloadProgress(event: AxiosProgressEvent) {
        if (row.process === 100) return
        row.process = event.progress * 100
      },
    })
    // 当触发 blobRes 表示下载完毕 进度设置为 100%
    row.process = 100
    // blobRes 为一个 blob 类型的数据
    FileSaver.saveAs(blobRes, row.name)
  } catch (e) {
    console.log('e', e)
  }
}

const dataList = computed<ResourceListItem[]>(() => {
  const tableData = store.list.map(item => ({ ...item, process: 0 }))
  if (!tableState.queryStr) return tableData
  return tableData.filter(
    data => !tableState.queryStr || data.name.toLowerCase().includes(tableState.queryStr.toLowerCase())
  )
})

const handlePreView = (row: ResourceListItem) => window.open(row.url, '_blank')

const handleDelete = (row: ResourceListItem) => {
  if (row.process > 0 && row.process < 100)
    return useNotificationMsg('操作失败', '当前文件正在下载 无法删除', 'warning')
  store.deleteResource(row.name)
}

const handleRefreshList = () => getDataList(true)

const handleBatchDel = async () => {
  tableState.loading = true
  const params = tableState.selectVal.map(item => item.name)
  await concurRequest(params, fileName => store.deleteResource(fileName, false))
  tableState.loading = false
  useNotificationMsg('', '批量删除成功')
}

const handleBatchDown = async () => {
  tableState.loading = true
  await concurRequest(tableState.selectVal, handleDownload)
  tableState.loading = false
}

const getDataList = async (refresh: boolean = false) => {
  tableState.loading = true
  await store.getResourceList(refresh)
  tableState.loading = false
}

const handleAcceptBroadcasts = () => {
  const channel = new BroadcastChannel(BroadcastChannelEnum.RESOURCE_CHANNEL)
  channel.onmessage = e => {
    e.data === 'update' && getDataList(true)
  }
}

const handleRowDbClikc = (row: ResourceListItem) => {
  if (!row.mimeType) return
  if (!row.mimeType.includes('image')) return
  viewerApi({ images: [row.url] })
}

onMounted(() => {
  getDataList()
  handleAcceptBroadcasts()
})

onUnmounted(() => {
  cancelCbs.value.forEach(c => c && c())
})
</script>
