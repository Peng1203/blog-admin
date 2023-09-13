<template>
  <div class="peng-editor-container">
    <!-- v-model="props.modelValue" -->
    <MdEditor
      v-model="text"
      :theme="props.theme"
      :language="props.lang"
      :showCodeRowNumber="showCodeRowNumber"
      :tableShape="[10, 6]"
      :autoDetectCode="true"
      :toolbars="toolbarConfigHashMapping[config]"
      @onChange="(val: string) => emit('update:modelValue', val)"
      @onUploadImg="handleUploadImg"
      @onSave="handleDownSave"
    />
    <!-- :sanitize="sanitize" -->
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { MdEditor } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'
// 引入公共库中的预览主题
import '@vavt/md-editor-extension/dist/previewTheme/arknights.css'
// 引入公共库中的语言配置
import ZH_TW from '@vavt/md-editor-extension/dist/locale/zh-TW'
import { allToolbars, commonToolbars } from './config'

const toolbarConfigHashMapping = {
  all: allToolbars,
  common: commonToolbars,
}

interface MarkdownEditorAttibute {
  // toolbar配置
  config?: toolbarConfigs
  // 内容
  modelValue: string
  // 主题
  theme?: Themes | undefined
  // 预览主题
  preTheme?: preThemes | undefined
  // 语言
  lang?: string
  // 代码块主题
  codeTheme?: codeTheme
  // 代码块是否显示行数
  showCodeRowNumber?: boolean
  // 提示
  placeholder?: string
  // 不展示的工具栏
  toolbarsExclude?: []
}

const emit = defineEmits(['update:modelValue', 'uploadImg', 'fastSave'])

const props = withDefaults(defineProps<MarkdownEditorAttibute>(), {
  config: 'common',
  theme: 'light',
  preTheme: 'default',
  lang: 'zh-CN',
  codeTheme: 'atom',
  showCodeRowNumber: true,
  placeholder: '',
})

// 上传图片事件
const handleUploadImg = async (
  files: File[],
  cb: (urls: Array<string>) => void
) => emit('uploadImg', files, cb)

// ctrl + s 保存事件
const handleDownSave = async (val: string, html: Promise<string>) =>
  html.then((htmlVal) => emit('fastSave', val, htmlVal))

const text = ref<string>('')
watch(
  () => props.modelValue,
  (val) => (text.value = val),
  {
    deep: true,
    immediate: true,
  }
)
</script>

<style lang="scss" scoped>
.peng-editor-container {
  width: 100%;
  :deep(.md-editor-footer) {
    height: initial;
  }
}
</style>
