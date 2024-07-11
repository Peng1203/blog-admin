<template>
  <div class="layout-padding">
    <el-card
      shadow="hover"
      class="layout-padding-auto h100%"
    >
      <template #header>
        <div class="card-header flex-sb-c">
          <h1 className="flex-c-c h40px">
            {{ isEdit ? '编辑文章' : '发布文章' }}
          </h1>

          <!-- 编辑已有文章 或者 发布文章 -->
          <div v-show="activeStep === 1">
            <QuickActions />

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
        </div>
      </template>
      <!-- v-model="articleForm" -->
      <Peng-Skeleton
        height="30px"
        :rows="15"
        :throttle="1000"
        :loading="loadingStatus"
      >
        <StepHeadend
          size="default"
          v-model:step="activeStep"
          @click-save-draft-box="handleSaveToDraftBox"
          @click-publish="handlePublish"
          @click-save="handlePublish"
        >
          <!-- @click-next-step="handleNextStep" -->
          <template #titleSlot>
            <Peng-Form
              ref="titleFormRef"
              :formItems="formItemList"
              v-model="articleForm"
              v-show="activeStep === 1"
            />
          </template>
        </StepHeadend>
        <!-- {{ articleForm }} -->

        <!-- flex-1 -->
        <!-- 动态切换 文章内容 编辑器 -->
        <component
          v-show="activeStep === 1"
          v-model="articleForm.content"
          height="calc(100vh - 333px)"
          placeholder="请输入文章内容"
          :is="editorMapping[articleForm.contentModel]"
          @fastSave="handleFastSave"
          @pasteUploadImg="handlePasteUploadImg"
        />

        <!-- 文章信息表单 -->
        <InfoForm
          ref="infoFormRef"
          v-show="activeStep === 2"
          v-model="articleForm"
        />
        <!-- :formItemList="formItemList" -->
      </Peng-Skeleton>
    </el-card>
  </div>
</template>

<script setup lang="tsx" name="WriteArticle">
import { ref, reactive, onMounted, computed } from 'vue'
import MarkdownEditor from '@/components/MarkdownEditor'
import { useRoute, useRouter } from 'vue-router'
import {
  AddArticleType,
  OperationArticleData,
  ArticleData,
} from '../article/types'
import { FormItem } from '@/components/Form'
import AiEditor from '@/components/AiEditor'
import StepHeadend from './components/StepHeadend.vue'
import InfoForm from './components/InfoForm.vue'
import { useUserInfo } from '@/stores/userInfo'
import { useArticleApi } from '@/api'
import { useNotificationMsg } from '@/utils/notificationMsg'
import QuickActions from './components/QuickActions.vue'

const { addArticle, updateArticle, getArticleDetailById, uploadImage } =
  useArticleApi()

const userInfoStore = useUserInfo()

const route = useRoute()
const router = useRouter()

// 是否是编辑模式
const isEdit = computed<boolean>(() => route.name !== 'WriteArticle')

const activeStep = ref(1)

const editorMapping = {
  0: MarkdownEditor,
  1: AiEditor,
}

const formItemList = ref<FormItem<AddArticleType>[]>([
  {
    span: 24,
    type: 'input',
    label: '文章标题',
    prop: 'title',
    placeholder: '请输入文章标题',
    rules: [{ required: true, trigger: 'blur', message: '文章标题不能为空' }],
  },
])

let articleForm = reactive<AddArticleType | OperationArticleData>({
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
})

const titleFormRef = ref<RefType>()
const infoFormRef = ref<RefType>()

/**
 * 暂存草稿箱
 *  暂存成功时 为当前form对象赋值 文章id
 *  根据该 文章的id 来判断进行后续操作 更新/创建
 **/
const handleSaveToDraftBox = async () => {
  const validate = await titleFormRef.value
    .getRef()
    .validate()
    .catch(() => false)

  if (!validate) return
  // 创建 / 更新
  if (articleForm.id) return handleUpdateArticle()
  else handleAddArticle(0)
}

// 发布文章
const handlePublish = async () => {
  const validate1 = await titleFormRef.value
    .getRef()
    .validate()
    .catch(() => false)
  const validate2 = await infoFormRef.value.validateForm()

  if (!(validate1 && validate2))
    return useNotificationMsg('', '有必填项未填', 'warning')

  // 创建 / 更新
  if (articleForm.id) return handleUpdateArticle()
  else handleAddArticle(1)
}

// 添加文章
const handleAddArticle = async (actionType: 0 | 1) => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
    const { summary, author, category, id, ...args } = articleForm
    const { data: res } = await addArticle<ArticleData>({
      ...args,
      category: category || 0,
      authorId: author,
      summary: summary || args.content.substring(0, 300),
    })
    const [errMsg, successMsg] = [
      ['暂存失败!', '暂存成功!'],
      ['发布失败', '发布成功'],
    ][actionType]
    if (res.code !== 20100) return useNotificationMsg('', errMsg, 'error')
    useNotificationMsg('', successMsg)
    articleForm.id = res.data.id
    router.push({
      name: 'EditArticle',
      params: { aid: res.data.id },
    })
  } catch (e) {
    console.log('e ------', e)
  }
}

// 更新文章
const handleUpdateArticle = async () => {
  try {
    const { author, id, category, ...args } = articleForm
    const params = {
      category: category || 0,
      ...args,
    }
    const { data: res } = await updateArticle<ArticleData>(author, id, params)
    const { code, message, success } = res
    if (code !== 20001 && success) return
    useNotificationMsg('更新成功', message)
  } catch (e) {
    console.log('e ------', e)
  }
}

// ctrl + s 快捷更新 只针对于 已创建文章 编辑时生效
const handleFastSave = () => {
  if (isEdit.value) handleUpdateArticle()
}

const loadingStatus = ref<boolean>(route.name === 'EditArticle')
// 编辑文章 获取文章详情
const getArticleDetail = async () => {
  try {
    loadingStatus.value = true
    const { data: res } = await getArticleDetailById<ArticleData>(
      userInfoStore.userInfos.id,
      Number(route.params.aid)
    )
    const { code, success, data } = res
    if (code !== 20000 && success) return
    const { tags, category, author, ...args } = data
    for (const key in articleForm) {
      articleForm[key] = args[key]
    }

    articleForm.tags = tags.map(({ id }) => id)
    articleForm.category = category?.id || ''
    articleForm.author = author.id
  } catch (error) {
    console.log(error)
  } finally {
    loadingStatus.value = false
  }
}

// 编辑文章初始化操作
const editArticleInit = () => {
  if (route.name === 'EditArticle') {
    if (!Number(route.params.aid)) {
      loadingStatus.value = false
      useNotificationMsg('', '文章ID参数有误', 'warning')
      return
    }
    getArticleDetail()
  }
}

const handlePasteUploadImg = async ({
  file,
  cb,
}: {
  file: File
  cb: Function
}) => {
  const imgUrl = await handleUploadImage(file)
  if (!imgUrl) return
  cb(imgUrl)
}

const handleUploadImage = async (file: File): Promise<string> => {
  try {
    const formData = new FormData()

    formData.append('file', file)
    const { data: res } = await uploadImage(formData)
    const { data, code, success } = res
    if (!success || code !== 20100) return
    return data
  } catch (e) {
    console.log('e', e)
    return ''
  }
}

onMounted(() => {
  editArticleInit()
})
</script>

<style scoped lang="scss">
.layout-padding {
  :deep(.el-card__body) {
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
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
