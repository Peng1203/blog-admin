<template>
  <div>
    <input
      ref="fileInputRef"
      type="file"
      @change="handleFileChange"
    />
    <!-- <img
      src="https://peng-1302604454.cos.ap-guangzhou.myqcloud.com/%E5%AE%B5%E5%AE%AB.gif?q-sign-algorithm=sha1&q-ak=AKIDN6EKxx6yQiesZbt46tdforZvX9GeNeN7-yh3dH2gJd8qkCjo2i6tXspo1e7H_tcr&q-sign-time=1707016141;1707019741&q-key-time=1707016141;1707019741&q-header-list=&q-url-param-list=ci-process&q-signature=0f7d2894ade78e693e0ed0bebb43b6f92704083e&x-cos-security-token=qyf8mMbjW3v9QMp11xUZCFLKz3HgL8Cacff71071d9e46f614d5e1ebfab64a94bvStZ0CPTP4_ZrnVZ1AZgyjoGAomA2cyiF76M90nIt9AJc7foqVNuh-JHt_gvfqetr307gtSDFVTxpfCTH4czVizHLrKvPYlZQgkNkOHuo9HHk8uJcqaCnlKMMmnah3-jdo0Xxwl-NcVIxem9B6867zsStj4py4MndqNuDJEkXnRTAqML_amsRZB47H7FiQWI&ci-process=originImage"
      alt=""
    /> -->
    <!-- <img
      :src="option.img"
      alt=""
    /> -->
    <!-- mode="cover" -->
    <!-- fixedBox -->
    <!-- high -->
    <Cropper
      fixed
      centerBox
      autoCrop
      :img="img"
    />
  </div>
</template>

<script setup lang="ts" name="Test">
import { ref, reactive } from 'vue';
import 'vue-cropper/dist/index.css';
import Cropper from '@/components/Cropper';

const img = ref();

const fileInputRef = ref<RefType>();

const handleFileChange = e => {
  const files = e.target.files as FileList;

  const reader = new FileReader();

  reader.readAsDataURL(files[0]);

  reader.onload = e => {
    console.log(`%c e.target.result ----`, 'color: #fff;background-color: #000;font-size: 18px', e.target.result);
    img.value = e.target.result as string;
  };
};
</script>

<style scoped lang="scss"></style>
