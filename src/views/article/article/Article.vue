<template>
  <div class="article layout-padding">
    <!-- 顶部过滤组件 -->
    <FilterHeadend
      v-model="filterParams"
      @search="resetFilterGetDataList"
    />

    <!-- {{ filterParams }} -->
    <!-- 文章列表容器 -->
    <el-card
      shadow="hover"
      class="layout-padding-auto article-list mt15"
      v-loading="articleListState.loading"
    >
      <el-scrollbar>
        <div
          v-infinite-scroll="load"
          infinite-scroll-immediate
          :infinite-scroll-disabled="articleListState.articleList.length === articleListState.total"
        >
          <template
            :key="item.id"
            v-for="item in articleListState.articleList"
          >
            <ArticleItem :article="item" />
          </template>
        </div>

        <el-backtop
          :right="100"
          :bottom="100"
        />
        <!-- 加载完毕 -->
        <p
          class="flex-c-c"
          v-if="!articleListState.loading && articleListState.articleList.length === articleListState.total"
        >
          加载完毕
        </p>
      </el-scrollbar>
    </el-card>

    <!-- 预览 -->
    <PreviewArticleDialog ref="previewDialogRef" />
  </div>
</template>

<script lang="ts" setup name="ArticleList">
import { ref, reactive, onMounted, defineAsyncComponent } from 'vue';
import { useRouter } from 'vue-router';
import { useArticleApi } from '@/api/article/index';
import { useUserInfo } from '@/stores/userInfo';
import { ElMessageBox } from 'element-plus';
import { ArticleListData, ArticleData, FilterParamsInfo } from './';
import FilterHeadend from './components/FilterHeadend.vue';
import ArticleItem from './components/ArticleItem.vue';
const userInfoStore = useUserInfo();

const router = useRouter();
const { getArticles, delArticle } = useArticleApi();

const filterParams = reactive<FilterParamsInfo>({
  queryStr: '',
  type: 0,
  status: 0,
  authorId: 0,
  categoryId: 0,
  tagId: 0,
  // 归档日期
  timeVal: ['', ''],
});

// 文章列表参数
const articleListState = reactive({
  loading: false,
  page: 1,
  pageSize: 10,
  column: '',
  order: '',
  // 文章列表数据
  articleList: ref<ArticleData[]>([]),
  total: 0,
});

// 获取文章列表
const getArticleDataList = async () => {
  articleListState.loading = true;
  try {
    const { page, pageSize, order, column } = articleListState;
    const { timeVal, ...args } = filterParams;
    const [startTime, endTime] = timeVal || ['', ''];
    const params = {
      page,
      pageSize,
      column,
      order,
      startTime,
      endTime,
      ...args,
    };
    const { data: res } = await getArticles<ArticleListData>(params);
    const { data, message, code, success } = res;
    if (code !== 20000 || !success) return (articleListState.loading = false);

    articleListState.articleList = [...articleListState.articleList, ...data.list];
    articleListState.total = data.total;
  } catch (e) {
    console.log(e);
    articleListState.loading = false;
  } finally {
    articleListState.loading = false;
  }
};

// 带有过滤条件的查询 page 和 list 需要重置
const resetFilterGetDataList = () => {
  articleListState.articleList = [];
  articleListState.page = 1;
  getArticleDataList();
};

// 文章列表触底
const load = () => {
  if (articleListState.articleList.length >= articleListState.total) return;
  articleListState.page++;
  getArticleDataList();
};

// 处理删除文章
const handleDelete = async (id: number, title: string) => {
  const confirmRes = await ElMessageBox.confirm(`此操作将永久文章：“${title}”，是否继续?`, '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  }).catch(() => false);
  if (!confirmRes) return;
  const delRes = await deleteArticle(id);
  if (delRes) resetFilterGetDataList();
};

// 删除文章
const deleteArticle = async (id: number): Promise<boolean> => {
  try {
    const { data: res } = await delArticle(id);
    const { code, data, message } = res;
    if (code !== 200 || message !== 'Success') return false;

    // ElMessage.success(data);
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};

// 编辑文章
const handleEditArticle = (aid: number) => {
  router.push({
    name: 'WriteArticle',
    params: { aid },
  });
};

// 预览组件
const PreviewArticleDialog = defineAsyncComponent(() => import('./components/PreviewArticle.vue'));

const previewDialogRef = ref<RefType>(null);
// 处理预览操作
const handlePreViewArticle = async (aid: number) => {
  await previewDialogRef.value.getArticleDetailById(aid);
  setTimeout(() => {
    previewDialogRef.value.previewDialogStatus = true;
  }, 500);
};

// 根据 登录用户 判断 是否展示编辑按钮
const isShowEdit = (aId: number): boolean => userInfoStore.userInfos.id === aId;

const isShowDelete = (aId: number): boolean => userInfoStore.userInfos.id === aId || userInfoStore.userInfos.id === 1;
// 根据 登录用户 判断是否展示删除按钮 admin 默认可以删除任何
// const isShowEdit = computed<boolean>(
//   (aId: number) => userStore.userInfos.id === aId
// )

onMounted(() => {
  getArticleDataList();
});
</script>

<style lang="scss" scoped>
.row {
  display: flex;
  align-items: center;
  .row-label {
    display: flex;
    min-width: 50px;
  }
}
.article {
  :deep(.el-date-editor) {
    max-width: 200px;
  }
  .article-list {
    :deep(.el-card__body) {
      height: 100%;
      padding: 0 !important;
      // overflow-y: auto;
    }
  }
}
.article-item {
  p {
    max-width: 720px;
    max-height: 100px;
    line-height: 22px;
    font-size: 12px;
    // overflow: hidden;
    // text-overflow: ellipsis;
    overflow-y: auto;
  }
}
.article-statistics {
  color: rgba(0, 0, 0, 0.45);
}
</style>
