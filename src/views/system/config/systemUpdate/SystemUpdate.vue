<template>
  <div class="table-container layout-padding">
    <el-card
      shadow="hover"
      class="layout-padding-auto"
    >
      <!-- <el-button @click="test">测试</el-button> -->

      <el-tabs type="border-card">
        <!-- disabled -->
        <el-tab-pane label="Web">
          <el-button
            type="primary"
            size="small"
            @click="handleUpdateWeb"
          >
            更新 Web 服务
          </el-button>
          <div
            class="out-container"
            id="web-res-con"
            v-html="webResult"
          ></div>
        </el-tab-pane>
        <el-tab-pane label="Admin">
          <el-button
            type="primary"
            size="small"
            @click="handleUpdateAdmin"
          >
            更新 Admin 服务
          </el-button>
          <div
            class="out-container"
            id="admin-res-con"
            v-html="adminResult"
          ></div>
        </el-tab-pane>
        <el-tab-pane label="Serve">
          <el-button
            type="primary"
            size="small"
            @click="handleUpdateServe"
          >
            更新 Serve 服务
          </el-button>
          <div
            class="out-container"
            id="serve-res-con"
            v-html="serveResult"
          ></div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup lang="ts" name="">
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import { useSystemConfigApi } from '@/api/system/config';
import { ElNotification } from 'element-plus';

const { updateWebSys, updateAdminSys, updateServeSys } = useSystemConfigApi();

const test = () => {
  fetch('http://localhost:3000/system');
};

const webResult = ref<string>('');
let updateWebSSE = ref<EventSource>();
const handleUpdateWeb = () => {
  webResult.value = '';
  updateWebSSE.value = updateWebSys((e: MessageEvent) => {
    const { data, status } = JSON.parse(e.data).data;
    webResult.value += `<pre>${data}</pre>`;

    nextTick(() => {
      const conDom = document.getElementById('web-res-con');
      conDom!.scrollTop = conDom!.scrollHeight;
    });
    if (status === 'Success')
      ElNotification.success({
        title: '通 知',
        message: `Web 服务更新完成!`,
      });
  });
};

const adminResult = ref<string>('');
let updateAdminSSE = ref<EventSource>();
const handleUpdateAdmin = () => {
  adminResult.value = '';
  updateAdminSSE.value = updateAdminSys((e: MessageEvent) => {
    const { data, status } = JSON.parse(e.data).data;
    adminResult.value += `<pre>${data}</pre>`;
    nextTick(() => {
      const conDom = document.getElementById('admin-res-con');
      conDom!.scrollTop = conDom!.scrollHeight;
    });
    if (status === 'Success')
      ElNotification.success({
        title: '通 知',
        message: `Admin 服务更新完成!`,
      });
  });
};

const serveResult = ref<string>('');
let updateServeSSE = ref<EventSource>();
const handleUpdateServe = () => {
  serveResult.value = '';
  updateServeSSE.value = updateServeSys((e: MessageEvent) => {
    const { data, status } = JSON.parse(e.data).data;
    serveResult.value += `<pre>${data}</pre>`;
    nextTick(() => {
      const conDom = document.getElementById('serve-res-con');
      conDom!.scrollTop = conDom!.scrollHeight;
    });
    if (status === 'Success')
      ElNotification.success({
        title: '通 知',
        message: `Serve 服务更新完成!`,
      });
  });
};

onUnmounted(() => {
  updateWebSSE.value?.close();
  updateAdminSSE.value?.close();
  updateServeSSE.value?.close();
});
</script>

<style scoped lang="scss">
.table-container {
  .el-tabs {
    height: calc(100% - 40px);
  }
  :deep(.el-tabs__content) {
    height: 100%;
  }

  :deep(.el-tab-pane) {
    height: 100%;
    position: relative;
  }
}

.out-container {
  position: absolute;
  box-sizing: border-box;
  height: 85%;
  width: 100%;
  white-space: pre;
  font-family: monospace;
  // height: 100%;
  background-color: #000000b9;
  color: #fff;
  border-radius: 3px;
  padding: 10px;
  overflow: auto;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
