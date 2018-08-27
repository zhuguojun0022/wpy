import http from '../config/httpConfig'
import qs from 'qs'

const mock = false

// 获取apiList
const getApiList = (params) => http.post('/security/api/all', params, {mock: mock})
// 获取已订阅API
const getOrderApi = (params) => http.post('/security/subscription/all', params, {mock: mock})
// 启用API订阅
const updateStatusOrderedAPI = (params) => http.get('/security/subscription/active?' + qs.stringify(params))
// 订阅API
const addOrderedAPI = (params) => http.post('/security/subscription/batch/add', params, {mock: mock})
// 获取已订阅API详细信息（编辑专用）
const getOrderedDetailAPI = (params) => http.get('/security/subscription/details/' + params)
// 更新已订阅API详情信息（编辑专用）
const updateOrderedAPI = (params) => http.get('/security/subscription/concurrency?' + qs.stringify(params), params)
// 获取渠道列表
const getChannelInfo = (params) => http.get('/channel/list?' + qs.stringify(params))
// 删除订阅
const deleteOrder = (id) => http.get(`/security/subscription/remove?id=${id}`)

export default {
    getOrderApi,
    updateStatusOrderedAPI,
    addOrderedAPI,
    getOrderedDetailAPI,
    updateOrderedAPI,
    getApiList,
    getChannelInfo,
    deleteOrder
}