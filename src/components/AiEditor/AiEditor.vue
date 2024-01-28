<template>
  <div
    ref="divRef"
    :style="{ height }"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, useAttrs } from 'vue';
import { AiEditor } from 'aieditor';
import _ from 'lodash';
import 'aieditor/dist/style.css';
import { watch } from 'vue';
import { AiEditorAttrs } from './types';
import {} from 'vue';

const attrs = useAttrs();

withDefaults(defineProps<AiEditorAttrs>(), {
  height: '400px',
});

let modelValue = defineModel({ type: String, required: true });
const divRef = ref<RefType>();
let aiEditor: AiEditor | null = null;

// 内容变化
const handleContenChange = _.debounce((editor: AiEditor) => {
  modelValue.value = editor.getMarkdown();
}, 300);
// const handleContenChange = (editor: AiEditor) => {
//   _.debounce(() => {
//     console.log('e ------', editor);
//     modelValue.value = editor.getMarkdown();
//   }, 300);
// };

watch(
  modelValue,
  _.debounce((content: string) => aiEditor && aiEditor.setContent(content), 300)
);

onMounted(() => {
  aiEditor = new AiEditor({
    element: divRef.value,
    placeholder: (attrs?.placeholder as string) || '选中输入',
    content: modelValue.value,
    onChange: handleContenChange,
  });
});

onUnmounted(() => {
  aiEditor && aiEditor.destroy();
});
</script>
