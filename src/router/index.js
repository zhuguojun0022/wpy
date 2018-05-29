import App from '../pages/App'
import Login from '../pages/infra/login/Login'
import AdminIndexPage from '../pages/dashboard/AdminIndexPage'
import SystemManagePage from './system.route'
import ChannelManagePage from './channel.route'
import BillManagePage from './bill.route'

export default [{
    path: '/',
    redirect: '/index'
}, {
    path: '/login',
    name: 'login',
    component: Login
}, {
    path: '/index',
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
