<template>
  <div class="personal layout-pd">
    <el-row>
      <!-- 个人信息 -->
      <el-col :xs="24" :sm="16">
        <el-card shadow="hover" header="个人信息">
          <!-- 暂未用上 -->
          <div class="user-info-skeleton-container flex-sb-c" v-if="loading">
            <el-skeleton
              style="
                --el-skeleton-circle-size: 140px;
                width: auto;
                margin-right: 10px;
              "
            >
              <template #template>
                <el-skeleton-item variant="circle" />
              </template>
            </el-skeleton>
            <el-skeleton />
          </div>

          <div class="personal-user" v-else>
            <div class="personal-user-left">
              <el-upload
                class="avatar-uploader"
                :show-file-list="false"
                :before-upload="beforeAvatarUpload"
                :http-request="handleUploadUserAvatar"
                :on-success="handleAvatarSuccess"
              >
                <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                <el-icon v-else class="avatar-uploader-icon">
                  <Plus />
                </el-icon>
              </el-upload>
              <!-- <el-upload
                class="h100 personal-user-left-upload"
                action="https://jsonplaceholder.typicode.com/posts/"
                multiple
                :limit="1"
              >
                <img src="https://img2.baidu.com/it/u=1978192862,2048448374&fm=253&fmt=auto&app=138&f=JPEG?w=504&h=500" />
              </el-upload> -->
            </div>
            <div class="personal-user-right">
              <el-row>
                <el-col :span="24" class="personal-title mb18">
                  {{ currentTime }}，
                  {{ userInfoStores.userInfos.userName }}
                  ，生活变的再糟糕，也不妨碍我变得更好！
                </el-col>
                <el-col :span="24">
                  <el-row>
                    <el-col :xs="24" :sm="8" class="personal-item mb6">
                      <div class="personal-item-label">昵称：</div>
                      <div class="personal-item-value">
                        {{ userInfoStores.userInfos.userName }}
                      </div>
                    </el-col>
                    <el-col :xs="24" :sm="16" class="personal-item mb6">
                      <div class="personal-item-label">身份：</div>
                      <div class="personal-item-value">
                        {{ userInfoStores.userInfos.roleName }}
                      </div>
                    </el-col>
                  </el-row>
                </el-col>
                <el-col :span="24">
                  <el-row>
                    <el-col :xs="24" :sm="8" class="personal-item mb6">
                      <div class="personal-item-label">登录IP：</div>
                      <div class="personal-item-value">{{ clientInfo.ip }}</div>
                    </el-col>
                    <el-col :xs="24" :sm="16" class="personal-item mb6">
                      <div class="personal-item-label">登录时间：</div>
                      <div class="personal-item-value">
                        {{ clientInfo.loginTime }}
                      </div>
                    </el-col>
                  </el-row>
                </el-col>
                <el-col :span="24">
                  <el-row>
                    <el-col :xs="24" :sm="8" class="personal-item mb6">
                      <div class="personal-item-label">浏览器信息：</div>
                      <div class="personal-item-value">
                        {{
                          `${clientInfo.brower.name} ${clientInfo.brower.version}`
                        }}
                      </div>
                    </el-col>
                    <el-col :xs="24" :sm="16" class="personal-item mb6">
                      <div class="personal-item-label">操作系统：</div>
                      <div class="personal-item-value">
                        {{ clientInfo.os }}
                      </div>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- 消息通知 -->
      <el-col :xs="24" :sm="8" class="pl15 personal-info">
        <el-card shadow="hover">
          <template #header>
            <span>消息通知</span>
            <span class="personal-info-more">更多</span>
          </template>
          <div class="personal-info-box">
            <ul class="personal-info-ul">
              <li
                v-for="(v, k) in state.newsInfoList"
                :key="k"
                class="personal-info-li"
              >
                <a
                  :href="v.link"
                  target="_block"
                  class="personal-info-li-title"
                  >{{ v.title }}</a
                >
              </li>
            </ul>
          </div>
        </el-card>
      </el-col>

      <!-- 营销推荐 -->
      <!-- <el-col :span="24">
        <el-card shadow="hover" class="mt15" header="营销推荐">
          <el-row :gutter="15" class="personal-recommend-row">
            <el-col
              :sm="6"
              v-for="(v, k) in state.recommendList"
              :key="k"
              class="personal-recommend-col"
            >
              <div
                class="personal-recommend"
                :style="{ 'background-color': v.bg }"
              >
                <SvgIcon
                  :name="v.icon"
                  :size="70"
                  :style="{ color: v.iconColor }"
                />
                <div class="personal-recommend-auto">
                  <div>{{ v.title }}</div>
                  <div class="personal-recommend-msg">{{ v.msg }}</div>
                </div>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </el-col> -->

      <!-- 更新信息 -->
      <el-col :span="24">
        <el-card shadow="hover" class="mt15 personal-edit" header="更新信息">
          <div class="personal-edit-title">基本信息</div>
          <!-- 表单信息 -->
          <el-skeleton :loading="loading" animated>
            <template #template>
              <el-skeleton-item
                variant="p"
                style="height: 35px; margin: 15px 0 5px 0"
              />

              <el-skeleton-item
                variant="p"
                style="height: 35px; margin-bottom: 15px"
              />

              <el-skeleton-item
                variant="button"
                style="width: 135px; margin-left: 5%"
              />
            </template>

            <template #default>
              <Peng-Form
                class="mt35 mb35"
                size="default"
                :gutter="35"
                :labelW="80"
                :labelP="'right'"
                :formData="state.userInfoForm"
                :formItemList="state.userInfoFormItems"
              >
                <template #updata>
                  <el-button type="primary" @click="handleUpdatePersonalInfo">
                    <el-icon>
                      <ele-Position />
                    </el-icon>
                    更新个人信息
                  </el-button>
                </template>
              </Peng-Form>
            </template>
          </el-skeleton>

          <div class="personal-edit-title mb15">账号安全</div>
          <div class="personal-edit-safe-box">
            <div class="personal-edit-safe-item">
              <div class="personal-edit-safe-item-left">
                <div class="personal-edit-safe-item-left-label">账户密码</div>
                <div class="personal-edit-safe-item-left-value">
                  当前密码强度：强
                </div>
              </div>
              <div class="personal-edit-safe-item-right">
                <el-button
                  text
                  type="primary"
                  @click="changePwdState.dialogState = true"
                  >立即修改</el-button
                >
              </div>
            </div>
          </div>
          <div class="personal-edit-safe-box">
            <div class="personal-edit-safe-item">
              <div class="personal-edit-safe-item-left">
                <div class="personal-edit-safe-item-left-label">密保手机</div>
                <div class="personal-edit-safe-item-left-value">
                  已绑定手机：132****4108
                </div>
              </div>
              <div class="personal-edit-safe-item-right">
                <el-button text type="primary">立即修改</el-button>
              </div>
            </div>
          </div>
          <div class="personal-edit-safe-box">
            <div class="personal-edit-safe-item">
              <div class="personal-edit-safe-item-left">
                <div class="personal-edit-safe-item-left-label">密保问题</div>
                <div class="personal-edit-safe-item-left-value">
                  已设置密保问题，账号安全大幅度提升
                </div>
              </div>
              <div class="personal-edit-safe-item-right">
                <el-button text type="primary">立即设置</el-button>
              </div>
            </div>
          </div>
          <div class="personal-edit-safe-box">
            <div class="personal-edit-safe-item">
              <div class="personal-edit-safe-item-left">
                <div class="personal-edit-safe-item-left-label">绑定QQ</div>
                <div class="personal-edit-safe-item-left-value">
                  已绑定QQ：110****566
                </div>
              </div>
              <div class="personal-edit-safe-item-right">
                <el-button text type="primary">立即设置</el-button>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <Peng-Dialog
      title="修改密码"
      width="40%"
      v-model="changePwdState.dialogState"
    >
      <template #main>
        <Peng-Form
          labelW="150px"
          ref="changePwdFormRef"
          :formData="changePwdState.dataForm"
          :formItemList="changePwdState.formItems"
        >
        </Peng-Form>
      </template>

      <!-- 操作 -->
      <template #footer>
        <el-button size="default" @click="changePwdState.dialogState = false">
          取 消
        </el-button>
        <el-button type="primary" size="default" @click="handleChangePwd">
          确 认
        </el-button>
      </template>
    </Peng-Dialog>
  </div>
