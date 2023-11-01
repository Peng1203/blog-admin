<template>
  <Dialog
    title="添加菜单"
    v-model="addMenuDialogStatus"
    @clickCancel="addMenuDialogStatus = false"
    @clickConfirm="handleAdd"
  >
    {{ addMenuState.data }}
    <Form
      ref="addFormRef"
      :labelW="'120px'"
      :formItems="addMenuState.formItemList"
      v-model="addMenuState.data"
    >
      <template #iconSlot="{ prop }">
        <!-- <span>{{ row[prop!] }}</span> -->
        <IconSelector
          :prepend="preIcon"
          v-model="addMenuState.data.menuIcon"
        />
        <!-- @get="(icon) => (addTagState.data.tagIcon = icon)" -->
      </template>
    </Form>
    <!-- @radioChange="handleRadioChange" -->
    <!-- @selectChange="handleSelectChange" -->
    <!-- @switchChange="handleSwitchChange" -->
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
import Form, { FormItem, RadioItem, OperationItem } from '@/components/Form';
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
  formItemList: ref<FormItem<AddMenuType>[]>([
    {
      type: 'radio',
      label: '类型',
      prop: 'menuType',
      options: ref<RadioItem[]>([
        { label: '目录', value: 0 },
        { label: '菜单', value: 1 },
      ]),
    },
    {
      type: 'input',
      label: '菜单名',
      prop: 'menuName',
      rules: [
        { required: true, trigger: 'blur' },
        { min: 2, max: 8, trigger: 'blur' },
      ],
    },
    {
      type: 'slot',
      label: '图标',
      prop: 'menuIcon',
      slotName: 'iconSlot',
    },
    {
      type: 'input',
      label: '访问路径',
      prop: 'menuPath',
      statrPre: '/',
      rules: [
        { required: true, trigger: 'blur' },
        { min: 2, max: 8, trigger: 'blur' },
      ],
    },
    {
      type: 'switch',
      label: '缓存',
      prop: 'isKeepalive',
      tValue: 1,
      fValue: 0,
      span: 10,
    },
    {
      type: 'switch',
      label: '隐藏',
      prop: 'isHidden',
      tValue: 1,
      fValue: 0,
      span: 10,
    },
    {
      type: 'inputNum',
      label: '排序',
      prop: 'orderNum',
      minVal: 0,
      maxVal: 20,
      controlsR: true,
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

// 图标选择器前置图标
const preIcon = computed<string>(() => {
  if (addMenuState.data.menuIcon) return addMenuState.data.menuIcon;
  else return 'ele-Pointer';
});

// 下拉选择切换
// const handleSelectChange = ({ newVal, prop, index }) => {};

// // switch 选项切换
// const handleSwitchChange = ({ newVal, prop, index }) => {};

// radios 单选框切换
// const handleRadioChange = ({ newVal, prop, index }) => {};

// 可添加菜单详情数组 用于查找
const unAddMenus = ref();
// 下拉筛选数据
const menuOptions = ref([]);

const reSetAddForm = () => {
  // addMenuState.data = {
  //   menuName: '',
  //   menuPath: '',
  //   menuUri: '',
  //   menuIcon: '',
  //   parentId: 0,
  //   menuType: 1,
  //   updateTime: '',
  //   createTime: '',
  //   isKeepalive: 0,
  //   isHidden: 0,
  // };
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
