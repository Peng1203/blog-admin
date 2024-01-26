<template>
  <div class="peng-editor-container">
    <MdEditor
      v-model="model"
      :theme="props.theme"
      :language="props.lang"
      :showCodeRowNumber="showCodeRowNumber"
      :tableShape="[10, 6]"
      :autoDetectCode="true"
      :toolbars="toolbarConfigHashMapping[toolbarModel]"
      @onUploadImg="handleUploadImg"
      @onSave="handleDownSave"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue';
import { MdEditor, MdPreview, MdCatalog } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
// 引入公共库中的预览主题
import '@vavt/md-editor-extension/dist/previewTheme/arknights.css';
// 引入公共库中的语言配置
import ZH_TW from '@vavt/md-editor-extension/dist/locale/zh-TW';
import { allToolbars, commonToolbars } from './config/index';
import { MarkdownEditorAttibute } from './types';

const model = defineModel({ type: String });

const toolbarConfigHashMapping = {
  all: allToolbars,
  common: commonToolbars,
};

const emit = defineEmits(['update:modelValue', 'uploadImg', 'fastSave']);

const props = withDefaults(defineProps<MarkdownEditorAttibute>(), {
  toolbarModel: 'common',
  theme: 'light',
  preTheme: 'default',
  lang: 'zh-CN',
  codeTheme: 'atom',
  showCodeRowNumber: true,
  placeholder: '',
});

// 上传图片事件
const handleUploadImg = async (files: File[], cb: (urls: Array<string>) => void) => emit('uploadImg', files, cb);

// ctrl + s 保存事件
const handleDownSave = async (val: string, html: Promise<string>) =>
  html.then(htmlVal => emit('fastSave', val, htmlVal));
</script>

<style lang="scss" scoped>
.peng-editor-container {
  width: 100%;
  :deep(.md-editor-footer) {
    height: initial;
  }
}
</style>
