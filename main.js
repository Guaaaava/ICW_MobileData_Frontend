import App from './App'

// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'
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
export function createApp() {
  const app = createSSRApp(App)
	app.use(uView)
  return {
    app
  }
}
// #endif