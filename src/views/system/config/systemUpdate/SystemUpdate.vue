<template>
  <div class="table-container layout-padding">
    <el-card
      shadow="hover"
      class="layout-padding-auto"
    >
      <!-- <el-button @click="test">测试</el-button> -->
      <!-- {{ activeTab }} -->
      <el-tabs
        v-model="activeTab"
        type="border-card"
      >
        <el-tab-pane
          :name="tab.value"
          :label="tab.label"
          :disabled="loadingStatus"
          v-for="tab in serveTabs"
        />

        <UpdateBtn />
      </el-tabs>
      <div
        class="out-container"
        id="update-msg-con"
      >
        <el-scrollbar ref="msgScrollConRef">
          <p v-html="updateMsg"></p>
        </el-scrollbar>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="tsx" name="SystemUpdate">
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import { useSystemConfigApi } from '@/api/system/config';
import { ElNotification } from 'element-plus';

const { updateSystem } = useSystemConfigApi();

const test = () => {
  const es = new EventSource('http://localhost:3000/system/update/12');
  es.onopen = data => console.log('open ------', data);
  es.onmessage = data => console.log('msg ------', data);
  es.onerror = err => {
    es.close();
    console.log('err ------', err);
  };
};

const msgScrollConRef = ref<RefType>(null);

const serveTabs = [
  { label: 'Web', value: 'web' },
  { label: 'Admin', value: 'admin' },
  { label: 'Serve', value: 'serve' },
];
const activeTab = ref<string>('web');

const loadingStatus = ref<boolean>(false);

const updateMsg = ref<string>('');
const updateSSE = ref<EventSource>();
const handleUpdateSystem = () => {
  updateMsg.value = '';

  updateSSE.value = updateSystem(activeTab.value, (e: MessageEvent) => {
    loadingStatus.value = true;
    const { data, status } = JSON.parse(e.data).data;
    updateMsg.value += `<pre>${data}</pre>`;
    nextTick(() => {
      const conDom = msgScrollConRef.value;
      conDom!.scrollTop = conDom!.scrollHeight;
    });

    if (status === 'Success') {
      ElNotification.success({
        title: '通 知',
        message: `${activeTab.value} 服务更新完成!`,
      });
      loadingStatus.value = false;
    }
  });
};

const UpdateBtn = () => {
  return (
    <>
      <el-button
        size="small"
        type="primary"
        loading={loadingStatus.value}
        disabled={loadingStatus.value}
        onClick={handleUpdateSystem}
      >
        {loadingStatus.value ? '更新中...' : `更新 ${activeTab.value} 服务`}
      </el-button>
    </>
  );
};

onUnmounted(() => {
  updateSSE.value?.close();
});
</script>

<style scoped lang="scss">
.out-container {
  box-sizing: border-box;
  height: calc(100% - 42px - 54px);
  width: 100%;
  white-space: pre;
  font-family: monospace;
  background-color: #000000b9;
  color: #fff;
  border-radius: 0 0 3px 3px;
  padding: 10px;
}
</style>
