import http from '../config/httpConfig'

const searchChannelList = () => http.get('/channel', {mock: false})

const searchMerchantsList = () => http.get('/channel/merchantsList', {mock: false})

const searchContractList = () => http.get('/channel/constractList', {mock: false})

export default {
    searchChannelList,
    searchMerchantsList,
    searchContractList
}