<template>
  <div class="layout-padding">
    <el-card
      shadow="hover"
      class="layout-padding-auto"
      pos-relative
    >
      <div flex-sb-c>
        <!-- 路径面包屑 -->
        <div flex-s-c>
          <Peng-Icon
            name="icon-weibiaoti-_huabanfuben"
            size="25"
          />
          <el-breadcrumb ml10>
            <el-breadcrumb-item>
              <span
                fw-black
                :class="netdistState.path.length ? 'pseudo-c-p-c' : ''"
                @click="handleGoRootDir"
              >
                根目录
              </span>
            </el-breadcrumb-item>
            <el-breadcrumb-item v-for="(dir, i) in netdistState.path">
              <span v-if="i === netdistState.path.length - 1">{{ dir }}</span>
              <span
                pseudo-c-p-c
                @click="handleGoSubDir(dir)"
                v-else
              >
                {{ dir }}
              </span>
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>

        <!-- 右侧操作 -->
        <div>
          <el-button
            size="small"
            type="primary"
            @click="handleRefresh"
          >
            <el-icon>
              <RefreshRight />
            </el-icon>
            刷 新
          </el-button>
        </div>
      </div>

      <Table
        size="small"
        emptyText="文件夹为空"
        :stripe="false"
        :data="netdistState.data"
        :columns="netdistState.columns"
        :loading="netdistState.loading"
        :isNeedPager="false"
        @mouseRightRowClick="handleMouseRightRowClick"
      >
        <template #nameSlot="{ row, prop }">
          <span
            v-if="row['type'] === 'dir'"
            flex-s-c
          >
            <span
              pseudo-c-p
              @click="handleEnterSubDir(row)"
            >
              <Peng-Icon
                name="icon-weibiaoti-_huabanfuben"
                size="20"
              />
              <span ml5>
                {{ row[prop] }}
              </span>
            </span>
          </span>

          <span v-else>
            <Peng-Icon
              v-if="row['ext'] === '.png'"
              :name="extHashmappingIcon['.png']"
              size="20"
            />
            <Peng-Icon
              v-if="row['ext'] === '.jpg'"
              :name="extHashmappingIcon['.jpg']"
              size="20"
            />
            <Peng-Icon
              v-if="row['ext'] === '.jpeg'"
              :name="extHashmappingIcon['.png']"
              size="20"
            />
            <span ml5>{{ row[prop] }}</span>
          </span>
        </template>

        <template #sizeSlot="{ row, prop }">
          {{ row[prop] ? `${row[prop]} MB` : '-' }}
        </template>
      </Table>

      <!-- 表格鼠标右键 菜单 -->
      <ContextMenu
        :left="rightMenuInfo.left"
        :top="rightMenuInfo.top"
        v-model="rightMenuInfo.visible"
      >
        <el-button size="small">打开</el-button>
        <br />
        <el-button size="small">下载</el-button>
        <br />
        <el-button size="small">重命名</el-button>
        <br />
        <el-button size="small">删除</el-button>
        <br />
        <el-button size="small">属性</el-button>
        <br />
      </ContextMenu>
    </el-card>
  </div>
</template>

<script setup lang="ts" name="Netdisk">
import { ref, onMounted, reactive, defineAsyncComponent, onUnmounted } from 'vue';
import { useResourceApi } from '@/api/resource';
import { DirFileDataItem, NetdiskDirData } from './types';
import { ColumnItem } from '@/components/Table';
import Table from '@/components/Table';
import dayjs from 'dayjs';
import { userTableRightMenu } from '@/hooks/useTableMouseRight';
import { Local } from '@/utils/storage';

const ContextMenu = defineAsyncComponent(() => import('@/components/ContextMenu'));

const { getNetdiskDir } = useResourceApi();

const { rightMenuInfo, handleMouseRightRowClick } = userTableRightMenu();

const extHashmappingIcon: Record<string, string> = {
  '.png': 'icon-PNG',
  '.jpg': 'icon-JPG',
  '.jpeg': 'icon-JPG',
  '.gif': 'icon-GIF',
};

const netdistState = reactive({
  path: ref<string[]>([]),
  loading: false,
  data: ref<DirFileDataItem[]>([]),
  columns: ref<ColumnItem<DirFileDataItem>[]>([
    {
      label: '文件名',
      prop: 'name',
      slotName: 'nameSlot',
    },
    {
      label: '大小',
      prop: 'size',
      slotName: 'sizeSlot',
    },
    {
      label: '修改时间',
      prop: 'lastModified',
    },
  ]),
});

const getNetdiskDirData = async (params?: Record<'path', string>) => {
  try {
    netdistState.loading = true;
    const { data: res } = await getNetdiskDir<NetdiskDirData>(params);
    const { code, success, data } = res;
    if (code !== 20000 || !success) return;
    data.list.forEach(item => {
      item.lastModified = dayjs(item.lastModified).format('YYYY-MM-DD HH:mm:ss');
    });
    netdistState.data = data.list;
    netdistState.path = data.path.split('/').filter(val => val !== '');
  } catch (error) {
    console.log('error ------', error);
  } finally {
    netdistState.loading = false;
  }
};

const handleGoSubDir = (dir: string) => {
  const pathStr = netdistState.path.join('/');
  const subLength = pathStr.indexOf(dir);
  let paramsPath = pathStr.substring(0, dir.length + subLength);

  getNetdiskDirData({ path: paramsPath });
};

const handleEnterSubDir = (row: DirFileDataItem) => {
  getNetdiskDirData({ path: row.path });
};

const handleGoRootDir = () => {
  if (!netdistState.path.length) return;
  getNetdiskDirData();
};

const handleRefresh = () => {
  const paramsPath = netdistState.path.join('/');
  getNetdiskDirData({ path: paramsPath });
};

// const handleMouseRightRowClick = (row: DirFileDataItem) => {
//   console.log('鼠标右击 ------', row);
// };

onMounted(() => {
  getNetdiskDirData();
});

onUnmounted(() => {
  Local.set('tiems', Date.now());
});
</script>

<style scoped lang="scss"></style>
