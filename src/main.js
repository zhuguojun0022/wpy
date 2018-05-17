import Vue from 'vue'
import Main from './Main.vue'
import router from './router'
import './config/httpConfig'
import '../theme/index.less'
import './iViewImport'
import './assets/less/main.less'
import './assets/less/utils.less'
import './assets/less/iview.less'
import './assets/iconfont/iconfont.css'
import LoginUser from './common/loginUser'
import store from './store'

Vue.config.productionTip = false
Vue.use(LoginUser)

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    render: h => h(Main)
})
