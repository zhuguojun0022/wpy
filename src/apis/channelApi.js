import http from '../config/httpConfig'

const searchChannelList = () => http.get('/channel/channellist', {mock: true})

const searchMerchantsList = () => http.get('/channel/merchantsList', {mock: true})

const searchContractList = () => http.get('/channel/constractList', {mock: true})

export default {
    searchChannelList,
    searchMerchantsList,
    searchContractList
}