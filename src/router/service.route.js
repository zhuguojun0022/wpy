import ServiceManage from '../pages/service/IndexPage.vue'
import ServiceDetails from '../pages/service/details/IndexPage.vue'
import ServiceDetailsBase from '../pages/service/details/BaseInfo.vue'
import ServiceDetailsOrder from '../pages/service/details/OrderInfo.vue'

export default [{
    path: 'service',
    name: 'serviceManage',
    meta: {
        menuCode: 'SERVICE_MANAGE'
    },
    component: ServiceManage
}, {
    path: 'service/details',
    name: 'serviceDetails',
    meta: {
        menuCode: 'SERVICE_MANAGE'
    },
    component: ServiceDetails,
    children: [{
        path: 'base/:id',
        name: 'serviceDetailsBase',
        meta: {
            menuCode: 'SERVICE_MANAGE'
        },
        component: ServiceDetailsBase
    }, {
        path: 'order/:id',
        name: 'serviceDetailsOrder',
        meta: {
            menuCode: 'SERVICE_MANAGE'
        },
        component: ServiceDetailsOrder
    }]
}]