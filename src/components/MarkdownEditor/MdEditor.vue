<template>
  <div class="peng-editor-container">
    <MdEditor
      ref="mdEditorRef"
      v-model="model"
      :theme="props.theme"
      :language="props.lang"
      :showCodeRowNumber="showCodeRowNumber"
      :tableShape="[10, 6]"
      :autoDetectCode="true"
      :toolbars="toolbarConfigHashMapping[toolbarModel]"
      v-bind="$attrs"
      @onUploadImg="handleUploadImg"
      @onSave="handleDownSave"
    />
  </div>
</template>

<script lang="ts" setup>
import { MdEditor } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
// 引入公共库中的预览主题
import '@vavt/md-editor-extension/dist/previewTheme/arknights.css';
import { allToolbars, commonToolbars } from './config/index';
import { MarkdownEditorAttibute } from './types';
import { useComponentRef } from '@/composables/useComponentRef';
import { onMounted, nextTick } from 'vue';
import { compressImage, imageToBase64 } from '@/utils/file';

const model = defineModel({ type: String });

const mdEditorRef = useComponentRef(MdEditor);

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
  height: '400px',
});

// 上传图片事件
const handleUploadImg = async (
  files: File[],
  cb: (urls: Array<string>) => void
) => emit('uploadImg', files, cb);

// ctrl + s 保存事件
const handleDownSave = async (val: string, html: Promise<string>) =>
  html.then(htmlVal => emit('fastSave', val, htmlVal));

const addPasteUploadImg = () => {
  const inputEl = mdEditorRef.value.$el.querySelector(
    '.md-editor-input-wrapper'
  );

  inputEl.addEventListener('paste', (event: ClipboardEvent) => {
    console.log('触发了 paste 事件------', event);
    const { clipboardData } = event;
    const { types, files, items } = clipboardData;
    console.log('types ------', types);
    console.log('files ------', files);
    console.log('items ------', items);

    // 粘贴内容是否为文件
    if (!types.includes('Files')) return;
    // 粘贴文件是否为图片
    if (!files[0].type.includes('image')) return;

    handlePasteUploadImg(files[0]);
  });
};

const handlePasteUploadImg = async (file: File) => {
  console.log(
    `%c 粘贴文件信息 ----`,
    'color: #fff;background-color: #000;font-size: 18px',
    file
  );
  compressImage(file);

  console.time('转换耗时');
  const base64Img = await imageToBase64(file);
  // console.log('base64Img ------', base64Img);
  console.timeEnd('转换耗时');
};

onMounted(() => {
  addPasteUploadImg();
});
</script>

<style lang="scss" scoped>
.peng-editor-container {
  width: 100%;
  .md-editor {
    height: v-bind('props.height');
  }
}
</style>
