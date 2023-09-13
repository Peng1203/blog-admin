<template>
  <Peng-Dialog width="60%" :title="articleInfo.title" v-model="previewDialogStatus">
    <template #main>
      <MdPreview :editorId="id" :modelValue="articleInfo.content" />
      <MdCatalog :editorId="id" />
      <!-- :scrollElement="scrollElement" -->
    </template>

    <!-- <template #footer>
      <el-button size="small" @click="previewDialogStatus = false">
        取消
      </el-button>
    </template> -->
  </Peng-Dialog>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted } from 'vue'
import { useArticleApi } from '@/api/article'
import { MdPreview, MdCatalog } from 'md-editor-v3'
// preview.css相比style.css少了编辑器那部分样式
import 'md-editor-v3/lib/preview.css'
import { AxiosResponse } from 'axios'

const { getArticleDetailById: getArticle } = useArticleApi()
const previewDialogStatus = ref<boolean>(false)

const articleInfo = ref<any>({
  title: '',
  content: '',
})

const id = 'preview-only'

// 获取文章详情
const getArticleDetailById = async (aid: number): Promise<void> => {
  try {
    const { data: res }: AxiosResponse<ResResponse<Article>> = await getArticle(aid)
    const { data, message, code } = res
    if (code !== 200 || message !== 'Success') return
    articleInfo.value = data
  } catch (e) {
    console.log(e)
  }
}

watch(previewDialogStatus, val => {
  if (val) return
  setTimeout(() => {
    articleInfo.value = {
      title: '',
      content: '',
    }
  }, 300)
})

defineExpose({ previewDialogStatus, getArticleDetailById })
</script>

<style lang="scss" scoped></style>
