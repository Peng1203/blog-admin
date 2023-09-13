<template>
  <Peng-Drawer
    :title="'修改菜单信息'"
    :direction="deviceClientType === 'pc' ? 'rtl' : 'btt'"
    :size="deviceClientType === 'pc' ? '400px' : '50%'"
    v-model="editDrawerStatus"
  >
    <template #main>
      <Peng-Form
        labelP="top"
        size="default"
        ref="editFormRef"
        :labelW="100"
        :formData="editFormState.data"
        :formItemList="editFormState.formItemList"
        @switchChange="handleSwitchChange"
      >
        <template #menuIcon>
          <!-- style="width: 300px !important;" -->
          <!-- 
            @clear="handleClearIcon" -->
          <!-- disabled -->
          <IconSelector
            :prepend="preIcon"
            v-model="editFormState.data.menuIcon"
            @get="handleGetIcon"
          />
        </template>
      </Peng-Form>

      <div class="mt20 flex-e-c">
        <el-button size="small" @click="editDrawerStatus = false">
          取消
        </el-button>
        <el-button size="small" type="primary" @click="handleSaveEdit">
          保存
        </el-button>
      </div>
    </template>
  </Peng-Drawer>
</template>

<script lang="ts" setup>
import {
  ref,
  reactive,
  inject,
  PropType,
  watch,
  defineAsyncComponent,
  computed,
} from 'vue'
import { useMenuApi } from '@/api/menu/index'
import { ElMessage } from 'element-plus'

const IconSelector = defineAsyncComponent(
  () => import('@/components/iconSelector/index.vue')
)
const { updataMenu } = useMenuApi()

const deviceClientType = inject('deviceClientType')

const props = defineProps({
  editRow: {
    type: Object as PropType<object>,
    require: true,
  },
})
const emits = defineEmits(['updateList'])

// 抽屉状态
const editDrawerStatus = ref<boolean>(false)

const editFormState = reactive({
  data: ref<Menu & { isHide: boolean; isKeepAlive: boolean }>({
    id: 0,
    menuName: '',
    menuPath: '',
    menuURI: '',
    menuIcon: '',
    parentId: 0,
    updateTime: '',
    createdTime: '',
    menuType: '1',
    menuRedirect: '',
    isHide: false,
    isKeepAlive: false,
    otherConfig: {
      isHide: false,
      isKeepAlive: false,
      parentMenuName: '',
    },
  }),
  formItemList: ref<FormItem[]>([
    {
      type: 'radio',
      label: '菜单类型',
      prop: 'menuType',
      disabled: true,
      options: ref<RadioItem[]>([
        {
          label: '一级目录',
          value: '1',
        },
        {
          label: '目录',
          value: '2',
        },
        {
          label: '一级菜单',
          value: '3',
        },
        {
          label: '菜单',
          value: '4',
        },
      ]),
    },
    {
      type: 'input',
      label: '菜单名',
      prop: 'menuName',
      placeholder: '请输入菜单名称',
      rules: [{ required: true, trigger: 'blur' }],
    },
    {
      type: 'input',
      label: '菜单路径',
      prop: 'menuPath',
      placeholder: '请输入菜单路径 例: /xxx',
      rules: [
        { required: true, trigger: 'blur' },
        { min: 2, trigger: 'blur' },
      ],
    },
    {
      type: 'input',
      label: '唯一标识 (注意!修改菜单唯一标识会导致缓存失效!)',
      prop: 'menuURI',
      placeholder: '请输入菜单唯一标识',
      rules: [
        { required: true, trigger: 'blur' },
        { min: 2, trigger: 'blur' },
      ],
    },
    {
      xs: 24,
      span: 24,
      type: 'input',
      label: '重定向菜单',
      placeholder: '请输入菜单唯一标识',
      prop: 'menuRedirect',
      isShow: true,
      // rules: [{ required: true, trigger: 'blur' }],
      rules: [{ required: true, trigger: 'change' }],
    },
    {
      type: 'slot',
      label: '菜单图标',
      prop: 'menuIcon',
      slotName: 'menuIcon',
    },
    {
      type: 'switch',
      label: '是否缓存',
      prop: 'isKeepAlive',
      tValue: true,
      fValue: false,
      tText: '是',
      fText: '否',
    },
    {
      type: 'switch',
      label: '菜单状态',
      prop: 'isHide',
      tValue: false,
      fValue: true,
      tText: '可见',
      fText: '隐藏',
    },
    // 非父级菜单 设置重定向地址 {}
  ]),
})

