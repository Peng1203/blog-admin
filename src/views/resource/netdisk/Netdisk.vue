<template>
  <div class="layout-padding">
    <el-card
      shadow="hover"
      class="layout-padding-auto"
    >
      网盘
      <div flex-s-c>
        <Peng-Icon
          name="icon-weibiaoti-_huabanfuben"
          size="25"
        />
        <el-breadcrumb ml10>
          <el-breadcrumb-item>
            <a href="javascript:void(0)">homepage</a>
          </el-breadcrumb-item>
          <el-breadcrumb-item><a href="javascript:void(0)">promotion</a></el-breadcrumb-item>
          <el-breadcrumb-item>promotion list</el-breadcrumb-item>
          <el-breadcrumb-item>promotion detail</el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <Table
        :data="netdistState.data"
        :columns="netdistState.columns"
        :isNeedPager="false"
      >
        <template #nameSlot="{ row, prop }">
          <span
            v-if="row['type'] === 'dir'"
            flex-s-c
          >
            <Peng-Icon
              name="icon-weibiaoti-_huabanfuben"
              size="20"
            />
            <span ml5>{{ row[prop] }}</span>
          </span>

          <span v-else>
            <Peng-Icon
              v-if="row['ext'] === '.png'"
              name="icon-PNG"
              size="20"
            />
            <span ml5>{{ row[prop] }}</span>
          </span>
        </template>
      </Table>
    </el-card>
  </div>
</template>

<script setup lang="ts" name="Netdisk">
import { ref, onMounted, reactive } from 'vue';
import { useResourceApi } from '@/api/resource';
import { DirFileDataItem, NetdiskDirData } from './types';
import { ColumnItem } from '@/components/Table';
import Table from '@/components/Table';
import dayjs from 'dayjs';

const { getNetdiskDir } = useResourceApi();

const extHashmappingIcon = {
  '.png': 'icon-PNG',
  '.jpg': 'icon-JPG',
  '.jpeg': 'icon-JPG',
  '.gif': 'icon-GIF',
};

const netdistState = reactive({
  data: ref<DirFileDataItem[]>([]),
  columns: ref<ColumnItem<DirFileDataItem>[]>([
    {
      label: '文件名',
      prop: 'name',
      tooltip: true,
      slotName: 'nameSlot',
    },
    {
      label: '大小',
      prop: 'size',
    },
    {
      label: '修改时间',
      prop: 'lastModified',
    },
  ]),
});

const getNetdiskDirData = async () => {
  try {
    const { data: res } = await getNetdiskDir<NetdiskDirData>();
    const { code, success, data } = res;
    if (code !== 20000 || !success) return;
    console.log('data ------', data);
    data.list.forEach(item => {
      item.lastModified = dayjs(item.lastModified).format('YYYY-MM-DD HH:mm:ss');
    });
    netdistState.data = data.list;
  } catch (error) {
    console.log('error ------', error);
  }
};

onMounted(() => {
  getNetdiskDirData();
});
</script>

<style scoped lang="scss"></style>
