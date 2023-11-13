<template>
  <el-button
    v-auth="'ADD'"
    size="default"
    type="success"
    class="ml10"
    @click="handleAddAllMenu"
  >
    <el-icon>
      <Menu />
    </el-icon>
    一键添加默认菜单
  </el-button>
</template>

<script lang="ts" setup>
import { AxiosResponse } from 'axios';
import { ElMessage } from 'element-plus';
import { allDynamicRoutes } from '@/router/dynamicRoutes.js';
import { formatFlatteningRoutes } from '@/router/index';
import { useMenuApi } from '@/api/menu/index';

const emits = defineEmits(['updateList']);

const { addAllDefaultMenu } = useMenuApi();

const handleAddAllMenu = async () => {
  const allMenuRules = formatFlatteningRoutes(allDynamicRoutes).filter((rule: any) => rule.name !== 'Index');

  const data = allMenuRules.map((item: any) => ({
    menuName: item.meta.title,
    menuPath: item.path,
    menuIcon: item.meta.icon,
    menuURI: item.name,
    parentId: 0,
    menuType: item.meta.menuType,
    menuRedirect: item?.redirect?.name || '',
    otherConfig: {
      isKeepAlive: item.meta.isKeepAlive,
      isHide: item.meta.isHide,
      parentMenuName: item.meta?.parentMenuName || '',
    },
  }));

  const editRes = await addDefaultMenus(data);
  if (!editRes) return;
  emits('updateList');
};

const addDefaultMenus = async (params: any[]): Promise<boolean> => {
  try {
    const { data: res }: AxiosResponse<ResResponse> = await addAllDefaultMenu(params);
    const { data, message, code } = res;
    if (message !== 'Success' || code !== 200) return false;

    ElMessage.success(data);
    return true;
  } catch (e) {
    return false;
    console.log(e);
  }
};
</script>

<style lang="scss" scoped></style>
