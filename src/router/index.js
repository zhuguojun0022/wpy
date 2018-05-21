import Vue from 'vue'
import Router from 'vue-router'
import App from '../pages/App'
import Login from '../pages/infra/login/Login'
import AdminIndexPage from '../pages/dashboard/AdminIndexPage'
import SystemManagePage from './system.route'
import ChannelManagePage from './channel.route'
import BillManagePage from './bill.route'

Vue.use(Router)

export default new Router({
    routes: [{
        path: '/login',
        name: 'login',
        component: Login
    }, {
        path: '/',
        component: App,
        children: [{
            path: '',
            name: 'home',
            meta: {
                menuCode: 'HOME'
            },
            component: AdminIndexPage
        },
        ...SystemManagePage,
        ...ChannelManagePage,
        ...BillManagePage]
    }]
})
