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
            v-show="activeStep === 1"
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
      >
        <!-- @click-next-step="handleNextStep" -->
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

      <!-- flex-1 -->
      <!-- 动态切换 文章内容 编辑器 -->

      <component
        v-show="activeStep === 1"
        v-model="articleForm.content"
        height="calc(100vh - 330px)"
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
import { AddArticleType, OperationArticleData, ArticleData } from '../article/types';
import { FormItem } from '@/components/Form';
import AiEditor from '@/components/AiEditor';
import StepHeadend from './components/StepHeadend.vue';
import InfoForm from './components/InfoForm.vue';
import { useUserInfo } from '@/stores/userInfo';
import { useArticleApi } from '@/api';
import { ElMessage } from 'element-plus';

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
  id: 0,
  content: '',
  title: '',
  cover: '',
  type: 1,
  status: 3,
  isTop: 0,
  tags: [],
  category: '',
  author: userInfoStore.userInfos.id,
  contentModel: 0,
  summary: '',
  accessPassword: '',
});

const titleFormRef = ref<RefType>();
const infoFormRef = ref<RefType>();

/**
 * 暂存草稿箱
 *  暂存成功时 为当前form对象赋值 文章id
 *  根据该 文章的id 来判断进行后续操作 更新/创建
 **/
const handleSaveToDraftBox = async () => {
  const validate = await titleFormRef.value
    .getRef()
    .validate()
    .catch(() => false);

  if (!validate) return;
  // 创建 / 更新
  if (articleForm.id) return;
  else handleAddArticle();
  // infoFormRef.value.validateForm();
};

const handleAddArticle = async () => {
  try {
    const { summary, author, id, category, ...args } = articleForm;
    const { data: res } = await addArticle<ArticleData>({
      ...args,
      category: category || 0,
      authorId: author,
      summary: args.content.substring(0, 300),
    });

    if (res.code !== 20100) return ElMessage.error('暂存失败!');
    ElMessage.success('暂存成功!');

    articleForm.id = res.data.id;
  } catch (e) {
    console.log('e ------', e);
  }
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

  :deep(.el-card__header) {
    padding: 5px 20px;
  }
}
</style>
