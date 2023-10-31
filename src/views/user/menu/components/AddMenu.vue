<template>
  <Dialog
    title="添加菜单"
    v-model="addMenuDialogStatus"
    @clickCancel="addMenuDialogStatus = false"
    @clickConfirm="handleAdd"
  >
    <template #main>
      <!-- labelP="top" -->
      <Form
        ref="addFormRef"
        :labelW="'120px'"
        v-model="addMenuState.data"
        :formItemList="addMenuState.formItemList"
        @selectChange="handleSelectChange"
        @switchChange="handleSwitchChange"
        @radioChange="handleRadioChange"
      ></Form>
    </template>
  </Dialog>
</template>

<script lang="ts" setup>
import { ref, reactive, watch, PropType, computed, onMounted, defineAsyncComponent } from 'vue';
import { storeToRefs } from 'pinia';
import { ElMessage } from 'element-plus';
import { useMenuApi } from '@/api/menu/index';
import { allDynamicRoutes } from '@/router/dynamicRoutes.js';
import { formatFlatteningRoutes } from '@/router/index';
import { useUserAuthList } from '@/stores/userAuthList';
import { useRoutesList } from '@/stores/routesList';
import Dialog from '@/components/Dialog';
import Form, { FormItem, OperationItem } from '@/components/Form';
import { MenuData, AddMenuType } from '../types';

const userAuthListStore = useUserAuthList();
const userAuthList = storeToRefs(userAuthListStore);
const stores = useRoutesList();

const { routesList } = storeToRefs(stores);

const IconSelector = defineAsyncComponent(() => import('@/components/iconSelector/index.vue'));

const { addMenu } = useMenuApi();

const emits = defineEmits(['updateList']);

const props = defineProps({
  URIs: {
    type: Array as PropType<string[]>,
  },
});

const addMenuDialogStatus = ref<boolean>(false);

const addMenuState = reactive({
  data: ref<AddMenuType>({
    menuUri: '',
    menuName: '',
    menuPath: '',
    menuIcon: '',
    menuType: 0,
    parentId: 0,
    updateTime: '',
    createTime: '',
    orderNum: 0,
    isKeepalive: 0,
    isHidden: 0,
    children: [],
  }),
  formItemList: ref<FormItem<MenuData>[]>([
    {
      type: 'radio',
      label: '类型',
      prop: '',
    },
  ]),
});

const addFormRef = ref<any>(null);
// 处理添加操作
const handleAdd = async () => {
  // if (!validRes) return;
  // const addRes = await addNewMenu();
  // if (!addRes) return;
  // addMenuDialogStatus.value = false;
  // emits('updateList');
};

// 添加权限标识
const addNewMenu = async (): Promise<boolean> => {
  try {
    const {
      menuName,
      menuPath,
      menuIcon,
      menuURI,
      parentId,
      menuType,
      regedit,
      roles,
      // updateTime,
      // createdTime,
      isKeepAlive,
      isHide,
      parentMenuName,
    } = addMenuState.data;
    const params = {
      menuName,
      menuPath,
      menuIcon,
      menuURI,
      parentId,
      menuType,
      menuRedirect: regedit,
      // otherConfig: { isKeepAlive, isHide },
      otherConfig: JSON.stringify({ isKeepAlive, isHide, parentMenuName }),
    };
    const { data: res } = await addMenu(params);
    const { code, data, message } = res;
    if (code !== 200 || message !== 'Success') {
      ElMessage.error(data);
      return false;
    } else {
      ElMessage.success(data);
      return true;
    }
  } catch (e) {
    console.log(e);
    return false;
  }
};

// 图标选择器前置图标
const preIcon = computed<string>(() => {
  if (addMenuState.data.menuIcon) return addMenuState.data.menuIcon;
  else return 'ele-Pointer';
});

