import Vue from 'vue'

import 'normalize.css/normalize.css'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN'

import '@/styles/index.scss'

import App from './App'
import store from './store'
import router from './router'

import '@/icons'
import '@/permission'
import { hasBtnPermission } from './utils/permission'
Vue.use(ElementUI, { locale })
Vue.config.productionTip = false
Vue.prototype.hasPerm = hasBtnPermission

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
