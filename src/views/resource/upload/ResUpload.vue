<template>
  <div
    ref="el"
    class="table-container layout-padding resource-upload-container"
  >
    <el-upload
      drag
      multiple
      :auto-upload="false"
      :show-file-list="false"
      :on-change="(uploadInfo: UploadFile)=> handleFileChange(uploadInfo.raw)"
    >
      <el-icon class="el-icon--upload"><upload-filled /></el-icon>
      <div class="el-upload__text">拖拽或点击选择上传文件</div>
      <div>上传文件不得大于 {{ MAX_SIZE_MB }} Mb</div>
    </el-upload>

    <div class="select-file-row flex">
      <el-upload
        multiple
        :auto-upload="false"
        :show-file-list="false"
        :on-change="(uploadInfo: UploadFile)=> handleFileChange(uploadInfo.raw)"
      >
        <!-- :on-change="test" -->
        <el-button
          type="primary"
          size="default"
          icon="ele-Files"
        >
          选择文件
        </el-button>
      </el-upload>

      <el-button
        ml10
        type="primary"
        size="default"
        icon="ele-Folder"
        color="#ffe791"
        @click="handleSelectDirectory"
      >
        选择文件夹
      </el-button>

      <el-upload
        ml10
        multiple
        :auto-upload="false"
        :show-file-list="false"
        :on-change="(uploadInfo: UploadFile)=> handleFileChange(uploadInfo.raw,LARGE_FILE_MAX_SIZE_VALUE)"
      >
        <!-- :on-change="test" -->
        <el-button
          type="primary"
          size="default"
          icon="ele-Files"
        >
          上传大文件
        </el-button>
      </el-upload>

      <el-button
        ml10
        type="info"
        size="default"
        icon="ele-DeleteFilled"
        @click="tableState.data = []"
      >
        清空
      </el-button>
    </div>

    <Peng-Table
      flex1
      empty-text="暂无文件"
      :border="false"
      :isNeedPager="false"
      :data="tableState.data"
      :columns="tableState.columns"
    >
      <!-- 状态 -->
      <template #statusSlot="{ row }">
        <el-tag
          type="info"
          size="small"
          v-if="row.status === StatusEnum.PENDING"
        >
          待上传
        </el-tag>

        <!-- 上传中 进度条 0 ~ 100 -->
        <!-- :color="row.uploadProcess === 100 ? '#67c23a' : '#409eff'" -->
        <el-progress
          :show-text="false"
          :status="row.uploadProcess === 100 ? 'success' : ''"
          :percentage="row.uploadProcess"
          v-else-if="row.status === StatusEnum.UPLOADING"
        />

        <el-tag
          size="small"
          type="success"
          v-else-if="row.status === StatusEnum.SUCCESS"
        >
          上传成功
        </el-tag>

        <el-tag
          size="small"
          type="danger"
          tip="点击重试"
          @click="
            () => {
              row.uploadProcess = 0
              handleExeUploadMethod(row)
            }
          "
          v-else-if="row.status === StatusEnum.FAIL"
        >
          上传失败 {{ row.errMsg }}
        </el-tag>
      </template>

      <!-- 大小 -->
      <template #sizeSlot="{ row, prop }">
        <!-- {{ row[prop] }} -->
        {{ byteToMb(row[prop]) }} Mb
      </template>

      <!-- 上传压缩 -->
      <template #isCompressSlot="{ row }">
        <div v-if="row.mimeType.includes('image')">
          <span v-if="row.mimeType.includes('gif')">不支持压缩gif图</span>
          <el-switch
            v-else
            v-model="row.isCompress"
          />
        </div>

        <span v-else>仅针对图片类型生效</span>
      </template>

      <!-- 操作列 -->
      <template #operationSlot="{ row, scope }">
        <!-- {{ row }} -->

        <el-button
          circle
          title="上传"
          size="small"
          type="primary"
          icon="ele-Upload"
          :disabled="row.status === StatusEnum.SUCCESS"
          @click="handleExeUploadMethod(row)"
        />

        <el-button
          circle
          title="删除"
          size="small"
          type="danger"
          icon="ele-Delete"
          @click="handleDelete(row, scope)"
        />

        <el-button
          circle
          title="预览"
          size="small"
          type="success"
          icon="ele-View"
          @click="handlePreView(row)"
          v-if="row.mimeType.includes('image')"
        />
      </template>
    </Peng-Table>

    <!-- 上传按钮 上传文件信息统计 -->
    <div
      class="upload-inof-row"
      flex-sb-c
    >
      <el-button
        type="primary"
        size="default"
        icon="ele-UploadFilled"
        :disabled="!tableState.data.length"
        @click="handleUpload"
      >
        开始上传
      </el-button>

      <div>
        <el-tag
          type="info"
          size="small"
          effect="light"
        >
          文件数量: {{ uploadInfo.files }}
        </el-tag>
        <el-tag
          size="small"
          effect="light"
          type="success"
        >
          成功上传: {{ uploadInfo.successFiles }}
        </el-tag>
        <el-tag
          size="small"
          effect="light"
          type="danger"
        >
          上传失败: {{ uploadInfo.failFiles }}
        </el-tag>
        <el-tag
          size="small"
          effect="light"
        >
          总大小: {{ uploadInfo.filesTotalSize }} byte ≈
          {{ byteToMb(uploadInfo.filesTotalSize) }} Mb
        </el-tag>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ColumnItem } from '@/components/Table'
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import _ from 'lodash'
import { FileData, StatusEnum } from './types'
import {
  ElUpload,
  UploadFile,
  // UploadInstance,
  // UploadProps,
  // UploadRawFile,
  // genFileId,
} from 'element-plus'
import { useNotificationMsg } from '@/utils/notificationMsg'
import { useResourceApi } from '@/api'
import { blobToFile, compressImage, imageToBase64 } from '@/utils/file'
import { api as viewerApi } from 'v-viewer'

