<template>
  <el-button
    v-if="isEdit"
    type="primary"
    size="mini"
    @click="$router.push({ name: 'WriteArticle' })"
  >
    写文章
  </el-button>

  <Peng-Select
    v-else
    virtual
    width="200px"
    placeholder="请选择编辑文章"
    :options="articleOptions"
    v-model="aId"
    @change="handleSelectEdit"
  />
</template>

<script setup lang="ts">
import { useArticleApi } from '@/api'
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArticleOptionData } from '../types'
import { useUserInfo } from '@/stores/userInfo'

const route = useRoute()
const router = useRouter()
const { userInfos } = useUserInfo()

const { getUserArticles } = useArticleApi()

const aId = ref<number>()
const articleOptions = ref<OptionItem[]>([])

// 是否是编辑模式
const isEdit = computed<boolean>(() => route.name !== 'WriteArticle')

const getArticleOptions = async () => {
  try {
    const params = {
      page: 1,
      pageSize: 1000,
      column: 'createTime',
      order: 'DESC',
      type: 2,
    }
    const { data: res } = await getUserArticles<ArticleOptionData>(
      userInfos.id,
      params
    )
    const { code, message, data } = res
    if (code !== 20000 || !message) return
    articleOptions.value = data.list
  } catch (e) {
    console.log('e', e)
  }
}

const handleSelectEdit = () => {
  router.push({
    name: 'EditArticle',
    params: { aid: aId.value },
  })
}

onMounted(() => {
  // 获取当前用户可编辑文章 下拉数据
  isEdit.value || getArticleOptions()
})
</script>

<style scoped lang="scss"></style>
