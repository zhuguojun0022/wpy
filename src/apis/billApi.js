import http from '../config/httpConfig'

const searchBillList = () => http.get('/bill/billlist', {mock: true})

export default {
    searchBillList
}