const { uploadResource } = useResourceApi()

// 正常上传文件大小
const MAX_SIZE_MB = 5
const MAX_SIZE_VALUE = 1024 * 1024 * MAX_SIZE_MB

// 大上传文件大小
const LARGE_FILE_MAX_SIZE_MB = 200
const LARGE_FILE_MAX_SIZE_VALUE = 1024 * 1024 * LARGE_FILE_MAX_SIZE_MB

const tableState = reactive({
  data: <FileData[]>[],
  columns: <ColumnItem<FileData>[]>[
    {
      label: '文件名',
      prop: 'name',
      sort: true,
      tooltip: true,
    },
    {
      label: '类型',
      prop: 'type',
      sort: true,
    },
    {
      label: '文件大小',
      prop: 'size',
      sort: true,
      slotName: 'sizeSlot',
    },
    {
      label: '状态',
      prop: 'status',
      sort: true,
      slotName: 'statusSlot',
    },
    {
      label: '上传压缩',
      prop: 'isCompress',
      slotName: 'isCompressSlot',
      tooltip: true,
    },
    {
      label: '操作',
      prop: 'operation',
      width: 150,
      slotName: 'operationSlot',
    },
  ],
})

// 文件列表信息统计
const uploadInfo = ref({
  files: computed(() => tableState.data.length),
  successFiles: computed(
    () =>
      tableState.data.filter(file => file.status === StatusEnum.SUCCESS).length
  ),
  failFiles: computed(
    () => tableState.data.filter(file => file.status === StatusEnum.FAIL).length
  ),
  filesTotalSize: computed(() => _.sum(tableState.data.map(file => file.size))),
})

// 字节转换mb单位
const byteToMb = (size: number) => (size / 1024 / 1024).toFixed(2)

// 选择文件夹上传
const handleSelectDirectory = () => {
  const inputEl: HTMLInputElement = document.createElement('input')
  inputEl.type = 'file'
  inputEl.webkitdirectory = true
  // 用于兼容 openg浏览器和 火狐浏览器
  ;(inputEl as any).mozdirectory = true
  ;(inputEl as any).odirectory = true
  inputEl.click()

  inputEl.onchange = () => {
    for (let i = 0; i < inputEl.files.length; i++) {
      const file = inputEl.files[i]
      handleFileChange(file)
    }

    // 选择完成 删除创建的 input 元素
    inputEl.remove()
  }
}

const handleFileChange = (file: File, maxFileSize = MAX_SIZE_VALUE) => {
  const { name, size, type } = file

  // type 为空时 file 为目录
  if (!type) return

  // prettier-ignore
  if (size > maxFileSize) return useNotificationMsg('', `请选择小于${MAX_SIZE_MB}MB的文件`, 'warning', 2);

  const fileItem: FileData = {
    name,
    size,
    type: name.split('.')[name.split('.').length - 1],
    status: StatusEnum.PENDING,
    fileData: file,
    mimeType: type,
    isCompress: type.includes('image') && !type.includes('gif'),
  }

  tableState.data.unshift(fileItem)
}

