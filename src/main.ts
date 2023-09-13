import { createApp } from 'vue';
import pinia from '@/stores/index';
import App from './App.vue';
import router from './router';
import { directive } from '@/directive/index';
import other from '@/utils/other';

import ElementPlus from 'element-plus';
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
// import locale from 'element-plus/lib/locale/lang/zh-cn'
import ComponentHashMap from '@/utils/registerGlobalComponent'
import '@/assets/icons/iconfont.css'
import '@/assets/icons/iconfont.js'
import 'element-plus/dist/index.css'
import '@/theme/index.scss';
import '@/assets/global.css'

const app = createApp(App);

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 注册全局组件
for (const key in ComponentHashMap) {
  app.component(key, ComponentHashMap[key])
}

directive(app);
other.elSvg(app);

app.use(pinia)
  // .use(ElementPlus, { locale })
  .use(router)
  .use(ElementPlus)
  .mount('#app');
