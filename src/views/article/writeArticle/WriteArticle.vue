<template>
  <div class="layout-padding">
    <el-card
      shadow="hover"
      class="layout-padding-auto h100%"
    >
      <template #header>
        <div class="card-header flex-sb-c">
          <Title />

          <el-switch
            inline-prompt
            v-model="articleForm.contentModel"
            style="--el-switch-on-color: #1323ce; --el-switch-off-color: #3ce"
            :active-value="0"
            :inactive-value="1"
            active-text="Markdown"
            inactive-text="富文本"
          />
        </div>
      </template>

      <!-- v-model="articleForm" -->
      <StepHeadend
        size="default"
        v-model:step="activeStep"
        @click-save-draft-box="handleSaveToDraftBox"
        @click-next-step="handleNextStep"
      >
        <template #titleSlot>
          <!-- <el-input
            class="title-input"
            size="default"
            v-model="articleForm.title"
            placeholder="文章标题"
          /> -->

          <Peng-Form
            v-show="activeStep === 1"
            ref="titleFormRef"
            v-model="articleForm"
            :formItems="formItemList.slice(0, 1)"
          />
        </template>
      </StepHeadend>
      <!-- {{ articleForm }} -->

      <!-- 文章内容 编辑器 -->
      <!-- flex-1 -->
      <component
        v-show="activeStep === 1"
        v-model="articleForm.content"
        height="calc(100% - 190px)"
        placeholder="请输入文章内容"
        :is="editorMapping[articleForm.contentModel]"
      />

      <!-- 文章信息表单 -->
      <InfoForm
        ref="infoFormRef"
        v-show="activeStep === 2"
        v-model="articleForm"
        :formItemList="formItemList"
      />
      <!-- <AiEditor v-model="articleForm.content" />

      <MarkdownEditor v-model="articleForm.content" /> -->
    </el-card>
  </div>
</template>

<script setup lang="tsx" name="WriteArticle">
import { ref, reactive } from 'vue';
import MarkdownEditor, { Preview } from '@/components/MarkdownEditor';
import { useRoute } from 'vue-router';
import { AddArticleType, OperationArticleData } from '../article/types';
import { FormItem } from '@/components/Form';
import AiEditor from '@/components/AiEditor';
import StepHeadend from './components/StepHeadend.vue';
import InfoForm from './components/InfoForm.vue';
import { useUserInfo } from '@/stores/userInfo';
import { useArticleApi } from '@/api';

const { addArticle } = useArticleApi();

const userInfoStore = useUserInfo();

const route = useRoute();
const Title = () => <h1>{route.name === 'WriteArticle' ? '发布文章' : '编辑文章'}</h1>;

const activeStep = ref(1);

const editorMapping = {
  0: MarkdownEditor,
  1: AiEditor,
};

const formItemList = ref<FormItem<AddArticleType>[]>([
  {
    span: 24,
    type: 'input',
    label: '文章标题',
    prop: 'title',
    placeholder: '请输入文章标题',
    rules: [{ required: true, trigger: 'blur', message: '文章标题不能为空' }],
  },
]);

const articleForm = reactive<AddArticleType | OperationArticleData>({
  content: '',
  title: '',
  cover: '',
  type: 1,
  status: 3,
  isTop: 0,
  tags: [],
  category: 0,
  author: userInfoStore.userInfos.id,
  contentModel: 0,
  summary: '',
  accessPassword: '',
});

const titleFormRef = ref<RefType>();
const infoFormRef = ref<RefType>();

// 暂存草稿箱
const handleSaveToDraftBox = async () => {
  const validate = await titleFormRef.value
    .getRef()
    .validate()
    .catch(() => false);

  if (!validate) return;
  handleAddArticle();
  // infoFormRef.value.validateForm();
};

const handleAddArticle = async () => {
  try {
    const { summary, author, ...args } = articleForm;
    const { data: res } = await addArticle({
      ...args,
      authorId: author,
      summary: args.content.substring(0, 300),
    });
    console.log('res ------', res);
  } catch (e) {
    console.log('e ------', e);
  }
};

// 下一步
const handleNextStep = step => {
  console.log(`%c step ----`, 'color: #fff;background-color: #000;font-size: 18px', step);
};
</script>

<style scoped lang="scss">
.layout-padding {
  :deep(.el-card__body) {
    height: 100%;
    display: flex;
    flex-direction: column;
    // overflow-y: auto;
    .peng-editor-container {
      flex: 1;
    }
  }
  .title-input {
    margin: 10px 0 15px 0;
  }

  :deep(.md-editor) {
    height: calc(100% - 62px);
  }
}
</style>
