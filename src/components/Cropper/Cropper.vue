<template>
  <div flex>
    <VueCropper
      ref="cropperRef"
      :img="img"
      :outputSize="outputSize"
      :outputType="outputType"
      :style="{ width, height }"
      v-bind="$attrs"
      @realTime="handleRealPreview"
    />

    <el-avatar
      :size="100"
      :src="previewInfo.base64"
    />
    <el-avatar
      :size="50"
      :src="previewInfo.base64"
    />

    <div v-html="previewInfo?.html" />
    <el-button
      :disabled="!img"
      @click="handleUpload"
    >
      上 传
    </el-button>
  </div>
</template>

<script setup lang="tsx">
import { ref } from 'vue';
import 'vue-cropper/dist/index.css';
import { VueCropper } from 'vue-cropper';
import { CropperAttribute } from './types';
import _ from 'lodash';

withDefaults(defineProps<CropperAttribute>(), {
  outputSize: 0.8,
  outputType: 'jpeg',
  width: '600px',
  height: '350px',
});

const cropperRef = ref<RefType>();

const previewInfo = ref({
  url: '',
  html: '',
  base64: '',
});
/** 实时预览 */
const handleRealPreview = _.debounce(async data => {
  console.log('data ------', data);
  previewInfo.value = data;

  const [base64_data, blob_data] = await Promise.all([getCropData(), getCropBlob()]);
  console.log('base64_data ------', base64_data);
  console.log('blob_data ------', blob_data);
  previewInfo.value.base64 = base64_data;
}, 300);

/** 获取裁剪之后图片的base64 */
const getCropData = (): Promise<string> => {
  return new Promise(resolve => {
    cropperRef.value.getCropData(data => resolve(data));
  });
};

/** 获取裁剪之后图片的blob数据 */
const getCropBlob = (): Promise<Blob> => {
  return new Promise(resolve => {
    cropperRef.value.getCropBlob(data => resolve(data));
  });
};

const handleUpload = async () => {
  const [base64_data, blob_data] = await Promise.all([getCropData(), getCropBlob()]);
  console.log('base64_data ------', base64_data);
  console.log('blob_data ------', blob_data);
};
</script>

<style scoped lang="scss"></style>
