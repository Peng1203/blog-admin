<template>
  <div class="article-item">
    <!-- 标题 -->
    <h3 class="title">{{ article.title }}</h3>
    <!-- 分类 -->
    <div class="category">
      <el-check-tag
        checked
        size="small"
      >
        {{ article.category.categoryName }}
      </el-check-tag>
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

    <!-- 文章其他信息 -->
    <div class="other-con">
      <InfoIcons />
      <!-- :size="14" -->
    </div>
    <!-- {{ article }} -->
  </div>
</template>

<script setup lang="tsx">
import { ref } from 'vue';
import { ArticleData, ArticleItemProps, IconHashMappingItem } from '../';
import Icon from '@/components/SymbolIcon/index.vue';

const props = defineProps<ArticleItemProps>();

//
const iconHashMapping: IconHashMappingItem[] = [
  { name: 'icon-like-fill', title: '点赞数', prop: 'likes' },
  { name: 'icon-view', title: '浏览量', prop: 'views' },
  { name: 'icon-pinglun1', title: '评论数', prop: 'comment' },
];

// 文章uv 数据
const InfoIcons = () => {
  return (
    <div class="icon-con">
      {iconHashMapping.map(info => (
        <span class="item">
          <Icon
            type="class"
            size={18}
            key={info.prop}
            name={info.name}
          />
          <span class="value">{props.article[info.prop] || 0}</span>
          {/* <span>{props.article[info.prop as keyof ArticleData] || 0}</span> */}
        </span>
      ))}
    </div>
  );
};
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
    // width: 70%;
    max-width: 820px;
    max-height: 100px;
    overflow: hidden;
    line-height: 20px;
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

  .other-con {
    margin-block-start: 16px;
  }

  .icon-con {
    display: flex;
    gap: 10px;
    :deep(.item) {
      display: flex;
      align-items: center;

      // align-items: baseline;
      // justify-content: center;
      .value {
        margin-left: 5px;
      }
    }
  }
}
</style>