const handleUpload = () => {
  tableState.data.forEach(
    item => item.status === StatusEnum.PENDING && handleExeUploadMethod(item)
  )
}

// 根据文件大小 判断走正常上传还是 大文件分片上传
const handleExeUploadMethod = (row: FileData) => {
  if (row.size <= MAX_SIZE_VALUE) uploadFile(row)
  else chunkUpload(row)
}

// 分片上传
const chunkUpload = async (fileItem: FileData) => {
  try {
    console.log('分片上传 ------', fileItem)
    const { fileData } = fileItem

    // slice 类似数组中的方法 表示 取当前文件的字节范围 0~99 字节
    // const chunk = fileData.slice(0, 100);
    const chunks = createFileChunks(fileData, 1024 * 1024)
    console.log('chunks ------', chunks)
  } catch (e) {
    console.log('e', e)
  }
}

// 将文件按照指定大小切分
const createFileChunks = (file: File, chunkSize: number): Blob[] => {
  const fileChunks: Blob[] = []
  const currentChunkSize = () => fileChunks.length * chunkSize
  while (file.size > currentChunkSize()) {
    const chunk = file.slice(currentChunkSize(), currentChunkSize() + chunkSize)
    fileChunks.push(chunk)
  }

  // console.time('for 切割耗时');
  // const fileChunks2: Blob[] = [];
  // for (let i = 0; i < file.size; i += chunkSize) {
  //   const chunk = file.slice(i, i + chunkSize);
  //   fileChunks2.push(chunk);
  // }
  // console.timeEnd('for 切割耗时');
  // console.log('fileChunks2 ------', fileChunks2);
  return fileChunks
}

// 正常上传
const uploadFile = async (fileItem: FileData) => {
  fileItem.status = StatusEnum.UPLOADING
  try {
    const formData = await fileToFormData(fileItem)
    const { data: res } = await uploadResource(
      formData,
      event => (fileItem.uploadProcess = event.progress * 100),
      fileItem
    )
    // 当 res 响应时 onUploadProgress 事件 回调函数将不会再执行 但可能会触发1~2次 res 响应之前 已经触发的回调
    const { success, code } = res
    if (code !== 20100 || !success) return
    fileItem.uploadProcess = 1
    fileItem.status = StatusEnum.SUCCESS
  } catch (e) {
    console.log('e', e)
    fileItem.errMsg = e.message
    fileItem.status = StatusEnum.FAIL
  }
}
// 获取文件的 FormData 并且判断是否是 图片类型且开启了压缩
const fileToFormData = async (fileItem: FileData): Promise<FormData> => {
  const { fileData, isCompress } = fileItem
  const formData = new FormData()
  if (isCompress) {
    const compressFile = (await compressImage(fileData)) as Blob
    const newFile = blobToFile(compressFile)
    formData.append('file', newFile)
  } else formData.append('file', fileData)
  return formData
}

const handleDelete = (row: FileData, scope) => {
  tableState.data.splice(scope.$index, 1)
  row.cancel && row.cancel()
}

// 图片预览
const handlePreView = async (fileItem: FileData) => {
  const { fileData, isCompress } = fileItem
  let dateUrl = ''
  if (isCompress) {
    const compressFile = (await compressImage(fileData)) as Blob
    const newFile = blobToFile(compressFile)
    dateUrl = await imageToBase64(newFile)
  } else {
    dateUrl = await imageToBase64(fileData)
  }

  viewerApi({ images: [dateUrl] })
}

const PASTE_EVENT = 'paste'
const el = ref<RefType<HTMLDivElement>>(null)

// 粘贴文件快捷操作
const handlePasteEvent = (event: ClipboardEvent) => {
  const { clipboardData } = event
  const { files } = clipboardData

  for (let i = 0; i < files.length; i++) {
    handleFileChange(files[i])
  }
}

onMounted(() => {
  el.value && el.value.addEventListener(PASTE_EVENT, handlePasteEvent)
})

onUnmounted(() => {
  el.value && el.value.removeEventListener(PASTE_EVENT, handlePasteEvent)
})
</script>

<style scoped lang="scss">
.el-tag + .el-tag {
  margin-left: 5px;
}

.resource-upload-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
