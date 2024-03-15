<template>
  <el-container>
    <el-aside width="250px"></el-aside>
    <el-main>
      <el-scrollbar
        class="chat-list-container"
        ref="chatListConScrollRef"
      >
        <template v-for="item of chatList">
          <!-- 左响应 -->
          <div
            class="chat-item-container left"
            v-if="item.direction === 'left'"
          >
            <div w40px>
              <Icon
                name="iconfont icon-chatGPT"
                size="40"
              />
            </div>

            <div class="title-message-container">
              <div class="title">
                <span class="name">ChatGPT</span>
              </div>

              <div class="message-tool-content">
                <MdPreview
                  class="message-content"
                  :modelValue="item.content"
                />

                <div class="tool">复制</div>
              </div>
            </div>
          </div>

          <!-- 右响应 -->
          <div
            class="chat-item-container right"
            v-else
          >
            <div w40px>
              <el-avatar
                :size="40"
                :src="item.avatar || 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'"
              />
            </div>

            <div class="title-message-container">
              <div class="title">
                <span class="name">{{ item.name }}</span>
              </div>

              <div class="message-tool-content">
                <div class="tool">复制</div>

                <MdPreview
                  class="message-content"
                  :modelValue="item.content"
                />
              </div>
            </div>
          </div>
        </template>
      </el-scrollbar>

      <!-- 输入框 -->
      <el-form :model="form">
        <el-form-item prop="sendMessage">
          <el-input
            :readonly="loading"
            type="textarea"
            placeholder="请输入内容..."
            v-model="form.sendMessage"
            @keyup.native.enter="handleSubmitForm"
          ></el-input>

          <el-button
            size="small"
            type="info"
            class="send-btn"
            :readonly="loading"
            @click.stop="handleSubmitForm"
          >
            <i class="iconfont icon-huichetijiao" />
          </el-button>
        </el-form-item>
      </el-form>
    </el-main>
  </el-container>
</template>

<script setup lang="ts" name="Chat">
import { reactive, ref, onMounted, nextTick } from 'vue';
import { ElScrollbar } from 'element-plus';
import { MdPreview } from 'md-editor-v3';
import { ChatItem } from './types';
import { useUserInfo } from '@/stores/userInfo';
import Icon from '@/components/SymbolIcon/index.vue';
import { useChatApi } from '@/api/chat';
import { dateTimeFormat } from '@/utils/moment';
import 'md-editor-v3/lib/preview.css';

const { userInfos } = useUserInfo();
const { postChatContent } = useChatApi();

const form = reactive({
  sendMessage: '',
});

const MAX_MESSAGE_TO_SEND = 5;

const loading = ref<boolean>(false);

// 对话消息列表
const chatList = ref<ChatItem[]>([]);

const chatListConScrollRef = ref<InstanceType<typeof ElScrollbar>>(null);

const handleSubmitForm = () => {
  const { userAvatar, userName } = userInfos;

  chatList.value.push({
    name: userName,
    avatar: userAvatar,
    content: form.sendMessage,
    direction: 'right',
    role: chatList.value.length ? 'user' : 'system',
    time: dateTimeFormat(),
  });

  scrollToBottom();

  handlePostMessage();
};

const handlePostMessage = () => {
  loading.value = true;
  // 截取最近的 5 条消息进行发送
  const messages =
    chatList.value.length <= MAX_MESSAGE_TO_SEND
      ? chatList.value
      : chatList.value.slice(chatList.value.length - MAX_MESSAGE_TO_SEND, chatList.value.length);
  const params = {
    messages: messages.map(({ role, content }) => ({ role, content })),
  };

  // 清除文本框的文字
  form.sendMessage = '';

  postChatContent(params, async (res: Response) => {
    const reader = res.body.getReader();
    const textDecoder = new TextDecoder();

    chatList.value.push({
      role: '',
      name: 'ChatGPT',
      direction: 'left',
      content: '',
      time: dateTimeFormat(),
    });

    // 响应信息对象
    const responseMessage = chatList.value[chatList.value.length - 1];

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const data = textDecoder.decode(value);
      const jsonData = data
        .split('\n')
        .filter(item => item !== '')
        .map(item => JSON.parse(item));

      jsonData.forEach(item => {
        const { role, content } = item.choices[0].delta;
        role && (responseMessage.role = role);
        if (!content) return;
        responseMessage.content += content;
      });

      scrollToBottom();
    }
    loading.value = false;
  });
};

const scrollToBottom = () => {
  nextTick(() => {
    chatListConScrollRef.value.setScrollTop(9999);
  });
};

onMounted(() => {});
</script>

<style scoped lang="scss">
// @import '@/theme/index';

.el-container {
  width: 100%;
  height: 100%;
  position: relative;

  .el-main {
    display: flex;
    flex-direction: column;
    // background-color: red;
    // height: calc(100% - 2%);
    overflow: hidden;
    padding: 1% 10%;

    .el-scrollbar {
      flex: 1;
      max-height: 78vh;
    }

    .el-form {
      flex: 0.1;
    }

    .chat-list-container {
      // background-image: linear-gradient(to right, white 50%, #9bec6b 50%);
      background-image: linear-gradient(to right, #9bec6b 50%, white 50%);

      .chat-item-container {
        display: flex;
        padding: 16px 15px;
        flex-direction: row;

        .title-message-container {
          margin-left: 10px;
          .title {
            margin-bottom: 5px;
          }
          .message-tool-content {
            display: flex;
            gap: 10px;
            .message-content {
              max-width: 40vw;
              padding: 0px 12px;
              background: #fff;
              border-radius: 8px;
              word-wrap: break-word;
            }
            .tool {
              display: none;
            }
            // &:hover {
            //   .tool {
            //     display: block;
            //   }
            // }
          }
        }
      }

      .right {
        flex-direction: row-reverse !important;
        .title-message-container {
          margin-right: 10px;

          .title {
            text-align: right;
          }

          .message-content {
            background: #9bec6b !important;
          }
        }
      }
    }

    :deep(.el-textarea__inner) {
      height: 80px !important;
      min-height: 80px !important;
      max-height: 300px !important;

      resize: none;
    }
    .send-btn {
      position: absolute;
      bottom: 10px;
      right: 15px;
    }
  }
}

:deep(.md-editor-preview-wrapper) {
  padding: 0 !important;
}

@media screen and (max-width: 376px) {
  .el-aside {
    position: absolute;
    left: -999px;
  }

  .el-main {
    padding: 1% 2% !important;
  }

  .message-content {
    max-width: 60vw !important;
  }
}
</style>
