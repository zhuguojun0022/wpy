import BillManage from '../pages/bill/IndexPage'
import BillDetails from '../pages/bill/detailsPage'
export default [{
    path: 'bill/list',
    name: 'billManage',
    meta: {
        menuCode: 'BILL_BILL_MANAGE'
    },
    component: BillManage
}, {
    path: 'bill/list/:id',
    name: 'billDetails',
    meta: {
        menuCode: 'BILL_BILL_DETAILS'
    },
    component: BillDetails
}]