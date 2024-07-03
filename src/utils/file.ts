// import { saveAs } from 'file-saver';

/** 是否是图片 */
export const isImage = (file: File): boolean => {
  return file.type.includes('image')
}

/** 文件是否超出指定大小 */
export const checkFileSizeExceeds = (
  file: File,
  maxSize: number = 2
): boolean => {
  const fileMb = file.size / (1024 * 1024)
  return fileMb > maxSize
}

export const imageToBase64 = (file: File): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = e => resolve(e.target.result as string)
    reader.onerror = err => reject(err)
  })
}

type QualityType = 0.1 | 0.2 | 0.3 | 0.4 | 0.5 | 0.6 | 0.7 | 0.8 | 0.9 | 1
interface CompressOptions {
  quality?: QualityType
  outputType?: 'jpeg' | 'png' | 'webp' | 'base64'
}
/** 压缩图片 无法压缩gif图 */
export const compressImage = (
  file: File,
  options: CompressOptions = { quality: 0.5, outputType: 'webp' }
): Promise<string | Blob> => {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async resolve => {
    const { quality, outputType } = options
    const { size } = file

    const base64: string = await imageToBase64(file)
    const imgEl = document.createElement('img')
    imgEl.src = base64

    setTimeout(() => {
      const { width, height } = imgEl

      const canvasEl = document.createElement('canvas')
      canvasEl.width = imgEl.width
      canvasEl.height = imgEl.height

      const ctx = canvasEl.getContext('2d')
      ctx.drawImage(imgEl, 0, 0, width, height)

      switch (outputType) {
        case 'base64':
          const compressBase64 = canvasEl.toDataURL('image/jpeg', quality)
          resolve(compressBase64)
          break
        default:
          // 转换为 blob 对象
          canvasEl.toBlob(
            blob => {
              const compressibility =
                (((size - blob.size) / size) * 100).toFixed(2) + ' %'
              console.table({
                原始大小: size,
                压后大小: blob.size,
                文件类型: blob.type,
                压缩率: compressibility,
              })
              // saveAs(blob, `${Date.now()}.${outputType}`);
              resolve(blob)
            },
            `image/${outputType}`,
            quality
          )
          break
      }
    })
  })
}

/** Blob类型转File类型 */
export function blobToFile(blob: Blob, fileName: string = Date.now() + '') {
  // 创建一个新的 File 对象
  const file = new File([blob], `${fileName}.${blob.type.split('/')[1]}`, {
    type: blob.type,
    lastModified: Date.now(),
  })
  return file
}
