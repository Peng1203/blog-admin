<template>
  <div>
    <input
      ref="fileInputRef"
      type="file"
      @change="handleFileChange"
    />
    <!-- <img
      src="https://peng-1302604454.cos.ap-guangzhou.myqcloud.com/%E5%AE%B5%E5%AE%AB.gif?q-sign-algorithm=sha1&q-ak=AKIDN6EKxx6yQiesZbt46tdforZvX9GeNeN7-yh3dH2gJd8qkCjo2i6tXspo1e7H_tcr&q-sign-time=1707016141;1707019741&q-key-time=1707016141;1707019741&q-header-list=&q-url-param-list=ci-process&q-signature=0f7d2894ade78e693e0ed0bebb43b6f92704083e&x-cos-security-token=qyf8mMbjW3v9QMp11xUZCFLKz3HgL8Cacff71071d9e46f614d5e1ebfab64a94bvStZ0CPTP4_ZrnVZ1AZgyjoGAomA2cyiF76M90nIt9AJc7foqVNuh-JHt_gvfqetr307gtSDFVTxpfCTH4czVizHLrKvPYlZQgkNkOHuo9HHk8uJcqaCnlKMMmnah3-jdo0Xxwl-NcVIxem9B6867zsStj4py4MndqNuDJEkXnRTAqML_amsRZB47H7FiQWI&ci-process=originImage"
      alt=""
    /> -->
    <!-- <img
      :src="option.img"
      alt=""
    /> -->
    <!-- mode="cover" -->
    <!-- fixedBox -->
    <!-- high -->
    <Cropper
      fixed
      centerBox
      autoCrop
      :img="img"
    />
    <div mt400>
      <Preview
        height="600px"
        :catalogVisible="false"
        v-model="responseMsg"
      />

      <div flex-sb-c>
        <textarea v-model="inputStr"></textarea>
        <el-button @click="handlePostMsg">send</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="Test">
import { ref, reactive } from 'vue';
import 'vue-cropper/dist/index.css';
import { Preview } from '@/components/MarkdownEditor';
import Cropper from '@/components/Cropper';
import { useChatApi } from '@/api/chat';

import { MdPreview } from 'md-editor-v3';

const { postChatContent } = useChatApi();

const resMsg = ref<string>('121');

const inputStr = ref<string>('你好');
const responseMsg = ref<string>('');

const handlePostMsg = async () => {
  responseMsg.value = '';
  // const { data: res } = await postChatContent({
  //   content: inputStr.value,
  // });
  // console.log('res ------', JSON.parse(`{${res}}`));
  const params = {
    messages: [{ role: 'user', content: inputStr.value }],
  };
  postChatContent(params, async (res: Response) => {
    const reader = res.body.getReader();
    const textDecoder = new TextDecoder();

    // 响应信息对象
    const responseMessage = {
      role: '',
      content: '',
    };

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
        responseMsg.value += content;
      });
    }

    console.log('responseMessage ------', responseMessage);
    inputStr.value = '';
  });
};

const img = ref();

const fileInputRef = ref<RefType>();

const handleFileChange = e => {
  const files = e.target.files as FileList;

  const reader = new FileReader();

  reader.readAsDataURL(files[0]);

  reader.onload = e => {
    console.log(`%c e.target.result ----`, 'color: #fff;background-color: #000;font-size: 18px', e.target.result);
    img.value = e.target.result as string;
  };
};
</script>

<style scoped lang="scss"></style>
