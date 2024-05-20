<template>
  <div class="personal layout-pd">
    <el-row>
      <!-- 个人信息 -->
      <el-col
        :xs="24"
        :sm="16"
      >
        <el-card
          shadow="hover"
          header="个人信息"
        >
          <!-- 暂未用上 -->
          <div
            class="user-info-skeleton-container flex-sb-c"
            v-if="loading"
          >
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

          <div
            class="personal-user"
            v-else
          >
            <div class="personal-user-left">
              <el-avatar
                pseudo-c-p
                alt="用户头像"
                shape="square"
                :size="130"
                :src="userInfos.userAvatar || defaultAvatar"
                @click="handleShowChangeAvatarDialog"
              />
            </div>
            <div class="personal-user-right">
              <el-row>
                <el-col
                  :span="24"
                  class="personal-title mb18"
                >
                  {{ currentTime }}，
                  {{ userInfos.nickName || userInfos.userName }}
                  <!-- ，生活变的再糟糕，也不妨碍我变得更好！ -->
                </el-col>

                <!-- <el-tag
                  ml5
                  size="small"
                  :key="role.id"
                  v-for="role of userInfos.roles"
                >
                  {{ role.roleName }}
                </el-tag> -->

                <el-col
                  :span="24"
                  :key="i"
                  v-for="(itemRow, i) of personalInfoItemMapping"
                >
                  <el-row>
                    <el-col
                      :xs="24"
                      :sm="8"
                      :key="i + j"
                      class="personal-item mb6"
                      v-for="(item, j) of itemRow"
                    >
                      <div class="personal-item-label">{{ item.label }}：</div>
                      <div class="personal-item-value">
                        <span v-html="item.value()" />
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
      <el-col
        :xs="24"
        :sm="8"
        class="pl15 personal-info"
      >
        <el-card shadow="hover">
          <template #header>
            <span>消息通知</span>
            <span class="personal-info-more">更多</span>
          </template>
          <div class="personal-info-box"></div>
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
        <el-card
          shadow="hover"
          class="mt15 personal-edit"
          header="更新信息"
        >
          <div class="personal-edit-title">基本信息</div>
          <!-- 表单信息 -->
          <el-skeleton
            :loading="loading"
            animated
          >
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
                v-model="state.userInfoForm"
                :formItems="state.userInfoFormItems"
              >
                <template #updata>
                  <el-button
                    type="primary"
                    @click="handleUpdatePersonalInfo"
                  >
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
                  @click="handleShowChangePasswordDialog"
                >
                  立即修改
                </el-button>
              </div>
            </div>
          </div>
          <!-- <div class="personal-edit-safe-box">
            <div class="personal-edit-safe-item">
              <div class="personal-edit-safe-item-left">
                <div class="personal-edit-safe-item-left-label">密保手机</div>
                <div class="personal-edit-safe-item-left-value">已绑定手机：132****4108</div>
              </div>
              <div class="personal-edit-safe-item-right">
                <el-button
                  text
                  type="primary"
                >
                  立即修改
                </el-button>
              </div>
            </div>
          </div>
          <div class="personal-edit-safe-box">
            <div class="personal-edit-safe-item">
              <div class="personal-edit-safe-item-left">
                <div class="personal-edit-safe-item-left-label">密保问题</div>
                <div class="personal-edit-safe-item-left-value">已设置密保问题，账号安全大幅度提升</div>
              </div>
              <div class="personal-edit-safe-item-right">
                <el-button
                  text
                  type="primary"
                >
                  立即设置
                </el-button>
              </div>
            </div>
          </div>
          <div class="personal-edit-safe-box">
            <div class="personal-edit-safe-item">
              <div class="personal-edit-safe-item-left">
                <div class="personal-edit-safe-item-left-label">绑定QQ</div>
                <div class="personal-edit-safe-item-left-value">已绑定QQ：110****566</div>
              </div>
              <div class="personal-edit-safe-item-right">
                <el-button
                  text
                  type="primary"
                >
                  立即设置
                </el-button>
              </div>
            </div>
          </div> -->
        </el-card>
      </el-col>
    </el-row>

    <ChangePasswordDialog ref="changePasswordDialogRef" />

    <UploadAvatarDialog ref="uploadAvatarDialogRef" />
  </div>
</template>

<script setup lang="ts" name="personal">
import { ref, reactive, computed, defineAsyncComponent } from 'vue';
import { formatAxis } from '@/utils/formatTime';
import { useUserInfo } from '@/stores/userInfo';
import { Local } from '@/utils/storage';
import { FormItem } from '@/components/Form';
import { ClientInfo } from '@/views/login';
import { AddEditUserType } from '../user/user';

const { userInfos } = useUserInfo();

const defaultAvatar =
  'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png';

//
//
const personalInfoItemMapping = [
  [
    { label: '用户名', value: () => userInfos.userName || '--' },
    { label: '昵称', value: () => userInfos.nickName || userInfos.userName },
    {
      label: '身份',
      value: () => userInfos.roles.map(role => role.roleName),
    },
  ],
  [
    {
      label: '位置信息',
      value: () =>
        `${locationInfo.country}${locationInfo.province}${locationInfo.city}`,
    },
    { label: '登录IP', value: () => ip },
    { label: '登录时间', value: () => loginTime || '--' },
  ],
  [
    { label: '设备信息', value: () => clientInfo.deviceTypes },
    { label: '操作系统', value: () => clientInfo.os },
    {
      label: '浏览器信息',
      value: () => `${clientInfo.browser} ${clientInfo.version}`,
    },
  ],
];

// 登录客户端信息
const clientInfo: ClientInfo = Local.get('clientInfo');
const ip = Local.get('ip');
const locationInfo = Local.get('locationInfo');
const loginTime = Local.get('loginTime');

// 定义变量内容
const state = reactive({
  userInfoForm: <AddEditUserType>{
    nickName: '',
    roleIds: [],
    state: 0,
    email: '',
    userEnabled: 1,
  },
  userInfoFormItems: ref<FormItem<AddEditUserType>[]>([
    {
      xs: 24,
      sm: 12,
      md: 8,
      lg: 6,
      xl: 4,
      type: 'input',
      label: '用户昵称',
      prop: 'nickName',
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
      prop: 'roleIds',
      multiple: true,
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
      prop: 'userEnabled',
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
});

const loading = ref<boolean>(false);

// 当前时间提示语
const currentTime = computed(() => {
  return formatAxis(new Date());
});

// 处理更新个人信息操作
const handleUpdatePersonalInfo = () => {
  saveEditUserInfo();
};
// 更新用户个人信息
const saveEditUserInfo = async () => {};

// 更新用户头像
const UploadAvatarDialog = defineAsyncComponent(
  () => import('./components/UploadAvatarDialog.vue')
);
const uploadAvatarDialogRef = ref<RefType>();
const handleShowChangeAvatarDialog = () => {
  uploadAvatarDialogRef.value.dialogState = true;
};

// 修改密码
const ChangePasswordDialog = defineAsyncComponent(
  () => import('./components/ChangePasswordDialog.vue')
);
const changePasswordDialogRef = ref<RefType>();
const handleShowChangePasswordDialog = () => {
  changePasswordDialogRef.value.dialogState = true;
};
</script>

<style scoped lang="scss">
@import '../../theme/mixins/index.scss';

.avatar-uploader .avatar {
  width: 130px;
  height: 130px;
  display: block;
}

.personal :deep(.avatar-uploader-icon) {
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
</style>
{'}'}{'>'}{'}'}