</template>

<script setup lang="ts" name="personal">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { formatAxis } from '@/utils/formatTime'
import { newsInfoList, recommendList } from './mock'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage, UploadProps } from 'element-plus'
import { useUserApi } from '@/api/user'
import { useUserInfo } from '@/stores/userInfo'
import { Session } from '/@/utils/storage'
import { useUserAuthList } from '@/stores/userAuthList'
import { storeToRefs } from 'pinia'
import { AxiosResponse } from 'axios'

const userAuthListStore = useUserAuthList()
const userAuthList = storeToRefs(userAuthListStore)

const { uploadUserAvatar, updateUserInfo, changeUserPwd } = useUserApi()

const userInfoStores = useUserInfo()

// 登录客户端信息
const clientInfo = Session.get('clientInfo')

// 定义变量内容
const state = reactive<PersonalState>({
  newsInfoList,
  recommendList,
  personalForm: {
    name: '',
    email: '',
    autograph: '',
    occupation: '',
    phone: '',
    sex: '',
  },
  userInfoForm: {
    id: 0,
    roleId: 0,
    userName: '',
    state: 0,
    email: '',
    unsealTime: '',
    updateTime: '',
    createdTime: '',
  },
  userInfoFormItems: ref<FormItem[]>([
    {
      xs: 24,
      sm: 12,
      md: 8,
      lg: 6,
      xl: 4,
      type: 'input',
      label: '用户名',
      prop: 'userName',
      placeholder: '请输入昵称',
    },
    {
      xs: 24,
      sm: 12,
      md: 8,
      lg: 6,
      xl: 4,
      type: 'select',
      label: '角色',
      prop: 'roleId',
      options: [],
      placeholder: '请选择角色',
    },
    {
      xs: 24,
      sm: 12,
      md: 8,
      lg: 6,
      xl: 4,
      type: 'input',
      label: '邮箱',
      prop: 'email',
      placeholder: '请输入邮箱',
    },
    {
      xs: 24,
      sm: 12,
      md: 8,
      lg: 6,
      xl: 4,
      type: 'switch',
      label: '用户状态',
      prop: 'state',
      tValue: 1,
      fValue: 0,
      tText: '启用',
      fText: '锁定',
      isInline: true,
    },
    {
      xs: 24,
      sm: 24,
      md: 24,
      lg: 24,
      xl: 24,
      type: 'slot',
      slotName: 'updata',
      prop: '',
      label: '',
    },
  ]),
})

