/** 是否是图片 */
export const isImage = (file: File): boolean => {
  return file.type.includes('image');
};

/** 文件是否超出指定大小 */
export const checkFileSizeExceeds = (
  file: File,
  maxSize: number = 2
): boolean => {
  const fileMb = file.size / (1024 * 1024);
  return fileMb > maxSize;
};

export const imageToBase64 = (file: File): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = e => resolve(e.target.result as string);
    reader.onerror = err => reject(err);
  });
};

type QualityType = 0.1 | 0.2 | 0.3 | 0.4 | 0.5 | 0.6 | 0.7 | 0.8 | 0.9 | 1;
/** 压缩图片 */
export const compressImage = async (file: File, quality: QualityType = 0.5) => {
  const { name, size, type } = file;

  console.log('压缩前: ------', size);
  const base64: string = await imageToBase64(file);
  console.log('base64 ------', base64);
  const imgEl = document.createElement('img');
  const canvasEl = document.createElement('canvas');
  imgEl.src = base64;
  const { width, height } = imgEl;
  canvasEl.width = imgEl.width;
  canvasEl.height = imgEl.height;
  const ctx = canvasEl.getContext('2d');
  ctx.drawImage(imgEl, 0, 0, width, height);

  // 转换为 blob 对象
  canvasEl.toBlob(
    blob => {
      console.log('压缩后: ------', blob);
    },
    // type,
    'image/webp',
    quality
  );

  const compressBase64 = canvasEl.toDataURL('image/jpeg', quality);
  console.log('compressBase64 ------', compressBase64);
};
