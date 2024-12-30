import App from './App'

// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI);
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
  ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import uView from '@/uni_modules/vk-uview-ui';
import { createSSRApp } from 'vue'

// 引入 Vuex Store


export function createApp() {
  const app = createSSRApp(App)

  app.use(uView)
  return {
    app
  }
}
// #endif