const loading = ref<boolean>(false)

const imageUrl = ref('')
// 上传用户头像
const handleUploadUserAvatar = async (fileInfo: any) => {
  try {
    const file = new FormData()
    file.append('file', fileInfo.file)
    const { data: res } = await uploadUserAvatar(
      userInfoStores.userInfos.id,
      file
    )
    const { code, data, message, img } = res
    if (code !== 200 || message !== 'Success') return ElMessage.error(data)
    ElMessage.success(data)
    userInfoStores.userInfos.avatarUrl = img
    Session.set(
      'userInfo',
      JSON.parse(JSON.stringify(userInfoStores.userInfos))
    )
  } catch (e) {
    throw e
  }
}
// 限制 上传文件
const beforeAvatarUpload = () => {}
const handleAvatarSuccess: UploadProps['onSuccess'] = (
  response,
  uploadFile
) => {
  imageUrl.value = URL.createObjectURL(uploadFile.raw!)
}
// 当前时间提示语
const currentTime = computed(() => {
  return formatAxis(new Date())
})

// 处理更新个人信息操作
const handleUpdatePersonalInfo = () => {
  saveEditUserInfo()
}
// 更新用户个人信息
const saveEditUserInfo = async () => {
  try {
    const {
      id,
      roleId,
      userName,
      state: userState,
      email,
      // unsealTime,
      // updateTime,
      // createdTime,
    } = state.userInfoForm
    const params = {
      roleId,
      userName,
      state: userState,
      email,
    }

    const { data: res }: AxiosResponse = await updateUserInfo(id, params)
    const { data, code, message } = res
    if (code !== 200 || message !== 'Success') return ElMessage.error(data)
    ElMessage.success(data)
  } catch (e) {
    ElMessage.error('更新失败')
    console.log(e)
  }
}

const changePwdState = reactive({
  dialogState: ref<boolean>(false),
  dataForm: {
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  },
  formItems: ref<FormItem[]>([
    {
      span: 20,
      type: 'pwd',
      label: '旧密码',
      prop: 'oldPassword',
      placeholder: '请输入旧密码',
      rules: [{ required: true, trigger: 'blur', min: 6, max: 15 }],
    },
    {
      span: 20,
      type: 'pwd',
      label: '新密码',
      prop: 'newPassword',
      placeholder: '请输入输入新密码',
      rules: [{ required: true, trigger: 'blur', min: 6, max: 15 }],
    },
    {
      span: 20,
      type: 'pwd',
      label: '确认密码',
      prop: 'confirmNewPassword',
      placeholder: '请输入再一次输入新密码',
      rules: [{ required: true, trigger: 'blur', min: 6, max: 15 }],
    },
    {
      span: 20,
      type: 'slot',
      label: '',
      prop: '',
      slotName: 'updataPwd',
    },
  ]),
})
const changePwdFormRef = ref<any>(null)
// 处理修改密码
const handleChangePwd = async () => {
  const validRes = await changePwdFormRef.value
    .getRef()
    .validate()
    .catch(() => false)
  if (!validRes) return
  const changeRes = await changePwd()
  if (!changeRes) return
  changePwdState.dialogState = false

  setTimeout(() => {
    userInfoStores.userLogout()
  }, 2000)
}
watch(
  () => changePwdState.dialogState,
  (val) => {
    if (val) return
    changePwdFormRef.value.getRef().resetFields()
    changePwdState.dataForm = {
      oldPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    }
  }
)
const changePwd = async (): Promise<boolean> => {
  try {
    const params = {
      ...changePwdState.dataForm,
      userName: userInfoStores.userInfos.userName,
    }
    const { data: res } = await changeUserPwd(
      userInfoStores.userInfos.id,
      params
    )
    const { code, data, message } = res
    if (code !== 200 || message !== 'Success') {
      ElMessage.error(data)
      return false
    }
    ElMessage.success(`${data}, 2 秒后将自动退出登录!`)
    return true
  } catch (e) {
    console.log(e)
    return false
  }
}

