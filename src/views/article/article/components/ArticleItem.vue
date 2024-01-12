<template>
  <div class="article-item">
    <!-- 文章封面 -->
    <el-image
      w350px
      h200px
      fit="fit"
      :src="article.cover || 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'"
    >
      <template #error>
        <div
          class="err-cover"
          w350px
          h200px
        >
          <el-icon><icon-picture /></el-icon>
        </div>
      </template>
    </el-image>

    <div class="info-con">
      <!-- 标题 -->
      <div flex-sb-c>
        <h3 class="title">{{ article.title }}</h3>

        <span
          fz11
          style="color: rgba(128, 128, 128, 0.466)"
        >
          {{ typeMapping[article.type] }}
        </span>
      </div>
      <!-- 分类 -->
      <div class="category">
        <el-check-tag
          checked
          size="small"
        >
          {{ article.category.categoryName }}
        </el-check-tag>

        <!-- 文章状态 & 类型 -->
      </div>
      <!-- 文章内容 -->
      <div class="content-con">
        <p>
          {{ article.content }}
        </p>
      </div>

      <!-- 相关信息 -->
      <div
        class="about-info-con"
        flex-sb-c
      >
        <div class="user-con">
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

        <div>
          <span>{{ statusMapping[article.status] }}</span>
        </div>
      </div>

      <!-- 文章其他信息 -->
      <div class="other-con flex-sb-c">
        <InfoIcons />
        <!-- :size="14" -->
        <!-- 状态：{{ article.status }}
      {{  }} -->

        <div class="tag-con">
          <el-tag
            v-for="{ tagName, id } in article.tags"
            :key="id"
            :effect="'dark'"
            size="small"
            class="ml15 pseudo-link"
          >
            {{ tagName }}
          </el-tag>
        </div>
      </div>
    </div>

    <!-- {{ article }} -->
  </div>
</template>

<script setup lang="tsx">
import { ref } from 'vue';
import { ArticleData, ArticleItemProps, IconHashMappingItem, ArticleStatusEnum } from '../';
import Icon from '@/components/SymbolIcon/index.vue';
import { Picture as IconPicture } from '@element-plus/icons-vue';

const props = defineProps<ArticleItemProps>();

// 文章状态映射
const statusMapping = {
  1: '已发布',
  2: '私密',
  3: '草稿箱',
  4: '已删除',
  5: '待审核',
  6: '已拒绝',
};

// 文章类型映射
const typeMapping = {
  1: '原创',
  2: '转载',
  3: '翻译',
};

// 图标信息映射
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
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 16px 24px;
  border-block-end: 1px solid rgba(5, 5, 5, 0.06);

  .info-con {
    flex: 1;
  }
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
    margin-top: 16px;
    .user-con {
      display: flex;
      align-items: center;

      gap: 10px;

      .time {
        color: rgba(0, 0, 0, 0.25);
      }
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

.err-cover {
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--el-fill-color-light);
  color: var(--el-text-color-secondary);
  font-size: 30px;
}
</style>
