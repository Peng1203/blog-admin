<template>
  <el-form
    size="large"
    ref="loginFormRef"
    class="login-content-form"
    :model="loginState.loginForm"
    :rules="loginState.loginFormRules"
  >
    <el-form-item
      prop="userName"
      class="login-animation1"
    >
      <el-input
        text
        clearable
        autocomplete="off"
        placeholder="请输入用户名"
        v-model.trim="loginState.loginForm.userName"
      >
        <template #prefix>
          <el-icon class="el-input__icon"><ele-User /></el-icon>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item
      prop="password"
      class="login-animation2"
    >
      <el-input
        autocomplete="off"
        placeholder="请输入密码"
        v-model.trim="loginState.loginForm.password"
        :type="loginState.isShowPassword ? 'text' : 'password'"
      >
        <template #prefix>
          <el-icon class="el-input__icon"><ele-Unlock /></el-icon>
        </template>
        <template #suffix>
          <i
            class="iconfont el-input__icon login-content-password"
            :class="loginState.isShowPassword ? 'icon-yincangmima' : 'icon-xianshimima'"
            @click="loginState.isShowPassword = !loginState.isShowPassword"
          ></i>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item
      prop="captcha"
      class="login-animation3"
    >
      <el-col :span="15">
        <el-input
          text
          clearable
          maxlength="4"
          autocomplete="off"
          placeholder="验证码 (不区分大小写)"
          v-model.trim="loginState.loginForm.captcha"
          @keyup.enter="handleUserLogin"
        >
          <template #prefix>
            <el-icon class="el-input__icon"><ele-Position /></el-icon>
          </template>
        </el-input>
      </el-col>
      <el-col :span="1"></el-col>
      <el-col :span="8">
        <div
          h40px
          pseudo-c-p
          v-html="captchaCode"
          @click="handleRefreshCaptcha"
        />
        <!-- <el-button
          v-waves
          class="login-content-code"
        >
          {{ captchaCode }}
        </el-button> -->
      </el-col>
    </el-form-item>
    <el-form-item class="login-animation4">
      <!-- v-waves -->
      <el-button
        round
        type="primary"
        class="login-content-submit"
        :loading="loginState.loading.signIn"
        @click="handleUserLogin"
      >
        <span>登 录</span>
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts" name="loginAccount">
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, ElNotification, FormRules } from 'element-plus';
import { handleUserAuthRouters } from '@/router/handleAuthRouter';
import { Local, Session } from '@/utils/storage';
import { formatAxis } from '@/utils/formatTime';
import { NextLoading } from '@/utils/loading';
import { useLoginApi } from '@/api';
import type { LoginData } from '../';

const { getCaptcha, login } = useLoginApi();

const router = useRouter();

const loginState = reactive({
  isShowPassword: false,
  // 登录表单
  loginForm: {
    // userName: '',
    // password: '',
    // userName: 'Peng',
    // password: '123mzp',
    userName: 'admin',
    password: '123456',
    captcha: '',
  },
  // 登录表单校验规则
  loginFormRules: reactive<FormRules>({
    userName: [
      { required: true, message: '用户名不能为空', trigger: 'blur' },
      { min: 2, max: 6, message: '用户名长度在 2 到 6 位', trigger: 'blur' },
    ],
    password: [
      { required: true, message: '密码不能为空', trigger: 'blur' },
      { min: 6, max: 15, message: '密码长度在 6 到 15 位', trigger: 'blur' },
    ],
    captcha: [
      { required: true, message: '验证码不能为空', trigger: 'blur' },
      { min: 4, max: 4, message: '验证码长度为 4 位', trigger: 'blur' },
    ],
  }),
  loading: {
    signIn: false,
  },
});

onMounted(() => {
  getLoginCaptcha();
});

// 刷新 定时器
const timer = ref<number>(0);
// 刷新验证码
const handleRefreshCaptcha = () => {
  clearTimeout(timer.value);
  // 防抖
  timer.value = setTimeout(() => {
    loginState.loginForm.captcha = '';
    getLoginCaptcha();
  }, 500);
};

// 获取登录验证码
const captchaCode = ref<string>('');
const getLoginCaptcha = async (): Promise<void> => {
  try {
    const { data: res } = await getCaptcha<string>();
    captchaCode.value = res;
  } catch (error) {
    console.log('------', error);
  }
};

// 登录 获取用户信息
const getLoginUserInfo = async (): Promise<any> => {
  try {
    const { data: res } = await login<LoginData>(loginState.loginForm);
    const { code, data, success } = res;
    if (code !== 20000 || !success) return;
    return data;
  } catch (error: any) {
    if (error.code === 40101) handleRefreshCaptcha();
    throw error;
  }
};

const loginFormRef = ref(null) as any;
// 处理登录
const handleUserLogin = async () => {
  try {
    await loginFormRef.value.validate();
    loginState.loading.signIn = true;
    // 调用后端验证码校验接口
    const { user, tokens } = (await getLoginUserInfo()) as LoginData;
    if (!user || !tokens) return;
    Local.set('userInfo', user);
    Local.setRFToken(tokens.refresh_token);
    Session.setACToken(tokens.access_token);

    // 处理登录用户角色的路由表
    const showPageName = await handleUserAuthRouters();
    if (showPageName === '') {
      ElMessage.warning(`当前用户角色没有任何菜单, 请联系管理员!`);
      loginState.loading.signIn = false;
      return;
    }
    router.push({ name: showPageName });
    const signInText = '欢迎回来！';
    ElNotification.success({
      title: loginState.loginForm.userName,
      message: `${currentTime.value}，${signInText}`,
    });
    NextLoading.start();
    loginState.loading.signIn = false;
  } catch (e) {
    loginState.loading.signIn = false;
    throw e;
  }
};
// 时间获取
const currentTime = computed(() => {
  return formatAxis(new Date());
});
</script>

<style scoped lang="scss">
.login-content-form {
  margin-top: 20px;
  // :deep(svg) {
  //   border-radius: 3px;
  // }
  @for $i from 1 through 4 {
    .login-animation#{$i} {
      opacity: 0;
      animation-name: error-num;
      animation-duration: 0.5s;
      animation-fill-mode: forwards;
      animation-delay: calc($i/10) + s;
    }
  }

  .login-content-password {
    display: inline-block;
    width: 20px;
    cursor: pointer;

    &:hover {
      color: #909399;
    }
  }

  .login-content-code {
    width: 100%;
    padding: 0;
    font-weight: bold;
    letter-spacing: 5px;
  }

  .login-content-submit {
    width: 100%;
    letter-spacing: 2px;
    font-weight: 300;
    margin-top: 15px;
  }
}
</style>