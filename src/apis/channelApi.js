import http from '../config/httpConfig'

const searchChannelList = (currentPage, pageSize, confStatus, AAZ570, AAZ571) => http.post('/channel', {
    currentPage, pageSize, confStatus, AAZ570, AAZ571}, {mock: false})

// const updateChannelConfig = (channelId, signAlgorithm, algorithmValue, platformPublicKey, platformPrivateKey,
//     encryptKey, checkSwitch, channelAccessKey, channelSecretKey) => http.post('/channel/update', {
//     channelId, signAlgorithm, algorithmValue, platformPublicKey, platformPrivateKey, encryptKey, checkSwitch, channelAccessKey, channelSecretKey
// }, {mock: false})

const searchMerchantsList = () => http.get('/channel/merchantsList', {mock: false})

const searchContractList = () => http.get('/channel/constractList', {mock: false})

const addChannel = (AAZ570, AAZ571, AAZ572, AAZ573, channelUser, channelUserMobile, accessType, regionIdList) => http.post('/channel/add', {
    AAZ570, AAZ571, AAZ572, AAZ573, channelUser, channelUserMobile, accessType, regionIdList}, {mock: false})
const updateChannel = (channelId, AAZ571, AAZ572, AAZ573, channelUser, channelUserMobile, regionIdList) => http.post('/channel/update', {
    channelId, AAZ571, AAZ572, AAZ573, channelUser, channelUserMobile, regionIdList}, {mock: false})
const searchRegionList = (regionId, regionNo, regionName) => http.post('/region/queryRegionList', {regionId, regionNo, regionName}, {mock: false})

const channelInit = (channelId, signAlgorithm, channelAccessKey, channelSecretKey, checkSwitch) => http.post('/channel/init', {
    channelId, signAlgorithm, channelAccessKey, channelSecretKey, checkSwitch}, {mock: false})
const updateChannelConfig = (channelId, signAlgorithm, channelAccessKey, channelSecretKey, checkSwitch) => http.post('/channel/config/update', {
    channelId, signAlgorithm, channelAccessKey, channelSecretKey, checkSwitch}, {mock: false})
const updateChannelStatus = (channelId, active) => http.post('/channel/update', {channelId, active}, {mock: false})
const updateEncryptKey = (channelId) => http.post('/channel/config/encryptKey/refresh', {channelId}, {mock: false})
export default {
    searchChannelList,
    searchMerchantsList,
    searchContractList,
    addChannel,
    searchRegionList,
    channelInit,
    updateChannelConfig,
    updateChannelStatus,
    updateChannel,
    updateEncryptKey
}