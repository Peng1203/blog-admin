<template>
  <div class="article system-user-container layout-padding" style="padding: 10px !important">
    <el-card shadow="hover" style="overflow-y: scroll" class="layout-padding-auto" v-loading="laoding">
      <!-- labelP="top" -->
      <Peng-Form ref="addFormRef" size="default" :labelW="'90px'" :formData="articleForm" :formItemList="articleFormItemList">
        <!-- 封面上传 -->
        <template #cover>
          <el-upload class="cover-uploader" :show-file-list="false" :http-request="handleUploadCover" style="width: 178px; height: 178px">
            <img v-if="articleForm.cover" :src="articleForm.cover" class="cover" style="width: 100%; height: 100%" />
            <el-icon v-else class="cover-uploader-icon">
              <Plus />
            </el-icon>
          </el-upload>
        </template>

        <!-- 文章富文本 -->
        <template #content>
          <PengMdEditor v-model="articleForm.content" @fastSave="handleFastSave" @uploadImg="handleUploadArticleImg" />
        </template>

        <!-- 操作行 -->
        <template #operation>
          <div class="flex-e-c" style="width: 100%">
            <el-button v-if="!isAdd" @click="router.go(-1)">返 回</el-button>
            <el-button type="primary" v-if="isAdd" @click="handleAdd">发 布</el-button>
            <el-button type="primary" v-if="!isAdd" @click="handleSaveEdit">保 存</el-button>
          </div>
        </template>
      </Peng-Form>
    </el-card>
  </div>
</template>

<script lang="ts" setup name="WriteArticle">
import { AxiosResponse } from 'axios'
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useArticleApi } from '@/api/article/index'
import { useArticleInfo } from '@/stores/articleInfo'
import { ElMessage } from 'element-plus'
import { Session } from '@/utils/storage'
import PengMdEditor from '@/components/MdEditor/index.vue'

const route = useRoute()
const router = useRouter()

const articleInfoStore: any = useArticleInfo()
const articleInfoState = storeToRefs(articleInfoStore)

const { getArticleDetailById, addArticle, updateArticle, uploadArticleCover, uploadArticleContentResource } = useArticleApi()

// 是否是添加文章
const isAdd = ref<boolean>(route.params.aid === ':aid')

const laoding = ref<boolean>(false)
// 文章表单信息
let articleForm = ref<any>({
  id: '',
  title: '',
  brief: '',
  content: '',
  authorId: 0,
  cover: '',
  categoryId: '',
  tags: ref<number[]>([]),
  // commentCount: 0,
  // likeCount: 0,
  // dislikeCount: 0,
  // viewCount: 0,
  // state: 0,
  // createdTime: '',
  // updateTime: '',
})

// 表单行信息
const articleFormItemList: FormItem[] = reactive([
  {
    xs: 24,
    span: 7,
    type: 'input',
    label: '标题',
    prop: 'title',
    placeholder: '',
    rules: [{ required: true, trigger: 'blur' }],
  },
  {
    xs: 24,
    span: 7,
    type: 'select',
    label: '分类',
    prop: 'categoryId',
    placeholder: '',
    options: [],
    rules: [{ required: true, trigger: 'change' }],
  },
  {
    label: '',
    prop: '',
    span: 8,
    type: 'transparent',
  },
  {
    xs: 24,
    span: 14,
    type: 'select',
    multiple: true,
    label: '标签',
    prop: 'tags',
    placeholder: '',
    options: [],
    rules: [{ required: true, trigger: 'change' }],
  },
  {
    xs: 24,
    span: 14,
    type: 'textarea',
    label: '简介',
    prop: 'brief',
    placeholder: '',
  },
  {
    xs: 24,
    span: 14,
    prop: '',
    type: 'slot',
    label: '封面',
    slotName: 'cover',
  },
  // 操作行
  {
    xs: 24,
    span: 10,
    label: '',
    prop: '',
    type: 'slot',
    slotName: 'operation',
  },
  {
    // xs: 24,
    span: 24,
    label: '',
    prop: '',
    type: 'slot',
    slotName: 'content',
  },
  // {
  //   xs: 24,
  //   span: 10,
  //   type: 'slot',
  //   slotName: 'preview',
  // },
])

// 通过ID获取文章详情
const getArticleDetail = async () => {
  try {
    laoding.value = true
    const { data: res } = await getArticleDetailById(route.params.aid as any)
    const { data, message, code } = res
    if (code !== 200 || message !== 'Success') return
    const { Category, authorId, content, brief, cover, tags, title, id } = data
    articleForm.value = {
      id,
      categoryId: Category.id,
      authorId,
      content,
      brief,
      cover,
      tags,
      title,
    }
  } catch (e) {
    console.log(e)
  } finally {
    laoding.value = false
  }
}

// 上传封面
const handleUploadCover = async (fileInfo: any) => {
  try {
    const file = new FormData()
    file.append('file', fileInfo.file)
    const { data: res } = await uploadArticleCover(file)
    articleForm.value.cover = res
  } catch (e) {
    console.log(e)
  }
}

// 处理发布文章
const handleAdd = () => addNewArticle()

// 添加新文章
const addNewArticle = async (): Promise<boolean> => {
  try {
    const params = JSON.parse(JSON.stringify(articleForm.value))
    delete params.id
    params.authorId = Session.get('userInfo').id
    const { data: res } = await addArticle(params)
    const { code, data, message } = res
    if (code !== 200 || message !== 'Success') {
      ElMessage.error(data)
      return false
    }
    ElMessage.success(data)
    return true
  } catch (e) {
    console.log(e)
    return false
  }
}

// 处理保存编辑
const handleSaveEdit = () => saveEditArticle()

// 保存修改
const saveEditArticle = async (): Promise<boolean> => {
  try {
    const params = {
      ...articleForm.value,
    }
    const aId = JSON.parse(JSON.stringify(params.id))
    delete params.id
    const { data: res } = await updateArticle(aId, params)
    const { code, data, message } = res
    if (code !== 200 || message !== 'Success') {
      ElMessage.error(data)
      return false
    }
    ElMessage.success(data)
    return true
  } catch (e) {
    console.log(e)
    return false
  }
}

// 处理文章上传图片
const handleUploadArticleImg = async (files: File[], callback: (urls: Array<string>) => void) => {
  try {
    const file = new FormData()
    file.append('file', files[0])
    const { data: url }: AxiosResponse<string> = await uploadArticleContentResource(file)
    callback([url])
  } catch (e) {
    console.log(e)
  }
}

// 快速保存
const handleFastSave = (val: string, html: string) => {
  saveEditArticle()
}

onMounted(async () => {
  await Promise.all([articleInfoStore.getAllCategoryList(), articleInfoStore.getAllTagList()])

  const findCategoryItem = articleFormItemList.find(item => item.prop === 'categoryId')
  if (findCategoryItem) findCategoryItem.options = articleInfoState.allCategoryOptions.value

  const findTagItem = articleFormItemList.find(item => item.prop === 'tags')
  if (findTagItem) findTagItem.options = articleInfoState.allTagOptions.value

  // if (route.params.aid === ':aid') return
  // isAdd.value = false
  if (!isAdd.value) getArticleDetail()
})
</script>

<style lang="scss" scoped>
.cover-uploader,
.el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.cover-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.cover-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
