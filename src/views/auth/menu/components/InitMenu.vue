<template>
  <el-button
    size="default"
    type="primary"
    @click="handleInitMenus"
  >
    <i class="iconfont icon-chushihua" />
    初始化菜单
  </el-button>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useMenuApi } from '@/api/menu';

const { initMenus } = useMenuApi();
import { allDynamicRoutes } from '@/router/dynamicRoutes';

const handleInitMenus = async () => {
  try {
    const menus = getInitMenuData();
    console.log(`%c menus ----`, 'color: #fff;background-color: #000;font-size: 18px', menus);
    const { data: res } = await initMenus<string>(menus);
    console.log('res ------', res);
    const { data, success, message, code } = res;
    if (code !== 20100 || !success) return false;
  } catch (e) {
    console.log('e', e);
  }
};

const getInitMenuData = () => {
  return allDynamicRoutes[0].children.reduce(
    (prev, cur) => {
      const { name: menuUri, path: menuPath, children } = cur;
      const { title: menuName, icon: menuIcon, orderNum, isHide, isKeepAlive } = cur.meta;

      prev.parentMenus.push({ menuUri, menuPath, menuName, menuIcon, orderNum, isHide, isKeepAlive });

      if (children) {
        prev.subMenus.push(
          ...children.map(subMenu => ({
            menuName: subMenu.meta.title,
            menuPath: subMenu.path,
            menuUri: subMenu.name,
            menuIcon: subMenu.meta.icon,
            orderNum: subMenu.meta.orderNum,
            isHide: subMenu.meta.isHide,
            isKeepAlive: subMenu.meta.isKeepAlive,
            parentUri: menuUri,
          }))
        );
      }

      return prev;
    },
    { parentMenus: [], subMenus: [] }
  );
};
</script>
