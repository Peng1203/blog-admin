<template>
  <div class="article-item">
    <!-- 标题 -->
    <h3 class="title">{{ article.title }}</h3>
    <!-- 分类 -->
    <div class="category">
      {{ article.category.categoryName }}
    </div>
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
      <span fz12>
        发布于：
        <span class="time">
          {{ article.createTime }}
        </span>
      </span>

      <span fz12>
        最近修改：
        <span class="time">
          {{ article.updateTime }}
        </span>
      </span>
    </div>

    <!-- 统计信息 -->
    <div></div>
    <!-- {{ article }} -->
  </div>
</template>

<script setup lang="tsx">
import { ref } from 'vue';
import { ArticleItemProps } from '../';
defineProps<ArticleItemProps>();
</script>

<style scoped lang="scss">
.article-item {
  padding: 16px 24px;
  border-block-end: 1px solid rgba(5, 5, 5, 0.06);
  .title {
    margin-block-end: 12px;
    color: rgba(0, 0, 0, 0.88);
    font-size: 16px;
    line-height: 1.5;
  }

  .category {
    margin-block-end: 16px;
  }

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
    margin-top: 16px;
    gap: 10px;

    .time {
      color: rgba(0, 0, 0, 0.25);
    }
  }
}
</style>
