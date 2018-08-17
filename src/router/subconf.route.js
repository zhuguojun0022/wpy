// 订阅配置 相关路由
import orderedCaller from '../pages/subscribeConfig/OrderedCallerView'
import orderConfig from '../pages/subscribeConfig/OrderConfigView'
import subDetails from '../pages/subscribeConfig/subDetailsView'
import addOrder from '../pages/subscribeConfig/AddOrderView'

export default [
    {
        path: 'orderedCaller',
        name: 'orderedCaller',
        component: orderedCaller
    },
    {
        path: 'orderConfig',
        name: 'orderConfig',
        component: orderConfig
    },
    {
        path: 'subDetails/:apiId/:apiName',
        name: 'subDetails',
        component: subDetails
    },
    {
        path: 'addOrder/:callerId/:callerName',
        name: 'addOrder',
        component: addOrder
    },
    {
        path: 'addOrder/:orderId/:callerId/:callerName',
        name: 'copy',
        component: addOrder
    }
]