onMounted(async () => {
  loading.value = true
  // 获取角色下拉列表
  await userAuthListStore.getAllRoleList()
  state.userInfoFormItems[1].options = userAuthList.allRoleOptions.value

  imageUrl.value = userInfoStores.userInfos.avatarUrl || ''

  state.userInfoForm.id = userInfoStores.userInfos.id
  state.userInfoForm.roleId = userInfoStores.userInfos.roleId
  state.userInfoForm.userName = userInfoStores.userInfos.userName
  state.userInfoForm.email = userInfoStores.userInfos.email
  state.userInfoForm.state = userInfoStores.userInfos.state
  loading.value = false
})
</script>

<style scoped lang="scss">
@import '../../theme/mixins/index.scss';

.avatar-uploader .avatar {
  width: 130px;
  height: 130px;
  display: block;
}

.personal ::v-deep .avatar-uploader-icon {
  width: 130px;
  height: 130px;
}

.personal {
  .personal-user {
    height: 130px;
    display: flex;
    align-items: center;

    .personal-user-left {
      width: 130px;
      height: 130px;
      border-radius: 3px;

      :deep(.el-upload) {
        height: 100%;
      }

      .personal-user-left-upload {
        img {
          width: 100%;
          height: 100%;
          border-radius: 3px;
        }

        &:hover {
          img {
            animation: logoAnimation 0.3s ease-in-out;
          }
        }
      }
    }

    .personal-user-right {
      flex: 1;
      padding: 0 15px;

      .personal-title {
        font-size: 18px;
        @include text-ellipsis(1);
      }

      .personal-item {
        display: flex;
        align-items: center;
        font-size: 13px;

        .personal-item-label {
          color: var(--el-text-color-secondary);
          @include text-ellipsis(1);
        }

        .personal-item-value {
          @include text-ellipsis(1);
        }
      }
    }
  }

  .personal-info {
    .personal-info-more {
      float: right;
      color: var(--el-text-color-secondary);
      font-size: 13px;

      &:hover {
        color: var(--el-color-primary);
        cursor: pointer;
      }
    }

    .personal-info-box {
      height: 130px;
      overflow: hidden;

      .personal-info-ul {
        list-style: none;

        .personal-info-li {
          font-size: 13px;
          padding-bottom: 10px;

          .personal-info-li-title {
            display: inline-block;
            @include text-ellipsis(1);
            color: var(--el-text-color-secondary);
            text-decoration: none;
          }

          & a:hover {
            color: var(--el-color-primary);
            cursor: pointer;
          }
        }
      }
    }
  }

  .personal-recommend-row {
    .personal-recommend-col {
      .personal-recommend {
        position: relative;
        height: 100px;
        border-radius: 3px;
        overflow: hidden;
        cursor: pointer;

        &:hover {
          i {
            right: 0px !important;
            bottom: 0px !important;
            transition: all ease 0.3s;
          }
        }

        i {
          position: absolute;
          right: -10px;
          bottom: -10px;
          font-size: 70px;
          transform: rotate(-30deg);
          transition: all ease 0.3s;
        }

        .personal-recommend-auto {
          padding: 15px;
          position: absolute;
          left: 0;
          top: 5%;
          color: var(--next-color-white);

          .personal-recommend-msg {
            font-size: 12px;
            margin-top: 10px;
          }
        }
      }
    }
  }

  .personal-edit {
    .personal-edit-title {
      position: relative;
      padding-left: 10px;
      color: var(--el-text-color-regular);

      &::after {
        content: '';
        width: 2px;
        height: 10px;
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        background: var(--el-color-primary);
      }
    }

    .personal-edit-safe-box {
      border-bottom: 1px solid var(--el-border-color-light, #ebeef5);
      padding: 15px 0;

      .personal-edit-safe-item {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .personal-edit-safe-item-left {
          flex: 1;
          overflow: hidden;

          .personal-edit-safe-item-left-label {
            color: var(--el-text-color-regular);
            margin-bottom: 5px;
          }

          .personal-edit-safe-item-left-value {
            color: var(--el-text-color-secondary);
            @include text-ellipsis(1);
            margin-right: 15px;
          }
        }
      }

      &:last-of-type {
        padding-bottom: 0;
        border-bottom: none;
      }
    }
  }
}
</style>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}

.user-info-skeleton-container {
  /* width: auto; */
}
</style>
