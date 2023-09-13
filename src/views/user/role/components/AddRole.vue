<template>
  <Peng-Dialog title="添加角色" width="50%" v-model="addRoleDialogStatus">
    <template #main>
      <!-- labelP="top" -->
      <Peng-Form
        ref="addRoleFormRef"
        size="default"
        :labelW="'120px'"
        :formData="addRoleState.data"
        :formItemList="addRoleState.formItemList"
      >
        <!-- 菜单树形 -->
        <template #menuTree>
          <div class="flex-c-c w100">
            <el-input
              style="flex: 1"
              v-model="filterStr"
              placeholder="菜单过滤"
            />

            <div style="flex: 1" />

            <el-button
              size="small"
              type="primary"
              class="ml20"
              @click="handleTreeBtnSelect(menusId)"
            >
              全选
            </el-button>
            <el-button
              size="small"
              type="info"
              @click="handleTreeBtnSelect([])"
            >
              重置
            </el-button>
            <el-button size="small" type="success" @click="handleIsExpand">
              展开/折叠
            </el-button>
          </div>

          <el-scrollbar max-height="230px" style="margin: 5px 0 0 0">
            <el-tree
              ref="treeRef"
              node-key="id"
              show-checkbox
              :default-expand-all="allExpand"
              :data="props.menus"
              :default-checked-keys="[]"
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
          </el-scrollbar>
        </template>

        <!-- 权限标识 -->
        <template #operPermissions>
          <el-checkbox-group v-model="addRoleState.data.operationPermissions">
            <el-checkbox
              :key="item.value"
              :label="item.value"
              v-for="item in userAuthList.allAuthPermissionOptions.value"
            >
              {{ item.label }}
            </el-checkbox>
          </el-checkbox-group>
          {{ addRoleState.data.operationPermissions }}
        </template>
      </Peng-Form>
    </template>

    <template #footer>
      <el-button size="small" @click="addRoleDialogStatus = false">
        取消
      </el-button>
      <el-button type="primary" size="small" @click="handleAdd">确认</el-button>
    </template>
  </Peng-Dialog>
</template>

<script lang="ts" setup>
import { ref, reactive, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { ElMessage, ElTree } from 'element-plus'
import { useRoleApi } from '@/api/role/index'
import { useUserAuthList } from '@/stores/userAuthList'

interface AddDialogProps {
  menus: Menu[]
}

const props = defineProps<AddDialogProps>()

const emits = defineEmits(['updateList'])

const userAuthListStore = useUserAuthList()
const userAuthList = storeToRefs(userAuthListStore)

const { addRole } = useRoleApi()

const menusId: number[] = []

// 获取全部的菜单ID
const getMenusID = (data: Menu[]) => {
  data.forEach((item: Menu) => {
    menusId.push(item.id)
    if (item.children) getMenusID(item.children)
  })
}

getMenusID(props.menus)

const addRoleDialogStatus = ref<boolean>(false)

const addRoleState = reactive({
  data: ref<Role>({
    id: 0,
    roleName: '',
    roleDesc: '',
    menus: [],
    operationPermissions: [1],
    updateTime: '',
    createdTime: '',
  }),
  formItemList: ref<FormItem[]>([
    {
      xs: 24,
      span: 18,
      type: 'input',
      label: '角色名称',
      prop: 'roleName',
      placeholder: '请输入角色名称',
      rules: [{ required: true, trigger: 'blur' }],
    },
    {
      xs: 24,
      span: 24,
      type: 'slot',
      slotName: 'menuTree',
      label: '持有菜单',
      prop: 'menus',
      placeholder: '请选择角色拥有菜单',
      required: true,
    },
    {
      xs: 24,
      span: 24,
      type: 'checkbox',
      label: '持有操作权限',
      prop: 'operationPermissions',
      options: [],
      required: true,
    },
    {
      xs: 24,
      span: 24,
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
  addRoleState.data.menus = treeInfo.checkedKeys
}

const allExpand = ref(false)

// 菜单树形 全选或重置
const handleTreeBtnSelect = (value: any[]) => {
  filterStr.value = ''
  treeRef.value.setCheckedKeys(value, false)
  addRoleState.data.menus = value
}

const handleIsExpand = () => {}

const addRoleFormRef = ref<RefType>(null)
// 处理添加操作
const handleAdd = async () => {
  if (!addRoleState.data.menus.length) return
  if (!addRoleState.data.operationPermissions.length) return

  const validRes = await addRoleFormRef.value
    .getRef()
    .validate()
    .catch(() => false)
  if (!validRes) return
  const addRes = await addNewRole()
  if (!addRes) return
  addRoleDialogStatus.value = false
  emits('updateList')
}

// 添加角色
const addNewRole = async (): Promise<boolean> => {
  try {
    const {
      roleName,
      roleDesc,
      menus,
      operationPermissions,
      updateTime,
      createdTime,
    } = addRoleState.data
    const params = { roleName, roleDesc, menus, operationPermissions }
    const { data: res } = await addRole(params)
    const { code, data, message } = res
    if (code !== 200 || message !== 'Success') {
      ElMessage.error(data)
      return false
    } else {
      ElMessage.success(data)
      return true
    }
  } catch (e) {
    console.log(e)
    return false
  }
}

watch(addRoleDialogStatus, async val => {
  if (val) {
    await userAuthListStore.getAllMenuList()
    await userAuthListStore.getAllAuthPermissionList()
    addRoleState.formItemList[1].options = userAuthList.allMenuOptions.value
    addRoleState.formItemList[2].options =
      userAuthList.allAuthPermissionOptions.value
  } else {
    addRoleFormRef.value.getRef().resetFields()

    addRoleState.data = {
      id: 0,
      roleName: '',
      roleDesc: '',
      menus: [],
      operationPermissions: [],
      updateTime: '',
      createdTime: '',
    }
  }
})

defineExpose({ addRoleDialogStatus })
</script>

<style lang="scss" scoped></style>
