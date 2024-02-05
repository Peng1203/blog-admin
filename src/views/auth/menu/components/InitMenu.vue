<template>
  <el-button
    size="default"
    type="primary"
  >
    初始化菜单
  </el-button>
  {{ allDynamicRoutes[0].children }}
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { allDynamicRoutes } from '@/router/dynamicRoutes';
</script>
