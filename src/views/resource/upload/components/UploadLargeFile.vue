<template>
  <el-upload
    ml10
    multiple
    :auto-upload="false"
    :show-file-list="false"
    :on-change="(uploadInfo: UploadFile)=> handleFileChange(uploadInfo.raw, LARGE_FILE_MAX_SIZE_VALUE)"
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
</template>

<script setup lang="ts">
// import { ref } from 'vue'
import { ElUpload, UploadFile } from 'element-plus'
import { MB } from '@/constants'
import { FileData, StatusEnum } from '../types'
import { useNotificationMsg } from '@/utils/notificationMsg'
import { onMounted } from 'vue'

const emits = defineEmits(['change'])
// 大上传文件大小
const LARGE_FILE_MAX_SIZE_MB = 500
const LARGE_FILE_MAX_SIZE_VALUE = MB * LARGE_FILE_MAX_SIZE_MB

// 切片大小
const SLICE_SIZE = MB * 2

const handleFileChange = (
  file: File,
  maxFileSize = LARGE_FILE_MAX_SIZE_VALUE
) => {
  const { name, size, type } = file
  // type 为空时 file 为目录
  if (!type) return

  // prettier-ignore
  if (size > maxFileSize) return useNotificationMsg('', `请选择小于${maxFileSize / MB}MB的文件`, 'warning', 2);

  const fileItem: FileData = {
    url: '',
    name,
    size,
    pause: false,
    mimeType: type,
    fileData: file,
    type: name.split('.')[name.split('.').length - 1],
    status: StatusEnum.PENDING,
    isCompress: type.includes('image') && !type.includes('gif'),
  }
  emits('change', fileItem)
}

// 分片上传
const chunkUpload = async (fileItem: FileData) => {
  try {
    console.log('分片上传 ------', fileItem)
    const { fileData } = fileItem

    // slice 类似数组中的方法 表示 取当前文件的字节范围 0~99 字节
    // const chunk = fileData.slice(0, 100);
    const chunks = createFileChunks(fileData)
    console.log('chunks ------', chunks)
    // 上传切片前 先在服务器创建相关资源

    // fileItem.status = StatusEnum.UPLOADING
  } catch (e) {
    console.log('e', e)
  }
}

// const createResource = () => {
//   try {
//   } catch (e) {
//     console.log('e', e)
//   }
// }

// 将文件按照指定大小切分
const createFileChunks = (file: File): Blob[] => {
  const fileChunks: Blob[] = []
  const currentChunkSize = () => fileChunks.length * SLICE_SIZE
  while (file.size > currentChunkSize()) {
    const chunk = file.slice(
      currentChunkSize(),
      currentChunkSize() + SLICE_SIZE
    )
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

onMounted(() => {
  const options: WorkerOptions = {
    type: 'classic',
  }
  const worker = new Worker('/worker/createdFileChunk.js', options)

  // addEventListener 添加监听子进程传递回来的事件
  worker.addEventListener('message', event => {
    console.log('event ------', event)
  })

  worker.dispatchEvent(event)

  // 像子线程发送消息
  worker.postMessage({ name: 'zs' }, {})
})

defineExpose({ chunkUpload })
</script>
