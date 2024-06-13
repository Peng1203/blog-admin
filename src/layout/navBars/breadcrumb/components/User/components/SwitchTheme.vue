<template>
  <el-dropdown
    trigger="click"
    :show-timeout="70"
    :hide-timeout="50"
    @command="handleSwitchTheme"
  >
    <div class="layout-navbars-breadcrumb-user-icon">
      <Peng-Icon
        name="icon-zhutiqiehuan1"
        title="主题切换"
      />
    </div>

    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          :key="item.value"
          :command="item.value"
          :disabled="themeConfig.themeMode === item.value"
          v-for="item in themeOptions"
        >
          {{ item.label }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import { useThemeConfig } from '@/stores/themeConfig';
import { Local } from '@/utils/storage';
import { storeToRefs } from 'pinia';
import { onUnmounted, ref } from 'vue';

const themeOptions = [
  {
    label: '跟随系统',
    value: 'os',
  },
  {
    label: '默认',
    value: 'light',
  },
  {
    label: '黑暗',
    value: 'dark',
  },
];

const store = useThemeConfig();
const { themeConfig } = storeToRefs(store);

const THEME_MODE_KEY = 'current_theme';

const handleSwitchTheme = newTheme => {
  themeConfig.value.themeMode = newTheme;
  Local.set(THEME_MODE_KEY, newTheme);
  setTheme();
};

const matchTheme = ref<MediaQueryList>();

const handleOSThemeChange = (e: MediaQueryListEvent) => {
  const newColorScheme = e.matches ? 'dark' : 'light';
  setHTMLThemeAttr(newColorScheme);
};

const setHTMLThemeAttr = (val: string) => {
  const HTML = document.documentElement as HTMLElement;

  HTML.setAttribute('data-theme', val);
  // document.startViewTransition(() => {});
  // document.documentElement.classList.add('transition');
  // document.documentElement.classList.remove('transition');
};

const setTheme = () => {
  if (matchTheme.value) {
    matchTheme.value.removeEventListener('change', handleOSThemeChange);
  }
  switch (themeConfig.value.themeMode) {
    case 'os':
      matchTheme.value = matchMedia('(prefers-color-scheme:dark)');
      setHTMLThemeAttr(matchTheme.value.matches ? 'dark' : '');
      matchTheme.value.addEventListener('change', handleOSThemeChange);
      break;
    case 'light':
      setHTMLThemeAttr('');
      break;
    case 'dark':
      setHTMLThemeAttr('dark');
      break;
    default:
      setHTMLThemeAttr('');

      break;
  }
};

handleSwitchTheme(Local.get(THEME_MODE_KEY) || 'light');

onUnmounted(() => {
  matchTheme.value?.removeEventListener('change', handleOSThemeChange);
});
</script>

<style scoped lang="scss">
.layout-navbars-breadcrumb-user-icon {
  padding: 0 10px;
  cursor: pointer;
  color: var(--next-bg-topBarColor);
  height: 50px;
  line-height: 50px;
  display: flex;
  align-items: center;
  &:hover {
    background: var(--next-color-user-hover);
    i {
      display: inline-block;
      animation: logoAnimation 0.3s ease-in-out;
    }
  }
}
</style>
