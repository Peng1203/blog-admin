<template>
  <div>
    <Preview v-model="articleForm.content" />

    <MarkdownEditor v-model="articleForm.content" />
    <!-- <div class="table-container layout-padding">
      <el-card
      shadow="hover"
      class="layout-padding-auto"
      ></el-card>
    </div> -->
  </div>
</template>

<script setup lang="ts" name="WriteArticle">
import MarkdownEditor, { Preview } from '@/components/MarkdownEditor';
import { reactive } from 'vue';
const articleForm = reactive({
  content: '',
});
</script>

<style scoped lang="scss"></style>
