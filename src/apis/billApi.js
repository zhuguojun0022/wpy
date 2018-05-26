import http from '../config/httpConfig'

const searchBillList = () => http.get('/bill/billlist', {mock: true})

const searchReconciliation = () => http.get('/bill/detailslist', {mock: true})

const searchBilllDetails = () => http.get('/bill/billlDetails', {mock: true})

export default {
    searchBillList,
    searchReconciliation,
    searchBilllDetails
}