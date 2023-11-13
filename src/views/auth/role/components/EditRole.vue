<template>
  <Peng-Drawer
    :title="'修改角色信息'"
    :direction="deviceClientType === 'pc' ? 'rtl' : 'btt'"
    :size="deviceClientType === 'pc' ? '400px' : '50%'"
    v-model="editDrawerStatus"
  >
    <template #main>
      <Peng-Form
        ref="editFormRef"
        size="default"
        labelP="top"
        :labelW="100"
        :formData="editFormState.data"
        :formItemList="editFormState.formItemList"
      >
        <!-- 菜单树形 -->
        <template #menuTree>
          <div class="flex-c-c w100">
            <el-input
              style="flex: 1"
              v-model="filterStr"
              placeholder="菜单过滤"
            />
          </div>

          <!-- <el-scrollbar max-height="350px" style="margin: 5px 0 0 0"> -->
          <el-tree
            ref="treeRef"
            node-key="id"
            show-checkbox
            :default-expand-all="false"
            :data="props.menus"
            :default-checked-keys="editFormState.data.menus"
            :filter-node-method="filterNode"
            :props="{ children: 'children', label: 'menuName' }"
            @check="handleMenuTreeCheck"
          >
            <template #default="{ node, data }">
              <span class="flex-c-c">
                <Peng-Icon :name="data.menuIcon" />
                <span class="ml5">{{ node.label }}</span>
              </span>
            </template>
          </el-tree>
          <!-- </el-scrollbar> -->
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
import { ref, reactive, inject, PropType, watch } from 'vue'
import { useRoleApi } from '@/api/role/index'
import { ElMessage } from 'element-plus'
import { useUserAuthList } from '@/stores/userAuthList'
import { storeToRefs } from 'pinia'

const { updateRole } = useRoleApi()

const userAuthListStore = useUserAuthList()
const userAuthList = storeToRefs(userAuthListStore)

const deviceClientType = inject('deviceClientType')

interface EditRowProps {
  editRow: Menu
  menus: Menu[]
}

const props = defineProps<EditRowProps>()
const emits = defineEmits(['updateList'])

// 抽屉状态
const editDrawerStatus = ref<boolean>(false)

const editFormState = reactive({
  data: ref<Role>({
    id: 0,
    roleName: '',
    roleDesc: '',
    menus: [],
    operationPermissions: [],
    updateTime: '',
    createdTime: '',
  }),
  formItemList: ref<FormItem[]>([
    {
      type: 'input',
      label: '角色名称',
      prop: 'roleName',
      placeholder: '请输入角色名称',
      rules: [{ required: true, trigger: 'blur' }],
    },
    {
      type: 'slot',
      slotName: 'menuTree',
      label: '持有菜单',
      prop: 'menus',
      placeholder: '请选择角色拥有菜单',
      required: true,
    },
    {
      type: 'checkbox',
      label: '持有操作权限',
      prop: 'operationPermissions',
      options: [],
      required: true,
    },
    {
      type: 'textarea',
      label: '角色描述',
      prop: 'roleDesc',
      placeholder: '请输入角色描述',
      rules: [{ required: true, trigger: 'blur' }],
    },
  ]),
})

// 树形过滤
const filterStr = ref('')

const treeRef = ref<RefType>()
// treeRef.value!.filter(val)
watch(filterStr, val => {
  treeRef.value.filter(val)
})

const filterNode = (value: string, data: { [key: string]: any }) => {
  if (!value) return true
  return data.menuName.includes(value)
}

const handleMenuTreeCheck = (menu: Menu, treeInfo: any) => {
  editFormState.data.menus = treeInfo.checkedKeys
}

const editFormRef = ref<RefType>(null)
// 处理保存修改
const handleSaveEdit = async () => {
  const valdateRes = await editFormRef.value
    .getRef()
    .validate()
    .catch(() => false)
  if (!valdateRes) return
  const editRes = await saveEditRole()
  if (!editRes) return
  editDrawerStatus.value = false
  emits('updateList')
}

// 保存修改数据
const saveEditRole = async (): Promise<boolean> => {
  try {
    const {
      id,
      roleName,
      roleDesc,
      menus,
      operationPermissions,
      updateTime,
      createdTime,
    } = editFormState.data
    const params = {
      roleName,
      roleDesc,
      menus,
      operationPermissions,
    }
    const { data: res } = await updateRole(id, params)
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

watch(
  () => props.editRow,
  val => (editFormState.data = JSON.parse(JSON.stringify(val))),
  { deep: true }
)

watch(
  editDrawerStatus,
  async val => {
    // 当打开编辑抽屉时 为选择操作权限标识和菜单的下拉选择赋值数据
    if (val) {
      await userAuthListStore.getAllMenuList()
      await userAuthListStore.getAllAuthPermissionList()
      editFormState.formItemList[1].options = userAuthList.allMenuOptions.value
      editFormState.formItemList[2].options =
        userAuthList.allAuthPermissionOptions.value
    } else treeRef.value.setCheckedKeys([], false)
  },
  { deep: true }
)

defineExpose({ editDrawerStatus })
</script>

<style lang="scss" scoped></style>