// 图标选择器前置图标
const preIcon = computed<string>(() => {
  if (editFormState.data.menuIcon) return editFormState.data.menuIcon
  else return 'ele-Pointer'
})

const editFormRef = ref<any>(null)
// 处理保存修改
const handleSaveEdit = async () => {
  let validProps: any = []
  if (['1', '2'].includes(editFormState.data.menuType))
    validProps = ['menuName', 'menuPath', 'menuURI', 'menuRedirect']
  else validProps = ['menuName', 'menuPath', 'menuURI']

  // const valdateRes = await editFormRef.value
  //   .getRef()
  //   .validate()
  //   .catch(() => false)

  let valdateRes: boolean = false
  await editFormRef.value
    .getRef()
    .validateField(validProps, (isValid: boolean) => (valdateRes = isValid))

  if (!valdateRes) return

  const editRes = await saveEditMenu()
  if (!editRes) return
  editDrawerStatus.value = false
  emits('updateList')
}

// 保存修改数据
const saveEditMenu = async (): Promise<boolean> => {
  try {
    const {
      id,
      menuName,
      menuPath,
      menuURI,
      menuIcon,
      parentId,
      menuType,
      menuRedirect,
      otherConfig,
      isHide,
      isKeepAlive,
      createdTime,
      updateTime,
    } = editFormState.data
    const params = {
      menuName,
      menuPath,
      menuURI,
      menuIcon,
      parentId,
      menuType,
      menuRedirect,
      otherConfig: JSON.stringify({ ...otherConfig, isHide, isKeepAlive }),
      // createdTime,
      // updateTime,
    }
    const { data: res } = await updataMenu(id, params)
    const { code, data, message } = res
    if (code !== 200 || message !== 'Success') {
      ElMessage.error(data)
      return false
    }
    ElMessage.success(data)
    return true
  } catch (e) {
    console.log(e)
    return false
  }
}

// switch 组件切换
const handleSwitchChange = ({ newVal, prop, index }: FormItemChangeType) => {
  // if (newVal) {
  //   editFormState.formItemList[5].isShow = false
  //   editFormState.data.parentId = 0
  // } else {
  //   editFormState.formItemList[5].isShow = true
  // }
}

// 获取当前点击的 icon 图标
const handleGetIcon = (icon: string) => (editFormState.data.menuIcon = icon)

// 当窗口关闭时 重置表单校验 重置图标
watch(editDrawerStatus, async val => {
  if (val) {
    const newVal = JSON.parse(JSON.stringify(props.editRow))

    editFormState.data = {
      ...newVal,
      isHide: newVal.otherConfig.isHide,
      isKeepAlive: newVal.otherConfig.isKeepAlive,
    }
    // editFormState.data.isHide = editFormState.data.otherConfig.isHide
    // editFormState.data.isKeepAlive = editFormState.data.otherConfig.isKeepAlive
  } else {
    editFormRef.value.getRef().resetFields()
    editFormState.data = {
      id: 0,
      menuName: '',
      menuPath: '',
      menuURI: '',
      menuIcon: '',
      parentId: 0,
      updateTime: '',
      createdTime: '',
      menuType: '1',
      menuRedirect: '',
      isHide: false,
      isKeepAlive: false,
      otherConfig: {
        isHide: false,
        isKeepAlive: false,
        parentMenuName: '',
      },
    }
  }
})

// 根据菜单类型来动态展示 重定向菜单 item
watch(
  () => editFormState.data.menuType,
  val => {
    const findRes = editFormState.formItemList.find(
      (item: FormItem) => item.prop === 'menuRedirect'
    )
    if (!findRes) return

    if (['1', '2'].includes(val)) findRes.isShow = true
    else findRes.isShow = false
  },
  {
    deep: true,
  }
)

defineExpose({ editDrawerStatus })
</script>

<style lang="scss" scoped></style>
