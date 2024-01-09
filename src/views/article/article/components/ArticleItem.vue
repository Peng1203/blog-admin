<template>
  <div>
    <!-- 标题 -->
    <h3>{{ article.title }}</h3>
    <!-- 分类 -->
    <div>{{ article.category.categoryName }}</div>
    <!-- 文章内容 -->
    <div class="content-con">
      <p>
        {{ article.content }}
      </p>
    </div>

    <!-- 相关信息 -->
    <div class="about-info-con">
      <!-- 头像 -->
      <el-avatar
        :size="30"
        :src="article.author.userAvatar"
      />
      <!-- 用户名/昵称 -->
      <span>{{ article.author.nickName || article.author.userName }}</span>
      <!-- 发布信息 -->
      <span>
        发布于:
        {{ article.createTime }}
      </span>

      <span>
        最近修改:
        {{ article.updateTime }}
      </span>
    </div>
    <!-- {{ article }} -->
  </div>
</template>

<script setup lang="tsx">
import { ref } from 'vue';
import { ArticleItemProps } from '../';
const props = defineProps<ArticleItemProps>();
</script>

<style scoped lang="scss">
.content-con {
  width: 70%;
  max-height: 100px;
  overflow: hidden;
  p {
    white-space: pre-wrap;
    // overflow: hidden; /* 隐藏溢出的文本 */
    text-overflow: ellipsis;
  }
}
.about-info-con {
  display: flex;
  align-items: center;
}
</style>
