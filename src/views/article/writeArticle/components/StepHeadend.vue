<template>
  <div>
    <el-steps
      :active="activeStep"
      finish-status="finish"
    >
      <el-step
        v-for="{ title, icon } of stepData"
        :title="title"
        :icon="icon"
      />
    </el-steps>

    <!-- 操作栏 -->
    <div
      flex-sb-c
      style="padding: 10px 0 20px 0"
    >
      <div style="width: 40%">
        <slot name="titleSlot">
          <!-- 站位作用 -->
        </slot>
      </div>

      <div flex-sp-c>
        <span mr10></span>

        <el-button
          :size="size"
          type="warning"
          v-show="activeStep === 1"
          v-if="route.name === 'WriteArticle'"
          @click="handleSaveDraftBox"
        >
          暂存草稿箱
        </el-button>

        <el-button
          type="success"
          :size="size"
          v-show="activeStep === 2"
          v-if="route.name === 'WriteArticle'"
          @click="handlePublishArticle"
        >
          发 布
        </el-button>

        <el-button
          type="success"
          :size="size"
          v-show="activeStep === 2"
          v-if="route.name === 'EditArticle'"
          @click="handleSaveEdit"
        >
          保 存
        </el-button>

        <el-button
          type="primary"
          :size="size"
          :icon="ArrowLeft"
          :disabled="activeStep === 1"
          @click="handleBackStep"
        >
          上一步
        </el-button>

        <el-button
          type="primary"
          :size="size"
          :disabled="activeStep === stepData.length"
          @click="handleNextStep"
        >
          下一步
          <el-icon class="el-icon--right">
            <ArrowRight />
          </el-icon>
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Edit, Picture, Upload, ArrowLeft, ArrowRight } from '@element-plus/icons-vue';
import { onMounted, onUnmounted, PropType } from 'vue';
import { AddArticleType } from '../../article/types';
import { useRoute } from 'vue-router';

const route = useRoute();

// 步骤
const stepData = [
  { title: '标题 / 文章', icon: Edit },
  { title: '文章信息', icon: Picture },
  // { title: '发 布', icon: Upload },
];

// const articleForm = defineModel({
//   type: Object as PropType<AddArticleType>,
// });

const emit = defineEmits(['clickSaveDraftBox', 'clickNextStep', 'clickPublish', 'clickSave']);

defineProps({
  size: {
    type: String as PropType<SizeEnum>,
    default: 'default',
  },
});

const activeStep = defineModel('step', {
  type: Number as PropType<number>,
  required: true,
});

const handleBackStep = () => {
  if (activeStep.value === 1) return;
  activeStep.value--;
};

const handleNextStep = () => {
  if (activeStep.value === stepData.length) return;
  // 校验表单 通过则可进行下一步
  emit('clickNextStep', activeStep.value);
  activeStep.value++;
};

const handleSaveDraftBox = () => emit('clickSaveDraftBox');

const handlePublishArticle = () => emit('clickPublish');

const handleSaveEdit = () => emit('clickSave');

// 操作快捷键
const handleKeyDown = (e: KeyboardEvent) => {
  // console.log('e ------', e.key);
  // 当前光标是否处于选中状态
  const activeElement = document.activeElement;
  if (activeElement.tagName !== 'BODY') return;

  switch (e.key) {
    case 'ArrowLeft':
      handleBackStep();
      break;
    case 'ArrowRight':
      handleNextStep();
      break;
  }
};

onMounted(() => {
  document.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown);
});
</script>

<style scoped lang="scss"></style>
