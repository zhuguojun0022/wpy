import App from '../pages/App'
import Login from '../pages/infra/login/Login'
import AdminIndexPage from '../pages/dashboard/AdminIndexPage'
import SystemManagePage from './system.route'
import ChannelManagePage from './channel.route'
import BillManagePage from './bill.route'
// import BigScreen from '../components/frame/bigTop'
import BigScreen from '../pages/bigScreen/BigScreen'
import ProvinceScreen from '../pages/bigScreen/provinceScreen'
import CityScreen from '../pages/bigScreen/cityScreen'
// import CityScreen from '../pages/bigScreen/cityMap'
import InquirePage from './inquire.route'

import ServiceManage from './service.route'
import SubscribeConfig from './subconf.route'
export default [{
    path: '/',
    redirect: '/index/home'
}, {
    path: '/login',
    name: 'login',
    component: Login
},
{
    path: '/bigscreen',
    name: 'bigscreen',
    component: BigScreen
}, {
    path: '/provinceScreen',
    name: 'provinceScreen',
    component: ProvinceScreen
}, {
    path: '/cityScreen',
    name: 'cityScreen',
    component: CityScreen
},
{
    path: '/index',
    component: App,
    children: [{
        path: '/index/home',
        name: 'home',
        meta: {
            menuCode: 'HOME'
        },
        component: AdminIndexPage
    },
    ...SystemManagePage,
    ...ChannelManagePage,
    ...BillManagePage,
    ...InquirePage,
    ...ServiceManage,
    ...SubscribeConfig]
}]
