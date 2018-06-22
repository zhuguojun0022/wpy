import Vue from 'vue'
import Router from 'vue-router'
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
import { getToken } from './common/utils'

Vue.use(Router)

Vue.config.productionTip = false
Vue.use(LoginUser)

export const appRouter = new Router({
    mode: 'hash',
    routes: router
})

appRouter.beforeEach((to, from, next) => {
    if (to.path === '/login') {
        if (getToken()) {
            next({ path: '/' })
        } else {
            next()
        }
    } else {
        if (getToken()) {
            next()
        } else {
            next({ path: '/login' })
        }
    }
})

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router: appRouter,
    store: store,
    render: h => h(Main)
})
