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
import { ElUpload, UploadFile } from 'element-plus'
import { MB } from '@/constants'
import { ChunkItem, CreateFileDirData, FileData, StatusEnum } from '../types'
import { useNotificationMsg } from '@/utils/notificationMsg'
import { useResourceApi } from '@/api'
import { getFileArrayBuffer } from '@/utils/file'
import { useUserInfo } from '@/stores/userInfo'

const emits = defineEmits(['change'])

const { createLargeFileDir, uploadFileChunk, mergeFileChunks } = useResourceApi()

const userStore = useUserInfo()

// 大上传文件大小
const LARGE_FILE_MAX_SIZE_MB = 1024
const LARGE_FILE_MAX_SIZE_VALUE = MB * LARGE_FILE_MAX_SIZE_MB

// 切片大小
const SLICE_SIZE = MB * 2

// 选中大文件
const handleFileChange = async (file: File, maxFileSize = LARGE_FILE_MAX_SIZE_VALUE) => {
  let chunckArr = []
  let isDone = false
  const reader = file.stream().getReader()

  while (!isDone) {
    const { value, done } = await reader.read()
    chunckArr.push(value)
    isDone = done
  }

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
    cancelList: [],
  }
  emits('change', fileItem)
}

// 处理上传大文件
const handleUploadLargeFile = async (fileItem: FileData) => {
  try {
    const { fileData } = fileItem
    fileItem.cancelList = []

    // 没有上传进度时 表示为进行过上传任务
    if (!fileItem.uploadProcess) {
      fileItem.uploadProcess = 0
      fileItem.status = StatusEnum.CALC_HASH
      const arrayBuffer = await getFileArrayBuffer(fileData)
      if (!fileItem.fileHash) {
        const fileHash = await getFileHash(arrayBuffer)
        fileItem.fileHash = fileHash
      }
    }

    const existingChunks = await handleCreateFileDir(fileItem)
    const chunks = createFileChunks(fileData)

    // 需要上传的 chunks
    const uploadChunks = !existingChunks.length
      ? chunks
      : chunks.filter(chunkItem => !existingChunks.includes(chunkItem.index))

    fileItem.status = StatusEnum.UPLOADING

    if (existingChunks.length === chunks.length) {
      fileItem.uploadProcess = 100
    } else {
      let finishCount = 0
      // 上传分片
      await Promise.all(
        uploadChunks.map(chunk =>
          handleUploadChunk(chunk, `${fileItem.fileHash}_${userStore.userInfos.id}`, fileItem)
            .then(() => {
              finishCount++

              fileItem.uploadProcess = ((existingChunks.length + finishCount) / chunks.length) * 100
            })
            .catch(e => {
              // 抛出错误 阻止剩下代码执行
              throw new Error(e)
            })
        )
      )
    }

    // 合成分片
    const url = await handleMergeFileChunks(fileItem)
    fileItem.status = url ? StatusEnum.SUCCESS : StatusEnum.FAIL
    fileItem.url = url
  } catch (e) {
    console.log('e', e)
  }
}

// 创建大文件合成目录
const handleCreateFileDir = async (fileItem: FileData): Promise<number[]> => {
  try {
    const params = {
      uploadId: `${fileItem.fileHash}_${userStore.userInfos.id}`,
    }
    const { data: res } = await createLargeFileDir<CreateFileDirData>(params)
    const { code, success, data } = res
    if (code !== 20100 || !success) return
    if (data.existingChunks) return data.existingChunks.map(chunk => Number(chunk))
    return []
  } catch (e) {
    console.log('e', e)
  }
}

// 分片上传
const handleUploadChunk = async (chunk: ChunkItem, uploadId: string, fileItem: FileData) => {
  try {
    const { blob, index, ...params } = chunk
    const formData = new FormData()
    formData.append('files', blob)

    const { data: res } = await uploadFileChunk({ index, ...params, uploadId }, formData, fileItem.cancelList)
    const { code, success } = res
    if (code !== 20000 || !success) return false
    return true
  } catch (e) {
    throw new Error(e)
  }
}

// 处理合成文件分片
const handleMergeFileChunks = async (fileItem: FileData): Promise<string> => {
  try {
    const params = {
      uploadId: `${fileItem.fileHash}_${userStore.userInfos.id}`,
      fileName: fileItem.name,
      extName: fileItem.type,
    }
    const { data: res } = await mergeFileChunks<string>(params)
    const { code, success, data } = res
    if (code !== 20100 || !success) return
    return data
  } catch (e) {
    console.log('e', e)
    return ''
  }
}

// 暂停/继续 上传处理方法
const handleUploadToggle = async (fileItem: FileData) => {
  try {
    fileItem.pause = !fileItem.pause

    if (fileItem.pause) fileItem.cancelList.forEach(c => c())
    else handleUploadLargeFile(fileItem)
  } catch (e) {
    console.log('e', e)
  }
}

const getFileHash = (arrayBuffer: ArrayBuffer): Promise<string> => {
  return new Promise(resolve => {
    const worker = new Worker('/worker/createdFileHash.js')
    worker.postMessage(arrayBuffer)
    worker.onmessage = e => resolve(e.data)
  })
}
// const createResource = () => {
//   try {
//   } catch (e) {
//     console.log('e', e)
//   }
// }

// 将文件按照指定大小切分
const createFileChunks = (file: File): ChunkItem[] => {
  const fileChunks: ChunkItem[] = []
  const currentChunkSize = () => fileChunks.length * SLICE_SIZE
  while (file.size > currentChunkSize()) {
    const chunk = file.slice(currentChunkSize(), currentChunkSize() + SLICE_SIZE)

    const chunkItem: ChunkItem = {
      blob: chunk,
      start: currentChunkSize(),
      end: Math.min(currentChunkSize() + SLICE_SIZE, file.size),
      index: fileChunks.length,
      size: file.size,
    }

    fileChunks.push(chunkItem)
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

defineExpose({ handleUploadLargeFile, handleFileChange, handleUploadToggle })
</script>
