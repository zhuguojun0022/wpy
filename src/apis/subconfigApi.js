import http from '../config/httpConfig'
import qs from 'qs'

const mock = false

// 获取指定应用的已订阅CALLER
const getSub = () => http.get('/portal/callers')
// 获取指定应用的未订阅CALLER
const getNoSub = () => http.get('/')
// 新增指定应用的调用者
const addSub = (params) => http.post('/portal/callers', params, {mock: mock})
// 获取已订阅API
const getOrderApi = (params) => http.get('/security/v1/configs/caller?' + qs.stringify(params), {mock: mock})
// 启用API订阅
const updateStatusOrderedAPI = (params) => http.put('/security/v1/config/status', params)
// 订阅API
const addOrderedAPI = (params) => http.post('/security/v1/config', params, {mock: mock})
// 获取已订阅API详细信息（编辑专用）
const getOrderedDetailAPI = (params) => http.get('/security/v1/config', params, {mock: mock})
// 更新已订阅API详情信息（编辑专用）
const updateOrderedAPI = (params) => http.put('/security/v1/config', params, {mock: mock})
// 获取未订阅API
const getNoOrderedAPI = (params) => http.get('/security/v1/apis/notsub', params, {mock: mock})

export default {
    getSub,
    getNoSub,
    addSub,
    getOrderApi,
    updateStatusOrderedAPI,
    addOrderedAPI,
    getNoOrderedAPI,
    getOrderedDetailAPI,
    updateOrderedAPI
}