// 下拉选择切换
const handleSelectChange = ({ newVal, prop, index }: FormItemChangeType) => {
  // 选择本地菜单切换
  if (prop === 'menuURI') {
    const selectMenuDetail: any = unAddMenus.value.find((item: any) => item.name === newVal);
    const { name, path, meta, redirect } = selectMenuDetail;

    addMenuState.data.menuName = meta.title;
    addMenuState.data.menuIcon = meta.icon;
    addMenuState.data.menuURI = name;
    addMenuState.data.menuPath = path;
    addMenuState.data.regedit = redirect ? redirect.name : '';
    addMenuState.data.parentMenuName = meta.parentMenuName || '';
    addMenuState.data.menuType = meta.menuType;

    // 选择父级菜单行 是否展示
    const findRes1 = addMenuState.formItemList.find(i => i.prop === 'parentId');
    // 输入重定向地址
    const findRes2 = addMenuState.formItemList.find(i => i.prop === 'regedit');

    if (['2', '4'].includes(addMenuState.data.menuType)) {
      findRes1 && (findRes1.isShow = true);
    } else if (['1', '3'].includes(addMenuState.data.menuType)) {
      findRes1 && (findRes1.isShow = false);
    }

    if (['1', '2'].includes(addMenuState.data.menuType)) {
      findRes2 && (findRes2.isShow = true);
    } else if (['3', '4'].includes(addMenuState.data.menuType)) {
      findRes2 && (findRes2.isShow = false);
    }
  }
};

// switch 选项切换
const handleSwitchChange = ({ newVal, prop, index }: FormItemChangeType) => {
  // if (prop === 'isParentMenu') {
  //   if (newVal) {
  //     addMenuState.data.parentId = 0
  //     addMenuState.formItemList[index + 1].isShow = false
  //   } else {
  //     addMenuState.formItemList[index + 1].isShow = true
  //   }
  // }
};

// radios 单选框切换
const handleRadioChange = ({ newVal, prop, index }: FormItemChangeType) => {
  if (prop === 'menuType') {
    // 选择父级菜单行 是否展示
    const findRes1 = addMenuState.formItemList.find(i => i.prop === 'parentId');
    // 输入重定向地址
    const findRes2 = addMenuState.formItemList.find(i => i.prop === 'regedit');

    if (['2', '4'].includes(newVal)) {
      findRes1 && (findRes1.isShow = true);
    } else if (['1', '3'].includes(newVal)) {
      findRes1 && (findRes1.isShow = false);
    }

    if (['1', '2'].includes(newVal)) {
      findRes2 && (findRes2.isShow = true);
    } else if (['3', '4'].includes(newVal)) {
      findRes2 && (findRes2.isShow = false);
    }

    reSetAddForm();
    addMenuState.data.menuType = newVal;
  }
};

// 可添加菜单详情数组 用于查找
const unAddMenus = ref();
// 下拉筛选数据
const menuOptions = ref([]);

watch(
  () => props.URIs,
  val => {
    // 根据本地全部的菜单数组 以及数据库中以存在的菜单 对比过滤出 可选添加的新菜单
    // .filter((rule: any) => !rule.redirect && rule)
    const menuRules = formatFlatteningRoutes(allDynamicRoutes).filter((rule: any) => rule.name !== 'Index');

    // 过滤出可选菜单
    unAddMenus.value = menuRules.filter((rule: any) => !val?.includes(rule.name));
    menuOptions.value = unAddMenus.value.map((item: any) => ({
      label: item.meta.title,
      value: item.name,
    }));
    const findMenu = addMenuState.formItemList.find(i => i.prop === 'menuURI');
    findMenu && (findMenu.options = menuOptions.value);
    // addMenuState.formItemList[0]
  },
  {
    deep: true,
    immediate: true,
  }
);

const reSetAddForm = () => {
  addMenuState.data = {
    menuName: '',
    menuPath: '',
    menuURI: '',
    menuIcon: '',
    parentId: 0,
    roles: [1],
    menuType: '1',
    updateTime: '',
    createdTime: '',
    regedit: '',
    isKeepAlive: false,
    isHide: false,
    parentMenuName: '',
  };
};

// 级联选择器数据
const allMenuRules = ref<any>();
// 处理级联选择器菜单数据
const hanldeFormatCascader = (rules: any[]) => {
  rules.forEach(rule => {
    rule.title = rule.meta.title;
    if (rule.children && rule.children.length) {
      rule.disabled = false;
      hanldeFormatCascader(rule.children);
    } else {
      rule.disabled = true;
    }
  });
};

onMounted(() => {
  // 处理选择父级菜单级联选择器数据
  hanldeFormatCascader(routesList.value);
  allMenuRules.value = routesList.value;
});

defineExpose({ addMenuDialogStatus });
</script>

<style lang="scss" scoped></style>
