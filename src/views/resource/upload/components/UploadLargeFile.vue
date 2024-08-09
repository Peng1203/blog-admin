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

const { createLargeFileDir, uploadFileChunk } = useResourceApi()

const userStore = useUserInfo()

// 大上传文件大小
const LARGE_FILE_MAX_SIZE_MB = 500
const LARGE_FILE_MAX_SIZE_VALUE = MB * LARGE_FILE_MAX_SIZE_MB

// 切片大小
const SLICE_SIZE = MB * 2

const handleFileChange = (file: File, maxFileSize = LARGE_FILE_MAX_SIZE_VALUE) => {
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

const handleUploadLargeFile = async (fileItem: FileData) => {
  try {
    const { fileData } = fileItem

    fileItem.status = StatusEnum.CALC_HASH
    const arrayBuffer = await getFileArrayBuffer(fileData)
    if (!fileItem.fileHash) {
      const fileHash = await getFileHash(arrayBuffer)
      fileItem.fileHash = fileHash
    }

    const existingChunks = await handleCreateFileDir(fileItem)

    console.log(`%c existingChunks ----`, 'color: #fff;background-color: #000;font-size: 18px', existingChunks)

    // slice 类似数组中的方法 表示 取当前文件的字节范围 0~99 字节
    // const chunk = fileData.slice(0, 100);
    const chunks = createFileChunks(fileData)

    const uploadChunks =
      existingChunks === true
        ? chunks
        : chunks.filter(chunkItem => !(existingChunks as number[]).includes(chunkItem.index))

    console.log(
      `%c chunks, uploadChunks ----`,
      'color: #fff;background-color: #000;font-size: 18px',
      chunks,
      uploadChunks
    )

    fileItem.status = StatusEnum.UPLOADING

    let finishCount = 0
    if (Array.isArray(existingChunks) && existingChunks.length === chunks.length) {
      console.log('上传完成 ------')
    }
    // 上传分片
    await Promise.all(
      uploadChunks.map(chunk =>
        handleUploadChunk(chunk, `${fileItem.fileHash}_${userStore.userInfos.id}`).then(() => {
          finishCount++

          fileItem.uploadProcess =
            (((Array.isArray(existingChunks) ? existingChunks.length : 0) + finishCount) / chunks.length) * 100
        })
      )
    )

    // 合成分片

    // fileItem.status = StatusEnum.SUCCESS
  } catch (e) {
    console.log('e', e)
  }
}

// 创建大文件合成目录
const handleCreateFileDir = async (fileItem: FileData): Promise<boolean | number[]> => {
  try {
    const params = {
      dirName: `${fileItem.fileHash}_${userStore.userInfos.id}`,
    }
    const { data: res } = await createLargeFileDir<CreateFileDirData>(params)
    const { code, success, data } = res
    if (code !== 20100 || !success) return
    if (data.existingChunks) return data.existingChunks.map(chunk => Number(chunk))
    return true
  } catch (e) {
    console.log('e', e)
    return false
  }
}

// 分片上传
const handleUploadChunk = async (chunk: ChunkItem, uploadId: string) => {
  try {
    const { blob, ...params } = chunk
    const formData = new FormData()
    formData.append('files', blob)

    const { data: res } = await uploadFileChunk({ ...params, uploadId }, formData)
    console.log('res ------', res)
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

defineExpose({ handleUploadLargeFile })
</script>
