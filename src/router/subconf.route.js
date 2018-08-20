// 订阅配置 相关路由
import orderConfig from '../pages/subscribeConfig/OrderConfigView'
import subDetails from '../pages/subscribeConfig/subDetailsView'
import addOrder from '../pages/subscribeConfig/AddOrderView'

export default [
    {
        path: 'orderConfig',
        name: 'orderConfig',
        component: orderConfig
    },
    {
        path: 'subDetails/:apiId/:apiName/:channelName',
        name: 'subDetails',
        component: subDetails
    },
    {
        path: 'addOrder',
        name: 'addOrder',
        component: addOrder
    },
    {
        path: 'addOrder/:orderId/:callerId/:callerName',
        name: 'copy',
        component: addOrder
    }
]